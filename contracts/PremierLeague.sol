// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PremierLeague is AutomationCompatibleInterface, FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings for uint256;

    string public source; // js code to be executed by Functions
    uint64 public subscriptionId;
    uint32 public gasLimit; // 300000
    bytes32 public donID;  // fuji: 0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000;
    
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    uint public processingGameweek = 0;
    uint public lastStoredIndex = 0;
    bytes public s_lastError;

    struct Gameweek{
        uint id;
        uint startDateTime;
        uint endDateTime;
        bool ended;
    }

    struct PlayerInfo {
        uint id;
        string name;
        uint position; // 0 = GK, 1 = D, 2 = M, 3 = F
        uint team;
        // bool active;
        // Add more player-related information as needed.
    }
    string[20] public teams;
    uint[4] public draftRules; // 0(GK) => 2, 1(D) => 5, 2(M) => 5, 3(F) => 3
    mapping(uint256 => PlayerInfo) public players;
    uint playersCount = 0;
    uint squadSize = 15; // how many players a squad can have

    Gameweek[38] public gameWeeks;
    mapping(uint256 => int[]) gameweekPoints;

    event StatsUpdated(uint256 indexed gameweek);
    error UnexpectedRequestID(bytes32 requestId);

    event Response(bytes32 indexed requestId, bytes response, bytes err);

    constructor(
        address router,
        uint64 _subscriptionId,
        string memory _source,
        uint32 _gasLimit,
        bytes32 _donID
    ) FunctionsClient(router) ConfirmedOwner(msg.sender){
        subscriptionId = _subscriptionId;
        source = _source;
        gasLimit = _gasLimit;
        donID = _donID;
    }

    function addPlayer(uint id, string memory name, uint position, uint team) public onlyOwner{
        players[id] = PlayerInfo(id, name, position, team);
        playersCount++;
    }

    function addGameweek(uint id, uint start, uint end) public onlyOwner{
        gameWeeks[id] = Gameweek(id, start, end, false);
    }

    function updateDraftRules(uint position, uint limit) public onlyOwner {
        draftRules[position] = limit;
    }

    function updateTeams(string[20] memory _teams) public onlyOwner {
        teams = _teams;
    }

    function updateSource(string calldata _source) public onlyOwner {
        source = _source;
    }

    function validateSquad(uint[15] calldata picks) public view returns(bool) {
        require(picks.length == 15, "Invalid squad size");
        uint[4] memory squadPositions;
        
        for(uint256 i = 0; i < picks.length; ++i) {
            PlayerInfo memory player = players[picks[i]];
            require(player.id > 0,"player does not exist");
            require(squadPositions[player.position] < draftRules[player.position],"Position cap exceeded");
            squadPositions[player.position]++;
        }
        return true;
    }

    function updategameweekPoints(uint256 gameweekId,int[] calldata stats) public{
        Gameweek storage gameweek = gameWeeks[gameweekId];
        require(block.timestamp > gameweek.endDateTime, "Gameweek still running");
        // TODO: update stats
        gameweekPoints[gameweekId] = stats;
        gameweek.ended = true;
        emit StatsUpdated(gameweekId);
    }
    function updatePlayerGameweekPoints(uint gameweekId, uint playerIndex, int points) public {
        Gameweek storage gameweek = gameWeeks[gameweekId];
        require(block.timestamp > gameweek.endDateTime, "Gameweek still running");
        int[] storage playerPoints = gameweekPoints[gameweekId];
        playerPoints[playerIndex] = points;
    }

    function calcSquadPoints(uint256[15] calldata squad, uint gwStart, uint gwEnd) public view returns (int[15] memory squadPoints){
        squadPoints = [int(0), int(0), int(0), int(0), int(0), int(0), int(0), int(0), int(0), int(0), int(0), int(0), int(0), int(0), int(0)];
        // for each gameweek in provided range
        for(uint i = gwStart; i <= gwEnd; ++i){
            // for each player picked in the squad
            for(uint j = 0; j < 15; ++j){
                // tally their points
                squadPoints[j] += gameweekPoints[i][squad[j]];
            }
        }
    }

    function getGameWeek(uint index) external view returns (uint, uint, uint, bool){
        require(index < gameWeeks.length, "Index out of bounds");
        Gameweek memory gw = gameWeeks[index];
        return (gw.id, gw.startDateTime, gw.endDateTime, gw.ended);
    }

    // Chainlink
    // **Automation**
    function checkUpkeep(
        bytes calldata checkData
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData )
    {
        
        uint gameweekId = abi.decode(checkData, (uint));
        Gameweek memory targetGameweek = gameWeeks[gameweekId];
        upkeepNeeded = (block.timestamp >= targetGameweek.endDateTime);// && (targetGameweek.ended == false);
        performData = abi.encodePacked(uint(gameweekId));
        
    }

    function performUpkeep(bytes calldata performData) external override {
        uint gameweekId = abi.decode(performData, (uint));
        Gameweek memory targetGameweek = gameWeeks[gameweekId];
        if ((block.timestamp >= targetGameweek.endDateTime) /*&& (targetGameweek.ended == false)*/) {
            sendRequest();
        }
    }

    // **Functions**

    function sendRequest() internal {
        FunctionsRequest.Request memory req;
        req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, source);
        string[] memory args = new string[](2);
        args[0] = processingGameweek.toString();
        args[1] = lastStoredIndex.toString();
        req.setArgs(args);

        s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;
        // Unpack the integers from the response bytes
        int[] memory integers = unpackInt(response);

        // Store the integers starting from the last stored index
        for (uint256 i = 0; i < integers.length; i++) {
            updatePlayerGameweekPoints(processingGameweek, lastStoredIndex + i , integers[i]);
        }

        // Update the last stored index
        lastStoredIndex += integers.length;

        // Check if there are more players to fetch stats for
        if(lastStoredIndex < playersCount){
            sendRequest();
        }else{
            lastStoredIndex = 0;
            processingGameweek++;
        }
        emit Response(requestId, s_lastResponse, s_lastError);
    }

     // helpers
     // Helper function to unpack bytes into integers
    function unpackInt(bytes memory packedData) internal pure returns (int256[] memory values) {
        require(packedData.length % 32 == 0, "Invalid packed data length");
        values = new int256[](packedData.length / 32);
        for (uint256 i = 0; i < values.length; i++) {
            int256 tempValue;
            assembly {
                tempValue := mload(add(packedData, add(32, mul(i, 32))))
            }
            values[i] = tempValue;
        }
    }

    function convertBytesToUint(bytes calldata checkData) public view returns(uint num){
        num = abi.decode(checkData, (uint));
    }

    function convertUintToBytes(uint num) public view returns(bytes memory checkData){
        checkData = abi.encodePacked(uint(num));
    }
}
