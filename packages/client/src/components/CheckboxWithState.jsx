/* eslint-disable react/forbid-prop-types */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '../styled/index.js';

const CheckboxWithState = React.forwardRef(({ label, checked, ...rest }, ref) => {
  const [stateOfChecked, setStateOfChecked] = useState(checked);
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      setStateOfChecked(!stateOfChecked);
    },
    [stateOfChecked]
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Checkbox {...rest} label={label} checked={stateOfChecked} onClick={onClick} ref={ref} />;
});

CheckboxWithState.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
};

CheckboxWithState.defaultProps = {
  checked: false,
};

export default CheckboxWithState;
