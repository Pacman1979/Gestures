import React from "react"
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'

// needs 'provider' for ethers because we're going to sign a contract...
// needs to know about the 'nft' contract, the 'cost' of the mint and...
// to be able to refresh the page (setIsLoading)
const WhitelistMint = ({ provider, nft, cost, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [mintAmount, setMintAmount] = useState(2)

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const signer = await provider.getSigner()
      const amount = parseInt(mintAmount)

      // set the address to be whitelisted as the known account[0]
      const accountZero = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
      // whitelist the account above
      const updateWl = await nft.connect().updateWhitelist(accountZero, true)
      await updateWl.wait()

      const transaction = await nft.connect(signer).whitelistMint(amount, { value: cost })
      await transaction.wait()

    } catch {
       console.error(Error)
       // window.alert('User rejected or transaction reverted')
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
            Whitelist Mint
          </Button>

        </Form.Group>
      )}
    </Form>
  )
}

export default WhitelistMint;
