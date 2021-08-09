/* eslint-disable no-continue */
import { isAlphabetical } from 'is-alphabetical';
import { trim } from '../lib/markdown.js';
import emptyTags from '../lib/empty-tags.js';

function getTagName(text) {
  let tagName = '';
  // The first is '<', skip
  for (let i = 1; i < text.length; i += 1) {
    if (text[i] === ' ' || text[i] === '>') {
      break;
    }
    tagName += text[i];
  }
  return tagName;
}

function matchChars(char, chars) {
  if (!chars) return false;

  for (let i = 0; i < chars.length; i += 1) {
    if (char === chars[i]) return true;
  }
  return false;
}

function matchEmptyChar(char) {
  const emptyChars = [' ', '\t', '\r', '\n'];
  return matchChars(char, emptyChars);
}

function parseText(text, tokens) {
  let textContent = '';
  let isEmpty = true;
  let isAfterStartChars = false;

  for (let i = 0; i < text.length; i += 1) {
    if (matchChars(text[i], tokens.endChars)) {
      break;
    }
    if (isAfterStartChars) {
      textContent += text[i];
      if (!matchEmptyChar(text[i])) {
        isEmpty = false;
      }
    } else if (matchChars(text[i], tokens.startChars)) {
      isAfterStartChars = true;
    }
  }

  if (isEmpty) return null;
  return textContent;
}

function getTheFirstTagTextContent(text) {
  const tokens = {
    startChars: ['<'],
    endChars: ['>'],
  };
  return parseText(text, tokens);
}

function getTextExceptTheFirstTag(text) {
  const tokens = {
    startChars: ['>'],
    endChars: null,
  };
  const result = parseText(text, tokens);
  return trim(result);
}

function getTextWithoutTagName(textWithTagName) {
  const lines = textWithTagName.split(' ');
  let { length } = lines;

  if (lines[lines.length - 1] === '/') length -= 1; // skip '/' in self close tag

  let textWithoutTagName = lines[1]; // lines[0] is tag name, skip it
  for (let i = 2; i < length; i += 1) {
    if (lines[i] === '') continue;
    textWithoutTagName += ` ${lines[i]}`;
  }

  return trim(textWithoutTagName);
}

function getPairs(textWithoutTagName) {
  const pairs = [];
  let insideSingleQuote = false;
  let insideDoubleQuote = false;

  let pair = '';
  for (let i = 0; i < textWithoutTagName.length; i += 1) {
    const char = textWithoutTagName[i];
    if (char === "'") {
      insideSingleQuote = !insideSingleQuote;
      continue;
    }
    if (char === '"') {
      insideDoubleQuote = !insideDoubleQuote;
      continue;
    }
    if (char === ' ') {
      if (insideSingleQuote || insideDoubleQuote) {
        pair += char;
      } else {
        pairs.push(pair);
        pair = '';
      }
    } else {
      pair += char;
    }
  }
  pairs.push(pair);
  return pairs;
}

function getParams(text) {
  const firstTextContent = trim(getTheFirstTagTextContent(text));

  const textWithoutTagName = getTextWithoutTagName(firstTextContent);

  if (!textWithoutTagName) return {};

  const pairs = getPairs(textWithoutTagName);
  const params = {};

  pairs.forEach((pair) => {
    const tokens = pair.split('=');
    const key = tokens[0];
    let value = tokens[1];
    if (value) {
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      params[key] = value;
    } else {
      params[key] = true;
    }
  });

  delete params.undefined;

  return params;
}

function getTextFromChildren(children) {
  if (!children) return null;
  let text = children;
  let node;
  while (text) {
    if (typeof text === 'string') break;
    // eslint-disable-next-line prefer-destructuring
    node = text[0];
    if (node) {
      if (typeof node === 'string') {
        text = node;
      } else {
        text = node.props.children;
      }
    }
  }
  return text;
}

function isCapitalLetter(letter) {
  if (!isAlphabetical(letter)) return false;
  if (letter.toUpperCase() === letter) return true;
  return false;
}

function isOpeningTagAtBegginning(text) {
  if (text[1] === '/') return false;
  return true;
}

function isEmptyTagAtBeginning(text) {
  const tagName = getTagName(text);
  for (let i = 0; i < emptyTags.length; i += 1) {
    if (emptyTags[i] === tagName) return true;
  }
  return false;
}

function isClosingTagAtBeginning(text) {
  if (text[0] === '<' && text[1] === '/') return true;
  return false;
}

function isClosingTagAtEnd(text) {
  const tokens = text.split('<');
  const lastTagName = tokens[tokens.length - 1];

  if (lastTagName[0] === '/' && isCapitalLetter(lastTagName[1])) {
    return true;
  }
  return false;
}

function isSelfCloseTag(text) {
  if (isEmptyTagAtBeginning(text)) return true;

  const firstTagTextContent = getTheFirstTagTextContent(text);
  if (firstTagTextContent[firstTagTextContent.length - 1] === '/') return true;

  return false;
}

function isReactTagAtBegginning(text) {
  if (text[0] !== '<') return false;
  if (isOpeningTagAtBegginning(text)) return isCapitalLetter(text[1]);
  return isCapitalLetter(text[2]);
}

function addBlankLines(markdown) {
  const lines = trim(markdown).split('\n');
  let result = lines[0];
  let isInsideCode = false;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].indexOf('```') === 0) isInsideCode = !isInsideCode;
    const trimedLine = trim(lines[i]);
    if (!isInsideCode && isReactTagAtBegginning(trimedLine)) {
      result += `\n\n${trimedLine}\n`;
    } else {
      result += `\n${lines[i]}`;
    }
  }

  return result;
}

function modifyTokenIfMultiTagsInOneLine(tokens) {
  tokens.forEach((token) => {
    if (token.type === 'paragraph' && token.text[0] === '<') {
      // eslint-disable-next-line no-param-reassign
      token.type = 'html';
    }
  });
}

export {
  addBlankLines,
  modifyTokenIfMultiTagsInOneLine,
  getParams,
  getTagName,
  getTheFirstTagTextContent,
  getTextExceptTheFirstTag,
  getTextFromChildren,
  isClosingTagAtBeginning,
  isEmptyTagAtBeginning,
  isClosingTagAtEnd,
  isReactTagAtBegginning,
  isOpeningTagAtBegginning,
  isSelfCloseTag,
};
