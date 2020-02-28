import React from "react";
import styled from "styled-components";
import FatText from "./Text";
import Button from "./Buttons";
import Input from "./Input";
import useInput from "../Hooks/useInput";
import { toast } from "react-toastify";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
  width: 100%;
  margin-top: 100px;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const Prompt = () => {
  const input = useInput("");

  const onKeyPress = async event => {
    const { which } = event;
    if (which === 13) {
      event.preventDefault();
      try {
        toast.info("enter pressed. INPUT VALUE: " + input.value);
        input.setValue("");
      } catch {
        toast.error("error occurred");
      }
    }
  };

  return (
    <Wrapper>
      <FatText text={"PLEASE INPUT IP ADDRESS AND PRESS ENTER KEY!!!"} />
      <Input
        value={input.value}
        onChange={input.onChange}
        placeholder="ex) 192.168.1.1"
        onKeyPress={onKeyPress}
      />
      <Button text={"export"} />
      <Button text={"import"} />
    </Wrapper>
  );
};
export default Prompt;
