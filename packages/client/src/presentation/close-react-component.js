import { trim } from '../lib/markdown.js';
import { isClosingTagAtBeginning, getTextExceptTheFirstTag } from './parse-react-component-utils.js';
import { getCurrentNode, addComponentToChildren } from './tree.js';
import MDXToReactHOC from './MDXToReactHOC.jsx';

function closeReactComponent(ctx) {
  const currentNode = getCurrentNode(ctx.reactRoot);
  if (currentNode.tagName === 'Title') {
    ctx.hasTitleInCurrentPage = true;
  }

  const component = MDXToReactHOC.createComponent(currentNode);
  addComponentToChildren(ctx.reactRoot, currentNode, component);

  if (ctx.reactRoot === currentNode) {
    ctx.pageChildren.push(component);
    ctx.reactRoot = null;
  }
}

function closeMultiReactComponentsInOneLine(ctx, origText) {
  let text = origText;
  if (!text || text.length < 4) return;

  while (isClosingTagAtBeginning(text)) {
    closeReactComponent(ctx);

    text = trim(getTextExceptTheFirstTag(text));
    if (!text || text.length < 4) return;
  }
}

export { closeReactComponent, closeMultiReactComponentsInOneLine };
