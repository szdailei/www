import React, { useState } from 'react';
import { Div, Input } from '../styled/index.js';
import parseMarkdown from './parse-markdown.js';
import Controller from './Controller.jsx';

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
        <Div marginBottom="2em" fontSize="1.5em" fontWeight="600">
          Please copy images files to courses/images directory under local-presentation.html
        </Div>
        <Div fontSize="1.5em" fontWeight="600">
          And then select a .mdx or .md file for presentation
        </Div>
        <Input fontSize="1.5em" type="file" accept=".txt,.md,.mdx" onChange={οnChangeOfInputFile} />
      </div>
    );
  }

  const parsedResult = parseMarkdown(data);
  return <Controller data={parsedResult} />;
}

export default PresentationOfLocalData;
