/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';

const TextArea = React.forwardRef(({ ...rest }, ref) => {
  useEffect(() => {
    ref.current.focus();
  });

  const minRows = 5;
  const onChange = useCallback((event) => {
    const currentRows = event.target.value.split('\n').length;
    if (currentRows > minRows) event.target.rows = currentRows + 1;
  }, []);

  const onblurStyle = {
    fontSize: '1em',
    transition: 'all 0.3s',
  };

  const onFocus = useCallback((event) => {
    event.target.style.outline = '1px solid blue';
    event.target.style.border = '1px double blue';
    event.target.style.boxShadow = '1px 1px 2px blue';
    event.target.style.borderRadius = '2px';
  }, []);

  const onBlur = useCallback((event) => {
    event.target.style.outline = '0px';
    event.target.style.border = '1px dashed';
    event.target.style.boxShadow = 'unset';
    event.target.style.borderRadius = 'unset';
  }, []);

  const Styled = styled.textarea(onblurStyle);
  return <Styled {...rest} onChange={onChange} onFocus={onFocus} onBlur={onBlur} rows={minRows} ref={ref} />;
});

export default TextArea;
