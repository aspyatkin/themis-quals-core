
export default {
  TASK_INITIAL: 1,
  TASK_OPENED: 2,
  TASK_CLOSED: 3,

  CONTEST_INITIAL: 1,
  CONTEST_STARTED: 2,
  CONTEST_PAUSED: 3,
  CONTEST_FINISHED: 4,

  TASK_MIN_VALUE: 10,
  TASK_MAX_VALUE: 1000,
  TASK_MAX_HINTS: 10,
  TASK_MAX_CATEGORIES: 5,
  TASK_MAX_ANSWERS: 15,

  TASK_SUBMIT_LIMIT_TIME: 10,
  TASK_SUBMIT_LIMIT_ATTEMPTS: 3,

  POSTGRES_UNIQUE_CONSTRAINT_VIOLATION: '23505',
  POSTGRES_FOREIGN_KEY_CONSTRAINT_VIOLATION: '23503',

  EVENT_CREATE_CATEGORY: 1,
  EVENT_UPDATE_CATEGORY: 2,
  EVENT_REMOVE_CATEGORY: 3,

  EVENT_UPDATE_CONTEST: 4,

  EVENT_UPDATE_TEAM_SCORE: 5,

  EVENT_CREATE_POST: 6,
  EVENT_UPDATE_POST: 7,
  EVENT_REMOVE_POST: 8,

  EVENT_CREATE_TASK: 9,
  EVENT_UPDATE_TASK: 10,
  EVENT_OPEN_TASK: 11,
  EVENT_CLOSE_TASK: 12,

  EVENT_CREATE_TASK_CATEGORY: 13,
  EVENT_REMOVE_TASK_CATEGORY: 14,
  EVENT_REVEAL_TASK_CATEGORY: 15,

  EVENT_CREATE_TEAM_TASK_HIT: 16,
  EVENT_CREATE_TEAM_TASK_HIT_ATTEMPT: 17,

  EVENT_CREATE_TEAM: 18,
  EVENT_UPDATE_TEAM_EMAIL: 19,
  EVENT_UPDATE_TEAM_PROFILE: 20,
  EVENT_UPDATE_TEAM_PASSWORD: 21,
  EVENT_QUALIFY_TEAM: 22,
  EVENT_DISQUALIFY_TEAM: 23,
  EVENT_LOGIN_TEAM: 24,
  EVENT_LOGOUT_TEAM: 25
}
