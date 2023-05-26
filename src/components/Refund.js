import React from "react"
import { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'
// import NFT_ABI from '../abis/Gestures.json'
// import config from '../config.json'

import Form from 'react-bootstrap/Form'
import { Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Refund = ({ provider, nft, cost, setIsLoading, signer, deployer, minter }) => { // TODO: Added 'async' in this line.
  const [isWaiting, setIsWaiting] = useState(false)
  // const [checkAddress, setCheckAddress] = useState("") // TODO: Don't think this is needed either.
  const [tokenIds, setTokenIds] = useState('')
  // const [inputNumber, setInputNumber] = useState('')
  // const [ownerAddress, setOwnerAddress] = useState('')

  const refundHandler = async (e) => {
    e.preventDefault()

    setIsWaiting(true)

    try {
      const enteredId = (parseInt(tokenIds, 10))
      console.log(`This is the token Id entered... ${enteredId}\n`)

      let ownership = await nft.ownerOf(enteredId)
      console.log(`This is the current owner's address (the signer)... ${ownership}\n`)

      console.log(`This is the contract address... ${nft.address}\n`)
      console.log(`This is the deployer's address... ${deployer}\n`)

      const gasLimit = 1000000

      // Check refund availability
      const rStartTime = await nft.wlStartTime()
      const rEndTime = rStartTime.add(12000) // 200 minutes
      const currentTime = Math.floor(Date.now() / 1000)
      if (currentTime < rStartTime) {
        throw new Error("Refund not available yet.")
      }
      if (currentTime > rEndTime) {
        throw new Error("Refund period closed.")
      }

      // Transfer the token to the contract
      if (ownership !== await signer.getAddress()) {
        throw new Error("Not the owner of the token")
      }

      await nft.connect(signer).approve(nft.address, enteredId, { gasLimit })
      const getPaid = await nft.connect(signer).returnable(await signer.getAddress(), enteredId, { gasLimit })


      // const transferFrom = await nft.connect(signer).transferFrom(await signer.getAddress(), await nft.address, enteredId, { gasLimit })
      // await nft.connect(signer)
      // await transferFrom.wait()
      // console.log(transferFrom)
      // console.log(`This is the new owner's account - the contract owner? ${await nft.ownerOf(enteredId)}\n`) // NOW OWNED BY THE CONTRACT AGAIN!!!!!!!!!!!!! LFG!!!!!!!!!!

      // Check if the NFT was received by the contract
      // if (await nft.ownerOf(enteredId) !== await nft.address) {
      //   throw new Error("NFT not received")
      // }

      console.log(`Is this still the contract owner's account? ${await nft.ownerOf(enteredId)}\n`) // YES IT IS... So...

      // Run function and control part of it if possible...
      // const getRefunded = await nft.connect(signer).returnable(await nft.address, enteredId)

      // if (getRefunded === false) {
      //   window.alert("NFT not received.")
      //   console.log(`NFT not received.`)
      // } else {


      // Get the balance of the contract
      const balance = await provider.getBalance(await nft.address)

      // Convert the balance to Ether
      const balanceInEther = ethers.utils.formatEther(balance)

      // Check contract balance before refund...
      console.log(`This is the contract balance: ${balanceInEther} Eth\n`)

      // // Trigger the refund of Ether
      // const refundTx = await nft.connect(signer).returnable(await nft.address, enteredId, { gasLimit })
      // await refundTx.wait()
      // console.log(refundTx)

      // await nft.connect(signer).approve(await signer.getAddress(), enteredId, { gasLimit })
      // const getPaid = await nft.connect(signer).returnable(await nft.address, enteredId, { value: ethers.utils.parseEther("0.1"), gasLimit: 1000000 })
      // console.log(getPaid)

    //     console.log('NFT returned successfully')
    //   }
    } catch (error) {
      console.error('Error returning NFT:', error)
    }

      // if (returnableNFT === false) {
      //   window.alert("You're not the owner of the token")
      // } else {
      // // Send NFT back to contract owner.
      // // a). Approve to do that.
      // // b). Send back to owner.
      //   const approveSendNFT = await nft.connect(signer).approve(deployer.address, tokenIds.toString())
      //   await approveSendNFT.wait()
      //   const sendNFT = await nft.connect(signer).safeTransferFrom(await signer.getAddress(), deployer.address, tokenIds.toString())
      //   await sendNFT.wait()
      // // Send mint cost back to minter.
      // // a). Approve to do that.
      // // b). Send back to minter.
      //   const approveSendEth = await nft.connect(signer).safeApprove(await signer.getAddress(), cost)
      //   await approveSendEth.wait()
      //   const sendEth = await nft.connect(signer).transferFrom(deployer.address, await signer.getAddress(), cost)
      //   await sendEth.wait()
      // }

    // } catch {

    //   window.alert("Please enter a valid Token Id.")
    // }

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
            <Countdown date={Date.now() + 60000} className='h5' />
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
            <Countdown date={Date.now() + 1200000} className='h5' />
          </div>
        </Card>
        </Form.Group>
      )}
    </Form>
		</Col>
	)
}

export default Refund
