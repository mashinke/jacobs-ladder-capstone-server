# API Communication

## Game start
- POST /game `{ ruleset: {...} }`
- GET /game `{ game: {....}, roll_card: {...}, skip_card: {...} }`

## Game middle
- GET /game `{ game_state: {....}, roll_card: {...}, skip_card: {...} }`
- POST /turn `{ roll_card: {...} || skip_card: {...}, time_elapsed: '...' }`

## Last turn
- GET /game `{ game: {...}, final_card: {...}, last_turn: true }`
- POST /turn `{ final_card: {...}, time_elapsed: '...' }`

## Game end
- GET /game `{ game: { ended: true, ... } }`

## Resources
- POST /game
- POST /turn
- GET /game