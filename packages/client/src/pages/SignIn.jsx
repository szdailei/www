import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../lib/network.js';
import { storageWebToken } from '../lib/security.js';
import { FlexContainer, GridContainer, Div, Button, Input } from '../styled/index.js';
import { Article } from '../sectioning/index.js';

function SignIn() {
  const navigate = useNavigate();
  const [serverResponse, setServerResponse] = useState('');
  let username;
  let password;

  function inputUsername(event) {
    username = event.target.value;
  }

  function inputPassword(event) {
    password = event.target.value;
  }

  async function signIn() {
    const query = `{getWebToken(name: "${username}" password: "${password}")}`;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error } = await request(query);
    if (error) setServerResponse('Login failure');
    if (!data) return;

    if (data.getWebToken) {
      storageWebToken(data.getWebToken);
      navigate('/');
    }
  }

  async function cancel() {
    navigate('/');
  }

  return (
    <Article>
      <FlexContainer>
        <Div textAlign="center">{serverResponse}</Div>
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
        <GridContainer gridTemplateColumns="1fr 1fr" marginTop="2em">
          <Button onClick={signIn} marginLeft="auto" marginRight="4em">
            Sign In
          </Button>
          <Button onClick={cancel}>Cancel</Button>
        </GridContainer>
      </FlexContainer>
    </Article>
  );
}

export default SignIn;
