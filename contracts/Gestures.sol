//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

// import "hardhat/console.sol";

// 'Ownable', so the owner can withdraw to their address...
contract Gestures is ERC721Enumerable, Ownable {

	// I think this allows for any numbers (uints) that are combined with strings...
    // e.g. return(string(abi.enc... to be recognised as both a uint and a string.
    using Strings for uint256; // I can still use this with lower uint numbers according to ChatGPT but had issues!

    string public baseURI;
    string public baseExtension = ".json";
    uint8 public cost; // POSSIBLE ISSUE HERE WITH uint8
    uint16 public maxSupply;
    uint32 public startMinting;

    mapping(address => bool) public whitelisted;

    event WhitelistMint(uint8 amount, address minter);
    event PublicMint(uint8 amount, address minter);
    event Withdraw(uint8 amount, address owner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _cost, // price of the mint e.g. 0.1 eth. APPARENTLY || doesn't apply to Bool and uint8?!?
        uint16 _maxSupply, // e.g. 100 for my 1st project.
        uint32 _startMinting, // start time to mint. Was '_allowMintingOn'.
        string memory _baseURI // ??? Is this the hash address for the nft's???
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;
        startMinting = _startMinting;
        baseURI = _baseURI;
    }

	function updateWhitelist(address[] memory _addresses, bool _whitelisted) public onlyOwner {
	    for (uint i = 0; i < _addresses.length; i++) {
	        whitelisted[_addresses[i]] = _whitelisted;
	    }
	}

    function isWhitelisted(address wl) public view returns (bool) {
    	return whitelisted[wl];
    }
    // payable allows the contract to receive ether.
    function whitelistMint(uint16 _wMintAmount) public payable {

        // Only allow minting after specified time -> block.timestamp is essentially now.
        require(block.timestamp >= startMinting && block.timestamp < startMinting + 28800);

        require(whitelisted[msg.sender], "Wallet address is not Whitelisted.");

        // only allowed to mint 1 or 2.
		require(_wMintAmount == 1 || _wMintAmount == 2, "Invalid mint amount");
        // Payment must be exactly 1 x cost or 2 x cost.
        require(msg.value <= cost * 2 && msg.value > 0, "Invalid Ether amount"); // THIS ALLOWS MAX 2 NFT'S TO MINT PER WALLET ADDRESS!

        uint16 supply = totalSupply(); // APPARENTLY uint256 not convertible to uint16

        // Do not let them mint more tokens than available
        require(supply + _wMintAmount <= maxSupply);

        // Create tokens - this loop helps people mint multiple NFTs.
        // _wMintAmount is the number the whitelisted buyer requests to buy.
        for(uint16 i = 1; i <= _wMintAmount; i++) { // Should this actually be uint256 i = -; i < _wMintAmount; i++) ??
            _safeMint(msg.sender, supply + i);
        }

        // Set the whitelisted status of the address to false after they have minted...
    	whitelisted[msg.sender] = false;

        // Emit event
        emit WhitelistMint(_wMintAmount, msg.sender); // APPARENTLY issues here with conversion from uint16 to uint8 here.
    }

    function publicMint(uint16 _pMintAmount) public payable {
    	// Only allow minting after specified time - block.timestamp is essentially now.
        require(block.timestamp >= startMinting + 28800 && block.timestamp < startMinting + 57600);
        // Must mint at least 1 token
		require(_pMintAmount == 1 || _pMintAmount == 2, "Invalid mint amount");
        // Require enough payment minus msg.value = balance of minter's wallet??
        require(msg.value <= cost * 2 && msg.value > 0, "Invalid Ether amount"); // THIS ALLOWS MAX 2 NFT'S TO MINT PER WALLET ADDRESS!

        uint16 supply = totalSupply(); // APPARENTLY conversion from uint256 to uint16 issue here.

        // I'M ASSUMING HERE THE SUPPLY VALUE HAS CARRIED OVER FROM THE whitelistMint function!?!
        require(supply + _pMintAmount <= maxSupply);

        // Create tokens - this loop helps people mint multiple NFTs.
        // _pMintAmount is the number the public buyer requests to buy. *** ONLY WANT 1 OPPORTUNITY/TRANSACTION PER BUYER ***
        for(uint16 i = 1; i <= _pMintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

        // Emit event
        emit PublicMint(_pMintAmount, msg.sender);
    }
    // Return metadata IPFS url
    // EG: 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/1.json'
    function tokenURI(uint16 _tokenId)
        public
        view
        virtual
        override
        returns(string memory)
    {
        // '_exists' is a function that comes with our libraries.
        require(_exists(_tokenId), 'token does not exist');
        return(string(abi.encodePacked(baseURI, _tokenId.toString(), baseExtension)));
    }

    // CHECK WHETHER I'VE DONE THIS RIGHT...
    function walletOfOwner(address _owner) public view returns(uint16[] memory) {
        uint16 ownerTokenCount = balanceOf(_owner);
        uint16[] memory tokenIds = new uint16[](ownerTokenCount);
        for(uint16 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // allows current owner of the token to return the token for a refund = to mint cost.
    // is '_this' required in this function??
    function returnable(address _this, address _from, address _to, uint256 _tokenId)
    	external
    	returns (bool)
    {
		require(block.timestamp >= startMinting + 7776000);

    	IERC721 returnNFT = IERC721(_this);
        require(returnNFT.ownerOf(_tokenId) == _from, "Not the owner of the token");
        returnNFT.approve(address(this), _tokenId);
        returnNFT.safeTransferFrom(msg.sender, address(this), _tokenId);

        // REVIEW THIS CODE...
        IERC20 erc20Token = IERC20(addressOfTheERC20Token); // replace `addressOfTheERC20Token` with the actual address of the ERC20 token
	    erc20Token.approve(_to, _tokenId);
	    returnNFT.transferFrom(_from, _to, _tokenId);

	    return true;
	    }
    }


    	// I want to have the approve function run to get approval from the current holder...
    	// ... to then be able to 'transferFrom' their wallet address to mine.

        // The next step would be transferring the nft back to the original contract address.
        safeTransferFrom(
	    //     address from,
	    //     address to,
	    //     uint256 tokenId,
	    //     bytes memory data
	    // ) public virtual override {
	    //     require(
	    //         _isApprovedOrOwner(_msgSender(), tokenId),
	    //         "ERC721: caller is not token owner nor approved"
	    //     );
	    //     _safeTransfer(from, to, tokenId, data);
	    // }

	    // To approve the return of ether using the ERC20 approve function...
	    approve(address _spender, uint256 _value) public returns (bool success)

	    // To transfer the ether, using the ERC20 transferFrom function,to the owner's address...
	    transferFrom(address _from, address _to, uint256 _value)
	    	public
	    	returns (bool success)

    // Owner functions

    function withdraw() public onlyOwner {
        uint16 balance = address(this).balance;

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success);

        emit Withdraw(balance, msg.sender);
    }

    // allows the owner to change the price of the mint at anytime...
    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

}

