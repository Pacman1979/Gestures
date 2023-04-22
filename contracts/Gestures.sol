//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";
// import "hardhat/console.sol";

// 'Ownable', so the owner can withdraw to their address...
contract Gestures is ERC721Enumerable, Ownable {

	// I think this allows for any numbers (uints) that are combined with strings...
    // e.g. return(string(abi.enc... to be recognised as both a uint and a string.
    using Strings for uint256; // I can still use this with lower uint numbers.

    string public baseURI;
    string public baseExtension = ".json";
    uint8 public cost;
    uint16 public maxSupply;
    uint32 public startMinting;

    mapping(address => bool) public whitelisted;

    event WhitelistMint(uint8 amount, address minter);
    event PublicMint(uint8 amount, address minter);
    event Withdraw(uint8 amount, address owner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _cost,
        uint16 _maxSupply, // e.g. 100 for my 1st project.
        uint32 _startMinting, // start time to mint. Was '_allowMintingOn'.
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;
        startMinting = _startMinting;
        baseURI = _baseURI;
    }

    // payable allows the contract to receive ether.
    function whitelistMint(uint16 _wMintAmount) public payable {
        // Only allow minting after specified time - block.timestamp is essentially now.
        require(block.timestamp >= startMinting && block.timestamp < startMinting + 28800);
        // Must mint at least 1 token
        require()
		require(_wMintAmount == 1 || _wMintAmount == 2, "Invalid mint amount");
        // Require enough payment minus msg.value = balance of minter's wallet??
        require(msg.value == cost || cost * 2); // THIS ALLOWS MAX 2 NFT'S TO MINT PER WALLET ADDRESS!

        uint16 supply = totalSupply();

        // Do not let them mint more tokens than available
        require(supply + _wMintAmount <= maxSupply);

        // Create tokens - this loop helps people mint multiple NFTs.
        // _wMintAmount is the number the whitelisted buyer requests to buy.
        for(uint16 i = 1; i <= _wMintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

        // Emit event
        emit WhitelistMint(_wMintAmount, msg.sender);
    }

    function publicMint(uint16 _pMintAmount) public payable {
    	// Only allow minting after specified time - block.timestamp is essentially now.
        require(block.timestamp >= startMinting + 28800 && block.timestamp < startMinting + 57600);
        // Must mint at least 1 token
		require(_pMintAmount == 1 || _pMintAmount == 2, "Invalid mint amount");
        // Require enough payment minus msg.value = balance of minter's wallet??
        require(msg.value == cost || cost * 2); // THIS ALLOWS MAX 2 NFT'S TO MINT PER WALLET ADDRESS!

        uint16 supply = totalSupply(); IS THIS NEEDED IF THEY CAN ONLY MINT 1 or 2??

        // Do not let them mint more tokens than available
        require(supply + _wMintAmount + _pMintAmount <= maxSupply); IS THIS NEEDED IF THEY CAN ONLY MINT 1 or 2??

        // Create tokens - this loop helps people mint multiple NFTs.
        // _pMintAmount is the number the public buyer requests to buy. *** ONLY WANT 1 OPPORTUNITY/TRANSACTION PER BUYER ***
        for(uint16 i = 1; i <= _pMintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

        // Emit event
        emit PublicMint(_pMintAmount, msg.sender);
    }
}
