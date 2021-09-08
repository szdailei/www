/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useImperativeHandle } from 'react';
import { Div } from '../styled/index.js';

// eslint-disable-next-line react/prop-types
const Message = React.forwardRef(({ style, ...rest }, ref) => {
  const [children, setChildren] = useState();

  const objStyle = {
    textAlign: 'center',
    ...style,
  };

  useImperativeHandle(ref, () => ({
    setChildren: (msg) => {
      setChildren(msg);
    },
  }));

  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Div {...rest} style={objStyle} ref={ref}>
      {children}
    </Div>
  );
});

export default Message;
