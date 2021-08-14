import React from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid.js';
import { Span } from '../styled/index.js';
import User from './User';
import { Article, Section, Header, Main } from '../sectioning/index.js';

function Home({ repo, locale, users }) {
  const children = [];
  users.forEach((user) => {
    children.push(<User key={makeid()} commits={user} repo={repo} locale={locale} />);
  });

  const gridTemplateAreas = `
  'header'
  'main'
  `;
  return (
    <Article style={{ fontSize: '1.7em' }}>
      <Section style={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto', gridTemplateAreas }}>
        <Header style={{ fontSize: '1.3em', display: 'grid', gridTemplateColumns: 'auto auto' }}>
          <Span>Repo path</Span>
          <Span>{repo}</Span>
        </Header>
        <Main marginTop="1em">{children}</Main>
      </Section>
    </Article>
  );
}

Home.propTypes = {
  repo: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  users: PropTypes.array.isRequired,
};

export default Home;
