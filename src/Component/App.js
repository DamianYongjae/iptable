import React from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Prompt from "./Prompt";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
  width: 100%;
`;

export default () => {
  // const {
  //   ipAddr
  // }
  return (
    <>
      <Header />
      <Wrapper>
        <Prompt />
      </Wrapper>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </>
  );
};
