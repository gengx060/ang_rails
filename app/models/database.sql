use geng;
-- auto-generated definition
CREATE TABLE users
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  created_at DATETIME     NOT NULL,
  updated_at DATETIME     NULL,
  firstname  VARCHAR(40)  NOT NULL,
  lastname   VARCHAR(40)  NULL,
  email      VARCHAR(100) NULL,
  password   VARCHAR(512) NULL,
  salt       VARCHAR(10)  NULL,
  org_id     INT          NULL,
  is_deleted BIT          NULL,
  `group`    VARCHAR(10)  NULL,
  CONSTRAINT users_email_constraint
  UNIQUE (email),
  CONSTRAINT users_users_id_fk
  FOREIGN KEY (org_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
CREATE INDEX users_firstname_lastname_index
  ON users (firstname, lastname);
CREATE INDEX users_users_id_fk
  ON users (org_id);

-- auto-generated definition
CREATE TABLE user_addresses
(
  id       INT AUTO_INCREMENT
    PRIMARY KEY,
  address2 VARCHAR(50) NULL,
  address1 VARCHAR(50) NULL,
  city     VARCHAR(30) NULL,
  state    VARCHAR(30) NULL,
  country  VARCHAR(30) NULL,
  user_id  INT         NULL,
  type     VARCHAR(10) NULL,
  zipcode  VARCHAR(20) NULL,
  CONSTRAINT user_address_users_id_fk
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
CREATE INDEX user_address_users_id_fk
  ON user_addresses (user_id);

-- auto-generated definition
CREATE TABLE user_phones
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  area       VARCHAR(10) NULL,
  number     VARCHAR(10) NULL,
  ext        VARCHAR(10) NULL,
  type       VARCHAR(10) NULL,
  user_id    INT         NULL,
  is_deleted BIT         NULL,
  CONSTRAINT user_phones_users_id_fk
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
CREATE INDEX user_phones_users_id_fk
  ON user_phones (user_id);
