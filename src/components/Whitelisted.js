import React from "react";
import { useState } from 'react'
import { ethers } from 'ethers'

import Countdown from 'react-countdown'
import Button from 'react-bootstrap/Button';
import Bootstrap from 'bootstrap'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


// Components
import Loading from './Loading';

const Whitelisted = ({ provider, nft, cost, setIsLoading }) => {
  const [address, setAddress] = useState("")


	return (
		<Card style={{ maxWidth: '350px' }} className='mx-auto px-auto my-1'>
      <Button variant="primary" type="submit" style={{ width: '40%' }} className='mx-auto px-auto my-4'>
        Whitelisted?
      </Button>
      <div style={{ maxWidth: '350px', margin: '50px auto' }} className='my-1 text-center mt-1'>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '300px' }}
          />
        </InputGroup>
      </div>
    </Card>

	)
}

export default Whitelisted;
