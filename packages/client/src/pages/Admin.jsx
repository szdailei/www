import React, { useCallback, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import makeid from '../lib/makeid.js';
import { request, useRemoteData } from '../lib/network.js';
import { FlexContainer, GridContainer, Div, Button, Option, Select } from '../styled/index.js';
import { Article } from '../sectioning/index.js';
import { Error, Message } from '../components/index.js';
import SignUp from './SignUp.jsx';

function selectRole() {}

function getPermissionById(id, permissions) {
  for (let i = 0; i < permissions.length; i += 1) {
    const permission = JSON.parse(permissions[i]);
    if (permission.id === id) {
      return permission.function_name;
    }
  }
  return null;
}

function RolePermissions({ roles, permissions }) {
  const rolesChildren = [];
  roles.forEach((stringifiedRole) => {
    const role = JSON.parse(stringifiedRole);

    let functionNames = '';
    role.permission_ids.forEach((id) => {
      const functionName = getPermissionById(id, permissions);
      functionNames += `${functionName},`;
    });

    const child = (
      <FlexContainer key={makeid()} style={{ marginLeft: '2em' }}>
        <GridContainer style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', fontSize: '1em' }}>
          <Div>{role.id}</Div>
          <Div>{role.name}</Div>
          <Div>{functionNames}</Div>
        </GridContainer>
      </FlexContainer>
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

function Users({ messageRef, onSuccessOfDeleteUser, users, roles }) {
  const navigate = useNavigate();
  const options = [<Option key={roles.length + 1} value="Select..." label="Select..." />];
  roles.forEach((role, key) => {
    // eslint-disable-next-line react/no-array-index-key
    const option = <Option key={key} value={JSON.parse(role).name} label={JSON.parse(role).name} />;
    options.push(option);
  });

  const deleteUser = useCallback(
    async (event) => {
      const userName = event.target.getAttribute('value');
      const query = `{deleteUser(name:"${userName}")}`;
      const { data, error } = await request(query);

      let msg;
      if (data && data.deleteUser) {
        msg = `Delete User ${userName} Success`;
      } else if (error) {
        msg = error.toString();
      } else {
        msg = `Delete User ${userName} Failure`;
      }
      messageRef.current.setChildren(msg);
      if (onSuccessOfDeleteUser && data && data.deleteUser) onSuccessOfDeleteUser();
    },
    [messageRef, onSuccessOfDeleteUser]
  );

  const changePassword = useCallback(
    async (event) => {
      navigate(`/change-password/${event.target.getAttribute('value')}`);
    },
    [navigate]
  );

  const usersChildren = [];
  users.forEach((stringifiedUser) => {
    const user = JSON.parse(stringifiedUser);
    const child = (
      <FlexContainer key={makeid()} style={{ marginLeft: '2em' }}>
        <GridContainer style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}>
          <Div>{user.id}</Div>
          <Div>{user.name}</Div>
          <Div>{user.role}</Div>
          <Div>{user.permission}</Div>
          <Select onChange={selectRole} options={options} style={{ fontSize: '1em' }} />
          <Button onClick={changePassword} value={user.name}>
            Change Password
          </Button>
          <Button onClick={deleteUser} value={user.name}>
            Delete User
          </Button>
        </GridContainer>
      </FlexContainer>
    );
    usersChildren.push(child);
  });
  return (
    <Div>
      <h1>User List</h1>
      <FlexContainer style={{ marginLeft: '2em' }}>
        <GridContainer style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}>
          <Div>ID</Div>
          <Div>Name</Div>
          <Div>Role</Div>
          <Div>Permission</Div>
        </GridContainer>
      </FlexContainer>
      {usersChildren}
    </Div>
  );
}

Users.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  messageRef: PropTypes.object.isRequired,
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSuccessOfDeleteUser: PropTypes.func,
};

Users.defaultProps = {
  onSuccessOfDeleteUser: null,
};

const RolesAndUsers = React.forwardRef(({ messageRef }, ref) => {
  const query = '{getUsers getRoles getPermissions}';
  const { data, error, refetch } = useRemoteData(query);

  useImperativeHandle(ref, () => ({
    refetch: () => {
      refetch();
    },
  }));

  if (error) return <Error error={error} />;
  if (!data) return null;

  return (
    <Div ref={ref}>
      <RolePermissions roles={data.getRoles} permissions={data.getPermissions} />
      <Users onSuccessOfDeleteUser={refetch} users={data.getUsers} roles={data.getRoles} messageRef={messageRef} />
    </Div>
  );
});

RolesAndUsers.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  messageRef: PropTypes.object.isRequired,
};

function Admin() {
  const messageRef = useRef();
  const RolesAndUsersRef = useRef();

  function onSuccessOfCreateUser() {
    RolesAndUsersRef.current.refetch();
  }

  return (
    <Article>
      <Message style={{ marginBottom: '2em' }} ref={messageRef} />
      <SignUp messageRef={messageRef} onSuccessOfCreateUser={onSuccessOfCreateUser} />
      <RolesAndUsers messageRef={messageRef} ref={RolesAndUsersRef} />
    </Article>
  );
}

export default Admin;
