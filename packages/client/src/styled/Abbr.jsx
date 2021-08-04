import React from 'react';
import styled from '@emotion/styled';

const Abbr = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    textDecoration: 'none',
    ...rest.style,
  };

  const Styled = styled.abbr(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Abbr;
