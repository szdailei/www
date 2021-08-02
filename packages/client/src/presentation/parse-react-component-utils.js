import { isAlphabetical } from 'is-alphabetical';

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

function removeQuote(text) {
  let result = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== '"' && text[i] !== "'") {
      result += text[i];
    }
  }
  return result;
}

function getAttributes(text) {
  const attributes = {};
  let key;
  let value;
  let attrsStr;

  const firstTextContent = getTheFirstTagTextContent(text);
  if (!firstTextContent) return {};

  const { length } = firstTextContent;
  if (length >= 2 && firstTextContent[length - 1] === '/' && firstTextContent[length - 2] === ' ') {
    // remove '/' if it is self closing tag
    attrsStr = firstTextContent.slice(0, -2);
  } else {
    attrsStr = firstTextContent;
  }

  const tokens = attrsStr.split(' ');

  // The first is tag name, skip
  for (let i = 1; i < tokens.length; i += 1) {
    const pair = tokens[i].split('=');
    if (pair.length === 2) {
      key = pair[0].trim();
      value = pair[1].trim();
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      attributes[key] = value;
    }
    if (pair.length === 1) {
      const mergedValue = removeQuote(`${value} ${pair}`);
      attributes[key] = mergedValue;
    }
  }
  return attributes;
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
  getAttributes,
  getTagName,
  getTheFirstTagTextContent,
  getTextExceptTheFirstTag,
  getTextFromChildren,
  isClosingTagAtBeginning,
  isClosingTagAtEnd,
  isReactTagAtBegginning,
  isOpeningTagAtBegginning,
  isSelfCloseTag,
};
