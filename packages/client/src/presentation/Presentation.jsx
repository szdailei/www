import React from 'react';
import PresentationOfLocalData from './PresentationOfLocalData.jsx';
import PresentationOfRemoteData from './PresentationOfRemoteData.jsx';

function Presentation() {
  if (window.location.protocol === 'file:') return <PresentationOfLocalData />;

  return <PresentationOfRemoteData />;
}

export default Presentation;
