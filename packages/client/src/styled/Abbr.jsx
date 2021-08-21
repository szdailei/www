import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const Abbr = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    textDecoration: 'none',
    ...style,
  };

  const Styled = styled.abbr(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Abbr;
