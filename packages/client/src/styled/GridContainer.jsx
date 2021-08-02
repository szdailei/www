import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function GridContainer({ gridTemplateColumns, children, ...styles }) {
  const objStyles = {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns,
    ...styles,
  };
  const Styled = styled.div(objStyles);
  return <Styled>{children}</Styled>;
}

GridContainer.propTypes = {
  gridTemplateColumns: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default GridContainer;
