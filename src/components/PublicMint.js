import React from "react";
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Countdown from 'react-countdown'

// needs 'provider' for ethers because we're going to sign a contract...
// needs to know about the 'nft' contract, the 'cost' of the mint and...
// to be able to refresh the page (setIsLoading)
const PublicMint = ({ provider, nft, cost, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [mintAmount, setMintAmount] = useState(2)

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const signer = await provider.getSigner()
      const amount = parseInt(mintAmount)

      if (amount !== 1 && amount !== 2) {
        throw new Error('Invalid amount entered')
      }
      const transaction = await nft.connect(signer).publicMint(amount, { value: cost })
      await transaction.wait()

    } catch {
      window.alert('User rejected or transaction reverted')
    }

    setIsLoading(true)
  }

  return(
    <Form onSubmit={mintHandler} style={{ maxWidth: '150px', margin: '0px auto' }}>
      {isWaiting ? (
        <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Form.Group>
          <Form.Control className='text-center' style={{ maxWidth: '100%' }}
            type="number"
            min="1"
            max="2"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
          />
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Public Mint
          </Button>

        </Form.Group>
      )}
      <div className='my-4 text-center'>
        <Countdown date={Date.now() + 120000} className='h2' />
      </div>
    </Form>
  )
}

export default PublicMint;
