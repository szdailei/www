import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Input = React.forwardRef(({ type, ...rest }, ref) => {
  let objStyle;

  switch (type) {
    case 'checkbox':
    case 'radio':
      objStyle = {
        fontSize: '1em',
        width: '1em',
        height: '1em',
        margin: '0 0.8em 0 0.8em',
        ...rest.style,
      };
      break;
    case 'text':
      objStyle = {
        fontSize: '1em',
        cursor: 'text',
        outline: 0,
        borderStyle: 'none none solid none',
        ...rest.style,
      };
      break;
    default:
      objStyle = {
        fontSize: '1em',
        ...rest.style,
      };
      break;
  }

  const Styled = styled.input(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled type={type} {...rest} ref={ref} />;
});

Input.propTypes = {
  type: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export default Input;
