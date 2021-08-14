import React from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid.js';
import { Span } from '../styled/index.js';
import { Section, Header, Main } from '../sectioning/index.js';
import Commit from './Commit.jsx';

function User({ commits, repo, locale }) {
  const name = commits[0].committerName;
  const email = commits[0].committerEmail;

  const children = [];
  commits.forEach((commit) => {
    children.push(<Commit key={makeid()} commit={commit} repo={repo} locale={locale} />);
  });

  const gridTemplateAreas = `
  'header'
  'main'`;
  return (
    <>
      <hr />
      <Section
        style={{
          marginTop: '24px',
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'auto auto',
          gridTemplateAreas,
        }}
      >
        <Header style={{ fontSize: '1.2em', display: 'grid', gridTemplateColumns: '1fr 1fr 4fr' }}>
          <Span>Committer</Span>
          <Span style={{ color: 'red' }}>{name}</Span>
          <Span style={{ color: 'red' }}>{email}</Span>
        </Header>
        <Main style={{ marginLeft: '1em', display: 'grid', gridTemplateRows: 'auto auto' }}>
          <Span style={{ width: '70%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '40px' }}>
            <Span>Commit Date</Span>
            <Span>Author</Span>
          </Span>
          <Span>{children}</Span>
        </Main>
      </Section>
    </>
  );
}

User.propTypes = {
  repo: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  commits: PropTypes.array.isRequired,
};

export default User;
