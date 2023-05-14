import React from "react";
import { useState } from 'react'
import { ethers } from 'ethers'
import Spinner from 'react-bootstrap/Spinner'

import Button from 'react-bootstrap/Button';
import Bootstrap from 'bootstrap'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


const UpdateWhitelist = ({ provider, nft, cost, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false)
	const [address, setAddress] = useState("")
	const [bool, setBool] = useState(false)

	const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

		let trueFalse = true // DEAL WITH THIS + BOOL, SETBOOL + ADDRESSES, TRUEFALSE

    try {
      const signer = await provider.getSigner()
      const address = signer.getAddress()

			const updateWl = await nft.connect(address).updateWhitelist(address, trueFalse, { value: address });
			await updateWl.wait()

    } catch {
      window.alert('User rejected or transaction reverted')
    }

  setIsLoading(true)

	}

  return (
		<Card style={{ maxWidth: '350px' }} className='mx-auto px-auto my-1'>
  	<Form onSubmit={mintHandler} style={{ maxWidth: '300px', margin: '0px auto' }}>
      {isWaiting ? (
        <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Form.Group>
        <div style={{ maxWidth: '450px', margin: '50px auto' }} className='my-1 text-center mt-1'>
	        <InputGroup>
	          <Form.Control className='text-center' style={{ maxWidth: '100%' }}
	            type="text"
	            placeholder="0x..."
	            value={address}
	            onChange={(e) => setAddress(e.target.value)}
	            style={{ width: '300px' }}
	          />
			      <Button variant="primary" type="submit" style={{ width: '50%' }} className='mx-auto px-auto my-4'>
			        Update Whitelist
			      </Button>
          </InputGroup>
        </div>
        </Form.Group>
      )}
    </Form>
    </Card>
	)
}

export default UpdateWhitelist;
