import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import { ethers } from 'ethers'

import logo from '../[0].png'

import '../font.css'

const Navigation = ({ account }) => {
  return (
    <div>
    <Navbar className='my-0 mb-4' style={{ height: '100px' }}>
      <img
        alt="logo"
        src={logo}
        width="60"
        height="60"
        className="d-inline-block align-top mx-1"
      />

      <Navbar.Text className='mx-auto' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flex: '1.5' }}>
        <h1 className='my-0 text-center ginga-font' style={{ color: '#b8860b', fontSize: '150px' }}>Gestures</h1> {/* Apply ginga-font class */}
      </Navbar.Text>

      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          { account ? account.toString().slice(0, 4) + "..." + account.toString().slice(-4) : "Please connect Wallet" }
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
    <hr/>
    </div>
  );
}

export default Navigation;
