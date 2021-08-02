import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function Option({ value, label, ...styles }) {
  const objStyles = {
    ...styles,
  };
  const Styled = styled.option(objStyles);
  return <Styled value={value}>{label}</Styled>;
}

Option.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Option;
