/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Span } from '../styled/index.js';

const Clock = React.forwardRef(({ showClock, ...props }, ref) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setDate(new Date()), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  if (showClock)
    return (
      <Span {...props} ref={ref}>
        🕒{date.toLocaleTimeString()}
      </Span>
    );

  return (
    <Span {...props} ref={ref}>
      {date.toLocaleTimeString()}
    </Span>
  );
});

Clock.propTypes = {
  showClock: PropTypes.bool,
};

Clock.defaultProps = {
  showClock: false,
};

export default Clock;
