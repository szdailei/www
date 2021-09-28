import React, { useState, useCallback } from 'react';
import { Div, Input } from '../styled';
import createPages from './create-pages';
import Controller from './Controller';

const reader = new FileReader();

function SlideOfLocalData() {
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
          This local html MUST be in parent folder of courses.
        </Div>
        <Div style={{ fontSize: '1.5em', fontWeight: '600' }}>Select a .mdx or .md file in courses folder</Div>
        <Input style={{ fontSize: '1.5em' }} type="file" accept=".txt,.md,.mdx" onChange={οnChangeOfInputFile} />
      </div>
    );
  }

  const pages = createPages(markdown);
  return <Controller pages={pages} />;
}

export default SlideOfLocalData;
