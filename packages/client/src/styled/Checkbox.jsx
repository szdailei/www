/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import GridContainer from './GridContainer.jsx';
import CheckboxSymbol from './CheckboxSymbol.jsx';
import Label from './Label.jsx';

const Checkbox = React.forwardRef(({ label, checked, right, ...rest }, ref) => {
  const checkboxSymbolRef = useRef();
  useImperativeHandle(ref, () => ({
    isChecked: () => checkboxSymbolRef.current.isChecked(),
    setChecked: (newState) => {
      checkboxSymbolRef.current.setChecked(newState);
    },
  }));

  useEffect(() => {
    checkboxSymbolRef.current.setChecked(checked);
  }, [checked]);

  function onClick() {
    const isChecked = checkboxSymbolRef.current.isChecked();
    checkboxSymbolRef.current.setChecked(!isChecked);
  }

  const labelStyle = {
    cursor: 'pointer',
    ...rest.style,
  };

  const checkboxSymbolStyle = { fontSize: labelStyle.fontSize };

  const gridContainerStyle = {};

  if (right) {
    gridContainerStyle.gridTemplateColumns = labelStyle.gridTemplateColumns || 'auto max-content';
    return (
      <GridContainer onClick={onClick} style={gridContainerStyle} ref={ref}>
        <Label {...rest} style={labelStyle}>
          {label}
        </Label>
        <CheckboxSymbol checked={checked} style={checkboxSymbolStyle} ref={checkboxSymbolRef} />
      </GridContainer>
    );
  }

  gridContainerStyle.gridTemplateColumns = labelStyle.gridTemplateColumns || 'max-content auto';
  labelStyle.marginLeft = labelStyle.marginLeft || '0.3em';
  return (
    <GridContainer onClick={onClick} style={gridContainerStyle} ref={ref}>
      <CheckboxSymbol checked={checked} style={checkboxSymbolStyle} ref={checkboxSymbolRef} />
      <Label {...rest} style={labelStyle}>
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
