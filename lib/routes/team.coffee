express = require 'express'
bodyParser = require 'body-parser'
busboy = require 'connect-busboy'
logger = require '../utils/logger'
constraints = require '../utils/constraints'
tmp = require 'tmp'
fs = require 'fs'
gm = require 'gm'

Team = require '../models/team'
TeamController = require '../controllers/team'
Validator = require 'validator.js'
validator = new Validator.Validator()
router = express.Router()
urlencodedParser = bodyParser.urlencoded extended: no

router.post '/signin', urlencodedParser, (request, response) ->
    if request.session.authenticated?
        response.status(400).json 'Already authenticated!'
    else
        signinConstraints =
            team: constraints.team
            password: constraints.password

        validationResult = validator.validate request.body, signinConstraints
        if validationResult is true
            TeamController.signin request.body.team, request.body.password, (err, team) ->
                if err?
                    logger.error err
                    response.status(400).json 'Invalid team or password!'
                else
                    if team?
                        request.session.authenticated = yes
                        request.session.identityID = team._id
                        request.session.role = 'team'
                        request.session.name = team.name
                        response.status(200).json success: yes
                    else
                        response.status(400).json 'Invalid team or password!'
        else
            response.status(400).json 'Validation error!'


multidataParser = busboy immediate: yes

router.post '/signup', multidataParser, (request, response) ->
    if request.session.authenticated?
        response.status(400).json 'Already authenticated!'
    else
        teamInfo = {}
        teamLogo = tmp.fileSync()

        request.busboy.on 'file', (fieldName, file, filename, encoding, mimetype) ->
            file.on 'data', (data) ->
                if fieldName is 'logo'
                    fs.appendFileSync teamLogo.name, data

        request.busboy.on 'field', (fieldName, val, fieldNameTruncated, valTruncated) ->
            teamInfo[fieldName] = val

        request.busboy.on 'finish', ->
            signupConstraints =
                team: constraints.team
                email: constraints.email
                password: constraints.password
                country: constraints.country
                locality: constraints.locality
                institution: constraints.institution

            validationResult = validator.validate teamInfo, signupConstraints
            if validationResult is true
                gm(teamLogo.name).size (err, size) ->
                    if err?
                        logger.error err
                        response.status(400).json 'Invalid image logo!'
                    else
                        if size.width < 48
                            response.status(400).json 'Image should be wider than 48px!'
                        else
                            TeamController.create teamInfo, (err, team) ->
                                if err?
                                    response.status(400).json err
                                else
                                    response.status(200).json success: yes
            else
                response.status(400).json 'Validation error!'


module.exports = router
