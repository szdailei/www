import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import './prism.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import './prism-line-highlight.css';

function parseLanguage(language) {
  const DEFAULT_LANG = 'jsx';
  let lang = DEFAULT_LANG;
  let dataLine;

  if (language && language !== '') {
    const indexOfLeftBracket = language.indexOf('{');
    if (indexOfLeftBracket === -1) {
      lang = language.trim();
    } else {
      lang = language.slice(0, indexOfLeftBracket).trim();
      if (lang === '') lang = DEFAULT_LANG;
      const indexOfRightBracket = language.indexOf('}');
      dataLine = language.slice(indexOfLeftBracket + 1, indexOfRightBracket).trim();
    }
  }

  return { lang, dataLine };
}

function PrismCode({ code, language }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const { lang, dataLine } = parseLanguage(language);

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
