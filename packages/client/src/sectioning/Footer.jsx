import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Footer({ children, ...styles }) {
  const objStyles = {
    gridArea: 'footer',
    marginTop: '0.3em',
    marginBottom: '0.3em',
    fontSize: '0.7em',
    ...styles,
  };
  const StyledFooter = styled.footer(objStyles);
  return <StyledFooter>{children}</StyledFooter>;
}

Footer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Footer;
