/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react';
import { Div } from '../styled/index.js';
import Clock from './Clock.jsx';
import Timer from './Timer.jsx';

// eslint-disable-next-line react/prop-types
const ClockOrTimer = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    cursor: 'pointer',
    ...style,
  };

  const [isClock, setIsClock] = useState(true);
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      setIsClock(!isClock);
    },
    [isClock]
  );

  return (
    <Div {...rest} onClick={onClick} style={objStyle} ref={ref}>
      {isClock ? <Clock showClock /> : <Timer />}
    </Div>
  );
});

export default ClockOrTimer;
