/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Article as RealArticle } from '../sectioning/index.js';

function Article({ children, ...rest }) {
  return (
    <RealArticle style={{ fontSize: '1.8em' }} {...rest}>
      {children}
    </RealArticle>
  );
}

Article.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Article;
