import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

/**
@examples
const gridTemplateAreas = `
'header'
'main'
'footer'
`;
<Section gridTemplateColumns="1fr" gridTemplateRows="auto 1fr auto" gridTemplateAreas={gridTemplateAreas}>
    <Header>{headerData}</Header>
    <Main>{mainData}</Main>
    <Footer>{footerData}</Footer>
</Section>
*/
function Section({ children, ...styles }) {
  const objStyles = {
    display: 'grid',
    ...styles,
  };
  const StyledSection = styled.section(objStyles);
  return <StyledSection>{children}</StyledSection>;
}

Section.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Section;
