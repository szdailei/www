import React from 'react';
import styled from '@emotion/styled';

const Header = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    gridArea: 'header',
    marginBottom: '0.4em',
    fontSize: '1.4em',
    fontWeight: '700',
    ...rest.style,
  };
  const Styled = styled.header(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Header;
