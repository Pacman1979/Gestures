import React from "react"; //EXTRA???
import { useEffect, useState, useCallback } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

// IMG
import preview from '../0.png'

// Components
import Navigation from './Navigation'
import Data from './Data'
import Whitelisted from './Whitelisted'
import WhitelistMint from './WhitelistMint'
import PublicMint from './PublicMint'
import Refund from './Refund'
import Loading from './Loading'
import UpdateWhitelist from './UpdateWhitelist'

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/Gestures.json'

// Config: Import your network config here
import config from '../config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNFT] = useState(null)

  const [account, setAccount] = useState(null)
  const [accounts, setAccounts] = useState(null)

  const [deployer, setDeployer] = useState(null)
  const [minter, setMinter] = useState(null)
  const [signer, setSigner] = useState(null)

  const [revealTime, setRevealTime] = useState(0) // should I change this to WRevealTime, setWRevealTime??
  // do I need a PRevealTime, setPRevealTime and others for the countdown timers?
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)
  const [mintAmount, setMintAmount] = useState(0)
  const [tokenIds, setTokenIds] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const handleAccountChange = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (account) {
      window.ethereum.on('accountsChanged', handleAccountChange);
    }
  }, [account])

  const loadBlockchainData = async () => { // TODO: Update here with the AMM settings (if applicable)...
    // // Initiate provider
    // const provider = await loadProvider(dispatch)

    // // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    // const chainId = await loadNetwork(provider, dispatch)

    // // Reload page when network changes
    // window.ethereum.on('chainChanged', () => {
    //   window.location.reload()
    // })

    // // Fetch current account from Metamask when changed
    // window.ethereum.on('accountsChanged', async () => {
    //   await loadAccount(dispatch)
    // })

    // // Connect to the Ethereum network - TODO: Do I need to make some changes below??
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send('eth_requestAccounts', []);

    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Initiate contract
    const nft = new ethers.Contract(config[31337].nft.address, NFT_ABI, provider)
    setNFT(nft)

    // Initiate signer
    const signer = await provider.getSigner()
    setSigner(signer)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Initiate deployer
    const deployer = await nft.owner()
    setDeployer(deployer)

    // Initiate minter
    const minter = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' // TODO: Can I make this: const minter = ethers.utils.getAddress(accounts[1])
    setMinter(minter)

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

    // Fetch token Ids
    const tokenCount = await nft.balanceOf(account)
    const tokenIds = []
    for (let i = 0; i < tokenCount; i++) {
      const tokenId = await nft.tokenOfOwnerByIndex(account, i)
      tokenIds.push(tokenId.toString())
    }
    setTokenIds(tokenIds)

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  return(
    <Container>
      {account && (
      <Navigation account={account} />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>

              <div className='my-1 text-center'>
                <Countdown date={1685342449000} className='h2' />
              </div>

              <WhitelistMint
                provider={provider}
                nft={nft}
                cost={cost}
                setIsLoading={setIsLoading}
                signer={signer}
                tokenIds={tokenIds}
              />

              <div className='mt-4 align-self-end mb-4'>
                <Whitelisted
                provider={provider}
                nft={nft}
                tokenIds={tokenIds}
              />
              </div>

              <div className="d-flex flex-column align-items-center">
              {balance > 0 ? (
                <div className='text-center'>
                  <img
                    src={`https://ipfs.io/ipfs/QmPk6cAtZ68tdeYEWSMfiznzDzuBXYXznZo4x5ArcbUJnp/${balance.toString()}.png`}
                    alt="Gestures"
                    width="200px"
                    height="200px"
                  />
                </div>
              ) : (
                <img src={preview} alt="" width="200" height="200" />
              )}
              </div>

            </Col>

            <Col>
              <PublicMint
                provider={provider}
                nft={nft}
                cost={cost}
                setIsLoading={setIsLoading}
                signer={signer}
                tokenIds={tokenIds}
              />

              <Data
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
                tokenIds={tokenIds}
              />

            </Col>

            <Col>

              <Refund
                provider={provider}
                nft={nft}
                cost={cost}
                setIsLoading={setIsLoading}
                tokenIds={tokenIds}
                signer={signer}
                deployer={deployer}
              />

            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
