import { ethers } from 'ethers' // for formatting the cost units.
// do I need to import the 'Gestures.sol' for it to use all the Data arguments?

const Data = ({ maxSupply, totalSupply, cost, balance }) => {
  return(
    <div className='text-center mt-5'>
      <p><strong>Available to Mint:</strong> {maxSupply - totalSupply}</p>
      <p><strong>Cost to Mint:</strong> {ethers.utils.formatUnits(cost, 'ether')} ETH</p>
      <p><strong>You own:</strong> {balance.toString()}</p>
    </div>
  )
}

export default Data;
