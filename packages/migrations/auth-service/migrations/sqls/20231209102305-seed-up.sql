SET search_path TO main,public;

/* Inserting auth clients */
INSERT INTO auth_clients (client_id, client_secret, redirect_url, secret)
values ('test_client_id', 'test_client_secret', 'http://localhost:5173/home', 'secret');

-- Inserting roles
INSERT INTO roles (name, permissions, role_type)
values ('Admin', '{ViewMessage,CreateMessage,UpdateMessage,DeleteMessage,CreateMessageRecipient,ViewMessageRecipient,UpdateMessageRecipient,DeleteMessageRecipient,ViewNotification,CreateNotification,UpdateNotification,DeleteNotification,CanGetNotificationAccess,ViewChannel,CreateChannel,UpdateChannel,DeleteChannel}' , 0);
  
-- Inserting tenants
INSERT INTO tenants (name, status, key)
values ('Master', 1, 'master');

-- Inserting Admin User
INSERT INTO users (first_name, last_name, username, email, default_tenant_id)
SELECT 'Sahil', 'Jassal', 'sahil-sf@eg.com', 'sahil-sf@eg.com', id FROM tenants
WHERE key = 'master';

INSERT INTO user_tenants (user_id, tenant_id, status, role_id)
SELECT (SELECT id FROM users
    WHERE username = 'sahil-sf@eg.com'), (SELECT id FROM tenants
    WHERE key = 'master'), 1, id FROM roles
WHERE role_type = 0;

INSERT INTO user_credentials (user_id, auth_provider, password)
SELECT id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG' FROM users
WHERE username = 'sahil-sf@eg.com';
UPDATE users SET auth_client_ids = ARRAY[(SELECT id FROM auth_clients WHERE client_id = 'test_client_id')::INTEGER];
