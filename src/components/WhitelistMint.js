import React from "react"
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

// needs 'provider' for ethers because we're going to sign a contract...
// needs to know about the 'nft' contract, the 'cost' of the mint and...
// to be able to refresh the page (setIsLoading)
const WhitelistMint = ({ provider, nft, cost, setIsLoading, signer }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [mintAmount, setMintAmount] = useState(2)

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const amount = parseInt(mintAmount)

      // Check if the Minter address is already whitelisted
      const isWhitelisted = await nft.isWhitelisted('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      if (!isWhitelisted) {
        window.alert('Account is not whitelisted.')
        setIsWaiting(false)
        return
      }

      const transaction = await nft.connect(signer).whitelistMint(amount, { value: (cost * mintAmount).toString() })
      await transaction.wait()

    } catch {
       window.alert('Whitelist not open or user not whitelisted.')
    }
    window.location.reload()
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
            Whitelist Mint
          </Button>

        </Form.Group>
      )}
    </Form>
  )
}

export default WhitelistMint;
