import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Header({ children, ...styles }) {
  const objStyles = {
    gridArea: 'header',
    marginBottom: '0.4em',
    fontSize: '1.4em',
    fontWeight: '700',
    ...styles,
  };
  const StyledHeader = styled.header(objStyles);
  return <StyledHeader>{children}</StyledHeader>;
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;
