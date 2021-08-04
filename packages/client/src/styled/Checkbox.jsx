/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Div from './Div';
import GridContainer from './GridContainer';

function CheckboxSymbol({ checked }) {
  return <Div>{checked ? '☑' : '☐'}</Div>;
}

CheckboxSymbol.propTypes = {
  checked: PropTypes.bool.isRequired,
};

/**
@example
  const [stateOfChecked, setStateOfChecked] = useState(checked);
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      setStateOfChecked(!stateOfChecked);
    },
    [stateOfChecked]
  );
  return <Checkbox label={label} checked={stateOfChecked} onClick={onClick} {...rest} ref={ref} />;
*/
const Checkbox = React.forwardRef(({ label, checked, right, ...rest }, ref) => {
  const objStyle = {
    cursor: 'pointer',
    ...rest.style,
  };

  if (right) {
    return (
      <GridContainer {...rest} style={objStyle} ref={ref}>
        {label}
        <CheckboxSymbol checked={checked} />
      </GridContainer>
    );
  }
  return (
    <GridContainer {...rest} style={objStyle} ref={ref}>
      <CheckboxSymbol checked={checked} />
      {label}
    </GridContainer>
  );
});

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  right: PropTypes.bool,
};

Checkbox.defaultProps = {
  checked: false,
  right: false,
};

export default Checkbox;
