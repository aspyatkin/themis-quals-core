import Task from '../models/task'

import logger from '../utils/logger'
import { InternalError, DuplicateTaskTitleError, TaskAlreadyOpenedError, TaskClosedError, TaskNotOpenedError, TaskAlreadyClosedError, TaskNotFoundError } from '../utils/errors'
import constants from '../utils/constants'
import publish from '../utils/publisher'

import _ from 'underscore'
import BaseEvent from '../utils/events'

import taskSerializer from '../serializers/task'


class CreateTaskEvent extends BaseEvent {
  constructor(task) {
    super('createTask')
    let taskData = taskSerializer(task, { preview: true })
    this.data.supervisors = taskData
  }
}


class UpdateTaskEvent extends BaseEvent {
  constructor(task) {
    super('updateTask')
    let taskData = taskSerializer(task, { preview: true })
    this.data.supervisors = taskData
    if (!task.isInitial()) {
      this.data.teams = taskData
      this.data.guests = taskData
    }
  }
}


class OpenTaskEvent extends BaseEvent {
  constructor(task) {
    super('openTask')
    let taskData = taskSerializer(task, { preview: true })
    this.data.supervisors = taskData
    this.data.teams = taskData
    this.data.guests = taskData
  }
}


class CloseTaskEvent extends BaseEvent {
  constructor(task) {
    super('closeTask')
    let taskData = taskSerializer(task, { preview: true })
    this.data.supervisors = taskData
    this.data.teams = taskData
    this.data.guests = taskData
  }
}


class TaskController {
  static create(options, callback) {
    Task.find({ title: options.title }).count((err, count) => {
      if (err) {
        logger.error(err)
        callback(new InternalError(), null)
      } else {
        if (count > 0) {
          callback(new DuplicateTaskTitleError(), null)
        } else {
          let now = new Date()
          let task = new Task({
            title: options.title,
            description: options.description,
            createdAt: now,
            updatedAt: now,
            hints: options.hints,
            value: options.value,
            categories: options.categories,
            answers: options.answers,
            caseSensitive: options.caseSensitive,
            state: constants.TASK_INITIAL
          })

          task.save((err, task) => {
            if (err) {
              logger.error(err)
              callback(new InternalError(), null)
            } else {
              callback(null, task)
              publish('realtime', new CreateTaskEvent(task))
            }
          })
        }
      }
    })
  }

  static update(task, options, callback) {
    task.description = options.description
    task.categories = options.categories
    task.hints = options.hints
    task.answers = _.union(task.answers, options.answers)
    task.updatedAt = new Date()
    task.save((err, task) => {
      if (err) {
        logger.error(err)
        callback(new InternalError(), null)
      } else {
        callback(null, task)
        publish('realtime', new UpdateTaskEvent(task))
      }
    })
  }

  static list(callback) {
    Task.find((err, tasks) => {
      if (err) {
        logger.error(err)
        callback(new InternalError(), null)
      } else {
        callback(null, tasks)
      }
    })
  }

  static listEligible(callback) {
    Task
      .find()
      .or([
        { state: constants.TASK_OPENED },
        {state: constants.TASK_CLOSED }
      ])
      .find((err, tasks) => {
        if (err) {
          logger.error(err)
          callback(new InternalError(), null)
        } else {
          callback(null, tasks)
        }
      })
  }

  static checkAnswer(task, proposedAnswer, callback) {
    if (!task.caseSensitive) {
      proposedAnswer = proposedAnswer.toLowerCase()
    }

    let answerCorrect = false
    for (let answer of task.answers) {
      if (task.caseSensitive) {
        answerCorrect = (proposedAnswer === answer)
      } else {
        answerCorrect = (proposedAnswer == answer.toLowerCase())
      }
      if (answerCorrect) {
        break
      }
    }

    callback(null, answerCorrect)
  }

  static open(task, callback) {
    if (task.isInitial()) {
      task.state = constants.TASK_OPENED
      task.updatedAt = new Date()
      task.save((err, task) => {
        if (err) {
          logger.error(err)
          callback(new InternalError())
        } else {
          callback(null)
          publish('realtime', new OpenTaskEvent(task))
        }
      })
    } else {
      if (task.isOpened()) {
        callback(new TaskAlreadyOpenedError())
      } else if (task.isClosed()) {
        callback(new TaskClosedError())
      } else {
        callback(new InternalError())
      }
    }
  }

  static close(task, callback) {
    if (task.isOpened()) {
      task.state = constants.TASK_CLOSED
      task.updatedAt = new Date()
      task.save((err, task) => {
        if (err) {
          logger.error(err)
          callback(new InternalError())
        } else {
          callback(null)
          publish('realtime', new CloseTaskEvent(task))
        }
      })
    } else {
      if (task.isInitial()) {
        callback(new TaskNotOpenedError())
      } else if (task.isClosed()) {
        callback(new TaskAlreadyClosedError())
      } else {
        callback(new InternalError())
      }
    }
  }

  static get(id, callback) {
    Task.findOne({ _id: id }, (err, task) => {
      if (err) {
        logger.error(err)
        callback(new TaskNotFoundError(), null)
      } else {
        if (task) {
          callback(null, task)
        } else {
          callback(new TaskNotFoundError(), null)
        }
      }
    })
  }

  static getByCategory(categoryId, callback) {
    Task.find({}, (err, tasks) => {
      if (err) {
        logger.error(err)
        callback(new InternalError(), null)
      } else {
        callback(null, _.filter(tasks, (task) => {
          return _.contains(task.categories, categoryId)
        }))
      }
    })
  }
}


export default TaskController
