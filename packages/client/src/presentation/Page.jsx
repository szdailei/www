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
    <Footer key={makeid()} style={{ visibility, display: 'grid', gridTemplateColumns: '1fr auto' }}>
      <Div style={{ justifySelf: 'center' }}>{footerNote}</Div>
      <Div style={{ marginRight: '2em' }}>{pageNum}</Div>
    </Footer>
  );
  return footer;
}

function createMain(ctx) {
  const main = (
    <Main key={makeid()} style={{ margin: '16px 16px 0 24px' }}>
      {ctx.pageChildren}
    </Main>
  );
  return main;
}

function Page() {}

Page.createPage = (ctx) => {
  const main = createMain(ctx);
  const footer = createFooter(ctx);

  const { currentPageNum, totalPagesNum } = ctx;
  const breakAfter = currentPageNum === totalPagesNum ? 'avoid' : 'all';
  const gridTemplateAreas = `
      'main'
      'footer'
      `;
  return (
    <Section
      key={makeid()}
      style={{
        minHeight: '100vh',
        breakInside: 'avoid-page',
        breakAfter: { breakAfter },
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 0fr',
        gridTemplateAreas,
      }}
    >
      {main}
      {footer}
    </Section>
  );
};

export default Page;
