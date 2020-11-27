# Jacob's Ladder - RESTful API server

## About the Game
My daughter and I created the rules for this game in 2019 as an experiment in language learning.

Jacob's Ladder is inspired by racing board games such as Snakes and Ladders and
Candyland, and originally conceived as a board game. This repository is for the
RESTFul API server. To learn more about the game, please visit the 
[client repository on GitHub](https://github.com/mashinke/jacobs-ladder-client).


## Data Schema

### game
- id: `int`
- active: `bool`
- stage_size: `int`
- total_stages: `int`
- hint_limit: `bool`
- max_hints: `int`
- ended: `bool`
- last_turn: `bool`
- id_user: `int:fk`

### turn
- id: `int`
- roll: `int` or `null`
- skip_attempt: `bool`
- skip_success: `bool`
- use_hint: `bool`
- id_game: `int:fk`
- id_card: `int:fk`

### card
- id: `int`
- difficulty: `int`
- id_question: `int:fk`
- id_answer: `int:fk`

### question
- id: `int`
- question_text: `text`

### answer
- id: `int`
- answer_text: `text`

### app_user
- id: `int`
- email: `text`
- password: `text` (encrypted)

## API Documentation

### POST /api/auth

#### Authenticates login and provides JSON Web Token.
_Requires a request body._

| key | Value |
| :--- | -----: |
| email | _string, required_ |
| password | _string, required_ |

#### Example response:

```
HTTP STATUS 200 OK
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwaXJlc0luIjoiN2QiLCJpYXQiOjE2MDUyMjA3MzUsInN1YiI6InRlc3RAZXhhbXBsZS5uZXQifQ.OAzmBM8JUOx3dxnyl1ledSp5sSIekTvsUJeC5hhSJus"
  }
```


Status 200

### /api/game

### /api/score

### /api/turn

### /api/user