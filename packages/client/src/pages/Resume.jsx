import React from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid.js';
import { getDownloadFileUrl, request, useRemoteData } from '../lib/network.js';
import { GridContainer, FlexContainer, Abbr, Div, Span } from '../styled/index.js';
import { Article, Header, Main, Section } from '../sectioning/index.js';
import { Error } from '../components/index.js';

async function gotoPdfUrl() {
  const query = `{pdf(url:"${window.location.href}")}`;
  const { data, error } = await request(query);
  // eslint-disable-next-line no-console
  if (error) console.error(error);
  if (data) {
    const downloadUrl = getDownloadFileUrl(data.pdf);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.rel = 'noopener noreferrer';
    anchor.target = '_blank';
    anchor.click();
  }
}

function Experiences({ experiences }) {
  const children = [];
  experiences.forEach((experience) => {
    const child = (
      <FlexContainer key={makeid()} style={{ marginLeft: '2em' }}>
        <Div style={{ fontSize: '20px', fontWeight: '600' }}>{experience.company}</Div>
        <GridContainer style={{ gridTemplateColumns: '2fr 3fr', marginLeft: '2.2em' }}>
          <Div>{experience.timePeriod}</Div>
          <Div>{experience.position}</Div>
        </GridContainer>
        <Div style={{ textIndent: '2.2em' }}>{experience.description}</Div>
      </FlexContainer>
    );
    children.push(child);
  });

  return (
    <FlexContainer style={{ marginTop: '8px' }}>
      <Div style={{ fontSize: '22px', fontWeight: '800' }}>工作经历</Div>
      {children}
    </FlexContainer>
  );
}

Experiences.propTypes = {
  experiences: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Educations({ educations }) {
  const children = [];
  educations.forEach((education) => {
    const child = (
      <FlexContainer key={makeid()} style={{ marginLeft: '2em' }}>
        <Div style={{ fontSize: '20px', fontWeight: '600' }}>{education.school}</Div>
        <GridContainer style={{ gridTemplateColumns: '4fr 1fr 5fr', marginLeft: '2.2em' }}>
          <Div>{education.timePeriod}</Div>
          <Div>{education.degree}</Div>
          <Div>{education.description}</Div>
        </GridContainer>
      </FlexContainer>
    );
    children.push(child);
  });

  return (
    <FlexContainer style={{ marginTop: '8px' }}>
      <Div style={{ fontSize: '22px', fontWeight: '800' }}>教育经历</Div>
      {children}
    </FlexContainer>
  );
}

Educations.propTypes = {
  educations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Skills({ skills }) {
  const children = [];
  skills.forEach((skill) => {
    const child = (
      <Span key={makeid()} style={{ marginLeft: '2.2em' }}>
        {skill.name}
      </Span>
    );
    children.push(child);
  });

  return (
    <FlexContainer style={{ marginTop: '8px' }}>
      <Div style={{ fontSize: '22px', fontWeight: '800', textIndent: '0' }}>技能专长</Div>
      {children}
    </FlexContainer>
  );
}

Skills.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Resume() {
  const query = '{resume}';
  const { data, error } = useRemoteData(query);
  if (error) return <Error error={error} />;
  if (!data) return null;

  const gridTemplateAreas = `
    'header'
    'main'
    `;

  const resume = JSON.parse(data.resume);
  return (
    <Article style={{ margin: '56px 48px 48px 64px' }}>
      <Section style={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto', gridTemplateAreas }}>
        <Header>
          <GridContainer style={{ gridTemplateColumns: '2fr 2fr 3fr' }}>
            <Abbr
              onClick={gotoPdfUrl}
              title="GotoPdfUrl"
              style={{ cursor: 'pointer', fontSize: '2em', letterSpacing: '0.5em', marginLeft: '0' }}
            >
              {resume.name}
            </Abbr>
            <Div style={{ fontSize: '1.2em' }}>{resume.position}</Div>
            <FlexContainer style={{ fontSize: '20px' }}>
              <Div>
                <span role="img" aria-labelledby="Send a love letter">
                  ✉️
                </span>
                {resume.contact.email}
              </Div>
              <Div>
                <span role="img" aria-labelledby="Call me">
                  ☎
                </span>
                {resume.contact.phone}
              </Div>
            </FlexContainer>
          </GridContainer>
        </Header>
        <Main>
          <Div style={{ textIndent: '2.21em' }}>{resume.about}</Div>
          <Experiences experiences={resume.experiences} />
          <Educations educations={resume.educations} />
          <Skills style={{ marginLeft: '2.2em' }} skills={resume.skills} />
        </Main>
      </Section>
    </Article>
  );
}

export default Resume;
