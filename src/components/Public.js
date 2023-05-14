import { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Countdown from 'react-countdown'
import Button from 'react-bootstrap/Button';
import Bootstrap from 'bootstrap'
import { Container, Row, Col } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';

// Components
import PData from './PData';
import PublicMint from './PublicMint';
import Loading from './Loading';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/Gestures.json'

// needs 'provider' for ethers because we're going to sign a contract...
// needs to know about the 'nft' contract, the 'cost' of the mint and...
// to be able to refresh the page (setIsLoading)
const PublicMint = ({ provider, nft, cost, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false)

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      let signer = await provider.getSigner()
      const amount = +window.prompt('Enter the amount you wish to mint (1 or 2):')
      if (amount !== 1 && amount !== 2) {
        throw new Error('Invalid amount entered')

      const transaction = await nft.connect(signer).publicMint(amount, { value: cost })

      await transaction.wait()

      }
    } catch {
      window.alert('User rejected or transaction reverted')
    }

    setIsLoading(true)
  }

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

          <PData
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
