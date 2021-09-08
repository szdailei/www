import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { request } from '../lib/network.js';
import { FlexContainer, Button } from '../styled/index.js';
import { SignInInput } from '../components/index.js';

function SignUp({ onSuccess, messageRef }) {
  const userNameRef = useRef();
  const passwordRef = useRef();

  const createUser = useCallback(async () => {
    const query = `{createUser(name: "${userNameRef.current.value}" password: "${passwordRef.current.value}")}`;
    const { data, error } = await request(query);

    let msg;
    if (data && data.createUser) {
      msg = 'Sign Up Success';
    } else if (error) {
      msg = error.response.errors[0].message;
    } else {
      msg = 'Sign Up Failure';
    }

    messageRef.current.setChildren(msg);
    if (onSuccess && data && data.createUser) onSuccess();
  }, [messageRef, onSuccess]);

  return (
    <FlexContainer>
      <SignInInput userNameRef={userNameRef} passwordRef={passwordRef} />
      <Button onClick={createUser} style={{ margin: 'auto', marginTop: '2em' }}>
        Sign Up
      </Button>
    </FlexContainer>
  );
}

SignUp.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  messageRef: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
};

SignUp.defaultProps = {
  onSuccess: null,
};

export default SignUp;
