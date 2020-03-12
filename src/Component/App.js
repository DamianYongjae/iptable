import React from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { HashRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Prompt from "./Prompt";
import Routes from "./Routes";
import Info from "./Info";
import { Modal } from "react-bootstrap";
import { IconButton } from "@material-ui/core";
import { Button } from "react-bootstrap";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
  width: 100%;
`;

export default () => {
  const [show, setShow] = React.useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <Router>
      <>
        <Header />
        <Wrapper>
          <Prompt />
          <IconButton
            aria-label="info"
            style={{
              outline: "none",
              color: "#3897f0"
            }}
            onClick={handleShow}
          >
            <LiveHelpIcon fontSize="large" />
          </IconButton>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>How to use IP Table</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Info />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Routes />
        </Wrapper>
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </>
    </Router>
  );
};
