import React from 'react';
import styled from '@emotion/styled';

const Button = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    cursor: 'pointer',
    width: 'fit-content',
    margin: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#f86e67',
    ...rest.style,
  };

  const Styled = styled.div(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Button;
