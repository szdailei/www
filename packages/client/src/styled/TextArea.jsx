import React from 'react';
import styled from '@emotion/styled';

const TextArea = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.textarea(rest.style);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default TextArea;
