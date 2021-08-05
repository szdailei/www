/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Article from './Article.jsx';

function Controller({ pages }) {
  const [currentPageCount, setCurrentPageCount] = useState(0);

  const onKeyUp = useCallback(
    (event) => {
      switch (event.code) {
        case 'PageUp':
          event.preventDefault();
          if (currentPageCount > 0) {
            setCurrentPageCount(currentPageCount - 1);
          }
          break;
        case 'PageDown':
          event.preventDefault();
          if (currentPageCount < pages.length - 1) {
            setCurrentPageCount(currentPageCount + 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          setCurrentPageCount(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentPageCount(pages.length - 1);
          break;
        default:
          break;
      }
    },
    [pages, currentPageCount]
  );

  // The MouseEvent.button read-only property indicates which button was pressed on the mouse to trigger the event.
  // 0: Main button pressed, usually the left button or the un-initialized state
  // 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
  // 2: Secondary button pressed, usually the right button
  // 3: Fourth button, typically the Browser Back button
  // 4: Fifth button, typically the Browser Forward button
  const onMouseUp = useCallback(
    (event) => {
      switch (event.button) {
        case 3:
          event.preventDefault();
          if (currentPageCount > 0) {
            setCurrentPageCount(currentPageCount - 1);
          }
          break;
        case 4:
          event.preventDefault();
          if (currentPageCount < pages.length - 1) {
            setCurrentPageCount(currentPageCount + 1);
          }
          break;
        default:
          break;
      }
    },
    [pages, currentPageCount]
  );

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onKeyUp, onMouseUp]);

  const showData = pages[currentPageCount];
  return <Article>{showData}</Article>;
}

Controller.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default Controller;
