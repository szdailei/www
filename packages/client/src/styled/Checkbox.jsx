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
  const labelStyle = {
    cursor: 'pointer',
    ...rest.style,
  };

  const checkboxSymbolstyle = {};
  checkboxSymbolstyle.fontSize = labelStyle.fontSize;

  const { onClick } = rest;
  const gridContainerStyle = {};

  if (right) {
    gridContainerStyle.gridTemplateColumns = labelStyle.gridTemplateColumns || 'auto max-content';
    return (
      <GridContainer onClick={onClick} style={gridContainerStyle}>
        <Label {...rest} style={labelStyle} ref={ref}>
          {label}
        </Label>
        <CheckboxSymbol checked={checked} style={checkboxSymbolstyle} />
      </GridContainer>
    );
  }

  gridContainerStyle.gridTemplateColumns = labelStyle.gridTemplateColumns || 'max-content auto';
  labelStyle.marginLeft = labelStyle.marginLeft || '0.3em';
  return (
    <GridContainer onClick={onClick} style={gridContainerStyle}>
      <CheckboxSymbol checked={checked} style={checkboxSymbolstyle} />
      <Label {...rest} style={labelStyle} ref={ref}>
        {label}
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
