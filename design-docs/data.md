# Data

## Gameplay

### Game
- max_hints: `int` or `null`
- stage_size: `int`
- no_of_stages: `int`
- ended: `bool`

### Turn
- roll: `int` or `null`
- time_elapsed: `time`
- use_hint: `bool`
- id_game: `int:fk`
- id_question: `int:fk`

### Card
- image: `blob``
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

### Diagram
![data diagram](data-diagram.png)