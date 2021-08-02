import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '../styled/index.js';

function CheckboxWithState({ checked, ...styles }) {
  const [state, setState] = useState(checked);
  const clickCheckbox = useCallback(
    (event) => {
      event.preventDefault();
      setState(!state);
    },
    [state]
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Checkbox checked={state} onClick={clickCheckbox} {...styles} />;
}

CheckboxWithState.propTypes = {
  checked: PropTypes.bool,
};

CheckboxWithState.defaultProps = {
  checked: false,
};

export default CheckboxWithState;
