import React from 'react';
import makeid from '../lib/makeid';
import { t } from '../i18n/index';
import { useRemoteData } from '../lib/cache';
import { SLIDE_PATH } from '../lib/path';
import { FlexContainer } from '../styled/index';
import { Article, Header, Main, Section } from '../sectioning/index';
import { Error } from '../components/index';

function Courses() {
  const query = '{getCourses}';
  const { data, error } = useRemoteData(query);
  if (error) return <Error error={error} />;
  if (!data) return null;

  const children = [];

  data.getCourses.forEach((course) => {
    const href = `#${SLIDE_PATH}/${course.toString()}`;
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
