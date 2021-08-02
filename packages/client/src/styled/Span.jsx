import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Span({ children, hover, ...styles }) {
  const HOVER_STYLE = {
    '&:hover': { ...hover },
  };

  const objStyles = { ...HOVER_STYLE, ...styles };
  const Styled = styled.span(objStyles);
  return <Styled>{children}</Styled>;
}

Span.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  hover: PropTypes.object,
};

Span.defaultProps = {
  hover: null,
};

export default Span;
