import React from 'react';
import styled from '@emotion/styled';

const Footer = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    gridArea: 'footer',
    fontSize: '0.7em',
    ...rest.style,
  };
  const Styled = styled.footer(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Footer;
