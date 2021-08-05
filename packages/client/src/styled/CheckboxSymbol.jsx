/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Span from './Span.jsx';

const CheckboxSymbol = React.forwardRef(({ checked, ...rest }, ref) => {
  const objStyle = { cursor: 'pointer', ...rest.style };
  return (
    <Span {...rest} style={objStyle} ref={ref}>
      {checked ? '☑' : '☐'}{' '}
    </Span>
  );
});

CheckboxSymbol.propTypes = {
  checked: PropTypes.bool.isRequired,
};

export default CheckboxSymbol;
