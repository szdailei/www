import React from 'react';
import makeid from '../lib/makeid.js';
import { convertSrcToLocal, convertSrcToServer, removeBlankLine, trim } from '../lib/markdown.js';
import { Heading, P, Span } from '../styled/index.js';
import { PrismCode } from '../components/index.js';
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
  const trimedText = trim(token.text);
  let node;

  switch (token.type) {
    case 'blockquote':
      node = <blockquote key={makeid()}>{children}</blockquote>;
      break;
    case 'code':
      if (token.codeBlockStyle === 'indented' && isReactTagAtBegginning(trimedText)) {
        node = {
          error: 'react-component',
          type: token.type,
          text: trimedText,
        };
      } else {
        node = <PrismCode key={makeid()} code={token.text} language={token.lang} />;
      }
      break;
    case 'del':
      node = <span key={makeid()}>{token.raw}</span>;
      break;
    case 'em':
      node = <em key={makeid()}>{trimedText}</em>;
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
        <img
          key={makeid()}
          src={
            window.location.protocol === 'file:'
              ? convertSrcToLocal(token.href, 'img')
              : convertSrcToServer(token.href, 'img')
          }
          alt={trimedText}
          title={token.title}
          style={{ display: 'block', margin: 'auto' }}
        />
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
      if (isReactTagAtBegginning(trimedText)) {
        node = {
          error: 'react-component',
          type: token.type,
          text: trimedText,
        };
      } else {
        node = HtmlNode(trimedText);
      }
      break;
    case 'paragraph':
      if (children.length === 1) {
        if (children[0].type === 'span') {
          node = <p key={makeid()}>{removeBlankLine(trimedText)}</p>;
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
