/* eslint-disable react/forbid-prop-types */
import React, { useState, useCallback, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Div, GridContainer, TextArea } from '../styled/index.js';
import makeid from '../lib/makeid.js';

const Example = React.forwardRef((props, ref) => {
  const [children, setChildren] = useState();

  useImperativeHandle(ref, () => ({
    setChildren: (firstPageMain) => {
      setChildren(firstPageMain);
    },
  }));

  return <Div ref={ref}>{children}</Div>;
});

const SubmitButton = React.forwardRef(({ createPages, textAreaRef, exampleRef }, ref) => {
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      // eslint-disable-next-line no-use-before-define
      const pages = createPages(textAreaRef.current.value);
      const firstPageMain = pages[0].props.children[0];
      exampleRef.current.setChildren(firstPageMain);
    },
    [createPages, textAreaRef, exampleRef]
  );

  return (
    <Button onClick={onClick} ref={ref}>
      演示
    </Button>
  );
});

SubmitButton.propTypes = {
  createPages: PropTypes.func.isRequired,
  textAreaRef: PropTypes.object.isRequired,
  exampleRef: PropTypes.object.isRequired,
};

function ExampleContainer({ createPages }) {
  const textAreaRef = useRef();
  const exampleRef = useRef();

  const gridContainerStyle = {
    gridTemplateColumns: 'auto min-content',
  };

  return (
    <>
      <GridContainer style={gridContainerStyle}>
        <TextArea ref={textAreaRef} />
        <SubmitButton createPages={createPages} textAreaRef={textAreaRef} exampleRef={exampleRef} />
      </GridContainer>
      <Example ref={exampleRef} />
    </>
  );
}

ExampleContainer.propTypes = {
  createPages: PropTypes.func.isRequired,
};

ExampleContainer.createComponent = (createPages) => <ExampleContainer key={makeid()} createPages={createPages} />;

function isRequiredParseOnTop(tag) {
  const ExampleContainerTag = '<Demo>';
  if (tag === ExampleContainerTag) return true;
  return false;
}

export { Example, SubmitButton, ExampleContainer, isRequiredParseOnTop };
