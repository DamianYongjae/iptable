import React from "react";
import styled from "styled-components";
import FatText from "./Text";

const Header = styled.header`
  width: 100%;
  border: 0;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  border-bottom: ${props => props.theme.boxBorder};
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px 0px;
  z-index: 2;
  font-size: 40px;
`;

export default () => {
  return (
    <Header>
      <FatText text="IP TABLES"></FatText>
    </Header>
  );
};
