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
import Navigation from './Navigation';
import Tabs from './Tabs';
import Data from './Data';
import Data1 from './Data1';
import WhitelistMint from './WhitelistMint';
import PublicMint from './PublicMint';
import Loading from './Loading';
import Whitelisted from './Whitelisted';
import Public from './Public';
import Refund from './Refund';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/Gestures.json'

// Config: Import your network config here
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNFT] = useState(null)

  const [account, setAccount] = useState(null)

  const [revealTime, setRevealTime] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
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
    // JavaScript works in milliseconds so this converts to milliseconds...
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

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <HashRouter>

        <Navigation account={account} />

        <hr />

        <Tabs />

        <Routes>
          <Route exact path="/" element={<Whitelisted />} />
          <Route path="/Public" element={<Public />} />
          <Route path="/Refund" element={<Refund />} />
        </Routes>
      </HashRouter>
    </Container>
  )
}

export default App;
