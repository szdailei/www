import React from 'react';
import PropTypes from 'prop-types';
import Controller from './Controller.jsx';

function Article({ data }) {
  return <Controller data={data} style={{ fontSize: '1.8em' }} />;
}

Article.propTypes = {
  data: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default Article;
