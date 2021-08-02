import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function StyledContainer({ onClick, children, disabled, ...styles }) {
  let objStyles;
  if (disabled) {
    objStyles = {
      ...styles,

      cursor: 'not-allowed',
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
      color: 'rgba(0, 0, 0, 0.36)',
      opacity: '0.5',
    };
  } else {
    objStyles = { ...styles };
  }
  const Styled = styled.div(objStyles);
  return <Styled onClick={onClick}>{children}</Styled>;
}

StyledContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

StyledContainer.defaultProps = {
  onClick: null,
  disabled: false,
};

export default StyledContainer;
