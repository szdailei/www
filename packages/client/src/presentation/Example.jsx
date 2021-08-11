/* eslint-disable react/forbid-prop-types */
import React, { useState, useCallback, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Div, GridContainer, TextArea } from '../styled/index.js';
import makeid from '../lib/makeid.js';

const Example = React.forwardRef((_, ref) => {
  const [children, setChildren] = useState();

  useImperativeHandle(ref, () => ({
    setChildren: (firstPageMain) => {
      setChildren(firstPageMain);
    },
  }));

  return <Div ref={ref}>{children}</Div>;
});

const ParseMessage = React.forwardRef((_, ref) => {
  const [children, setChildren] = useState();

  useImperativeHandle(ref, () => ({
    setChildren: (parseMessage) => {
      setChildren(parseMessage);
    },
  }));

  return <Div ref={ref}>{children}</Div>;
});

const ParseButton = React.forwardRef(({ createPages, textAreaRef, exampleRef, parseMessageRef }, ref) => {
  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      let firstPageMain;
      let elementCount;

      try {
        const pages = createPages(textAreaRef.current.value);
        const [firstPage] = pages;
        firstPageMain = { ...firstPage.props.main };
        elementCount = firstPageMain.props.children.length;
      } catch (error) {
        firstPageMain = error.toString();
        elementCount = 0;
      }

      const parseMessage = <Div style={{ color: 'red', fontSize: '0.8em' }}>解析出{elementCount}个元素</Div>;

      parseMessageRef.current.setChildren(parseMessage);
      exampleRef.current.setChildren(firstPageMain);
    },
    [createPages, textAreaRef, exampleRef, parseMessageRef]
  );

  return (
    <Button onClick={onClick} style={{ marginLeft: '0.5em', marginRight: '0.5em' }} ref={ref}>
      解析
    </Button>
  );
});

ParseButton.propTypes = {
  createPages: PropTypes.func.isRequired,
  textAreaRef: PropTypes.object.isRequired,
  exampleRef: PropTypes.object.isRequired,
  parseMessageRef: PropTypes.object.isRequired,
};

function ExampleContainer({ createPages }) {
  const textAreaRef = useRef();
  const exampleRef = useRef();
  const parseMessageRef = useRef();

  const onKeyUp = useCallback((event) => {
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  const gridContainerStyle = {
    gridTemplateColumns: 'auto min-content max-content',
  };

  const textAreaStyle = {
    caretColor: 'red',
  };

  return (
    <>
      <GridContainer style={gridContainerStyle}>
        <TextArea onKeyUp={onKeyUp} style={textAreaStyle} ref={textAreaRef} />
        <ParseButton
          createPages={createPages}
          textAreaRef={textAreaRef}
          exampleRef={exampleRef}
          parseMessageRef={parseMessageRef}
        />
        <ParseMessage ref={parseMessageRef} />
      </GridContainer>
      <Example ref={exampleRef} />
    </>
  );
}

ExampleContainer.propTypes = {
  createPages: PropTypes.func.isRequired,
};

ExampleContainer.createComponent = (createPages) => <ExampleContainer key={makeid()} createPages={createPages} />;

function isExampleTag(tagName) {
  return tagName === 'Example';
}

export { ExampleContainer, isExampleTag };
