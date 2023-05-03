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
import PublicMint from './PublicMint';
import Loading from './Loading';
import Refund from './Refund';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/Gestures.json'

function Public() {
	const [revealTime, setRevealTime] = useState(0)
	const [provider, setProvider] = useState(null)
	const [nft, setNFT] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState("")


	return (
		// can put an image below as it'll be to the left hand side of the page.
		<Card style={{ maxWidth: '450px' }} className='mx-auto px-auto my-4'>
      <Row>
        <Col>
          <div className='my-0 text-center mt-1' >
            <Countdown date={parseInt(revealTime)} className='h1' />
          </div>
          <PublicMint
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
	);
}

export default Public;

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
