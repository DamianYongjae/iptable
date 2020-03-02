import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.button`
  margin-left: 10px;
  width: 60px;
  border: 0;
  border-radius: 4px;
  color: white;
  font-weight: 600;
  background-color: #3897f0;
  text-align: center;
  padding: 7px 0px;
  font-size: 14px;
  cursor: pointer;
  :active {
    transform: translate(1px, 1px);
  }
  :focus {
    outline: none;
  }
`;

const Button = ({ text, onClick, id, className }) => (
  <Container onClick={onClick} id={id} className={className}>
    {text}
  </Container>
);

Button.prototype = {
  text: PropTypes.string.isRequired
};

export default Button;
