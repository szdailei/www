import React, { useState } from 'react';
import PropTypes from 'prop-types';
import makeid from '../lib/makeid.js';
import { request, useRemoteData } from '../lib/network.js';
import { FlexContainer, GridContainer, StyledContainer, Div, Button, Option, Select } from '../styled/index.js';
import { Article } from '../sectioning/index.js';
import { Error } from '../components/index.js';
import ChangePassword from './ChangePassword.jsx';
import SignUp from './SignUp.jsx';

function selectRole() {}

function getPermissionById(permissions, id) {
  for (let i = 0; i < permissions.length; i += 1) {
    if (permissions[i].id === id) {
      return permissions[i].function_name;
    }
  }
  return null;
}

function RolePermissions({ roles, permissions }) {
  const rolesChildren = [];
  roles.forEach((userRole) => {
    const json = JSON.parse(userRole);

    let functionNames = '';
    json.permission_ids.forEach((id) => {
      const functionName = getPermissionById(permissions, id);
      functionNames += `${functionName},`;
    });

    const child = (
      <StyledContainer key={makeid()} style={{ marginLeft: '2em' }}>
        <GridContainer style={{ gridTemplateColumns: '1fr  1fr 1fr 1fr 1fr', fontSize: '1em' }}>
          <Div>{json.id}</Div>
          <Div>{json.name}</Div>
          <Div>{functionNames}</Div>
        </GridContainer>
      </StyledContainer>
    );
    rolesChildren.push(child);
  });
  return (
    <Div>
      <h1>Role Permission List</h1>
      {rolesChildren}
    </Div>
  );
}

RolePermissions.propTypes = {
  roles: PropTypes.PropTypes.arrayOf(PropTypes.string).isRequired,
  permissions: PropTypes.PropTypes.arrayOf(PropTypes.string).isRequired,
};

function Users({ callback, onModal, users, roles }) {
  const options = [<Option key={roles.length + 1} value="Select..." label="Select..." />];
  roles.forEach((role, key) => {
    // eslint-disable-next-line react/no-array-index-key
    const option = <Option key={key} value={JSON.parse(role).name} label={JSON.parse(role).name} />;
    options.push(option);
  });

  async function deleteUser(event) {
    const mutation = `mutation {
    deleteUser(name:"${event.target.getAttribute('value')}")
    }`;
    const { data, error } = await request(mutation);
    if (error) callback(error);
    if (data) {
      if (data.deleteUser) {
        callback('Delete User Success', true);
      } else {
        callback('Delete User Failure');
      }
    }
  }

  function changePassword(event) {
    onModal(event.target.getAttribute('value'));
  }

  const usersChildren = [];
  users.forEach((user) => {
    const json = JSON.parse(user);
    const child = (
      <StyledContainer key={makeid()} style={{ marginLeft: '2em' }}>
        <GridContainer style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}>
          <Div>{json.id}</Div>
          <Div>{json.name}</Div>
          <Div>{json.role}</Div>
          <Div>{json.permission}</Div>
          <Select onChange={selectRole} options={options} style={{ fontSize: '1em' }} />
          <Button onClick={changePassword} value={json.name}>
            Change Password
          </Button>
          <Button onClick={deleteUser} value={json.name}>
            Delete User
          </Button>
        </GridContainer>
      </StyledContainer>
    );
    usersChildren.push(child);
  });
  return (
    <Div>
      <h1>User List</h1>
      <StyledContainer key={makeid()} style={{ marginLeft: '2em' }}>
        <GridContainer style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}>
          <Div>ID</Div>
          <Div>Name</Div>
          <Div>Role</Div>
          <Div>Permission</Div>
        </GridContainer>
      </StyledContainer>
      {usersChildren}
    </Div>
  );
}

Users.propTypes = {
  callback: PropTypes.func.isRequired,
  onModal: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function Status({ msg }) {
  return <Div style={{ textAlign: 'center' }}>{msg}</Div>;
}

Status.propTypes = {
  msg: PropTypes.string.isRequired,
};

function Admin() {
  const [userIsRequiredToChangePassword, setUsername] = useState(null);
  const [message, setMessage] = useState('');
  const query = '{getUsers getUserRoles getRoles getPermissions}';
  const { data, error, reFetch } = useRemoteData(query);

  function callback(msg, isSuccess) {
    if (isSuccess) {
      reFetch();
    }
    setMessage(msg);
  }

  function modalCallback(msg) {
    setUsername(null);
    setMessage(msg);
  }

  if (error) return <Error error={error} />;
  if (!data) return null;

  if (userIsRequiredToChangePassword) {
    return <ChangePassword name={userIsRequiredToChangePassword} callback={modalCallback} />;
  }

  return (
    <Article>
      <FlexContainer>
        <Status msg={message} />
        <SignUp callback={callback} />
        <RolePermissions roles={data.getRoles} permissions={data.getPermissions} />
        <Users callback={callback} onModal={setUsername} users={data.getUsers} roles={data.getRoles} />
      </FlexContainer>
    </Article>
  );
}

export default Admin;
