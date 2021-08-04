/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Div, Span } from '../styled/index.js';
import { Title } from '../sectioning/index.js';
import { Appear, CheckboxWithState, Clock, Timer, ClockOrTimer, Split } from '../components/index.js';
import makeid from '../lib/makeid.js';
import { getTextFromChildren } from './parse-react-component-utils.js';

function MDXToReactHOC({ children, tag, style }) {
  switch (tag) {
    case 'Appear': {
      const { hover, wrap, ...restStyle } = style;
      return (
        <Appear hover={hover} wrap={wrap} style={restStyle}>
          {children}
        </Appear>
      );
    }
    case 'Checkbox': {
      const { checked, right, ...restStyle } = style;
      return (
        <CheckboxWithState label={getTextFromChildren(children)} checked={checked} right={right} style={restStyle} />
      );
    }
    case 'Clock':
      return <Clock style={{ ...style }} />;
    case 'Timer':
      return <Timer style={{ ...style }} />;
    case 'ClockOrTimer':
      return <ClockOrTimer style={{ ...style }} />;
    case 'Header':
      return <Span style={{ fontSize: '1.4em', fontWeight: '500', ...style }}>{children}</Span>;
    case 'Footer':
      return <Span>{children}</Span>;
    case 'Split':
      return <Split style={{ ...style }}>{children}</Split>;
    case 'Div':
      return <Div style={{ ...style }}>{children}</Div>;
    case 'Span':
      return <Span style={{ ...style }}>{children}</Span>;
    case 'Title':
      return <Title style={{ ...style }}>{getTextFromChildren(children)}</Title>;
    default:
      throw new TypeError(`Unknown tag of ${tag}`);
  }
}

MDXToReactHOC.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object.isRequired,
};

MDXToReactHOC.createComponent = (node) => {
  const component = (
    <MDXToReactHOC key={makeid()} tag={node.tagName} style={node.style}>
      {node.children}
    </MDXToReactHOC>
  );
  return component;
};

export default MDXToReactHOC;
