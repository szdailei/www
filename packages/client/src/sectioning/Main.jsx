import React from 'react';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const Main = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    gridArea: 'main',
    ...style,
  };
  const Styled = styled.main(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Main;
