/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import makeid from '../lib/makeid.js';
import { Div, Span } from '../styled/index.js';
import { convertSrcToLocal, convertSrcToServer, trim } from '../lib/markdown.js';

function camelCase(name) {
  let camelName = name;
  switch (name) {
    case 'autoplay':
      camelName = 'autoPlay';
      break;
    case 'crossorigin':
      camelName = 'crossOrigin';
      break;
    case 'srclang':
      camelName = 'srcLang';
      break;
    default:
      break;
  }
  return camelName;
}

function getAttributeValues(attributes) {
  if (!attributes) return null;
  const obj = {};
  const keys = Object.getOwnPropertyNames(attributes);
  for (let i = 0; i < keys.length; i += 1) {
    if (Number.isNaN(Number.parseInt(keys[i].trim(), 10))) {
      const key = camelCase(keys[i]);
      if (attributes[keys[i]].value === '') {
        obj[key] = true;
      } else {
        obj[key] = attributes[keys[i]].value;
      }
    }
  }
  return obj;
}

function recursiveParseElement(element) {
  let recursiveParseResult;
  if (element.childNodes.length !== 0) {
    recursiveParseResult = [];
    element.childNodes.forEach((child) => {
      const subNode = recursiveParseElement(child);
      if (subNode) {
        recursiveParseResult.push(subNode);
      }
    });
  }

  const attributes = getAttributeValues(element.attributes);

  let children;
  if (recursiveParseResult && recursiveParseResult.length !== 0) {
    children = recursiveParseResult;
  } else {
    children = trim(element.textContent);
  }

  let node;
  let src;
  let defaultProps;
  let props;
  switch (element.nodeName) {
    case 'BR':
      node = <br key={makeid()} />;
      break;
    case 'DEL':
      node = <del key={makeid()}>{children}</del>;
      break;
    case 'STRONG':
      node = <strong key={makeid()}>{children}</strong>;
      break;
    case 'DIV':
      node = (
        <Div key={makeid()} {...attributes}>
          {children}
        </Div>
      );
      break;
    case 'SPAN':
      node = (
        <Span key={makeid()} {...attributes}>
          {children}
        </Span>
      );
      break;
    case 'HR':
      node = <hr key={makeid()} />;
      break;
    case 'SOURCE':
      src =
        window.location.protocol === 'file:'
          ? convertSrcToLocal(attributes.src, 'video')
          : convertSrcToServer(attributes.src, 'video');
      attributes.src = src;
      node = <source key={makeid()} {...attributes} />;
      break;
    case 'TRACK':
      src =
        window.location.protocol === 'file:'
          ? convertSrcToLocal(attributes.src, 'video')
          : convertSrcToServer(attributes.src, 'video');
      attributes.src = src;
      node = <track key={makeid()} {...attributes} />;
      break;
    case 'U':
      node = <u key={makeid()}>{children}</u>;
      break;
    case 'VIDEO':
      defaultProps = {
        controls: true,
        preload: 'auto',
      };
      if (window.location.protocol !== 'file:') {
        defaultProps.crossOrigin = 'anonymous';
      }
      props = {
        ...defaultProps,
        ...attributes,
      };
      node = (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video key={makeid()} {...props}>
          {children}
        </video>
      );
      break;
    case '#text':
      node = null;
      break;
    default:
      // eslint-disable-next-line no-console
      console.assert(false, `Unknown html tag of ${element.tagName}`);
      break;
  }
  return node;
}

function HtmlNode(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const nodes = [];
  for (let i = 0; i < doc.body.children.length; i += 1) {
    const node = recursiveParseElement(doc.body.children[i]);
    nodes.push(node);
  }
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];
  return nodes;
}

export default HtmlNode;
