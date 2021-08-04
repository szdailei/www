import React from 'react';
import styled from '@emotion/styled';

const Span = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.span(rest.style);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Span;
