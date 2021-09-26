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
} from './parse-react-component-utils';
import recursiveParseMarkedToken from './recursive-parse-marked-token';
import { closeReactComponent } from './close-react-component';
import {
  isParsingReactComponent,
  getTokensByMarkdown,
  openReactCompenent,
  recursiveSpliceChildren,
} from './open-react-component';
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
    reactRoot: null,
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
      contract('@require 发现React组件\n%s\n@ensure 解析React文本', node.text);
      const textExceptTheFirstTag = getTextExceptTheFirstTag(node.text);
      if (isOpeningTagAtBegginning(node.text)) {
        let text;
        if (textExceptTheFirstTag) {
          // Only parse the first tag name and params, textExceptTheFirstTag will be getTokensByMarkdown and insert it after current token.
          text = `<${getTheFirstTagTextContent(node.text)}>`;
        } else {
          text = node.text;
        }
        openReactCompenent(ctx, text);
      }

      const tagName = getTagName(node.text);
      if (isExampleTag(tagName)) {
        const currentNode = getCurrentNode(ctx.reactRoot);
        const component = ExampleContainer.createComponent(createPages);
        addComponentToChildren(ctx.reactRoot, currentNode, component);

        if (ctx.reactRoot === currentNode) {
          ctx.pageChildren.push(component);
          ctx.reactRoot = null;
        }
        continue;
      }

      if (!isOpeningTagAtBegginning(node.text) || isSelfCloseTag(node.text)) {
        closeReactComponent(ctx);
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

    if (isParsingReactComponent(ctx)) {
      contract('@require React节点里面有MD节点 \n%O\n@ensure 把MD节点push进React节点', node.props);
      const currentNode = getCurrentNode(ctx.reactRoot);
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
