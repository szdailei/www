/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Div, Span, Input, Label } from '../styled/index.js';
import { Title } from '../sectioning/index.js';
import { Appear, CheckboxWithState, Clock, Timer, ClockOrTimer, Split } from '../components/index.js';
import makeid from '../lib/makeid.js';
import { getTextFromChildren } from './parse-react-component-utils.js';

function MDXToReactHOC({ children, tag, params }) {
  let props;
  switch (tag) {
    case 'Appear': {
      const { hover, wrap, ...restParams } = params;
      props = { hover, wrap };
      return (
        <Appear {...props} style={restParams}>
          {children}
        </Appear>
      );
    }
    case 'Checkbox': {
      const label = getTextFromChildren(children);
      const { checked, right, ...restParams } = params;
      props = { label, checked, right };
      return <CheckboxWithState {...props} style={restParams} />;
    }
    case 'Clock':
      return <Clock style={params} />;
    case 'Timer':
      return <Timer style={params} />;
    case 'ClockOrTimer':
      return <ClockOrTimer style={params} />;
    case 'Split':
      return <Split style={params}>{children}</Split>;
    case 'Div':
      return <Div style={params}>{children}</Div>;
    case 'Header':
      return <Span style={{ fontSize: '1.4em', fontWeight: '500', ...params }}>{children}</Span>;
    case 'Footer':
    case 'Span':
      return <Span style={params}>{children}</Span>;
    case 'Title':
      return <Title style={params}>{getTextFromChildren(children)}</Title>;
    case 'Button':
      props = params;
      return <Button {...props}>{children}</Button>;
    case 'Input':
      props = params;
      return <Input {...props} />;
    case 'Label': {
      const { htmlFor, ...restParams } = params;
      props = { htmlFor };
      return (
        <Label {...props} style={restParams}>
          {children}
        </Label>
      );
    }
    default:
      throw new TypeError(`Unknown tag of ${tag}`);
  }
}

MDXToReactHOC.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  params: PropTypes.object.isRequired,
};

MDXToReactHOC.createComponent = (node) => {
  const component = (
    <MDXToReactHOC key={makeid()} tag={node.tagName} params={node.params}>
      {node.children}
    </MDXToReactHOC>
  );
  return component;
};

export default MDXToReactHOC;
