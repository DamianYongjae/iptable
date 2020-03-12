import React from "react";
import styled, { keyframes } from "styled-components";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
// import { Logo } from "./Icons";

const Animation = keyframes`
    0%{
        opacity: 0
    }
    50%{
        opacity: 1
    }
    100%{
        opacity: 0
    }
`;

const Loader = styled.div`
  animation: ${Animation} 1s linear infinite;
  width: 100%;
  text-align: center;
`;

export default () => (
  <Loader>
    <CloudDownloadIcon fontSize={"large"} />
    <p>Fetching the Data. Please wait!</p>
  </Loader>
);
