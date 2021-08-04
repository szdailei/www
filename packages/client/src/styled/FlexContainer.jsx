import React from 'react';
import styled from '@emotion/styled';

const FlexContainer = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexFlow: 'column wrap',
    ...rest.style,
  };
  const Styled = styled.div(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default FlexContainer;
