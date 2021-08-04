import React from 'react';
import { useParams } from 'react-router-dom';
import { useRemoteData } from '../lib/network.js';
import parseMarkdown from './parse-markdown.js';
import Article from './Article.jsx';

function PresentationOfRemoteData() {
  const { course } = useParams();
  const query = `{getCourse(name:"${course}")}`;

  const { data } = useRemoteData(query);
  if (!data) return null;

  const parsedResult = parseMarkdown(data.getCourse);
  return <Article data={parsedResult} />;
}

export default PresentationOfRemoteData;
