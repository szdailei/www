import React from 'react';
import PresentationOfLocalData from './PresentationOfLocalData';
import PresentationOfRemoteData from './PresentationOfRemoteData';

function Presentation() {
  if (window.location.protocol === 'file:') return <PresentationOfLocalData />;

  return <PresentationOfRemoteData />;
}

export default Presentation;
