/* eslint-disable react/jsx-props-no-spreading */
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
const Select = React.forwardRef(({ options, ...rest }, ref) => {
  const Styled = styled.select(rest.style);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Styled {...rest} ref={ref}>
      {options}
    </Styled>
  );
});

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Select;
