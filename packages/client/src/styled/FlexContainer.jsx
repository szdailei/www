import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function FlexContainer({ children, ...styles }) {
  const objStyles = {
    display: 'flex',
    flexDirection: 'column',
    flexFlow: 'column wrap',
    ...styles,
  };
  const Styled = styled.div(objStyles);
  return <Styled>{children}</Styled>;
}

FlexContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FlexContainer;
