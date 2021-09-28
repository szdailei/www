import React from 'react';
import SlideOfLocalData from './SlideOfLocalData';
import SlideOfRemoteData from './SlideOfRemoteData';

function Slide() {
  if (window.location.protocol === 'file:') return <SlideOfLocalData />;

  return <SlideOfRemoteData />;
}

export default Slide;
