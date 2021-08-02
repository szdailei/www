/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid';
import { Div, Span } from '../styled/index.js';

function Details({ files, status, repo }) {
  const children = [];
  for (let i = 0; i < files.length; i += 1) {
    const filePath = `${repo}/${files[i]}`;
    const child = (
      <Div key={makeid()}>
        <Span>{status[i]}</Span>
        <Span marginLeft="2em">
          <a href={filePath}>{files[i]}</a>
        </Span>
      </Div>
    );
    children.push(child);
  }

  return <Span>{children}</Span>;
}

Details.propTypes = {
  repo: PropTypes.string.isRequired,
  files: PropTypes.array.isRequired,
  status: PropTypes.array.isRequired,
};

export default Details;
