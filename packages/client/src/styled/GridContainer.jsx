import React from 'react';
import styled from '@emotion/styled';

const GridContainer = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    display: 'grid',
    alignItems: 'center',
    ...rest.style,
  };
  const Styled = styled.div(objStyle);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default GridContainer;
