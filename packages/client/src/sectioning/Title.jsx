/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Title = React.forwardRef(({ children, ...rest }, ref) => {
  document.title = children;

  const containerStyle = {
    minHeight: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const itemStyle = {
    fontSize: '3em',
    fontWeight: '700',
    ...rest.style,
  };
  const StyledContainer = styled.div(containerStyle);
  const StyledItem = styled.div(itemStyle);
  return (
    <StyledContainer {...rest} ref={ref}>
      <StyledItem id="title">{children}</StyledItem>
    </StyledContainer>
  );
});

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Title;
