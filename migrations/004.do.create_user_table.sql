create table app_user (
  id integer primary key generated by default as identity,
  email text not null
);

alter table game
  add id_user integer references app_user(id) not null;