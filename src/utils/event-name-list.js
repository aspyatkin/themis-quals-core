import constants from './constants'

class EventNameList {
  constructor () {
    this.eventNames = {}
    this.fillList()
  }

  fillList () {
    this.eventNames[constants.EVENT_CREATE_CATEGORY] = 'createCategory'
    this.eventNames[constants.EVENT_UPDATE_CATEGORY] = 'updateCategory'
    this.eventNames[constants.EVENT_REMOVE_CATEGORY] = 'removeCategory'

    this.eventNames[constants.EVENT_UPDATE_CONTEST] = 'updateContest'

    this.eventNames[constants.EVENT_UPDATE_TEAM_SCORE] = 'updateTeamScore'

    this.eventNames[constants.EVENT_CREATE_POST] = 'createPost'
    this.eventNames[constants.EVENT_UPDATE_POST] = 'updatePost'
    this.eventNames[constants.EVENT_REMOVE_POST] = 'removePost'

    this.eventNames[constants.EVENT_CREATE_TASK] = 'createTask'
    this.eventNames[constants.EVENT_UPDATE_TASK] = 'updateTask'
    this.eventNames[constants.EVENT_OPEN_TASK] = 'openTask'
    this.eventNames[constants.EVENT_CLOSE_TASK] = 'closeTask'

    this.eventNames[constants.EVENT_CREATE_TASK_CATEGORY] = 'createTaskCategory'
    this.eventNames[constants.EVENT_REMOVE_TASK_CATEGORY] = 'removeTaskCategory'
    this.eventNames[constants.EVENT_REVEAL_TASK_CATEGORY] = 'revealTaskCategory'

    this.eventNames[constants.EVENT_CREATE_TEAM_TASK_HIT] = 'createTeamTaskHit'
    this.eventNames[constants.EVENT_CREATE_TEAM_TASK_HIT_ATTEMPT] = 'createTeamTaskHitAttempt'

    this.eventNames[constants.EVENT_CREATE_TEAM] = 'createTeam'
    this.eventNames[constants.EVENT_UPDATE_TEAM_EMAIL] = 'updateTeamEmail'
    this.eventNames[constants.EVENT_UPDATE_TEAM_PROFILE] = 'updateTeamProfile'
    this.eventNames[constants.EVENT_UPDATE_TEAM_PASSWORD] = 'updateTeamPassword'
    this.eventNames[constants.EVENT_QUALIFY_TEAM] = 'qualifyTeam'
    this.eventNames[constants.EVENT_DISQUALIFY_TEAM] = 'disqualifyTeam'
    this.eventNames[constants.EVENT_LOGIN_TEAM] = 'loginTeam'
    this.eventNames[constants.EVENT_LOGOUT_TEAM] = 'logoutTeam'
  }

  getName (type) {
    return this.eventNames[type]
  }
}

export default new EventNameList()