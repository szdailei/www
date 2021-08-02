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
      <GridContainer gridTemplateColumns="3fr  3fr 3fr" marginTop="2em">
        <Div textAlign="right" marginRight="1em" fontSize="1.5em">
          Username
        </Div>
        <Input onChange={inputUsername} fontSize="1.5em" placeholder="Username" />
      </GridContainer>
      <GridContainer gridTemplateColumns="3fr  3fr 3fr" marginTop="2em">
        <Div textAlign="right" marginRight="1em" fontSize="1.5em">
          Password
        </Div>
        <Input onChange={inputPassword} fontSize="1.5em" placeholder="Password" />
      </GridContainer>
      <Button margin="auto" onClick={submit} marginTop="2em">
        Sign Up
      </Button>
    </FlexContainer>
  );
}

SignUp.propTypes = {
  callback: PropTypes.func.isRequired,
};

export default SignUp;
