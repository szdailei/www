import React from 'react';
import styled from '@emotion/styled';

const Main = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    gridArea: 'main',
    ...rest.style,
  };
  const Styled = styled.main(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});


export default Main;
