import React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Refund = () => {
	return (
		<Col>
			<Card style={{ width: '300px', maxWidth: '100%' }} className='mx-auto px-auto my-1'>
        <Button variant="primary" type="submit" style={{ width: '40%' }} className='mx-auto px-auto my-4'>
          Refund Mint
        </Button>
          <div className='my-4 text-center'>
            <Countdown date={Date.now() + 7776060000} className='h5' />
          </div>

          <div className='my-4 text-center'>
            <Countdown date={Date.now() + 8380860000} className='h5' />
          </div>
      </Card>
		</Col>
	);
}

export default Refund;
