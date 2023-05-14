import React from "react"; //EXTRA???
import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

// IMG
import preview from '../0.png'

// Components
import Navigation from './Navigation'
import WData from './WData'
import PData from './PData'
import Whitelisted from './Whitelisted'
import WhitelistMint from './WhitelistMint'
import PublicMint from './PublicMint'
import Refund from './Refund'
import Loading from './Loading'
import UpdateWhitelist from './UpdateWhitelist'

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/Gestures.json'

// Config: Import your network config here
import config from '../config.json'        // IS THIS IN THE RIGHT PLACE?

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNFT] = useState(null)

  const [account, setAccount] = useState(null)

  const [revealTime, setRevealTime] = useState(0) // should I change this to WRevealTime, setWRevealTime??
  // do I need a PRevealTime, setPRevealTime and others for the countdown timers?
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

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

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
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
              <WData
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />

              <WhitelistMint
                provider={provider}
                nft={nft}
                cost={cost}
                setIsLoading={setIsLoading}
              />

              <div className='mt-4 align-self-end mb-1'>
                <Whitelisted />
              </div>

            </Col>

            <Col>
              <PublicMint
                provider={provider}
                nft={nft}
                cost={cost}
                setIsLoading={setIsLoading}
              />

              <PData
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />

              <div className='mt-4 align-self-end mb-1'>
              <UpdateWhitelist />
              </div>

            </Col>

            <Col className="d-flex flex-column align-items-center">
              {balance > 0 ? (
                <div className='text-center'>
                  <img
                    src={`https://ipfs.io/ipfs/QmPk6cAtZ68tdeYEWSMfiznzDzuBXYXznZo4x5ArcbUJnp/${balance.toString()}.png`}
                    alt="Gestures"
                    width="300px"
                    height="300px"
                  />
                </div>
              ) : (
                <img src={preview} alt="" width="300" height="300" />
              )}

            <Refund />

            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
