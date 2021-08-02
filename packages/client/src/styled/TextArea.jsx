import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function TextArea({ defaultValue, ...styles }) {
  const Styled = styled.textarea(styles);
  return <Styled defaultValue={defaultValue} />;
}

TextArea.propTypes = {
  defaultValue: PropTypes.string.isRequired,
};

export default TextArea;
