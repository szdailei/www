import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// eslint-disable-next-line react/prop-types
const StyledContainer = React.forwardRef(({ disabled, style, ...rest }, ref) => {
  let objStyle;
  if (disabled) {
    objStyle = {
      ...style,

      cursor: 'not-allowed',
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
      color: 'rgba(0, 0, 0, 0.36)',
      opacity: '0.5',
    };
  } else {
    objStyle = { ...style };
  }
  const Styled = styled.div(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

StyledContainer.propTypes = {
  disabled: PropTypes.bool,
};

StyledContainer.defaultProps = {
  disabled: false,
};

export default StyledContainer;
