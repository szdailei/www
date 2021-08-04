import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer, GridContainer, Div, Button, Input } from '../styled/index.js';
import { request } from '../lib/network.js';

function SignUp({ callback }) {
  let username;
  let password;

  function inputUsername(event) {
    username = event.target.value;
  }

  function inputPassword(event) {
    password = event.target.value;
  }

  async function submit() {
    const query = `{createUser(name: "${username}" password: "${password}")}`;
    const { data, error } = await request(query);

    if (error) callback(error);
    if (data) {
      if (data.createUser) {
        callback('Sign Up Success', true);
      } else {
        callback('Sign Up Failure');
      }
    }
  }

  return (
    <FlexContainer>
      <GridContainer style={{ gridTemplateColumns: '3fr 3fr 3fr', marginTop: '2em' }}>
        <Div style={{ textAlign: 'right', marginRight: '1em', fontSize: '1.5em' }}>Username</Div>
        <Input onChange={inputUsername} style={{ fontSize: '1.5em' }} placeholder="Username" />
      </GridContainer>
      <GridContainer style={{ gridTemplateColumns: '3fr 3fr 3fr', marginTop: '2em' }}>
        <Div style={{ textAlign: 'right', marginRight: '1em', fontSize: '1.5em' }}>Password</Div>
        <Input onChange={inputPassword} style={{ fontSize: '1.5em' }} placeholder="Password" />
      </GridContainer>
      <Button onClick={submit} style={{ marginTop: '2em' }}>
        Sign Up
      </Button>
    </FlexContainer>
  );
}

SignUp.propTypes = {
  callback: PropTypes.func.isRequired,
};

export default SignUp;
