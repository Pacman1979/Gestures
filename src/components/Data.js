import React from "react";
import { ethers } from 'ethers' // for formatting the cost units.

const Data = ({ maxSupply, totalSupply, cost, balance, tokenIds }) => {
  return(
    <div className='text-center mt-5'>
      <p><strong>Available to Mint:</strong> {maxSupply - totalSupply}</p>
      <p><strong>Cost to Mint:</strong> {ethers.utils.formatUnits(cost, 'ether')} ETH</p>
      <p><strong>You own:</strong> {balance.toString()}</p>
      <p><strong>Token IDs:</strong> {tokenIds.join(', ')}</p>
    </div>
  )
}

export default Data;
