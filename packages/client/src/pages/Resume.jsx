import React from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid';
import { useRemoteData } from '../lib/cache';
import { GridContainer, FlexContainer, Div, Span } from '../styled';
import { Article, Section } from '../sectioning';
import { Error } from '../components';

const levelOneFontSize = '1.2em';
const levelOneFontWeight = '600';
const levelOneStyle = { fontSize: levelOneFontSize, fontWeight: levelOneFontWeight };

const levelTwoFontSize = '1.2em';
const levelTwoFontWeight = '600';
const levelTwoStyle = { fontSize: levelTwoFontSize, fontWeight: levelTwoFontWeight };

function Experiences({ experiences }) {
  const children = [];
  experiences.forEach((experience) => {
    const child = (
      <FlexContainer key={makeid()} style={{ marginLeft: '2em' }}>
        <Div style={{ ...levelTwoStyle }}>{experience.company}</Div>
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
      <Div style={{ ...levelOneStyle }}>工作经历</Div>
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
        <Div style={{ ...levelTwoStyle }}>{education.school}</Div>
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
      <Div style={{ ...levelOneStyle }}>教育经历</Div>
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
      <Div style={{ ...levelOneStyle, textIndent: '0' }}>技能专长</Div>
      {children}
    </FlexContainer>
  );
}

Skills.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Resume() {
  const query = '{getResume,getResumeImage,getResumeWeChatImage}';
  const { data, error } = useRemoteData(query);
  if (error) return <Error error={error} />;
  if (!data) return null;

  const resume = JSON.parse(data.getResume);
  return (
    <Article style={{ margin: '56px 48px 48px 64px' }}>
      <GridContainer style={{ gridTemplateColumns: '1fr auto', alignItems: 'center', marginBottom: '2em' }}>
        <Section style={{ marginRight: '2em' }}>
          <GridContainer style={{ gridTemplateColumns: 'auto 1fr auto', alignItems: 'center' }}>
            <Div style={{ lineHeight: '2.5em', marginLeft: '2.21em' }}>
              <Div
                style={{ fontSize: '2em', letterSpacing: '0.5em', fontWeight: levelOneFontWeight, textAlign: 'center' }}
              >
                {resume.name}
              </Div>
              <Div style={{ fontSize: '1em', fontWeight: levelOneFontWeight, textAlign: 'center' }}>
                {resume.position}
              </Div>
            </Div>
            <Div style={{ textAlign: 'right', lineHeight: '1.7em' }}>
              <Div>📞{resume.contact.phone}</Div>
              <Div>📧{resume.contact.email}</Div>
            </Div>
            <img src={`data:image/jpeg;base64,${data.getResumeWeChatImage}`} alt="" />
          </GridContainer>
          <Div style={{ marginTop: '0.5em', textIndent: '2.21em' }}>{resume.about}</Div>
        </Section>
        <img src={`data:image/jpeg;base64,${data.getResumeImage}`} alt="" />
      </GridContainer>
      <Experiences experiences={resume.experiences} />
      <Educations educations={resume.educations} />
      <Skills style={{ marginLeft: '2.2em' }} skills={resume.skills} />
    </Article>
  );
}

export default Resume;
