/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Heading = React.forwardRef(({ depth, ...rest }, ref) => {
  let Styled;
  let objStyle = { ...rest.style };
  switch (depth) {
    case 1:
      objStyle = {
        fontSize: '1.4em',
        ...rest.style,
      };
      Styled = styled.h1(objStyle);
      break;
    case 2:
      objStyle = {
        fontSize: '1.3em',
        ...rest.style,
      };
      Styled = styled.h2(objStyle);
      break;
    case 3:
      Styled = styled.h3(objStyle);
      break;
    case 4:
      Styled = styled.h4(objStyle);
      break;
    case 5:
      Styled = styled.h5(objStyle);
      break;
    case 6:
      Styled = styled.h6(objStyle);
      break;
    default:
      Styled = styled.h3(objStyle);
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

Heading.propTypes = {
  depth: PropTypes.number.isRequired,
};

export default Heading;
