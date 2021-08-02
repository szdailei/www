import React from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home.jsx';
import gitLog from '../reports/git-log.json';

function App() {
  const users = [];
  const ids = [];
  gitLog.data.forEach((commit) => {
    const id = commit.committerEmail;
    const index = ids.indexOf(id);
    if (index === -1) {
      ids.push(id);
      users.push([commit]);
    } else {
      users[index].push(commit);
    }
  });

  return <Home repo={gitLog.repo} locale={gitLog.locale} users={users} />;
}

ReactDOM.render(<App />, document.getElementById('root'));
