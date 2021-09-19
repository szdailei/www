import React from 'react';
import { useParams } from 'react-router-dom';
import { useRemoteData } from '../lib/cache.js';
import { Error } from '../components/index.js';
import createPages from './create-pages.jsx';
import Controller from './Controller.jsx';

function PresentationOfRemoteData() {
  const { course } = useParams();
  const query = `{getCourse(name:"${course}")}`;

  const { data, error } = useRemoteData(query);
  if (error) return <Error error={error} />;
  if (!data) return null;

  const markdown = data.getCourse;
  const pages = createPages(markdown);
  return <Controller pages={pages} />;
}

export default PresentationOfRemoteData;
