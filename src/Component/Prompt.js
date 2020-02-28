import React from "react";
import styled from "styled-components";
import FatText from "./Text";
import Button from "./Buttons";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
  width: 100%;
  margin-top: 100px;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  margin-top: 10px;
  margin-left: 10px;
  background-color: #fafafa;
  padding: 5px;
  font-size: 14px;
  border-radius: 3px;
  height: auto;
  text-align: center;
  width: 140px;
  &::placeholder {
    opacity: 0.8;
    font-weight: 200;
  }
  :focus {
    outline: none;
  }
`;

const CustomButton = styled(Button)``;

const Prompt = () => {
  return (
    <Wrapper>
      <FatText text={"PLEASE INPUT IP ADDRESS AND PRESS ENTER KEY!!!"} />
      <SearchInput class="inputIP" type="text" placeholder="ex) 192.168.1.1" />
      <CustomButton text={"export"} />
      <CustomButton text={"import"} />
    </Wrapper>
  );
};
export default Prompt;
