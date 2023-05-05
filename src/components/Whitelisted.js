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
import Data from './Data';
import Data1 from './Data1';
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
		// can put an image below as it'll be to the left hand side of the page.
		<Card style={{ maxWidth: '450px' }} className='mx-auto px-auto my-4' >
       <Row>
        <Col>
          <div className='my-0 text-center mt-1' >
            <Countdown date={parseInt(revealTime)} className='h1' />
          </div>
          <WhitelistMint
              provider={provider}
              nft={nft}
              cost={cost}
              setIsLoading={setIsLoading}
          />

          <Data
            maxSupply={maxSupply}
            totalSupply={totalSupply}
            cost={cost}
            balance={balance}
          />

          <Row>
            <div style={{ maxWidth: '400px', margin: '50px auto' }} className='my-1 text-center mt-4' >
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </InputGroup>
            </div>
          </Row>
        </Col>
      </Row>
    </Card>
	)
}

export default Whitelisted;

//       <Col xs={1}>
//         <div>
//           <img src={preview} alt="" />
//           <img src={preview} alt="" className='my-1'/>
//           <img src={preview} alt="" />
//           <img src={preview} alt="" className='my-1'/>
//         </div>
//       </Col>

//           </Row>

//           <Row xs={1}>
//             <div>
//               <img src={preview} alt="" />
//               <img src={preview} alt="" className='mx-1'/>
//               <img src={preview} alt="" />
//               <img src={preview} alt="" className='mx-1'/>
//               <img src={preview} alt="" />
//               <img src={preview} alt="" className='mx-1'/>
//               <img src={preview} alt="" />
//               <img src={preview} alt="" className='mx-1'/>
//               <img src={preview} alt="" />
//               <img src={preview} alt="" className='mx-1'/>
//               <img src={preview} alt="" />
//               <img src={preview} alt="" className='mx-1'/>
//             </div>
//           </Row>
//         </>
//       )}
//     </Container>
//   )
// }