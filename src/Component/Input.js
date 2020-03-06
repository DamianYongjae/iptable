import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

const Container = styled(TextField)`
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

const Input = ({
  placeholder,
  required = true,
  value,
  onChange,
  type = "text",
  className,
  onKeyPress,
  pattern
}) => (
  <Container
    className={className}
    placeholder={placeholder}
    required={required}
    value={value}
    onChange={onChange}
    type={type}
    onKeyPress={onKeyPress}
    pattern={pattern}
  ></Container>
);

Input.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default Input;
