import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Heading({ depth, children, ...styles }) {
  let Styled;
  let objStyles;
  switch (depth) {
    case 1:
      objStyles = {
        fontSize: '1.4em',
        ...styles,
      };
      Styled = styled.h1(objStyles);
      break;
    case 2:
      objStyles = {
        fontSize: '1.3em',
        ...styles,
      };
      Styled = styled.h2(objStyles);
      break;
    case 3:
      Styled = styled.h3(styles);
      break;
    case 4:
      Styled = styled.h4(styles);
      break;
    case 5:
      Styled = styled.h5(styles);
      break;
    case 6:
      Styled = styled.h6(styles);
      break;
    default:
      Styled = styled.h3(styles);
  }
  return <Styled>{children}</Styled>;
}

Heading.propTypes = {
  depth: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default Heading;
