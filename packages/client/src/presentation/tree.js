/* eslint-disable no-param-reassign */
import { getAttributes, getTagName } from './parse-react-component-utils.js';
import { CreateComponent } from './Component.jsx';

function createRoot() {
  return {
    tagName: null,
    attributes: null,
    isFinished: false,
    curent: null,
    parent: null,
    nodeList: [],
    children: [],
  };
}

function createNode(text) {
  const node = createRoot();
  node.tagName = getTagName(text);
  node.attributes = getAttributes(text);
  node.isFinished = false;

  return node;
}

function getCurrentNode(root) {
  if (root.current) {
    return root.current;
  }
  return root;
}

function addNode(root, node) {
  const current = getCurrentNode(root);
  node.parent = current;
  current.nodeList.push(node);
  root.current = node;
}

function finishNode(root, node) {
  node.isFinished = true;

  const component = CreateComponent(node);
  node.component = component;

  if (node.parent) node.parent.children.push(component);

  if (node.parent && node.parent.parent) {
    root.current = node.parent;
  } else {
    root.current = null;
  }
}

export { createNode, addNode, getCurrentNode, finishNode };
