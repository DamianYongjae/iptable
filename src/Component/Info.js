import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
  width: 100%;
`;

export default () => {
  return (
    <Wrapper>
      <p>1. You can add Ip address.</p>
      <p>2. You can add Memo in 'View All List' menu.</p>
      <p>3. You can modify Ip address memo and type in search Modal</p>
      <p>4. You can delete Ip address in 'View All List' menu</p>
      <p>5. You can export black list and white list in each menu.</p>
      <p>6. You can find out information of the IP by clicking 'i' icons</p>
    </Wrapper>
  );
};
