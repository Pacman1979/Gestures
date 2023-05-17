import React from "react";
import { useState } from 'react'
import { ethers } from 'ethers'
import config from '../config.json'
import NFT_ABI from '../abis/Gestures.json'

const WhitelistedAddresses = async () => {

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const nft = new ethers.Contract(config[31337].nft.address, NFT_ABI, provider)
	const deployer = await nft.owner()
  await nft.updateWhitelist([deployer], true)
  console.log(`The deployer address is: ${deployer}\n`)

  const confirm = await nft.isWhitelisted(deployer)
  console.log(`Deployer's address whitelisted - true or false? ... ${confirm}\n`)
}

export default WhitelistedAddresses;