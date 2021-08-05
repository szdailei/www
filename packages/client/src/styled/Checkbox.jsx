/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import GridContainer from './GridContainer.jsx';
import CheckboxSymbol from './CheckboxSymbol.jsx';
import Label from './Label.jsx';

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
        <Label>
          {label} <CheckboxSymbol checked={checked} />
        </Label>
      </GridContainer>
    );
  }
  return (
    <GridContainer {...rest} style={objStyle} ref={ref}>
      <Label>
        <CheckboxSymbol checked={checked} /> {label}
      </Label>
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
