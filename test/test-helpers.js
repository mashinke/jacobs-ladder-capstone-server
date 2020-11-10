module.exports = {
  createTestGames() {
    return [
      {
        id: 1,
        stage_size: 18,
        total_stages: 6,
        hint_limit: true,
        max_hints: 18,
        ended: false,
        id_user: 1
      }
    ];
  },
  createTestUsers() {
    return [
      {
        id: 1,
        email: 'testone@example.net'
      },
      {
        id: 2,
        email: 'testtwo@example.net'
      }
    ];
  }
};