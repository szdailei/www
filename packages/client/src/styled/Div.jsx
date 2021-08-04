import React from 'react';
import styled from '@emotion/styled';

const Div = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.div(rest.style);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Div;
