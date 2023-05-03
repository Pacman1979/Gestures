import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from "react-router-bootstrap";

const Tabs = () => {
  return (
    <Nav variant="pills" defaultActiveKey="/" className='justify-content-center my-1'>
      <LinkContainer to="/">
        <Nav.Link>Whitelisted</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/Public">
        <Nav.Link>Public</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/Refund">
        <Nav.Link>Refund</Nav.Link>
      </LinkContainer>
    </Nav>
  );
}

export default Tabs;
