import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Main({ children, ...styles }) {
  const objStyles = {
    gridArea: 'main',
    ...styles,
  };
  const StyledMain = styled.main(objStyles);
  return <StyledMain>{children}</StyledMain>;
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
