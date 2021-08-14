/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { GridContainer } from '../styled/index.js';

const Split = React.forwardRef(({ children, ...rest }, ref) => {
  const objStyle = { ...rest.style };
  objStyle.gridTemplateRows = objStyle.gridTemplateRows || '1fr';
  objStyle.gridTemplateColumns = objStyle.gridTemplateColumns || `repeat(${children.length}, 1fr)`;
  objStyle.alignItems = objStyle.alignItems || 'end';

  return (
    <GridContainer {...rest} style={objStyle} ref={ref}>
      {children}
    </GridContainer>
  );
});

Split.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Split;
