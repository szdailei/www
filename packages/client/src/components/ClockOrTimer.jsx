/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react';
import { Div } from '../styled/index.js';
import Clock from './Clock.jsx';
import Timer from './Timer.jsx';

function ClockOrTimer({ ...styles }) {
  const [state, setState] = useState(true);
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      setState(!state);
    },
    [state]
  );

  return (
    <Div onClick={onClick} cursor="pointer">
      {state ? <Clock {...styles} /> : <Timer {...styles} />}
    </Div>
  );
}

export default ClockOrTimer;
