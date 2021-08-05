import React from 'react';
import styled from '@emotion/styled';

const Label = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.label();
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Label;
