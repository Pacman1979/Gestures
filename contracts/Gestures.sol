//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./ERC721.sol"; // TODO: Do I need this? I added it to try to get access to the safeTransferFrom function.
import "./IERC721Receiver.sol";
import "./Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Gestures is ERC721Enumerable, Ownable {

    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost;
    uint16 public maxSupply;
    uint256 public wlStartTime;
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
        uint256 _wlStartTime,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;
        wlStartTime = _wlStartTime;
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
        require(block.timestamp >= wlStartTime, "Whitelist Mint not open yet."); // got rid of the '+ 3600'
        require(whitelisted[msg.sender], "Wallet address is not Whitelisted.");
		require(_wMintAmount == 1 || _wMintAmount == 2, "Please enter 1 or 2.");
        require(msg.value <= cost * 2 && msg.value > 0, "Please enter the exact cost of 1 or 2 NFTs.");

        supply = totalSupply();

        require(maxSupply >= supply + _wMintAmount);

        for(uint16 i = 1; i <= _wMintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

        emit WhitelistMint(_wMintAmount, msg.sender);

        whitelisted[msg.sender] = false;
    }

    function publicMint(uint16 _pMintAmount) public payable {
        uint256 pStartTime = wlStartTime + 60;

        require(block.timestamp >= pStartTime, "Public Mint not open yet.");
		require(_pMintAmount == 1 || _pMintAmount == 2, "Please enter 1 or 2.");
        require(msg.value <= cost * 2 && msg.value > 0, "Please enter the exact cost of 1 or 2 NFTs.");

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
        uint256 rStartTime = wlStartTime;
        uint256 rEndTime = wlStartTime + 12000; // 200 minutes.

		require(block.timestamp >= rStartTime, "Refund not available yet.");
        require(block.timestamp <= rEndTime, "Refund period closed.");

    	IERC721 returnNFT = IERC721(address(this));
        require(returnNFT.ownerOf(_tokenId) == msg.sender, "Not the owner of the token");
        returnNFT.safeTransferFrom(msg.sender, address(this), _tokenId);

        require(returnNFT.ownerOf(_tokenId) == address(this), "NFT not received"); // TODO: IS THIS NEEDED?!

        payable(msg.sender).transfer(cost); // Send Ether back to the minter

        return true;
	}

    function withdraw()
    	public
    	onlyOwner
    {
        uint256 wStartTime = wlStartTime + 8384400;
    	require(block.timestamp > wStartTime, "Contract Owner funds not available.");
        uint256 balance = address(this).balance;

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success);

        emit Withdraw(balance, msg.sender);
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }
}
