import styled from "styled-components";
import React, { Fragment } from "react";

const AppTitle = styled.h4`
	text-align: center;
	text-transform: uppercase;
	margin-top: 20px;
`;

const Header = ({ children, title }) => (
  <Fragment>
    <AppTitle>{title}</AppTitle>
    {children}
  </Fragment>
);

export default Header;
