import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Div({ onClick, children, hover, ...styles }) {
  const HOVER_STYLE = {
    '&:hover': { ...hover },
  };

  const objStyles = { ...HOVER_STYLE, ...styles };
  const Styled = styled.div(objStyles);
  return <Styled onClick={onClick}>{children}</Styled>;
}

Div.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  hover: PropTypes.object,
};

Div.defaultProps = {
  onClick: null,
  hover: null,
};

export default Div;
