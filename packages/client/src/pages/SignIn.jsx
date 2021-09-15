import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../lib/client.js';
import { storageWebToken } from '../lib/security.js';
import { Button, Div } from '../styled/index.js';
import { Article } from '../sectioning/index.js';
import { Message, SignInInput } from '../components/index.js';

function SignIn() {
  const navigate = useNavigate();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const messageRef = useRef();

  const signIn = useCallback(async () => {
    const query = `{getWebToken(name: "${userNameRef.current.value}" password: "${passwordRef.current.value}")}`;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error } = await request(query);
    if (error) messageRef.current.setChildren(error.toString());

    if (data && data.getWebToken) {
      storageWebToken(data.getWebToken);
      navigate('/');
    }
  }, [navigate]);

  const gotoRoot = useCallback(async () => {
    navigate('/');
  }, [navigate]);

  return (
    <Article>
      <SignInInput userNameRef={userNameRef} passwordRef={passwordRef} />
      <Div style={{ textAlign: 'center', marginTop: '2em' }}>
        <Button onClick={signIn} style={{ display: 'inline-block', marginRight: '4em' }}>
          Sign In
        </Button>
        <Button onClick={gotoRoot} style={{ display: 'inline-block' }}>
          Cancel
        </Button>
      </Div>
      <Message style={{ marginTop: '2em' }} ref={messageRef} />
    </Article>
  );
}

export default SignIn;
