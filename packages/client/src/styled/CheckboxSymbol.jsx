/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Span from './Span.jsx';

/**
@example
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

  return (
    <GridContainer onClick={onClick} style={gridContainerStyle} ref={ref}>
      <CheckboxSymbol checked={checked} style={checkboxSymbolStyle} ref={checkboxSymbolRef} />
      <Label {...rest} style={labelStyle}>
        {label}
      </Label>
    </GridContainer>
  );
*/
const CheckboxSymbol = React.forwardRef(({ checked, ...rest }, ref) => {
  const [stateOfChecked, setStateOfChecked] = useState(checked);

  useImperativeHandle(ref, () => ({
    isChecked: () => stateOfChecked,
    setChecked: (newState) => {
      setStateOfChecked(newState);
    },
  }));

  const objStyle = { cursor: 'pointer', ...rest.style };
  return (
    <Span {...rest} style={objStyle} ref={ref}>
      {stateOfChecked ? '☑' : '☐'}
    </Span>
  );
});

CheckboxSymbol.propTypes = {
  checked: PropTypes.bool.isRequired,
};

export default CheckboxSymbol;
