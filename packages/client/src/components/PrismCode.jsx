import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import './prism-tomorrow.css';
import './prism-line-highlight.css';

function PrismCode({ code, language }) {
  let origLang = language;
  if (!language || language === '') {
    origLang = 'jsx';
  }

  const index = origLang.indexOf('{');
  let lang;
  let dataLine;
  if (index === -1) {
    lang = origLang.trim();
    dataLine = null;
  } else {
    lang = origLang.slice(0, index).trim();
    dataLine = origLang.slice(index + 1, origLang.length - 1);
  }

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div>
      <pre className="line-numbers" data-line={dataLine}>
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
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
