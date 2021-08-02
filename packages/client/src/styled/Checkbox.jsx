import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Div from './Div';
import FlexContainer from './FlexContainer';
import GridContainer from './GridContainer';

function CheckboxWithoutLabel({ checked, scale }) {
  const objStyles = {
    cursor: 'pointer',
    transform: `scale(${scale})`,
  };
  const Styled = styled.div(objStyles);
  return <Styled>{checked ? '☑' : '☐'}</Styled>;
}

CheckboxWithoutLabel.propTypes = {
  checked: PropTypes.bool.isRequired,
  scale: PropTypes.string.isRequired,
};

/**
@example
function CheckboxWithState({ checked, ...styles }) {
  const [state, setState] = useState(checked);
  function clickCheckbox() {
    setState(!state);
  }
  return <Checkbox checked={state} onClick={clickCheckbox} {...styles} />;
}
*/
function Checkbox({ checked, gridTemplateColumns, scale, label, onClick, right, ...styles }) {
  const objStyles = {
    ...styles,
  };
  const StyledDiv = styled.div(objStyles);

  if (right) {
    return (
      <Div onClick={onClick} cursor="pointer">
        <FlexContainer>
          <GridContainer gridTemplateColumns={gridTemplateColumns}>
            <StyledDiv>{label}</StyledDiv>
            <CheckboxWithoutLabel checked={checked} scale={scale} />
          </GridContainer>
        </FlexContainer>
      </Div>
    );
  }
  return (
    <Div onClick={onClick} cursor="pointer">
      <FlexContainer>
        <GridContainer gridTemplateColumns={gridTemplateColumns}>
          <CheckboxWithoutLabel checked={checked} scale={scale} />
          <StyledDiv>{label}</StyledDiv>
        </GridContainer>
      </FlexContainer>
    </Div>
  );
}

Checkbox.propTypes = {
  gridTemplateColumns: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  right: PropTypes.bool,
  scale: PropTypes.string,
};

Checkbox.defaultProps = {
  checked: false,
  right: false,
  scale: '1',
};

export default Checkbox;
