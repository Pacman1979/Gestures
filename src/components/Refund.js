import React from "react";
import { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'

import Form from 'react-bootstrap/Form';
import { Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Refund = ({ provider, nft, cost, setIsLoading, signer, deployer }) => { // TODO: Added setIsLoading but didn't change anything.
  const [isWaiting, setIsWaiting] = useState(false)
  // const [checkAddress, setCheckAddress] = useState("") // TODO: Don't think this is needed either.
  const [tokenIds, setTokenIds] = useState("")

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    // try {

      // Click Refund and check that the signer is the holder of the token entered...
      // const NFTHolder = await nft.tokenOfOwnerByIndex(signer, tokenIds) // THE 2ND VALUE HERE IS THE ARRAY NUMBER SO WONT WORK.
      // await NFTHolder.wait()
      // console.log(`${NFTHolder}`)

      // I think this will work because if they've entered the wrong tokenId then it'll fail...
      const returnableNFT = await nft.connect(signer).returnable(signer.address, tokenIds)
      console.log(returnableNFT)

      if (returnableNFT === false) {
        window.alert("You're not the owner of the token")
      } else {
      // Send NFT back to contract owner.
      // a). Approve to do that.
      // b). Send back to owner.
        const approveSendNFT = await nft.connect(signer).approve(signer.address, tokenIds)
        await approveSendNFT.wait()
        const sendNFT = await nft.connect(signer).safeTransferFrom(signer.address, deployer, tokenIds)
        await sendNFT.wait()
      // Send mint cost back to minter.
      // a). Approve to do that.
      // b). Send back to minter.
        const approveSendEth = await nft.connect(signer).safeApprove(signer.address, cost)
        await approveSendEth.wait()
        const sendEth = await nft.connect(signer).transferFrom(deployer, signer.address, cost)
        await sendEth.wait()
      }

    // } catch {

    //   window.alert("Please enter a valid Token Id.")
    // }

    setIsWaiting(false)
  }

	return (
		<Col>
    <Form onSubmit={mintHandler} style={{ maxWidth: '350px', margin: '0px auto' }}>
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
            type="text"
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
	);
}

export default Refund;
