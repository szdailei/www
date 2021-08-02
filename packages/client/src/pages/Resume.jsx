import React from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid.js';
import { getDownloadFileUrl, request, useRemoteData } from '../lib/network.js';
import { GridContainer, StyledContainer, Abbr, Div, Span } from '../styled/index.js';
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
      <StyledContainer key={makeid()} marginLeft="2em">
        <Div fontSize="20px" fontWeight="600">
          {experience.company}
        </Div>
        <GridContainer gridTemplateColumns="2fr 3fr" marginLeft="2.2em">
          <Div>{experience.timePeriod}</Div>
          <Div>{experience.position}</Div>
        </GridContainer>
        <Div textIndent="2.2em">{experience.description}</Div>
      </StyledContainer>
    );
    children.push(child);
  });

  return (
    <StyledContainer marginTop="8px">
      <Div fontSize="22px" fontWeight="800">
        工作经历
      </Div>
      {children}
    </StyledContainer>
  );
}

Experiences.propTypes = {
  experiences: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Educations({ educations }) {
  const children = [];
  educations.forEach((education) => {
    const child = (
      <StyledContainer key={makeid()} marginLeft="2em">
        <Div fontSize="20px" fontWeight="600">
          {education.school}
        </Div>
        <GridContainer gridTemplateColumns="4fr 1fr 5fr" marginLeft="2.2em">
          <Div>{education.timePeriod}</Div>
          <Div>{education.degree}</Div>
          <Div>{education.description}</Div>
        </GridContainer>
      </StyledContainer>
    );
    children.push(child);
  });

  return (
    <StyledContainer marginTop="8px">
      <Div fontSize="22px" fontWeight="800">
        教育经历
      </Div>
      {children}
    </StyledContainer>
  );
}

Educations.propTypes = {
  educations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Skills({ skills }) {
  const children = [];
  skills.forEach((skill) => {
    const child = (
      <Span key={makeid()} marginLeft="2.2em">
        {skill.name}
      </Span>
    );
    children.push(child);
  });

  return (
    <StyledContainer marginTop="8px">
      <Div fontSize="22px" fontWeight="800" textIndent="0">
        技能专长
      </Div>
      {children}
    </StyledContainer>
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
    <Article margin="56px 48px 48px 64px">
      <Section gridTemplateColumns="1fr" gridTemplateRows="auto auto" gridTemplateAreas={gridTemplateAreas}>
        <Header fontWeight="500">
          <GridContainer gridTemplateColumns="2fr 2fr 3fr">
            <Abbr
              onClick={gotoPdfUrl}
              title="GotoPdfUrl"
              cursor="pointer"
              fontSize="2em"
              letterSpacing="0.5em"
              marginLeft="0"
            >
              {resume.name}
            </Abbr>
            <Div fontSize="1.2em">{resume.position}</Div>
            <StyledContainer fontSize="20px">
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
            </StyledContainer>
          </GridContainer>
        </Header>
        <Main>
          <Div textIndent="2.21em">{resume.about}</Div>
          <Experiences experiences={resume.experiences} />
          <Educations educations={resume.educations} />
          <Skills marginLeft="2.2em" skills={resume.skills} />
        </Main>
      </Section>
    </Article>
  );
}

export default Resume;
