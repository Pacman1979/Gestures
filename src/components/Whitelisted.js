import React from "react";
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from 'ethers'

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Countdown from 'react-countdown'
import Button from 'react-bootstrap/Button';
import Bootstrap from 'bootstrap'

// IMG
import preview from '../1Text100.png';

// Components
import Tabs from './Tabs';
import WData from './WData';
import PData from './PData';
import WhitelistMint from './WhitelistMint';
import Loading from './Loading';
import Public from './Public';
import Refund from './Refund';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/Gestures.json'

// Config: Import your network config here
import config from '../config.json';

function Whitelisted() {
	const [revealTime, setRevealTime] = useState(0)
	const [provider, setProvider] = useState(null)
	const [nft, setNFT] = useState(null)

  const [account, setAccount] = useState(null)

	const [isLoading, setIsLoading] = useState(true)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState("")

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Initiate contract
    const nft = new ethers.Contract(config[31337].nft.address, NFT_ABI, provider)
    setNFT(nft)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch Countdown
    const startMinting = await nft.startMinting()
    // JavaScript works in milliseconds so adding '+ '000' ' converts to milliseconds...
    setRevealTime(startMinting.toString() + '000')

    // Fetch maxSupply
    setMaxSupply(await nft.maxSupply())

    // Fetch totalSupply
    setTotalSupply(await nft.totalSupply())

    // Fetch cost
    setCost(await nft.cost())

    // Fetch account balance
    setBalance(await nft.balanceOf(account))

    setIsLoading(false)
  }

	return (
		<Card style={{ maxWidth: '350px' }} className='mx-auto px-auto my-1'>
      <Button variant="primary" type="submit" style={{ width: '40%' }} className='mx-auto px-auto my-4'>
        Whitelisted?
      </Button>
      <div style={{ maxWidth: '350px', margin: '50px auto' }} className='my-1 text-center mt-1'>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '300px' }}
          />
        </InputGroup>
      </div>
    </Card>

	)
}

export default Whitelisted;
