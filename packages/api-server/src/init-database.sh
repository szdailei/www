psql -d web -U dbuser -c "CREATE TABLE all_user (id serial primary key,name varchar(32),password varchar(64), salt varchar(32) )"
psql -d web -U dbuser -c "CREATE TABLE role (id integer primary key, name varchar(32), permission_ids integer ARRAY)"
psql -d web -U dbuser -c "CREATE TABLE user_role (id integer primary key,user_name varchar(32),role_id integer, role_name varchar(32))"
psql -d web -U dbuser -c "CREATE TABLE permission (id integer primary key, function_name varchar(64), description varchar(256))"
psql -d web -U dbuser -c "INSERT INTO role (id, name, permission_ids) VALUES(1, 'super','{1,2}')"
psql -d web -U dbuser -c "INSERT INTO role (id, name, permission_ids) VALUES(2, 'normal','{2}')"
psql -d web -U dbuser -c "INSERT INTO role (id, name, permission_ids) VALUES(3, 'guest','{3}')"
psql -d web -U dbuser -c "INSERT INTO user_role (id, user_name, role_id, role_name) VALUES(1,'admin', 1,'super')"
psql -d web -U dbuser -c "INSERT INTO permission (id, function_name) VALUES(1,'test')"


psql -d web -U dbuser -c "UPDATE role SET name = 'super' WHERE id=1"


