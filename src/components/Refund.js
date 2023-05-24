import React from "react"
import { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'
import NFT_ABI from '../abis/Gestures.json';
import IERC721 from '@openzeppelin/contracts/token/ERC721/ERC721.sol'
import config from '../config.json'

import Form from 'react-bootstrap/Form'
import { Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Refund = ({ provider, nft, cost, setIsLoading, signer, deployer, minter }) => { // TODO: Added 'async' in this line.
  const [isWaiting, setIsWaiting] = useState(false)
  // const [checkAddress, setCheckAddress] = useState("") // TODO: Don't think this is needed either.
  const [tokenIds, setTokenIds] = useState('')
  const [inputNumber, setInputNumber] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')

  const refundHandler = async (e) => {
    e.preventDefault()

    setIsWaiting(true)

    // try {
      const returnedId = (parseInt(tokenIds, 10))
      console.log(`This is the token Id entered... ${returnedId}\n`)

      const ownership = await nft.ownerOf(returnedId)
      console.log(`This is the signer's address... ${ownership}\n`)

      console.log(`This is the contract address... ${nft.address}\n`)
      console.log(`This is the deployer's address... ${deployer}\n`)

      const gasLimit = 100000

      const testNft = new ethers.Contract(config[31337].nft.address, NFT_ABI, provider).attach(config[31337].nft.address)
      console.log(testNft)
      // const returnableCheck = await nft.connect(signer).returnable(ownership, returnedId, { gasLimit })
      const approve = await nft.connect(signer).approve(await nft.address, returnedId)
      await approve.wait()
      console.log(approve)

      // Call the safeTransferFrom function using the contract interface
      const ierc721Interface = new ethers.utils.Interface(NFT_ABI)
      const functionSignature = ierc721Interface.getSighash('safeTransferFrom(signer, await testNft.address, returnedId)')
      const data = ierc721Interface.encodeFunctionData('safeTransferFrom', signer, await testNft.address, returnedId)
      const safeTransferFrom = await testNft.signer.sendTransaction({
        to: testNft.address,
        data: data,
        value: ethers.utils.parseEther('0') // If there's no value to transfer along with the token
      });

      // const safeTransferFrom = await nft.safeTransferFrom(minter, await nft.address, returnedId)
      // await nft.connect(signer)
      // await safeTransferFrom.wait()
      // console.log(safeTransferFrom)

        // const ownerOf = await nft.ownerOf(returnedId)
        // const getPaid = await nft.connect(signer).payable(ownership).transfer(cost)

        // if (ownerOf === !deployer) {
        //   throw new Error("NFT not received.")
        // } else {
        //   await getPaid.wait()
        // }









      // Click Refund and check that the signer is the holder of the token entered...
      // const returnableNFT = await nft.returnable(ownership, returnedId)
      // console.log(returnableNFT)
    //   let transaction
    //     // Call the returnable function
    //     if (transaction = await nft.connect(deployer).returnable(deployer.toString(), returnedId) === false) {
    //     console.log(transaction)
    //     } else {

    //     // Wait for the transaction to be mined
    //     // await transaction.wait()



    //     console.log('NFT returned successfully')
    //   }
    // } catch (error) {
    //   console.error('Error returning NFT:', error)
    // }

      // Call the returnNFT function with the contract address and token ID
      // const contractAddress = '0x...'; // Replace with the actual contract address
      // const tokenId = 1; // Replace with the actual token ID
      // returnNFT(contractAddress, tokenId);


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
	);
}

export default Refund;
