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
    uint16 public supply = 0;

    mapping(address => bool) public whitelisted;
    mapping(address => mapping(uint256 => bool)) public refunding

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
        require()

        require(whitelisted[msg.sender], "Wallet address is not Whitelisted.");

        // only allowed to mint 1 or 2.
		require(_wMintAmount == 1 || _wMintAmount == 2, "Invalid mint amount");
        // Payment must be exactly 1 x cost or 2 x cost.
        require(msg.value <= cost * 2 && msg.value > 0, "Invalid Ether amount"); // THIS ALLOWS MAX 2 NFT'S TO MINT PER WALLET ADDRESS!

        supply = totalSupply(); // APPARENTLY uint256 not convertible to uint16

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

        supply = totalSupply(); // APPARENTLY conversion from uint256 to uint16 issue here.

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

    // allows current owner of the token to return the token for a refund of 90% x mint cost...
    // Like a money-back guarantee.
    // Do I need a '_from' address and a '_to' address??
    // Double check that this period of time is between 90 days and 97 days
    function returnable(address _buyer, uint256 _tokenId)
    	private
    	returns (bool)
    {
		require(block.timestamp >= startMinting + 7776000 && block.timestamp < startMinting + 8380800); // Window open between 90 days & 97 days


    	IERC721 returnNFT = IERC721(address(this));
        require(returnNFT.ownerOf(_tokenId) == _buyer, "Not the owner of the token");
        returnNFT.approve(address(this), _tokenId);
        returnNFT.safeTransferFrom(msg.sender, address(this), _tokenId);

	    // add code to transfer the 90% of cost to the buyer here

		refunding[_buyer][_tokenId] = true; // Mark token as refundable for the buyer. They could have multiple tokens and want...
		// ...a refund for only 1 = true. Others = false.

        return true;
	}

    // Owner functions

    // function executeReturn() public view returns (bool) {
    // 	uint256 elapsedTime = block.timestamp - startTime;
    // 	uint256 timeThreshold = 97 days;

    // 	if (elapsedTime >= timeThreshold) {
    // 		return true;
    // 	} else {
    // 		return false;
    // 	}
    // }

    function return90PercentOfCost(address _buyer, uint256 _tokenId)
    	private // this was 'external', however I want this function to run automatically after the 'startMinting' date.
    	returns (bool)
    {
    	// IS THIS LINE REQUIRED??
        // require(block.timestamp > startMinting + 8380800);

        // These lines replace the above...
        uint256 returnTime = block.timestamp - startMinting;
	    uint256 timeThreshold = 97 days;
	    bool canExecuteReturn = returnTime >= timeThreshold;

	    require(canExecuteReturn, "Cannot execute return yet");


        IERC20 etherBack = IERC20(msg.sender);
        // NEED TO FACTOR IN THE MAPPING FROM ABOVE...
	    etherBack.approve(_to, _tokenId);
	    returnedNFT.transferFrom(_from, _to, _tokenId, ); // do I need the 'data' argument in here?

	    // FIX...

	    // To approve the return of ether using the ERC20 approve function...
	    approve(address _spender, uint256 _value) public returns (bool success)

	    // To transfer the ether, using the ERC20 transferFrom function,to the owner's address...
	    transferFrom(address _from, address _to, uint256 _value)
	    	public
	    	returns (bool success)
	}

	// Do I need to alter this so the owner can't access the funds until after the date above?
    function withdraw()
    	public
    	onlyOwner
    {
    	require(block.timestamp > startMinting + 8352400); // Allows an hour for refunds to go through.
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

