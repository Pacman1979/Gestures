import React, { useState, useEffect } from "react"
import { useLocalStorage } from 'react-use'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Countdown from 'react-countdown'

// needs 'provider' for ethers because we're going to sign a contract...
// needs to know about the 'nft' contract, the 'cost' of the mint and...
// to be able to refresh the page (setIsLoading)
const PublicMint = ({ provider, nft, cost, setIsLoading, signer }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [mintAmount, setMintAmount] = useState(2)

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const amount = parseInt(mintAmount)

      if (amount !== 1 && amount !== 2) {
        throw new Error('Invalid amount entered')
      }

      // set up the time restrictions...
      const wlStartTime = await nft.wlStartTime()
      const publicStartTime = wlStartTime.add(3600)

      const currentTime = Math.floor(Date.now() / 1000)

      if (currentTime < publicStartTime) {
        window.alert('Public Mint still closed.')
        console.log(publicStartTime.toString())
        console.log(currentTime)
        // setIsWaiting(false)
        // return
      } else {
        const transaction = await nft.connect(signer).publicMint(amount, { value: (cost * mintAmount).toString() })
        await transaction.wait()
      }

    } catch {
      window.alert('User rejected or transaction reverted')
    }
    window.location.reload()
    setIsLoading(true)
  }

  return(
    <div className='my-1 text-center'>
      <Countdown date={1686108123000} className='h2' />
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
    </Form>
    </div>
  )
}

export default PublicMint;
