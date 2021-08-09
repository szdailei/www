/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Div } from '../styled/index.js';

const Appear = React.forwardRef(({ children, hover, wrap, ...rest }, ref) => {
  const objStyle = rest.style;
  const [stateOfShown, setStateOfShown] = useState(false);

  const onMouseEnter = useCallback((event) => {
    event.preventDefault();
    setStateOfShown(true);
  }, []);
  const onMouseLeave = useCallback((event) => {
    event.preventDefault();
    setStateOfShown(false);
  }, []);
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      setStateOfShown(!stateOfShown);
    },
    [stateOfShown]
  );

  let eventHandles;
  if (hover) {
    eventHandles = {
      onMouseEnter,
      onMouseLeave,
    };
  } else {
    eventHandles = { onClick };
  }

  const containerDivStyle = { ...objStyle };
  containerDivStyle.width = containerDivStyle.width || 'fit-content';

  const firstChildContainerStyle = { ...children[0].props.style };
  firstChildContainerStyle.width = firstChildContainerStyle.width || 'fit-content';

  const secondChildContainerStyle = { ...children[1].props.style };
  secondChildContainerStyle.width = secondChildContainerStyle.width || 'fit-content';
  const secondChildContainer = stateOfShown ? <Div style={secondChildContainerStyle}>{children[1]}</Div> : null;

  let firstChildContainer;
  if (wrap) {
    firstChildContainer = <Div style={firstChildContainerStyle}> {children[0]}</Div>;
    return (
      <Div {...rest} style={containerDivStyle} {...eventHandles} ref={ref}>
        {firstChildContainer}
        {secondChildContainer}
      </Div>
    );
  }

  firstChildContainer = (
    <Div {...eventHandles} style={firstChildContainerStyle}>
      {children[0]}
    </Div>
  );
  return (
    <Div {...rest} style={containerDivStyle} ref={ref}>
      {firstChildContainer}
      {secondChildContainer}
    </Div>
  );
});

Appear.propTypes = {
  children: PropTypes.node.isRequired,
  hover: PropTypes.bool,
  wrap: PropTypes.bool,
};

Appear.defaultProps = {
  hover: false,
  wrap: false,
};

export default Appear;
