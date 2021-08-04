/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { GridContainer } from '../styled/index.js';

const Split = React.forwardRef(({ children, right, ...rest }, ref) => {
  const [first, ...second] = React.Children.toArray(children);

  const objStyle = { ...rest.style };
  objStyle.gridTemplateColumns = objStyle.gridTemplateColumns || '1fr 1fr';
  objStyle.alignItems = objStyle.alignItems || 'end';

  if (right) {
    return (
      <GridContainer {...rest} style={objStyle} ref={ref}>
        {second}
        {first}
      </GridContainer>
    );
  }

  return (
    <GridContainer {...rest} style={objStyle} ref={ref}>
      {first}
      {second}
    </GridContainer>
  );
});

Split.propTypes = {
  children: PropTypes.node.isRequired,
  right: PropTypes.bool,
};

Split.defaultProps = {
  right: false,
};

export default Split;
