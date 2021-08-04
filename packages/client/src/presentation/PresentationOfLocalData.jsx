import React, { useState } from 'react';
import { Div, Input } from '../styled/index.js';
import parseMarkdown from './parse-markdown.js';
import Article from './Article.jsx';

const reader = new FileReader();

function PresentationOfLocalData() {
  const [data, setData] = useState();

  function onLoadEndOfReadFile(event) {
    event.preventDefault();
    reader.removeEventListener('load', onLoadEndOfReadFile);
    setData(event.target.result);
  }

  function οnChangeOfInputFile(event) {
    event.preventDefault();
    reader.addEventListener('loadend', onLoadEndOfReadFile);
    reader.readAsText(event.target.files[0]);
  }

  if (!data) {
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

  const parsedResult = parseMarkdown(data);
  return <Article data={parsedResult} />;
}

export default PresentationOfLocalData;
