import React from 'react';
import PropTypes from 'prop-types';
import { request } from '../lib/network.js';
import { GridContainer, Div, Button, Input } from '../styled/index.js';
import { Article } from '../sectioning/index.js';

function ChangePassword({ callback, name }) {
  let password;

  function inputPassword(event) {
    password = event.target.value;
  }

  async function submitNewPassword() {
    const query = `{changePassword(name:"${name}" password:"${password}")}`;
    const { data, error } = await request(query);
    if (error) callback(error);
    if (data) {
      if (data.changePassword) {
        callback('Change Password Success', true);
      } else {
        callback('Change Password Failure');
      }
    }
  }

  async function cancel() {
    callback('');
  }

  return (
    <Article>
      <Div>Change Password For </Div>
      <Div>{name}</Div>
      <Div textAlign="center" marginTop="8em">
        <Input onChange={inputPassword} fontSize="1.5em" placeholder="New Password" />
        <GridContainer gridTemplateColumns="1fr 1fr" marginTop="2em">
          <Button onClick={submitNewPassword} marginLeft="auto" marginRight="4em">
            Submit
          </Button>
          <Button onClick={cancel}>Cancel</Button>
        </GridContainer>
      </Div>
    </Article>
  );
}

ChangePassword.propTypes = {
  callback: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default ChangePassword;
