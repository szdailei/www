import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

function PrismCode({ code, language }) {
  let lang = language;
  if (!language || language === '') {
    lang = 'jsx';
  }

  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div>
      <pre className="line-numbers">
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
