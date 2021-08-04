import React from 'react';
import styled from '@emotion/styled';

/**
@examples
const gridTemplateAreas = `
'header'
'main'
'footer'
`;
<Section style={{gridTemplateColumns:"1fr", gridTemplateRows:"auto 1fr auto", gridTemplateAreas:{gridTemplateAreas}}}>
    <Header>{headerData}</Header>
    <Main>{mainData}</Main>
    <Footer>{footerData}</Footer>
</Section>
*/
const Section = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    display: 'grid',
    ...rest.style,
  };
  const Styled = styled.section(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Section;
