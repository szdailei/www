import React from 'react';
import makeid from '../lib/makeid.js';
import { t } from '../i18n/index.js';
import { useRemoteData } from '../lib/cache.js';
import { PRESENTATION_PATH } from '../lib/path.js';
import { FlexContainer } from '../styled/index.js';
import { Article, Header, Main, Section } from '../sectioning/index.js';
import { Error } from '../components/index.js';

function Courses() {
  const query = '{getCourses}';
  const { data, error } = useRemoteData(query);
  if (error) return <Error error={error} />;
  if (!data) return null;

  const children = [];

  data.getCourses.forEach((course) => {
    const href = `#${PRESENTATION_PATH}/${course.toString()}`;
    const child = (
      <FlexContainer key={makeid()} style={{ margin: '0.3em 0 0 2em', fontSize: '1.5em', letterSpacing: '2px' }}>
        <a href={href}>{course.toString()}</a>
      </FlexContainer>
    );
    children.push(child);
  });

  const gridTemplateAreas = `
  'header'
  'main'
  `;
  return (
    <Article>
      <Section style={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto', gridTemplateAreas }}>
        <Header>{t('courses:list')}</Header>
        <Main style={{ marginTop: '1em' }}>{children}</Main>
      </Section>
    </Article>
  );
}

export default Courses;
