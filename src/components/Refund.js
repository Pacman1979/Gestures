import React from "react"
import { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'

import Form from 'react-bootstrap/Form'
import { Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Refund = ({ provider, nft, cost, setIsLoading, signer, deployer, minter }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [tokenIds, setTokenIds] = useState('')

  const refundHandler = async (e) => {
    e.preventDefault()

    setIsWaiting(true)

    try {
      const enteredId = (parseInt(tokenIds, 10))
      console.log(`This is the token Id entered... ${enteredId}\n`)

      let ownership = await nft.ownerOf(enteredId)
      console.log(`This is the current owner's address (the Minter)... ${ownership}\n`)

      const balanceBefore = await provider.getBalance('0x70997970C51812dc3A010C7d01b50e0d17dc79C8') // TODO: changing long address to account[1]
      const balanceBeforeInEther = ethers.utils.formatEther(balanceBefore)
      console.log(`This is the Minter's address balance... ${balanceBeforeInEther} Eth.\n`)

      console.log(`This is the contract address... ${nft.address}\n`)

      // Get the balance of the contract
      const contractBalance = await provider.getBalance(await nft.address)
      // Convert the balance to Ether
      const contractBalanceInEther = ethers.utils.formatEther(contractBalance)
      // Show the contract balance before refund...
      console.log(`This is the current contract balance... ${contractBalanceInEther} Eth\n`)

      const gasLimit = 1000000

      // Check refund availability
      const wlStartTime = await nft.wlStartTime()
      const rStartTime = wlStartTime.add(120)

      const rEndTime = wlStartTime.add(612000)
      const currentTime = Math.floor(Date.now() / 1000)


      // fix this: message needed for trying to claim a refund on an unowned NFT...

      if (ownership !== await signer.getAddress()) {
        window.alert('Not the owner of the token.')
        console.log(ownership)
        setIsWaiting(false)
        return
      }






      if (currentTime < rStartTime) {
        window.alert('Refund not available yet.')
        setIsWaiting(false)
        return
      }

      if (currentTime > rEndTime) {
        window.alert('Refund period closed.')
        setIsWaiting(false)
        return
      }

      await nft.connect(signer).approve(nft.address, enteredId, { gasLimit })
      const getPaid = await nft.connect(signer).returnable(await signer.getAddress(), enteredId, { gasLimit })
      await getPaid.wait()
      console.log(`Is this now the contract owner's account? ${await nft.ownerOf(enteredId)}\n`)

    } catch (error) {
      console.error('Error returning NFT:', error)
    }
    window.location.reload()
    setIsWaiting(false)
  }

	return (
		<Col>
    <Form onSubmit={refundHandler} style={{ maxWidth: '350px', margin: '0px auto' }}>
      {isWaiting ? (
        <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Form.Group>
  			<Card style={{ width: '300px', maxWidth: '100%' }} className='mx-auto px-auto my-1'>
          <div className='text-center mt-1 h5'>
            <p><strong style={{ textDecoration: 'underline' }}>Refund period open in:</strong></p>
          </div>
          <div className='my-1 text-center'>
            <Countdown date={1686024000000} className='h5' />
          </div>
          <Form.Control className='my-4 text-center mt-1' style={{ maxWidth: '150px', margin: '50px auto' }}
            type="number"
            min="1"
            max="99"
            placeholder="Token Id..."
            value={tokenIds}
            onChange={(e) => setTokenIds(e.target.value)}
          />

          <Button variant="primary" type="submit" style={{ width: '40%' }} className='mx-auto px-auto my-1'>
            Refund Mint
          </Button>
          <div className='text-center mt-3'>
            <p><strong style={{ textDecoration: 'underline' }}>Time left to claim:</strong></p>
          </div>

          <div className='my-1 text-center mb-4'>
            <Countdown date={1686628800000} className='h5' />
          </div>
        </Card>
        </Form.Group>
      )}
    </Form>
		</Col>
	)
}

export default Refund
