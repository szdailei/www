import React from 'react';
import makeid from '../lib/makeid.js';
import { convertSrcToLocal, convertSrcToServer, removeBlankLine, trim } from '../lib/markdown.js';
import { Div, Heading, P, Span } from '../styled/index.js';
import { SyntaxHighlighter } from '../components/index.js';
import { isReactTagAtBegginning } from './parse-react-component-utils.js';
import HtmlNode from './HtmlNode.jsx';
import TableNode from './TableNode.jsx';

function MarkdownNode(token, children, parent) {
  const hoverStyle = {
    '&:hover': {
      fontWeight: 900,
      outline: '1px solid',
    },
  };
  const tokenText = trim(token.text);
  let node;

  switch (token.type) {
    case 'blockquote':
      node = <blockquote key={makeid()}>{children}</blockquote>;
      break;
    case 'code':
      if (token.codeBlockStyle === 'indented' && isReactTagAtBegginning(tokenText)) {
        node = {
          error: 'react-component',
          type: token.type,
          text: tokenText,
        };
      } else {
        node = <SyntaxHighlighter key={makeid()} style={{ borderStyle: 'solid' }} code={tokenText} />;
      }
      break;
    case 'del':
      node = <span key={makeid()}>{token.raw}</span>;
      break;
    case 'em':
      node = <em key={makeid()}>{tokenText}</em>;
      break;
    case 'heading':
      node = (
        <Heading key={makeid()} depth={token.depth}>
          {children}
        </Heading>
      );
      break;
    case 'image':
      node = (
        <Div key={makeid()} style={{ display: 'block', margin: '0', textAlign: 'center' }}>
          <img
            key={makeid()}
            src={
              window.location.protocol === 'file:'
                ? convertSrcToLocal(token.href, 'img')
                : convertSrcToServer(token.href, 'img')
            }
            alt={tokenText}
            title={token.title}
          />
        </Div>
      );
      break;
    case 'link':
      node = (
        <a key={makeid()} href={token.href} rel="noopener noreferrer" target="_blank">
          {token.text}
        </a>
      );
      break;
    case 'list':
      if (token.ordered) {
        node = <ol key={makeid()}>{children}</ol>;
      } else {
        node = <ul key={makeid()}>{children}</ul>;
      }
      break;
    case 'list_item':
      node = <li key={makeid()}>{children}</li>;
      break;
    case 'html':
      if (isReactTagAtBegginning(tokenText)) {
        node = {
          error: 'react-component',
          type: token.type,
          text: tokenText,
        };
      } else {
        node = HtmlNode(tokenText);
      }
      break;
    case 'paragraph':
      if (children.length === 1) {
        if (children[0].type === 'span') {
          node = <p key={makeid()}>{removeBlankLine(tokenText)}</p>;
        } else {
          [node] = children;
        }
      } else {
        node = <p key={makeid()}>{children}</p>;
      }
      break;
    case 'space':
      node = <br key={makeid()} />;
      break;
    case 'strong':
      node = <strong key={makeid()}>{children}</strong>;
      break;
    case 'table':
      node = TableNode(token);
      break;
    case 'text':
      if (parent && parent.type === 'paragraph' && parent.tokens && parent.tokens.length === 1) {
        node = (
          <P key={makeid()} style={hoverStyle}>
            {children}
          </P>
        );
      } else {
        node = (
          <Span key={makeid()} style={hoverStyle}>
            {children}
          </Span>
        );
      }
      break;
    default:
      throw new TypeError(`Unknown tag of ${token.type}`);
  }

  return node;
}

export default MarkdownNode;
