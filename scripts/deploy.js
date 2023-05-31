// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME = 'Gestures[0]'
  const SYMBOL = 'G'
  const COST = ethers.utils.parseUnits('0.1', 'ether')
  const MAX_SUPPLY = 99
  const NFT_MINT_DATE = (1685506000000).toString().slice(0, 10) // Date.now() + 30000
  const IPFS_METADATA_URI = 'ipfs://QmPk6cAtZ68tdeYEWSMfiznzDzuBXYXznZo4x5ArcbUJnp/' //THIS IS THE IMAGES URI!?!

  // Deploy NFT
  const NFT = await hre.ethers.getContractFactory('Gestures')
  let nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, NFT_MINT_DATE, IPFS_METADATA_URI)

  await nft.deployed()
  console.log(`NFT deployed to: ${nft.address}\n`)

  // TODO: Whitelist deployer here
  const minter = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
  await nft.updateWhitelist([minter], true)
  console.log(`The Minter's address is: ${minter}\n`)

  const confirm = await nft.isWhitelisted(minter)
  console.log(`True or false - The Minter's address is whitelisted? ${confirm}\n`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
