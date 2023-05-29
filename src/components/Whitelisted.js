import React from "react";
import { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const Whitelisted = ({ provider, nft, tokenIds }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [checkAddress, setCheckAddress] = useState("")

  const mintHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const deployer = await nft.owner()

      // check if the address that is entered into the form is whitelisted
      const areYouWhitelisted = await nft.isWhitelisted(checkAddress)

      if (areYouWhitelisted === true) {
        window.alert("Congratulations!! The address is whitelisted!")
      } else {
        window.alert("Sorry! You're not whitelisted.")
      }

    } catch {
      window.alert("Please enter a valid wallet address.")
    }

    setIsWaiting(false)
  }

	return (
		<Form onSubmit={mintHandler} style={{ maxWidth: '350px', margin: '0px auto' }}>
      {isWaiting ? (
        <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Form.Group>
        <Card style={{ maxWidth: '350px' }} className='mx-auto px-auto my-1'>
          <Button variant="primary" type="submit" style={{ width: '43%' }} className='mx-auto px-auto my-4' >
            Whitelisted?
          </Button>
          <Form.Control className='my-1 text-left mt-1' style={{ maxWidth: '320px', margin: '50px auto' }}
            type="text"
            placeholder="0x..."
            value={checkAddress}
            onChange={(e) => setCheckAddress(e.target.value)}
          />
        </Card>
        </Form.Group>
      )}
    </Form>

	)
}

export default Whitelisted;
