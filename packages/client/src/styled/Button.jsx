import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Button({ onClick, value, children, ...styles }) {
  const RIPPLE_STYLE = {
    position: 'relative',
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',

    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      content: '""',
      backgroundImage: 'radial-gradient(circle, #fff 5%, transparent 10.01%)',
      opacity: '0',
      transition: 'transform 0.5s, opacity 1s',
      transform: 'scale(10, 10)',
    },

    '&:active::after': {
      opacity: '0.2',
      transition: '0s',
      transform: 'scale(0, 0)',
    },
  };

  const objStyles = {
    cursor: 'pointer',
    width: 'fit-content',
    margin: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#f86e67',

    '&:hover': {
      backgroundColor: '#c84e47',
      boxShadow:
        '0 0 2px -2px rgba(29, 39, 231, 0.1), 0 0 3px 0 rgba(29, 39, 231, 0.1), 0 0 5px 0 rgba(29, 39, 231, 0.1), 0 2px 2px -4px rgba(29, 39, 231, 0.1), 0 4px 8px 0 rgba(29, 39, 231, 0.1), 0 2px 15px 0 rgba(29, 39, 231, 0.1)',
    },
    ...RIPPLE_STYLE,
    ...styles,
  };

  const Styled = styled.div(objStyles);
  return (
    <Styled onClick={onClick} value={value}>
      {children}
    </Styled>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  value: null,
};

export default Button;
