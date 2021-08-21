/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const Title = React.forwardRef(({ children, style, ...rest }, ref) => {
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
    ...style,
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
