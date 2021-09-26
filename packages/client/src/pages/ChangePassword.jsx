import React, { useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import request from '../lib/client';
import { Button, Div } from '../styled';
import { Article } from '../sectioning';
import { Message, SignInInput } from '../components';

function ChangePassword() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const messageRef = useRef();

  const submitNewPassword = useCallback(async () => {
    const name = userNameRef.current.value;
    const password = passwordRef.current.value;
    const query = `{changePassword(name:"${name}" password:"${password}")}`;
    const { data, error } = await request(query);

    let msg;
    if (data && data.changePassword) {
      msg = `Change ${name} Password Success`;
    } else if (error) {
      msg = error.toString();
    } else {
      msg = `Change ${name} Password Failure`;
    }
    messageRef.current.setChildren(msg);
  }, []);

  const gotoRoot = useCallback(async () => {
    navigate('/');
  }, [navigate]);

  return (
    <Article style={{ textAlign: 'center' }}>
      <SignInInput userNameRef={userNameRef} passwordRef={passwordRef} userName={userName} />
      <Div style={{ textAlign: 'center', marginTop: '2em' }}>
        <Button onClick={submitNewPassword} style={{ display: 'inline-block', marginRight: '4em' }}>
          Change Password
        </Button>
        <Button onClick={gotoRoot} style={{ display: 'inline-block' }}>
          Cancel
        </Button>
      </Div>
      <Message style={{ marginTop: '2em' }} ref={messageRef} />
    </Article>
  );
}

export default ChangePassword;
