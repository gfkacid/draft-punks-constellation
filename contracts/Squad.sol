// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Squad is ERC721Enumerable, Ownable {
    using Strings for uint256;
    struct SquadData {
        uint256 tournamentId;
        uint256[15] playerPicks;
        bool picked;
    }

    address public lobbyContract;
    
    // Mapping from token ID to SquadData.
    mapping(uint256 => SquadData) public squadData;

    // Event emitted when a new Squad NFT is minted.
    event SquadMinted(address indexed owner, uint256 indexed tokenId, uint256 indexed tournamentId);
    event SquadUpdated(uint256 indexed tokenId, uint256[15] picks);

    modifier onlyLobby() {
        require(msg.sender == lobbyContract, "Caller is not the Lobby contract");
        _;
    }

    constructor() ERC721("Draft Punks Squad", "SQUAD") Ownable(msg.sender){
        
    }

    // Mint a new Squad NFT for a player when they register for a tournament.
    function mintSquad(address player, uint256 tournamentId) external onlyLobby returns(uint256 nextTokenId){
        nextTokenId = totalSupply() + 1;
        _mint(player, nextTokenId);
        squadData[nextTokenId] = SquadData(tournamentId, [uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0),uint(0)], false);
        emit SquadMinted(player, nextTokenId, tournamentId);
    }

    // Set player picks for a Squad NFT.
    function setPlayerPicks(uint256 tokenId, uint256[15] calldata playerPicks) external onlyLobby {
        require(squadData[tokenId].playerPicks.length == 0, "Cannot repick players");
        squadData[tokenId].playerPicks = playerPicks;
        emit SquadUpdated(tokenId, playerPicks);
    }
    
    // burn squad when i.e. tournament is cancelled
    function burnSquad(uint256 tokenId) external onlyLobby {
        _burn(tokenId);
    }

    function setLobbyContract(address _lobbyContract) public onlyOwner() {
        lobbyContract = _lobbyContract;
    }

    function getSquadData(uint tokenId) public view returns(SquadData memory){
        return squadData[tokenId];
    }

    // generate dynamic NFT metadata
     function getTokenMetadata(uint256 tokenId) external view returns (string memory) {
        // Generate the SVG image
        string memory svgImage = generateImage(tokenId);

        // Include tournament ID and squad picks in the metadata.
        SquadData memory data = squadData[tokenId];
        string memory metadata = string(abi.encodePacked(
            '{"name": "Draft Punks Squad #', toString(tokenId),
            '", "description": "Draft Punks Squad for Premier League", ',
            '"attributes": [',
            '{"trait_type": "Tournament ID", "value": ', toString(data.tournamentId), '},',
            '{"trait_type": "Player Picks", "value": [', toStringArray(data.playerPicks), ']}',
            '],',
            '"image": "', svgImage, '"'
            '}'
        ));

        return metadata;
    }

    function generateImage(uint256 tokenId) internal view returns (string memory) {
        SquadData memory data = squadData[tokenId];
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">', "Tournament ID: ",toString(data.tournamentId),'</text>',
            '</svg>'
        );
        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )    
        );
    }

    // helpers
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function toStringArray(uint256[15] memory values) internal pure returns (string memory) {
        string memory result = '';
        for (uint256 i = 0; i < values.length; i++) {
            if (i > 0) {
                result = string(abi.encodePacked(result, ', '));
            }
            result = string(abi.encodePacked(result, toString(values[i])));
        }
        return result;
    }
}