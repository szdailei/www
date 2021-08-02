import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function TH({ children, ...styles }) {
  const Styled = styled.th(styles);
  return <Styled>{children}</Styled>;
}

TH.propTypes = {
  children: PropTypes.node.isRequired,
};

function TD({ children, ...styles }) {
  const Styled = styled.td(styles);
  return <Styled>{children}</Styled>;
}

TD.propTypes = {
  children: PropTypes.node.isRequired,
};

function TR({ children, ...styles }) {
  const objStyles = {
    borderBottom: '1px solid',
    ...styles,
  };

  const Styled = styled.tr(objStyles);
  return <Styled>{children}</Styled>;
}

TR.propTypes = {
  children: PropTypes.node.isRequired,
};

function THead({ children, ...styles }) {
  const Styled = styled.thead(styles);
  return <Styled>{children}</Styled>;
}

THead.propTypes = {
  children: PropTypes.node.isRequired,
};

function TBody({ children, ...styles }) {
  const Styled = styled.tbody(styles);
  return <Styled>{children}</Styled>;
}

TBody.propTypes = {
  children: PropTypes.node.isRequired,
};

function Table({ children, ...styles }) {
  const objStyles = {
    borderCollapse: 'collapse',
    ...styles,
  };

  const Styled = styled.table(objStyles);
  return <Styled>{children}</Styled>;
}

Table.propTypes = {
  children: PropTypes.node.isRequired,
};

export { TH, TD, TR, THead, TBody, Table };
