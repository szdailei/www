import React, { useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../lib/network.js';
import { Button, Div } from '../styled/index.js';
import { Article } from '../sectioning/index.js';
import { Message, SignInInput } from '../components/index.js';

function ChangePassword() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const messageRef = useRef();

  const submitNewPassword = useCallback(async () => {
    const query = `{changePassword(name:"${userNameRef.current.value}" password:"${passwordRef.current.value}")}`;
    const { data, error } = await request(query);

    let msg;
    if (data && data.changePassword) {
      msg = 'Change Password Success';
    } else if (error) {
      msg = error.response.errors[0].message;
    } else {
      msg = 'Change Password Failure';
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
