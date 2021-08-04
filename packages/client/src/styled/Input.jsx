import React from 'react';
import styled from '@emotion/styled';

const Input = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    cursor: 'text',
    outline: 0,
    borderStyle: 'none none solid none',
    ...rest.style,
  };
  const Styled = styled.input(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Input;
