# Jacob's Ladder - RESTful API server

## About the Game
My daughter and I created the rules for this game in 2019 as an experiment in language learning.

Jacob's Ladder is inspired by racing board games such as Snakes and Ladders and
Candyland, and originally conceived as a board game. This repository is for the
RESTFul API server. To learn more about the game, please visit the 
[client repository on GitHub](https://github.com/mashinke/jacobs-ladder-client).

## Technology
This project was developed with __Node.js__ + __Express.js__ + __Postgresql__ 
on the back end, and __React__ on the front end. The server is deployed on 
[Heroku](https://www.heroku.com/), and the client on [Vercel](https://vercel.com/).

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

| key      |              Value |
| :------- | -----------------: |
| email    | string, _required_ |
| password | string, _required_ |

#### Example response:

```
HTTP STATUS 200 OK
{
  "token": 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwaXJlc0luIjoiN2QiLCJpYX
    QiOjE2MDUyMjA3MzUsInN1YiI6InRlc3RAZXhhbXBsZS5uZXQifQ.OAzmBM8JUOx3dxnyl1ledSp
    5sSIekTvsUJeC5hhSJus"
}
```

### GET /api/game

#### Provides the game state objects to the client

#### Example response:

```
HTTP STATUS 200 OK
{
    "gameSettings": {
        "gameId": 12,
        "maxHints": 18,
        "hintLimit": true,
        "totalStages": 3,
        "stageSize": 18,
        "lastTurn": false,
        "ended": false
    },
    "gameState": {
        "turnNumber": 2,
        "hintsUsed": 0,
        "position": 7,
        "successfulRolls": 1,
        "totalRolls": 1,
        "successfulSkips": 0,
        "totalSkips": 0
    },
    "rollCard": {
        "id": 22,
        "altText": "פּ",
        "questionText": "What is the name of this letter?",
        "answers": [
            "tes",
            "pey",
            "sin",
            "samekh"
        ]
    },
    "skipCard": {
        "id": 44,
        "altText": "בָּרוּךְ",
        "questionText": "What does this word mean?",
        "answers": [
            "the",
            "one",
            "our God",
            "blessed"
        ]
    }
}
```

### POST /api/game

#### Creates a new game
_Requires a request body._

| key         |                                    Value |
| :---------- | ---------------------------------------: |
| totalStages |                      integer, _required_ |
| hintLimit   |                      boolean, _required_ |
| maxHints    | boolean, _required if hintLimit is true_ |

### Example response:

```
HTTP 200 OK
```
### GET /api/score

#### Provides an array of game scores

#### Example response:

```
HTTP STATUS 200 OK
[
    {
        "ended": true,
        "stageSize": 18,
        "totalStages": 3,
        "hintsUsed": 0,
        "maxHints": 18,
        "hintLimit": true,
        "successfulRolls": 2,
        "totalRolls": 3,
        "successfulSkips": 3,
        "totalSkips": 4,
        "position": 58,
        "turnNumber": 7
    }
]
```

### POST /api/turn

#### Creates a new game turn
_Requires a request body._

| key      |                                     Value |
| :------- | ----------------------------------------: |
| cardId   |                       integer, _required_ |
| answer   | string, _required unless useHint is true_ |
| skipCard |                                   boolean |
| useHint  |    boolean, _useless if skipCard is true_ |
#### Example response:
```
HTTP STATUS 200 OK
{
  "roll": 7,
  "correctAnswer": "nun",
  "useHint": false,
  "lastTurn": false,
  "skipSuccess": false,
  "gameWon": false
}
```

### POST /api/user

#### Creates a new user
_Requires a request body._

| key      |              Value |
| :------- | -----------------: |
| email    | string, _required_ |
| password | string, _required_ |

#### Example response:

```
HTTP STATUS 200 OK
```