/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Div, Span } from '../styled/index.js';
import { Title } from '../sectioning/index.js';
import { CheckboxWithState, Clock, Timer, ClockOrTimer } from '../components/index.js';
import Split from '../layout/Split.jsx';
import makeid from '../lib/makeid.js';
import { getTextFromChildren } from './parse-react-component-utils.js';

function Component({ children, tag, attributes }) {
  switch (tag) {
    case 'Checkbox':
      return <CheckboxWithState label={getTextFromChildren(children)} {...attributes} />;
    case 'Clock':
      return <Clock {...attributes} />;
    case 'Timer':
      return <Timer {...attributes} />;
    case 'ClockOrTimer':
      return <ClockOrTimer {...attributes} />;
    case 'Header':
      return (
        <Span fontSize="1.4em" fontWeight="700" {...attributes}>
          {children}
        </Span>
      );
    case 'Footer':
      return <Span>{children}</Span>;
    case 'Split':
      return <Split {...attributes}>{children}</Split>;
    case 'Div':
      return <Div {...attributes}>{children}</Div>;
    case 'Span':
      return <Span {...attributes}>{children}</Span>;
    case 'Title':
      return <Title {...attributes}>{getTextFromChildren(children)}</Title>;
    default:
      throw new TypeError(`Unknown tag of ${tag}`);
  }
}

Component.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  attributes: PropTypes.object.isRequired,
};

function CreateComponent(node) {
  const component = (
    <Component key={makeid()} tag={node.tagName} attributes={node.attributes}>
      {node.children}
    </Component>
  );
  return component;
}

export { Component, CreateComponent };
