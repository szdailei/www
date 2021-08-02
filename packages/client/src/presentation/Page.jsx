import React from 'react';
import makeid from '../lib/makeid.js';
import { Div } from '../styled/index.js';
import { Section, Main, Footer } from '../sectioning/index.js';

function createFooter(ctx) {
  const footerNote = ctx.currentFooter || '';
  ctx.currentFooter = null;
  const pageNum = `page ${ctx.currentPageNum} / ${ctx.totalPagesNum}`;
  const visibility = ctx.hasTitleInCurrentPage ? 'hidden' : 'visible';

  const footer = (
    <Footer key={makeid()} visibility={visibility} display="grid" gridTemplateColumns="1fr auto">
      <Div justifySelf="center">{footerNote}</Div>
      <Div marginRight="2em">{pageNum}</Div>
    </Footer>
  );
  return footer;
}

function createMain(ctx) {
  const main = (
    <Main key={makeid()} margin="16px 16px 0 24px">
      {ctx.pageChildren}
    </Main>
  );
  return main;
}

function Page(ctx) {
  const main = createMain(ctx);
  const footer = createFooter(ctx);

  const pageBreakAfter = ctx.currentPageNum === ctx.totalPagesNum ? 'avoid' : 'always';
  const gridTemplateAreas = `
      'main'
      'footer'
      `;
  const page = (
    <Section
      key={makeid()}
      minHeight="100vh"
      pageBreakAfter={pageBreakAfter}
      gridTemplateColumns="1fr"
      gridTemplateRows="1fr auto"
      gridTemplateAreas={gridTemplateAreas}
    >
      {main}
      {footer}
    </Section>
  );
  return page;
}

export default Page;
