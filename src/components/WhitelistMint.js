import React from "react";
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

// needs 'provider' for ethers because we're going to sign a contract...
// needs to know about the 'nft' contract, the 'cost' of the mint and...
// to be able to refresh the page (setIsLoading)
const WhitelistMint = ({ provider, nft, cost, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false)

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const signer = await provider.getSigner()
      const amount = parseInt(window.prompt('Enter the amount (1 or 2):'), 10)
      if (amount !== 1 && amount !== 2) {
        throw new Error('Invalid amount entered')
      }
      const transaction = await nft.connect(signer).whitelistMint(amount, { value: cost })
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
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Whitelist Mint
          </Button>
        </Form.Group>
      )}

    </Form>
  )
}

export default WhitelistMint;
