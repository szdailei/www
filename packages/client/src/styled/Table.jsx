/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from '@emotion/styled';

const TH = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.th(rest.style);
  return <Styled {...rest} ref={ref} />;
});

const TD = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.td(rest.style);
  return <Styled {...rest} ref={ref} />;
});

const TR = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    borderBottom: '1px solid',
    ...rest.style,
  };

  const Styled = styled.tr(objStyle);
  return <Styled {...rest} ref={ref} />;
});

const THead = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.thead(rest.style);
  return <Styled {...rest} ref={ref} />;
});

const TBody = React.forwardRef(({ ...rest }, ref) => {
  const Styled = styled.tbody(rest.style);
  return <Styled {...rest} ref={ref} />;
});

const Table = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    borderCollapse: 'collapse',
    ...rest.style,
  };

  const Styled = styled.table(objStyle);
  return <Styled {...rest} ref={ref} />;
});

export { TH, TD, TR, THead, TBody, Table };
