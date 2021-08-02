import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

/**
@example
const options = [<Option key={roles.length+1} value="Select..." label="Select..." />];
roles.forEach((role, key) => {
  // eslint-disable-next-line react/no-array-index-key
  const option = <Option key={key} value={role.name} label={role.name} />;
  options.push(option);
});
<Select onChange={selectRole} options={options} />
*/
function Select({ onChange, options, ...styles }) {
  const objStyles = {
    ...styles,
  };
  const Styled = styled.select(objStyles);
  return <Styled onChange={onChange}>{options}</Styled>;
}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Select;
