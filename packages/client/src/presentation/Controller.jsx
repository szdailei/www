import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Article } from '../sectioning/index.js';

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function Controller({ data }) {
  const [currentPageCount, setCurrentPageCount] = useState(0);
  const [isAllPages, setIsAllPages] = useState(false);

  const onKeyUp = useCallback(
    (event) => {
      if (isAllPages) {
        switch (event.code) {
          case 'KeyA':
            event.preventDefault();
            setIsAllPages(!isAllPages);
            break;
          default:
            break;
        }
        return;
      }

      switch (event.code) {
        case 'KeyA':
          event.preventDefault();
          setIsAllPages(!isAllPages);
          break;
        case 'KeyF':
          event.preventDefault();
          if (document.fullscreenEnabled) toggleFullScreen();
          break;
        case 'PageUp':
        case 'Numpad9':
          event.preventDefault();
          if (currentPageCount > 0) {
            setCurrentPageCount(currentPageCount - 1);
          }
          break;
        case 'Space':
        case 'PageDown':
        case 'Numpad3':
          event.preventDefault();
          if (currentPageCount < data.length - 1) {
            setCurrentPageCount(currentPageCount + 1);
          }
          break;
        case 'Home':
        case 'Numpad7':
          event.preventDefault();
          setCurrentPageCount(0);
          break;
        case 'End':
        case 'Numpad1':
          event.preventDefault();
          setCurrentPageCount(data.length - 1);
          break;
        default:
          break;
      }
    },
    [data, currentPageCount, isAllPages]
  );

  const onMouseUp = useCallback(
    (event) => {
      if (isAllPages) {
        return;
      }

      // The MouseEvent.button read-only property indicates which button was pressed on the mouse to trigger the event.
      // 0: Main button pressed, usually the left button or the un-initialized state
      // 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
      // 2: Secondary button pressed, usually the right button
      // 3: Fourth button, typically the Browser Back button
      // 4: Fifth button, typically the Browser Forward button
      switch (event.button) {
        case 3:
          event.preventDefault();
          if (currentPageCount > 0) {
            setCurrentPageCount(currentPageCount - 1);
          }
          break;
        case 4:
          event.preventDefault();
          if (currentPageCount < data.length - 1) {
            setCurrentPageCount(currentPageCount + 1);
          }
          break;
        default:
          break;
      }
    },
    [data, currentPageCount, isAllPages]
  );

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onKeyUp, onMouseUp]);

  const showData = isAllPages ? data : data[currentPageCount];
  return <Article fontSize="1.8em">{showData}</Article>;
}

Controller.propTypes = {
  data: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default Controller;
