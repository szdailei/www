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
  return parseText(text, tokens);
}

function removeQuoteAtBeginningAndEnd(text) {
  let result = trim(text);
  if (result[0] === '"' || result[0] === "'") result = result.slice(1);
  if (result[result.length - 1] === '"' || result[result.length - 1] === "'")
    result = result.slice(0, result.length - 1);
  return result;
}

function getStyle(text) {
  const style = {};
  let key;
  let value;
  let styleStr;

  const firstTextContent = trim(getTheFirstTagTextContent(text));

  const { length } = firstTextContent;
  if (length >= 2 && firstTextContent[length - 1] === '/' && firstTextContent[length - 2] === ' ') {
    // remove '/' if it is self closing tag
    styleStr = firstTextContent.slice(0, -2);
  } else {
    styleStr = firstTextContent;
  }

  const tokens = styleStr.split(' ');

  // The first is tag name, skip
  for (let i = 1; i < tokens.length; i += 1) {
    const pair = tokens[i].split('=');
    if (pair.length === 2) {
      key = pair[0].trim();
      value = removeQuoteAtBeginningAndEnd(pair[1]);

      if (value === 'true') value = true;
      if (value === 'false') value = false;
      style[key] = value;
    }
    if (pair.length === 1) {
      const mergedValue = removeQuoteAtBeginningAndEnd(`${value} ${pair}`);
      style[key] = mergedValue;
    }
  }

  delete style.undefined;

  return style;
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

export {
  getStyle,
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
