# Jacob's Ladder - RESTful API server

## About the Game
My daughter and I created the rules for this game in 2019 as an experiment in language learning.

Jacob's Ladder is inspired by racing board games such as Snakes and Ladders and
Candyland, and originally conceived as a board game. This repository is for the
RESTFul API server. To learn more about the game, please visit the 
[client repository on GitHub](https://github.com/mashinke/jacobs-ladder-client).


## Data Schema

### Gameplay

### Game
- max_hints: `int` or `null`
- stage_size: `int`
- total_stages: `int`
- ended: `bool`

### Turn
- roll: `int` or `null`
- skip: `bool`
- time_elapsed: `time`
- use_hint: `bool`
- id_game: `int:fk`
- id_question: `int:fk`

### Card
- image_url: `text`
- alt_text: `text`

### Question
- question_text: `text`
- difficulty: `int`
- type: `enum`
- id_answer: `int:fk
- id_card: `int:fk`

### Answer
- answer_text: `text`
- id_card: `int:fk`

## API Communication

### Game start
- POST /game `{ ruleset: {...} }`
- GET /game `{ game: {....}, roll_card: {...}, skip_card: {...} }`

### Game middle
- GET /game `{ game_state: {....}, roll_card: {...}, skip_card: {...} }`
- POST /turn `{ roll_card: {...} || skip_card: {...}, time_elapsed: '...' }`

### Last turn
- GET /game `{ game: {...}, final_card: {...}, last_turn: true }`
- POST /turn `{ final_card: {...}, time_elapsed: '...' }`

### Game end
- GET /game `{ game: { ended: true, ... } }`

### Resources
- POST /game
- POST /turn
- GET /game
