import express from 'express'
let router = express.Router()

import logger from '../utils/logger'
import errors from '../utils/errors'
import TeamController from '../controllers/team'
import TeamScore from '../models/team-score'
import _ from 'underscore'


function rankFunc(a, b) {
  if (a.score > b.score) {
    return -1
  } else if (a.score < b.score) {
    return 1
  } else {
    if (a.updatedAt && b.updatedAt) {
      if (a.updatedAt.getTime() < b.updatedAt.getTime()) {
        return -1
      } else if (a.updatedAt.getTime() > b.updatedAt.getTime()) {
        return 1
      } else {
        return 0
      }
    } else if (a.updatedAt && !b.updatedAt) {
      return -1
    } else if (!a.updatedAt && b.updatedAt) {
      return 1
    } else {
        return 0
    }
  }
}


router.get('/ctftime', (request, response, next) => {
  TeamController.listQualified((err, teams) => {
    if (err) {
      logger.error(err)
      next(new errors.InternalError(), null)
    } else {
      TeamScore.find({}, (err, teamScores) => {
        if (err) {
          logger.error(err)
          next(new errors.InternalError(), null)
        } else {
          let entries = _.map(teams, (team) => {
            let teamScore = _.findWhere(teamScores, { teamId: team._id })
            let entry = nil
            if (teamScore) {
              entry = {
                team: team.name,
                score: teamScore.score,
                updatedAt: teamScore.updatedAt
              }
            } else {
              entry = {
                team: team.name,
                score: 0,
                updatedAt: null
              }
            }

            return entry
          })

          entries.sort(rankFunc)
          response.json({
            standings: _.map(entries, (entry, ndx) => {
              return {
                pos: ndx + 1,
                team: entry.team,
                score: entry.score
              }
            })
          })
        }
      })
    }
  })
})


export default router