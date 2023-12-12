// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PremierLeague.sol";
import "./Squad.sol";

contract Lobby is Ownable{
    // Define a PayoutStructure struct for payout details.
    struct PayoutStructure {
        uint256[] percentages;
    }

    PremierLeague premierLeagueContract;
    Squad squadContract;
    // Define a Treasury contract address for collecting fees.
    address public treasuryAddress;
    address public feeTokenAddress;
    
    struct Tournament {
        address host;
        string name;
        uint256 startGameweek;
        uint256 endGameweek;
        uint256 buyIn;
        uint256 minEntrants;
        uint256 maxEntrants;
        uint256[] entries; // tokenId of each entry
    }

    // thresholds to change payout structure
    uint[] public payoutStructureThresholds = [3,7,11,20,30,41,52,64];
    // map index of payoutStructureThresholds to array with payout %s
    mapping(uint => uint[]) payoutStructures; // percentages: 1% = 100

    mapping(uint256 => Tournament) public tournaments;
    uint256 public tournamentCount;

    event TournamentCreated(uint256 indexed tournamentId, address indexed host);
    event PlayerRegistered(uint256 indexed tournamentId, address indexed player);
    event Payout(uint256 indexed tournamentId, address indexed winner, uint indexed amount);
    event TournamentEnded(uint256 indexed tournamentId);

    constructor(address _feeTokenAddress, address _treasuryAddress) Ownable(msg.sender){
        feeTokenAddress = _feeTokenAddress;
        treasuryAddress = _treasuryAddress;
    }
    
    function setTreasuryContract(address _treasuryAddress) public onlyOwner() {
        treasuryAddress = _treasuryAddress;
    }

    function setPremierLeagueContract(address _premierLeagueContract) public onlyOwner() {
        premierLeagueContract = PremierLeague(_premierLeagueContract);
    }

    function setSquadContract(address _squadContract) public onlyOwner() {
        squadContract = Squad(_squadContract);
    }

    function setPayoutStructure(uint index, uint[] calldata payouts) public onlyOwner() {
        payoutStructures[index] = payouts;
    }

    function createTournament(address host, string calldata name, uint256 gwStart, uint256 gwEnd, uint256 buyIn, uint256 minSize, uint256 maxSize) public {
        // validate tournament settings
        require(minSize > 1 && maxSize < 65 && minSize <= maxSize,"2-64 player limit");
        require(buyIn >= 10**6, "Buy in must be at least $1" );
        uint start;
        uint end;
        (,start,,) = premierLeagueContract.getGameWeek(gwStart);
        (,,end,) = premierLeagueContract.getGameWeek(gwEnd);
        // check that this tournament starts at least 2hr before gameweek starts, and it ends sometime in the future
        require(block.timestamp < start - 7200 && block.timestamp < end,"Tournament time out of bounds");
        uint256[] memory emptyEntries;
        tournaments[tournamentCount] = Tournament(host, name, gwStart, gwEnd, buyIn, minSize, maxSize, emptyEntries);
        emit TournamentCreated(tournamentCount, host);
        tournamentCount++;
    }

    function register(address player, uint256 tournamentId, uint256 registrationFee) public payable {
        Tournament storage tournament = tournaments[tournamentId];
        uint start;
        (,start,,) = premierLeagueContract.getGameWeek(tournament.startGameweek);
        // registration is closed 1hr before gameweek starts, or max number of entrants has been reached
        require(block.timestamp < start - 3600 && tournament.entries.length < tournament.maxEntrants, "Registration is closed.");
        require(registrationFee == tournament.buyIn, "Incorrect registration fee.");

        // collect buy in
        IERC20(feeTokenAddress).transferFrom(player, address(this), registrationFee);
        
        // mint NFT
        uint256 tokenId = squadContract.mintSquad(player, tournamentId);
        tournament.entries.push(tokenId);
        emit PlayerRegistered(tournamentId, player);
    }

    function pickPlayers(uint256 tokenId, uint256[15] memory playerPicks) external  {
        // TODO: replace msg.sender with AA compatible var
        // require token is owned by _msgSender
        require(squadContract.ownerOf(tokenId) == msg.sender);
        
        // validate squad
        premierLeagueContract.validateSquad(playerPicks);
        // store picks on squad
        squadContract.setPlayerPicks(tokenId, playerPicks);
    }

    function refundTournament(uint256 tournamentId) public {
        Tournament storage tournament = tournaments[tournamentId];
        uint start;
        (,start,,) = premierLeagueContract.getGameWeek(tournament.startGameweek);
        require(start - 3600 < block.timestamp, "tournament still registering");
        require(tournament.entries.length < tournament.minEntrants, "Enough players were registered");
        // iterate over entries, burn their squad NFT and transfer back funds
        for(uint256 i = 0; i < tournament.entries.length; ++i) {
            uint256 tokenId = tournament.entries[i];
            // burn squad NFT
            squadContract.burnSquad(tokenId);
            // transfer back buy in
            IERC20(feeTokenAddress).transferFrom(address(this), squadContract.ownerOf(tokenId), tournament.buyIn);
        }
    }

    function getTournamentStandings(uint256 tournamentId) public view returns(uint[] memory standings){
        Tournament storage tournament = tournaments[tournamentId];
        int[] memory entriesPoints;
        // for each entry
        for(uint256 i = 0; i < tournament.entries.length; ++i) {
            // load squad
            uint256[15] memory squad = squadContract.getSquadData(tournament.entries[i]).playerPicks;
            // get accumulated points of each player
            int[15] memory points = premierLeagueContract.calcSquadPoints(squad, tournament.startGameweek, tournament.endGameweek);
            // sum player points to get total
            for(uint j = 0; j < 15;++j){
                entriesPoints[i] += points[j];
            }
        }
        // sort entries by points
        // TODO: accumulate ties (for now ignore them)
        // create an array of entry indices
        uint[] memory entryIndices = new uint[](tournament.entries.length);
        for (uint i = 0; i < tournament.entries.length; ++i) {
            entryIndices[i] = i;
        }

        // sort entry indices based on corresponding points
        for (uint i = 0; i < tournament.entries.length - 1; ++i) {
            for (uint j = i + 1; j < tournament.entries.length; ++j) {
                if (entriesPoints[entryIndices[i]] < entriesPoints[entryIndices[j]]) {
                    // swap indices
                    (entryIndices[i], entryIndices[j]) = (entryIndices[j], entryIndices[i]);
                }
            }
        }

        // create the standings array
        standings = new uint[](tournament.entries.length);
        for (uint i = 0; i < tournament.entries.length; ++i) {
            standings[i] = tournament.entries[entryIndices[i]];
        }

        return standings;
        
    }

    function endTournament(uint256 tournamentId) public {
        Tournament storage tournament = tournaments[tournamentId];
        uint end;
        (,,end,) = premierLeagueContract.getGameWeek(tournament.endGameweek);
        require(block.timestamp > end, "tournament running");
        // Distribute winnings and collect fees to the treasury.
        uint256 totalFees = tournament.entries.length * tournament.buyIn;
        uint256 treasuryFee = totalFees * 8 / 100;
        uint256 hostFee = totalFees * 2 / 100;
        uint256 prizePool = totalFees - treasuryFee - hostFee;

        // get payout structure
        uint[] memory payoutPercentages;
        for(uint i = 0; i < payoutStructureThresholds.length; ++i){
            if(payoutStructureThresholds[i] > tournament.entries.length){
                payoutPercentages = payoutStructures[i];
                break;
            }
        }

        // get tournament standings
        uint[] memory standings = getTournamentStandings(tournamentId);

        // Distribute prizes to the winners.
        for(uint i = 0; i < payoutPercentages.length; ++i) {
            uint prize = payoutPercentages[i] * prizePool / 10000;
            address winnerAddress = squadContract.ownerOf(standings[i]);
            IERC20(feeTokenAddress).transfer(winnerAddress, prize );
            emit Payout(tournamentId, winnerAddress, prize);
        }

        // Send 2% of prizepool to host
        IERC20(feeTokenAddress).transfer(tournament.host,hostFee);

        // Send the treasury fee to the treasury contract.
        IERC20(feeTokenAddress).transfer(treasuryAddress,treasuryFee);

        emit TournamentEnded(tournamentId);
    }

}