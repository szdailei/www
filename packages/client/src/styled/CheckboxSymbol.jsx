/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Span from './Span.jsx';

/**
@example
  const checkboxSymbolRef = useRef();
  useImperativeHandle(ref, () => ({
    getStateOfChecked: () => checkboxSymbolRef.current.getStateOfChecked(),
    setStateOfChecked: (newState) => {
      checkboxSymbolRef.current.setStateOfChecked(newState);
    },
  }));

  useEffect(() => {
    checkboxSymbolRef.current.setStateOfChecked(checked);
  }, [checked]);

  function onClick() {
    const currentState = checkboxSymbolRef.current.getStateOfChecked();
    checkboxSymbolRef.current.setStateOfChecked(!currentState);
  }

  return (
    <GridContainer onClick={onClick} style={gridContainerStyle} ref={ref}>
      <CheckboxSymbol style={checkboxSymbolStyle} ref={checkboxSymbolRef} />
      <Label {...rest} style={labelStyle}>
        {label}
      </Label>
    </GridContainer>
  );
*/
const CheckboxSymbol = React.forwardRef(({ checked, ...rest }, ref) => {
  const [stateOfChecked, setStateOfChecked] = useState(checked);

  useImperativeHandle(ref, () => ({
    getStateOfChecked: () => stateOfChecked,
    setStateOfChecked: (newState) => {
      setStateOfChecked(newState);
    },
  }));

  const objStyle = { cursor: 'pointer', ...rest.style };
  return (
    <Span {...rest} style={objStyle} ref={ref}>
      {stateOfChecked ? '☑' : '☐'}{' '}
    </Span>
  );
});

CheckboxSymbol.propTypes = {
  checked: PropTypes.bool,
};

CheckboxSymbol.defaultProps = {
  checked: false,
};

export default CheckboxSymbol;
