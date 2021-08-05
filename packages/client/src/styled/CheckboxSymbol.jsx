import React from 'react';
import PropTypes from 'prop-types';
import Span from './Span.jsx';

const CheckboxSymbol = React.forwardRef(({ checked, ...rest }, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Span {...rest} ref={ref}>
    {checked ? '☑' : '☐'}
  </Span>
));

CheckboxSymbol.propTypes = {
  checked: PropTypes.bool.isRequired,
};

export default CheckboxSymbol;
