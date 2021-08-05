/* eslint-disable no-continue */
import marked from 'marked';
import { debug, color, START_COLOR, MD_PARSE } from '../lib/debug.js';
import { trim } from '../lib/markdown';
import {
  addBlankLines,
  modifyTokenIfMultiTagsInOneLine,
  isOpeningTagAtBegginning,
  isSelfCloseTag,
  getTheFirstTagTextContent,
  getTextExceptTheFirstTag,
} from './parse-react-component-utils.js';
import recursiveParseMarkedToken from './recursive-parse-marked-token.js';
import {
  isParsingReactComponent,
  finishReactComponent,
  openReactCompenent,
  recursiveSpliceChildren,
} from './parse-react-component.js';
import { getCurrentNode } from './tree.js';
import Page from './Page.jsx';

const contract = debug(MD_PARSE);

function createTotalPagesNum(tokens) {
  let totalCount = 1;
  tokens.forEach((token) => {
    if (token.type === 'hr') {
      totalCount += 1;
    }
  });
  return totalCount;
}

function finishOnePage(ctx, pages) {
  for (let i = 0; i < ctx.pageChildren.length; i += 1) {
    if (ctx.pageChildren[i].props && ctx.pageChildren[i].props.tag === 'Footer') {
      ctx.currentFooter = ctx.pageChildren[i];
      ctx.pageChildren.splice(i, 1);
      i -= 1;
    }
  }

  const page = Page.createPage(ctx);
  pages.push(page);
}

function createPages(markdown) {
  const formattedMarkdown = addBlankLines(markdown);
  const tokens = marked.lexer(formattedMarkdown);
  modifyTokenIfMultiTagsInOneLine(tokens);

  const pages = [];
  const context = {
    pageChildren: [],
    reactRoot: null,
    hasTitleInCurrentPage: false,
    currentFooter: null,
    currentPageNum: 1,
    totalPagesNum: createTotalPagesNum(tokens),
  };

  contract('@require MD \n%s\n@ensure 解析为%d个token%O', color(markdown, START_COLOR), tokens.length, tokens);
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === 'hr') {
      finishOnePage(context, pages);
      context.pageChildren = [];
      context.currentPageNum += 1;
      context.hasTitleInCurrentPage = false;
      continue;
    }

    const node = recursiveParseMarkedToken(token);
    if (!node) continue;
    if (node.error) {
      contract('@require 发现React组件\n%s\n@ensure 解析React文本', node.text);
      const textExceptTheFirstTag = getTextExceptTheFirstTag(node.text);
      if (isOpeningTagAtBegginning(node.text)) {
        let text;
        if (textExceptTheFirstTag) {
          text = `<${getTheFirstTagTextContent(node.text)}>`;
        } else {
          text = node.text;
        }
        openReactCompenent(context, text);
      }

      if (!isOpeningTagAtBegginning(node.text) || isSelfCloseTag(node.text)) {
        finishReactComponent(context);
        continue;
      }

      if (textExceptTheFirstTag) {
        const origTokensForTextExceptTheFirstTag = marked.lexer(trim(textExceptTheFirstTag));
        let tokensForTextExceptTheFirstTag;
        if (
          origTokensForTextExceptTheFirstTag.length &&
          origTokensForTextExceptTheFirstTag.length === 1 &&
          origTokensForTextExceptTheFirstTag[0].type === 'paragraph' &&
          origTokensForTextExceptTheFirstTag[0].tokens
        ) {
          tokensForTextExceptTheFirstTag = origTokensForTextExceptTheFirstTag[0].tokens;
        } else {
          tokensForTextExceptTheFirstTag = origTokensForTextExceptTheFirstTag;
        }

        tokens.splice(i + 1, 0, ...tokensForTextExceptTheFirstTag);
        continue;
      }
      continue;
    }

    if (node.props) {
      recursiveSpliceChildren(node.props.children);
    }

    if (isParsingReactComponent(context)) {
      contract('@require React节点里面有MD节点 \n%O\n@ensure 把MD节点push进React节点', node.props);
      const currentNode = getCurrentNode(context.reactRoot);
      currentNode.children.push(node);
      continue;
    }

    contract('@require 独立的MD节点 \n%O\n@ensure 把MD节点push进Page节点', node.props);
    context.pageChildren.push(node);
  }

  contract('@require 结束解析MD\n@ensure 把剩余节点push进Page节点');
  finishOnePage(context, pages);

  return pages;
}

export default createPages;
