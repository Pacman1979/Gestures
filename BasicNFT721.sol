// All that is needed really to put an NFT on the blockchain...

// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";

contract NFT is ERC721Enumerable {

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {

    }

}
