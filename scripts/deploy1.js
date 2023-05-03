// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME = 'Gestures[1]'
  const SYMBOL = 'G1'
  const COST = ethers.utils.parseUnits('0.01', 'ether')
  const MAX_SUPPLY = 900
  const NFT_MINT_DATE = (Date.now() + 60000).toString().slice(0, 10)
  const IPFS_METADATA_URI = 'ipfs://THIS IS GOING TO BE DIFFERENT TO GESTURES0/' //THIS IS THE IMAGES URI!?!

  // Deploy NFT
  const NFT = await hre.ethers.getContractFactory('Gestures1') // Change to 'Gestures' from NFT_Test
  let nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, NFT_MINT_DATE, IPFS_METADATA_URI)

  await nft.deployed()
  console.log(`NFT deployed to: ${nft.address}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
