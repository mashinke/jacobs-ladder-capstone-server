begin;

truncate 
  turn,
  card,
  question,
  answer,
  game,
  app_user
  restart identity cascade;

insert into app_user (email)
  values (
    'test@example.net'
  );

insert into game (
  stage_size,
  total_stages,
  hint_limit,
  max_hints,
  id_user
  )
  values 
    ( 18, 6, true, 18, 1 );

insert into answer ( answer_text )
  values
    ('alef'),
    ('bes'),
    ('ves'),
    ('gimel'),
    ('dales'),
    ('hey'),
    ('vov'),
    ('zayin'),
    ('khes'),
    ('tes'),
    ('yud'),
    ('kof'),
    ('khof'),
    ('lamed'),
    ('mem'),
    ('shlos mem'),
    ('nun'),
    ('langer nun'),
    ('samekh'),
    ('ayin'),
    ('pey'),
    ('fey'),
    ('langer fey'),
    ('tsadik'),
    ('langer tsadik'),
    ('kuf'),
    ('reysh'),
    ('shin'),
    ('sin'),
    ('tof'),
    ('sof'),
    
    ('bless'),
    ('holds a blessing'),
    ('universe, world, eternity'),
    ('until, eternity'),
    ('more'),
    ('direct object marker'),
    ('the'),
    ('indirect object marker'),
    ('hear!'),
    ('someone who struggles with God'),
    ('our God'),
    ('one'),
    ('blessed'),
    ('name'),
    ('honor'),
    ('kingdom'),
    ('king'),
    ('queen')
    ;
insert into question ( question_text )
  values
    ('What is the name of this letter?'),
    ('What does this word mean?'),
    ('What does this prefix mean?')
    ;
insert into card
  ( alt_text, id_question, id_answer, difficulty )
  values
    ( 'א', 1, 1, 1 ),
    ( 'בּ', 1, 2, 1 ),
    ( 'ב', 1, 2, 1 ),
    ( 'ג', 1, 3, 1 ),
    ( 'ד', 1, 4, 1 ),
    ( 'ה', 1, 5, 1 ),
    ( 'ו', 1, 6, 1 ),
    ( 'ז', 1, 7, 1 ),
    ( 'ח', 1, 8, 1 ),
    ( 'ט', 1, 9, 1 ),
    ( 'י', 1, 10, 1 ),
    ( 'כּ', 1, 11, 1 ),
    ( 'כ', 1, 12, 1 ),
    ( 'ך', 1, 13, 1 ),
    ( 'ל', 1, 14, 1 ),
    ( 'מ', 1, 15, 1 ),
    ( 'ם', 1, 16, 1 ),
    ( 'נ', 1, 17, 1 ),
    ( 'ן', 1, 18, 1 ),
    ( 'ס', 1, 19, 1 ),
    ( 'ע', 1, 20, 1 ),
    ( 'פּ', 1, 21, 1 ),
    ( 'פ', 1, 22, 1 ),
    ( 'ף', 1, 23, 1 ),
    ( 'צ', 1, 24, 1 ),
    ( 'ץ', 1, 25, 1 ),
    ( 'ק', 1, 26, 1 ),
    ( 'ר', 1, 27, 1 ),
    ( 'שׁ', 1, 28, 1 ),
    ( 'שׂ', 1, 29, 1 ),
    ( 'תּ', 1, 30, 1 ),
    ( 'ת', 1, 31, 1 ),
    ( 'בָּרְכוּ', 2, 32, 2 ),
    ( 'מְּבֹרָךְ', 2, 33, 2 ),
    ( 'עוֹלָם', 2, 34, 2 ),
    ( 'עֵד', 2, 35, 2 ),
    ( 'אֶת', 2, 36, 2 ),
    ( 'ה־', 3, 37, 2 ),
    ( 'ל־', 3, 38, 2 ),
    ( 'שְׁמַע', 2, 39, 2 ),
    ( 'יִשְׂרָאֵל', 2, 40, 2 ),
    ( 'אֱלֹהֵינוּ', 2, 41, 2 ),
    ( 'אֶחָד', 2, 42, 2 ),
    ( 'בָּרוּךְ', 2, 43, 2 ),
    ( 'שֵׁם', 2, 44, 2 ),
    ( 'כְּבוד', 2, 45, 2 ),
    ( 'מַלְכוּת', 2, 46, 2 ),
    ( 'מֶלֶךְ', 2, 47, 2 );
insert into turn 
  ( roll, skip_attempt, skip_success, use_hint, id_game, id_card )
  values
    ( 8, false, null, false, 1, 1 ),
    ( null, true, false, false, 1, 5 ),
    ( 3, null, true, true, 1, 3 ),
    ( null, false, null, false, 1, 5 );

commit;