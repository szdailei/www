import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Title({ children, ...styles }) {
  document.title = children;

  const containerStyles = {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const itemStyles = {
    fontSize: '3em',
    fontWeight: '700',
    ...styles,
  };
  const StyledContainer = styled.div(containerStyles);
  const StyledItem = styled.div(itemStyles);
  return (
    <StyledContainer>
      <StyledItem id="title">{children}</StyledItem>
    </StyledContainer>
  );
}

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Title;
