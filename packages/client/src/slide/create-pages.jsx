/* eslint-disable no-continue */
import marked from 'marked';
import { debug, MD_PARSE } from '../lib/debug';
import {
  addBlankLines,
  modifyTokenIfMultiTagsInOneLine,
  isOpeningTagAtBegginning,
  isSelfCloseTag,
  getTagName,
  getTheFirstTagTextContent,
  getTextExceptTheFirstTag,
} from './parse-jsx-utils';
import recursiveParseMarkedToken from './recursive-parse-marked-token';
import { closeJSX } from './close-jsx';
import { isParsingJSX, getTokensByMarkdown, openJSX, recursiveSpliceChildren } from './open-jsx';
import { getCurrentNode, addComponentToChildren } from './tree';
import Page from './Page';
import { ExampleContainer, isExampleTag } from './Example';

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
  const ctx = {
    pageChildren: [],
    jsxRoot: null,
    hasTitleInCurrentPage: false,
    currentFooter: null,
    currentPageNum: 1,
    totalPagesNum: createTotalPagesNum(tokens),
  };

  contract('@require MD \n%s\n@ensure 解析为%d个token%O', markdown, tokens.length, tokens);
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === 'hr') {
      finishOnePage(ctx, pages);
      ctx.pageChildren = [];
      ctx.currentPageNum += 1;
      ctx.hasTitleInCurrentPage = false;
      continue;
    }

    const node = recursiveParseMarkedToken(token);
    if (!node) continue;
    if (node.error) {
      contract('@require 发现JSX组件\n%s\n@ensure 解析JSX文本', node.text);
      const textExceptTheFirstTag = getTextExceptTheFirstTag(node.text);
      if (isOpeningTagAtBegginning(node.text)) {
        let text;
        if (textExceptTheFirstTag) {
          // Only parse the first tag name and params, textExceptTheFirstTag will be getTokensByMarkdown and insert it after current token.
          text = `<${getTheFirstTagTextContent(node.text)}>`;
        } else {
          text = node.text;
        }
        openJSX(ctx, text);
      }

      const tagName = getTagName(node.text);
      if (isExampleTag(tagName)) {
        const currentNode = getCurrentNode(ctx.jsxRoot);
        const component = ExampleContainer.createComponent(createPages);
        addComponentToChildren(ctx.jsxRoot, currentNode, component);

        if (ctx.jsxRoot === currentNode) {
          ctx.pageChildren.push(component);
          ctx.jsxRoot = null;
        }
        continue;
      }

      if (!isOpeningTagAtBegginning(node.text) || isSelfCloseTag(node.text)) {
        closeJSX(ctx);
      }

      if (textExceptTheFirstTag) {
        const tokensOfTextExceptTheFirstTag = getTokensByMarkdown(textExceptTheFirstTag);
        tokens.splice(i + 1, 0, ...tokensOfTextExceptTheFirstTag);
        continue;
      }
      continue;
    }

    if (node.props) {
      recursiveSpliceChildren(node.props.children);
    }

    if (isParsingJSX(ctx)) {
      contract('@require JSX节点里面有MD节点 \n%O\n@ensure 把MD节点push进JSX节点', node.props);
      const currentNode = getCurrentNode(ctx.jsxRoot);
      currentNode.children.push(node);
      continue;
    }

    contract('@require 独立的MD节点 \n%O\n@ensure 把MD节点push进Page节点', node.props);
    ctx.pageChildren.push(node);
  }

  contract('@require 结束解析MD\n@ensure 把剩余节点push进Page节点');
  finishOnePage(ctx, pages);

  return pages;
}

export default createPages;
