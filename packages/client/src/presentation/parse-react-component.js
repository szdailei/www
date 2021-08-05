import marked from 'marked';
import { debug, color, START_COLOR, REACT_PARSE } from '../lib/debug.js';
import { trim } from '../lib/markdown.js';
import recursiveParseMarkedToken from './recursive-parse-marked-token.js';
import { createNode, addNode, getCurrentNode, finishNode } from './tree.js';
import {
  isClosingTagAtBeginning,
  isClosingTagAtEnd,
  isOpeningTagAtBegginning,
  isSelfCloseTag,
  getTextExceptTheFirstTag,
} from './parse-react-component-utils.js';
import MDXToReactHOC from './MDXToReactHOC.jsx';

const contract = debug(REACT_PARSE);

function isParsingReactComponent(ctx) {
  return ctx.reactRoot;
}

function finishReactComponent(ctx) {
  const currentNode = getCurrentNode(ctx.reactRoot);

  finishNode(ctx.reactRoot, currentNode);
  if (currentNode.tagName === 'Title') {
    ctx.hasTitleInCurrentPage = true;
  }

  if (ctx.reactRoot.isFinished) {
    const rootComponent = MDXToReactHOC.createComponent(ctx.reactRoot);
    ctx.pageChildren.push(rootComponent);
    ctx.reactRoot = null;
  }
}

function finishMultiReactComponents(ctx, origText) {
  let text = origText;
  if (!text || text.length < 4) return;

  while (isClosingTagAtBeginning(text)) {
    finishReactComponent(ctx);

    text = trim(getTextExceptTheFirstTag(text));
    if (!text || text.length < 4) return;
  }
}

function openReactCompenent(ctx, text) {
  contract('@require React Opening tag \n%s', color(text, START_COLOR));
  const node = createNode(text);
  const textExceptTheFirstTag = trim(getTextExceptTheFirstTag(text));

  if (!ctx.reactRoot) {
    contract('@require ctx.reactRoot不存在 \n@ensure  新增ctx.reactRoot');
    ctx.reactRoot = node;
  } else {
    contract('@require ctx.reactRoot存在 \n@ensure  ctx.reactRoot添加子节点');
    addNode(ctx.reactRoot, node);
  }

  if (textExceptTheFirstTag) {
    const origTokens = marked.lexer(textExceptTheFirstTag);
    let tokens;
    if (origTokens.length && origTokens.length === 1 && origTokens[0].type === 'paragraph' && origTokens[0].tokens) {
      tokens = origTokens[0].tokens;
    } else {
      tokens = origTokens;
    }

    contract('@require React tag里有MD \n%s\n@ensure 解析为%d个token%O', textExceptTheFirstTag, tokens.length, tokens);
    tokens.forEach((token) => {
      contract('@require token \n%O \n@ensure 递归解析为subNode', token);
      const subNode = recursiveParseMarkedToken(token);
      if (!subNode) return;

      if (subNode.error) {
        if (isOpeningTagAtBegginning(subNode.text)) {
          contract('@require React有子节点文本\n%s\n@ensure 递归React Opening tag', subNode.text);
          openReactCompenent(ctx, subNode.text);
        } else {
          contract('@require React Closing tag \n%s\n@ensure 结束解析React子节点文本', subNode.text);
          finishReactComponent(ctx);
        }
        return;
      }

      if (subNode.props) {
        // eslint-disable-next-line no-use-before-define
        recursiveSpliceChildren(subNode.props.children);
        const currentNode = getCurrentNode(ctx.reactRoot);
        currentNode.children.push(subNode);
      }
    });
  }
}

function recursiveSpliceChildren(children) {
  const ctx = {
    pageChildren: [],
    reactRoot: null,
  };

  while (children) {
    if (children.length === 1 && children[0].props) {
      // eslint-disable-next-line no-param-reassign
      children = children[0].props.children;
    } else {
      let htmlStartIndex;
      let lastHtmlStartIndex;
      const htmlStartIndexs = [];

      if (!Array.isArray(children)) return;

      for (let i = 0; i < children.length; i += 1) {
        if (children[i].error) {
          if (isOpeningTagAtBegginning(children[i].text)) {
            htmlStartIndex = i;
            htmlStartIndexs.push(htmlStartIndex);
            openReactCompenent(ctx, children[i].text);
          }

          if (
            !isOpeningTagAtBegginning(children[i].text) ||
            isSelfCloseTag(children[i].text) ||
            isClosingTagAtEnd(children[i].text)
          ) {
            const currentNode = getCurrentNode(ctx.reactRoot);
            finishReactComponent(ctx);

            if (!htmlStartIndex) {
              htmlStartIndex = 0;
              htmlStartIndexs.push(htmlStartIndex);
            }

            lastHtmlStartIndex = htmlStartIndexs.pop();
            children.splice(lastHtmlStartIndex, i - lastHtmlStartIndex + 1, currentNode.component);
            i = lastHtmlStartIndex;
          }
        } else if (isParsingReactComponent(ctx)) {
          const currentNode = getCurrentNode(ctx.reactRoot);
          currentNode.children.push(children[i]);
        } else if (children[i].props) {
          recursiveSpliceChildren(children[i].props.children);
        }
      }
      break;
    }
  }
}

export {
  isParsingReactComponent,
  finishReactComponent,
  finishMultiReactComponents,
  openReactCompenent,
  recursiveSpliceChildren,
};
