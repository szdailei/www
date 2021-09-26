import React, { useState, useCallback } from 'react';
import { Div, Input } from '../styled';
import createPages from './create-pages';
import Controller from './Controller';

const reader = new FileReader();

function PresentationOfLocalData() {
  const [markdown, setMarkdown] = useState();

  const onLoadEndOfReadFile = useCallback((event) => {
    event.preventDefault();
    reader.removeEventListener('load', onLoadEndOfReadFile);
    setMarkdown(event.target.result);
  }, []);

  const οnChangeOfInputFile = useCallback(
    (event) => {
      event.preventDefault();
      reader.addEventListener('loadend', onLoadEndOfReadFile);
      reader.readAsText(event.target.files[0]);
    },
    [onLoadEndOfReadFile]
  );

  if (!markdown) {
    return (
      <div>
        <Div style={{ marginBottom: '2em', fontSize: '1.5em', fontWeight: '600' }}>
          Please copy images files to courses/images directory under local-presentation.html
        </Div>
        <Div style={{ fontSize: '1.5em', fontWeight: '600' }}>And then select a .mdx or .md file for presentation</Div>
        <Input style={{ fontSize: '1.5em' }} type="file" accept=".txt,.md,.mdx" onChange={οnChangeOfInputFile} />
      </div>
    );
  }

  const pages = createPages(markdown);
  return <Controller pages={pages} />;
}

export default PresentationOfLocalData;
