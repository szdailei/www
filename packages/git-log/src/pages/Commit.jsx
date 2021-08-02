import React from 'react';
import PropTypes from 'prop-types';
import { Span } from '../styled/index.js';
import { Section, Header, Main } from '../sectioning/index.js';
import Details from './Details';

function Commit({ commit, repo, locale }) {
  function Popup() {
    return <Details files={commit.files} status={commit.status} repo={repo} />;
  }

  const date = new Date(commit.committerDate);
  const localeDate = `${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale)}`;

  const gridTemplateAreas = `
  'header'
  'main'`;
  return (
    <>
      <hr />
      <Section gridTemplateColumns="1fr" gridTemplateRows="auto auto" gridTemplateAreas={gridTemplateAreas}>
        <Header
          width="70%"
          fontSize="1.1em"
          display="grid"
          gridTemplateColumns="1fr 1fr"
          color="blue"
          gridColumnGap="40px"
        >
          <Span>{localeDate}</Span>
          <Span>{commit.authorName}</Span>
        </Header>
        <Main display="grid" gridTemplateRows="auto auto auto">
          <Span fontSize="1.1em" fontWeight="500">
            {commit.subject}
          </Span>
          <Span>{commit.body}</Span>
          <Popup />
        </Main>
      </Section>
    </>
  );
}

Commit.propTypes = {
  repo: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  commit: PropTypes.object.isRequired,
};

export default Commit;
