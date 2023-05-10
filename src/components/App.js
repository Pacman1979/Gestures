import React from "react"; //EXTRA???
import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

// IMG
import preview from '../0.png'

// Components
import Navigation from './Navigation';
import WData from './WData';
import PData from './PData';

import Tabs from './Tabs';                // Do I need this??
import Whitelisted from './Whitelisted';
import WhitelistMint from './WhitelistMint';
import PublicMint from './PublicMint';

import Loading from './Loading';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/Gestures.json'

// Config: Import your network config here
import config from '../config.json';        // IS THIS IN THE RIGHT PLACE?

// DO I ACTUALLY NEED THE FOLLOWING???
// import {
//   loadProvider,
//   loadNetwork,
//   loadAccount
// } from '../store/interactions'

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNFT] = useState(null)

  const [account, setAccount] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [revealTime, setRevealTime] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)

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
    const wlStartTime = await nft.wlStartTime()
    // JavaScript works in milliseconds so this converts to milliseconds...
    setRevealTime(wlStartTime.toString() + '000')

    // Fetch maxSupply
    setMaxSupply(await nft.maxSupply())

    // Fetch totalSupply
    setTotalSupply(await nft.totalSupply())

    // Fetch cost
    setCost(await nft.cost())

    // Fetch account balance
    setBalance(await nft.balanceOf(account))

    setIsLoading(true)
  }

  useEffect(() => {
    if (!isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />

      <hr />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>
              <WhitelistMint />

              <div className='my-4 text-center'>
                <Countdown date={Date.now() + 60000} className='h2' />
              </div>

              <WData
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />

              <Whitelisted />

            </Col>

            <Col>
              <PublicMint />

              <div className='my-4 text-center'>
                <Countdown date={Date.now() + 28860000} className='h2' />
              </div>

              <PData
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />

            </Col>

            <Col className="d-flex flex-column align-items-center">
              <div className="align-self-end">
                <img src={preview} alt="" width="300" height="300" />
              </div>
              <div className='my-4 text-center'>
                <Countdown date={Date.now() + 7776060000} className='h5' />
              </div>
              <div className='my-4 text-center'>
                <Countdown date={Date.now() + 8380860000} className='h5' />
              </div>
            </Col>



          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
