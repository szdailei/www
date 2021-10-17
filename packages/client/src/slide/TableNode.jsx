import React from 'react';
import marked from 'marked';
import makeid from '../lib/makeid';
import { TH, TD, TR, THead, TBody, Table } from '../styled';
import HtmlNode from './HtmlNode';

function parseTDWithHtml(text) {
  const tokens = marked.lexer(text);
  let children;
  if (tokens[0] && tokens[0].tokens && tokens[0].tokens.length > 1) {
    children = [];
    tokens[0].tokens.forEach((token) => {
      let node = token.text;
      if (token.type === 'html') {
        node = HtmlNode(token.text);
      }
      children.push(node);
    });
  } else {
    children = text;
  }

  return children;
}

function TableNode(table) {
  const padding = '6px 16px 6px 16px';
  const backgroundColor = 'linen';

  const tHeaders = [];
  table.header.forEach((header) => {
    tHeaders.push(
      <TH key={makeid()} style={{ padding, backgroundColor }}>
        {header}
      </TH>
    );
  });
  const tHeadNode = (
    <THead key={makeid()}>
      <TR key={makeid()}>{tHeaders}</TR>
    </THead>
  );

  const tBodyRows = [];
  let isRequiredBackground = false;
  table.cells.forEach((rowCells) => {
    const dataCells = [];
    rowCells.forEach((text) => {
      const tDChildren = parseTDWithHtml(text);
      dataCells.push(
        <TD key={makeid()} style={{ padding }}>
          {tDChildren}
        </TD>
      );
    });

    const trNode = isRequiredBackground ? (
      <TR key={makeid()} style={{ backgroundColor }}>
        {dataCells}
      </TR>
    ) : (
      <TR key={makeid()}>{dataCells}</TR>
    );
    tBodyRows.push(trNode);
    isRequiredBackground = !isRequiredBackground;
  });
  const tBodyNode = <TBody key={makeid()}>{tBodyRows}</TBody>;

  const node = (
    <Table key={makeid()}>
      {tHeadNode}
      {tBodyNode}
    </Table>
  );

  return node;
}

export default TableNode;
