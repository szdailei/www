import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import './prism.css';
import './prism-line-highlight.css';

function PrismCode({ code, language }) {
  let origLang = language;
  if (!language || language === '') {
    origLang = 'jsx';
  }

  const indexOfLeftBracket = origLang.indexOf('{');
  let lang;
  let dataLine;
  if (indexOfLeftBracket === -1) {
    lang = origLang.trim();
    dataLine = null;
  } else {
    lang = origLang.slice(0, indexOfLeftBracket).trim();
    const indexOfRightBracket = origLang.indexOf('}');
    dataLine = origLang.slice(indexOfLeftBracket + 1, indexOfRightBracket).trim();
  }

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre className="line-numbers" data-line={dataLine}>
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
}

PrismCode.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
};

PrismCode.defaultProps = {
  language: 'jsx',
};

export default PrismCode;
