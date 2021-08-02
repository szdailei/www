import React from 'react';
import { useParams } from 'react-router-dom';
import { useRemoteData } from '../lib/network.js';
import parseMarkdown from './parse-markdown.js';
import Controller from './Controller.jsx';

function PresentationOfRemoteData() {
  const { course } = useParams();
  const query = `{getCourse(name:"${course}")}`;

  const { data } = useRemoteData(query);
  if (!data) return null;

  const parsedResult = parseMarkdown(data.getCourse);
  return <Controller data={parsedResult} />;
}

export default PresentationOfRemoteData;
