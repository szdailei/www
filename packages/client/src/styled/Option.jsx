import React from 'react';
import styled from '@emotion/styled';

const Option = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.option(rest.style);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Option;
