CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
 M_id smallint auto_increment,
 username varchar(15),
 room varchar(25),
 body text,
 createdAt timestamp
 PRIMARY KEY(M_id),
 FOREIGN KEY(username) references users(username)
);

CREATE TABLE users (
  username varchar(15),
  pass varchar(255),
  PRIMARY KEY(username),
  UNIQUE (username)
);

CREATE TABLE userfriends (
  F_id smallint auto_increment,
  username1 varchar(15),
  username2 varchar(15)
  PRIMARY KEY(F_id)
  FOREIGN KEY(username1) references users(username)
  FOREIGN KEY(username2) references users(username)
);

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
