import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function P({ children, hover, ...styles }) {
  const HOVER_STYLE = {
    '&:hover': { ...hover },
  };

  const objStyles = { ...HOVER_STYLE, ...styles };
  const Styled = styled.p(objStyles);
  return <Styled>{children}</Styled>;
}

P.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  hover: PropTypes.object,
};

P.defaultProps = {
  hover: null,
};

export default P;
