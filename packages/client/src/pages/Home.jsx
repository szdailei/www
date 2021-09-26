import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import marked from 'marked';
import { i18n, t } from '../i18n';
import makeid from '../lib/makeid';
import { Div, Span, Option, Select } from '../styled';
import { Article, Section, Header, Main } from '../sectioning';
import awesome from '../awesome.md';

function createHeading(node) {
  switch (node.depth) {
    case 1:
      return <h1 key={makeid()}>{node.text}</h1>;
    case 2:
      return <h2 key={makeid()}>{node.text}</h2>;
    default:
      return <h3 key={makeid()}>{node.text}</h3>;
  }
}

function createListItem(node) {
  if (node[0].type === 'link') {
    return (
      <Div key={makeid()}>
        <a href={node[0].href} rel="noopener noreferrer" target="_blank">
          {node[0].text}
        </a>
        <Span>{node[1].raw}</Span>
      </Div>
    );
  }
  return <Div key={makeid()}>{node[0].text}</Div>;
}

function parseMarkdown(markdown) {
  const tokens = marked.lexer(markdown);
  const result = [];
  tokens.forEach((token) => {
    let node;
    switch (token.type) {
      case 'heading':
        node = createHeading(token);
        result.push(node);
        break;
      case 'list':
        token.items.forEach((listChild) => {
          node = createListItem(listChild.tokens[0].tokens);
          result.push(node);
        });
        break;
      default:
        break;
    }
  });
  return result;
}

function Home() {
  const [refresh, setRefresh] = useState(false);

  const changeCurrentLocale = useCallback(
    (event) => {
      const localeName = i18n.getLocaleByNativeName(event.target.value);
      i18n.setCurrentLocaleCode(localeName);
      setRefresh(!refresh);
    },
    [refresh]
  );

  function LangSelect() {
    const options = [<Option key={i18n.getNativeNames().length + 1} value="Select..." label="Select..." />];
    i18n.getNativeNames().forEach((nativeName, key) => {
      // eslint-disable-next-line react/no-array-index-key
      const option = <Option key={key} value={nativeName} label={nativeName} />;
      options.push(option);
    });
    return <Select onChange={changeCurrentLocale} options={options} />;
  }

  const body = parseMarkdown(awesome);

  const gridTemplateAreas = `
    'header'
    'main'
    `;
  return (
    <Article>
      <Section
        style={{
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'auto auto',
          gridTemplateAreas,
          fontSize: '1.5em',
        }}
      >
        <Header style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr 1fr', fontSize: '1em' }}>
          <Link to="/">{t('home:title')}</Link>
          <Div>{t('home:blog')}</Div>
          <Link to="/resume">{t('home:aboutMe')}</Link>
          <Link to="/courses">{t('home:courses')}</Link>
          <Link to="/admin">{t('home:admin')}</Link>
          <Link to="/sign-in">{t('home:sign-in')}</Link>
          <LangSelect />
        </Header>
        <Main>{body}</Main>
      </Section>
    </Article>
  );
}

export default Home;
