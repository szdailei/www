import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Split({ children, leftWidth, rightWidth, right, ...styles }) {
  const [first, ...rest] = React.Children.toArray(children);

  const containerStyles = {
    display: 'flex',
    ...styles,
  };

  const leftItemStyles = {
    width: leftWidth,
  };

  const rightLeftStyles = {
    width: rightWidth,
  };

  const StyledContainer = styled.div(containerStyles);
  const StyledLeftItem = styled.div(leftItemStyles);
  const StyledRightItem = styled.div(rightLeftStyles);

  if (right) {
    return (
      <StyledContainer>
        <StyledRightItem>{rest}</StyledRightItem>
        <StyledLeftItem>{first}</StyledLeftItem>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledLeftItem>{first}</StyledLeftItem>
      <StyledRightItem>{rest}</StyledRightItem>
    </StyledContainer>
  );
}

Split.propTypes = {
  children: PropTypes.node.isRequired,
  leftWidth: PropTypes.string,
  rightWidth: PropTypes.string,
  right: PropTypes.bool,
};

Split.defaultProps = {
  leftWidth: '50%',
  rightWidth: '50%',
  right: false,
};

export default Split;
