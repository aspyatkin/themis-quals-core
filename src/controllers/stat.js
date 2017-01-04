import TeamProvider from './team'
import ContestProvider from './contest'
import Event from '../models/event'
import _ from 'underscore'
import constants from '../utils/constants'
import TeamTaskHitAttemptController from './team-task-hit-attempt'
import TeamTaskHitController from './team-task-hit'
import TeamTaskReviewController from './team-task-review'
import CountryProvider from './country'

class StatController {
  static getStats (callback) {
    const result = {
      teams: {
        total: 0,
        qualified: 0,
        disqualified: 0,
        signedInDuringContest: 0,
        attemptedToSolveTasks: 0,
        solvedAtLeastOneTask: 0,
        reviewedAtLeastOneTask: 0
      },
      countries: {
      }
    }

    TeamProvider.index((err, teams) => {
      if (err) {
        callback(err, null)
      } else {
        result.teams.total = teams.length
        result.teams.qualified = _.filter(teams, (team) => {
          return team.isQualified()
        }).length
        result.teams.disqualified = _.filter(teams, (team) => {
          return team.disqualified
        }).length

        ContestProvider.get((err, contest) => {
          if (err) {
            callback(err, null)
          } else {
            if (contest && contest.startsAt && contest.finishesAt) {
              const setSignedIn = new Set()
              const setHitAttempt = new Set()
              const setHit = new Set()
              const setReview = new Set()

              const contestStartTimestamp = contest.startsAt.getTime()
              const contestFinishTimestamp = contest.finishesAt.getTime()

              Event
                .query()
                .then((events) => {
                  const signInEvents = _.filter(events, (event) => {
                    const timestamp = event.createdAt.getTime()
                    return event.type === constants.EVENT_LOGIN_TEAM && timestamp >= contestStartTimestamp && timestamp <= contestFinishTimestamp
                  })

                  for (const signInEvent of signInEvents) {
                    setSignedIn.add(signInEvent.data.supervisors.id)
                  }

                  TeamTaskHitAttemptController.index((err, teamTaskHitAttempts) => {
                    if (err) {
                      callback(err, null)
                    } else {
                      for (const teamTaskHitAttempt of teamTaskHitAttempts) {
                        setHitAttempt.add(teamTaskHitAttempt.teamId)
                      }

                      TeamTaskHitController.list((err, teamTaskHits) => {
                        if (err) {
                          callback(err, null)
                        } else {
                          for (const teamTaskHit of teamTaskHits) {
                            setHitAttempt.add(teamTaskHit.teamId)
                            setHit.add(teamTaskHit.teamId)
                          }

                          TeamTaskReviewController.index((err, teamTaskReviews) => {
                            if (err) {
                              callback(err, null)
                            } else {
                              for (const teamTaskReview of teamTaskReviews) {
                                setReview.add(teamTaskReview.teamId)
                              }

                              result.teams.signedInDuringContest = setSignedIn.size
                              result.teams.attemptedToSolveTasks = setHitAttempt.size
                              result.teams.solvedAtLeastOneTask = setHit.size
                              result.teams.reviewedAtLeastOneTask = setReview.size

                              CountryProvider.index((err, countries) => {
                                if (err) {
                                  callback(err, null)
                                } else {
                                  const qualifiedTeams = _.filter(teams, (team) => {
                                    return team.isQualified()
                                  })
                                  result.countries = _.countBy(qualifiedTeams, (team) => {
                                    return _.findWhere(countries, { id: team.countryId }).name
                                  })

                                  callback(null, result)
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                })
                .catch((err) => {
                  callback(err, null)
                })
            } else {
              callback('Contest not found!', null)
            }
          }
        })
      }
    })
  }
}

export default StatController
