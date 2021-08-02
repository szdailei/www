import React, { useState, useEffect } from 'react';
import { Span } from '../styled/index.js';

function Clock({ ...styles }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setDate(new Date()), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Span {...styles}>🕒{date.toLocaleTimeString()} </Span>;
}

export default Clock;
