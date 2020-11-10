create table game (
  id integer primary key generated by default as identity,
  stage_size integer default 18 not null,
  total_stages integer not null,
  hint_limit boolean default false,
  max_hints integer,
  ended boolean default false
);