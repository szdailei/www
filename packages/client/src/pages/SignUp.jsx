import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import request from '../lib/client';
import { FlexContainer, Button } from '../styled';
import { SignInInput } from '../components';

function SignUp({ onSuccessOfCreateUser, messageRef }) {
  const userNameRef = useRef();
  const passwordRef = useRef();

  const createUser = useCallback(async () => {
    const userName = userNameRef.current.value;
    const password = passwordRef.current.value;
    const query = `{createUser(name:"${userName}" password:"${password}")}`;
    const { data, error } = await request(query);

    let msg;
    if (data && data.createUser) {
      msg = `Sign Up ${userName} Success`;
    } else if (error) {
      msg = error.toString();
    } else {
      msg = `Sign Up ${userName} Failure`;
    }

    messageRef.current.setChildren(msg);
    if (onSuccessOfCreateUser && data && data.createUser) onSuccessOfCreateUser();
  }, [messageRef, onSuccessOfCreateUser]);

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
  onSuccessOfCreateUser: PropTypes.func,
};

SignUp.defaultProps = {
  onSuccessOfCreateUser: null,
};

export default SignUp;
