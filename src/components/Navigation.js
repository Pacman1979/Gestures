import Navbar from 'react-bootstrap/Navbar';
import { ethers } from 'ethers'

import logo from '../[0].png';

const Navigation = ({ account }) => {
  return (
    <Navbar className='my-3'>
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#"><strong>Gestures</strong></Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          { account ? account.toString().slice(0, 4) + "..." + account.toString().slice(-4) : "Refresh to connect Wallet" }
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
