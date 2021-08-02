import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useRemoteConfig } from './lib/network';
import { Error, Loading, NotFound } from './components';
import { Home, Admin, Resume, Courses, SignIn } from './pages';
import {
  ROOT_PATH,
  HOME_PATH,
  ADMIN_PATH,
  RESUME_PATH,
  COURSES_PATH,
  SIGN_IN_PATH,
  PRESENTATION_PATH,
} from './lib/path';
import Presentation from './presentation/Presentation';

function App() {
  const { ready, error } = useRemoteConfig();
  if (error) return <Error error={error} />;
  if (!ready) return <Loading />;

  const presentationPath = `${PRESENTATION_PATH}/:course`;
  return (
    <Router>
      <Routes>
        <Route path={ROOT_PATH} element={<Home />} />
        <Route path={HOME_PATH} element={<Home />} />
        <Route path={ADMIN_PATH} element={<Admin />} />
        <Route path={RESUME_PATH} element={<Resume />} />
        <Route path={COURSES_PATH} element={<Courses />} />
        <Route path={SIGN_IN_PATH} element={<SignIn />} />
        <Route path={presentationPath} element={<Presentation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
