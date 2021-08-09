/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsLight';
import makeid from '../lib/makeid';

function SyntaxHighlighter({ code }) {
  const Pre = styled.pre`
padding: 0.5em;
margin: 1em 0;
overflow: scroll;
text-align: left;
`;

  const Line = styled.div`
display: table-row;
`;

  const LineNo = styled.span`
display: table-cell;
padding-right: 1em;
text-align: right;
user-select: none;
opacity: 0.5;
`;

  const LineContent = styled.span`
display: table-cell;
`;

  function render({ style, tokens, getLineProps, getTokenProps }) {
    return (
      <Pre style={style}>
        {tokens.map((line, i) => (
          <Line key={makeid()} {...getLineProps({ line, key: i })}>
            <LineNo>{i + 1}</LineNo>
            <LineContent>
              {line.map((token, key) => (
                <span key={makeid()} {...getTokenProps({ token, key })} />
              ))}
            </LineContent>
          </Line>
        ))}
      </Pre>
    );
  }
  return (
    <Highlight {...defaultProps} theme={theme} code={code} language="jsx">
      {render}
    </Highlight>
  );
}

SyntaxHighlighter.propTypes = {
  code: PropTypes.string.isRequired,
};

export default SyntaxHighlighter;
