//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Gestures is ERC721Enumerable, Ownable {

    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost;
    uint16 public maxSupply;
    uint32 public startMinting;
    uint256 public supply = 0;

    mapping(address => bool) public whitelisted;

    event WhitelistMint(uint16 amount, address minter);
    event PublicMint(uint16 amount, address minter);
    event Withdraw(uint256 amount, address owner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint16 _maxSupply,
        uint32 _startMinting,
        string memory _baseURI
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

    function whitelistMint(uint16 _wMintAmount) public payable {

        require(block.timestamp >= startMinting && block.timestamp < startMinting + 28800);
        require(whitelisted[msg.sender], "Wallet address is not Whitelisted.");
		require(_wMintAmount == 1 || _wMintAmount == 2, "Invalid mint amount.");
        require(msg.value <= cost * 2 && msg.value > 0, "Invalid Ether amount.");

        supply = totalSupply();

        require(supply + _wMintAmount <= maxSupply);

        for(uint16 i = 1; i <= _wMintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

    	whitelisted[msg.sender] = false;

        emit WhitelistMint(_wMintAmount, msg.sender);
    }

    function publicMint(uint16 _pMintAmount) public payable {

        require(block.timestamp >= startMinting + 28800 && block.timestamp < startMinting + 57600);
		require(_pMintAmount == 1 || _pMintAmount == 2, "Invalid mint amount");
        require(msg.value <= cost * 2 && msg.value > 0, "Invalid Ether amount");

        supply = totalSupply();

        require(supply + _pMintAmount <= maxSupply);

        for(uint16 i = 1; i <= _pMintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

        emit PublicMint(_pMintAmount, msg.sender);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns(string memory)
    {
        require(_exists(_tokenId), 'token does not exist');
        return(string(abi.encodePacked(baseURI, _tokenId.toString(), baseExtension)));
    }

    function walletOfOwner(address _owner) public view returns(uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for(uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function returnable(address _buyer, uint256 _tokenId)
    	public
    	returns (bool)
    {
		require(block.timestamp >= startMinting + 7776000 && block.timestamp < startMinting + 8382600);

    	IERC721 returnNFT = IERC721(address(this));
        require(returnNFT.ownerOf(_tokenId) == _buyer, "Not the owner of the token");
        returnNFT.approve(msg.sender, _tokenId);
        returnNFT.safeTransferFrom(msg.sender, address(this), _tokenId);

        require(returnNFT.ownerOf(_tokenId) == address(this), "NFT not received");

		IERC20 etherBack = IERC20(msg.sender);
	    etherBack.approve(msg.sender, cost);
	    etherBack.transferFrom(address(this), msg.sender, cost);

        return true;
	}

    function withdraw()
    	public
    	onlyOwner
    {
    	require(block.timestamp > startMinting + 8352400);
        uint256 balance = address(this).balance;

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success);

        emit Withdraw(balance, msg.sender);
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }
}
