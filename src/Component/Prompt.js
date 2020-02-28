import React from "react";
import styled from "styled-components";
import FatText from "./Text";

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  margin-top: 100px;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const Prompt = () => {
  return (
    <Wrapper>
      <FatText text={"PLEASE INPUT IP ADDRESS AND PRESS ENTER KEY!!!"} />
    </Wrapper>
  );
};
export default Prompt;
