import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Abbr({ onClick, title, children, ...styles }) {
  const objStyles = {
    textDecoration: 'none',
    ...styles,
  };
  const Styled = styled.abbr(objStyles);
  return (
    <Styled title={title} onClick={onClick}>
      {children}
    </Styled>
  );
}

Abbr.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
};

Abbr.defaultProps = {
  onClick: null,
  title: '',
  children: '',
};

export default Abbr;
