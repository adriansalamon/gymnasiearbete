var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Schema = mongoose.Schema
import fptp from "./server/fptp"
import stv from "./server/stv"
import schulze from "./server/schulze"

interface Db {
  _id: number
  __v: number
  votes: number[]
}

const parties = [
  "S",
  "M",
  "SD",
  "C",
  "V",
  "L",
  "MP",
  "KD",
  "F!"
]

var mongoUri = "mongodb://adrian:salamon@ds151049.mlab.com:51049/heroku_m3710js3"
mongoose.Promise = global.Promise

mongoose.connect(mongoUri)
var conn = mongoose.connection

conn.on('error', console.error.bind(console, 'connection error:'))

conn.once('open', function () {console.log("Great success!")})

var schema = new Schema({
  votes: [Number]
})

var Vote = mongoose.model('Votes', schema)

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send("Hello world")
})

app.post('/submit', (req, res) => {
  var json = req.body
  if (json.votes) {
    var vote = new Vote(json)
    vote.save((err) => {
      if (err) {
         console.log(err)
         return res.status(400).send(err)
      } else {
        return res.send('Result submitted')
      }
    })    
  } else {
    return res.status(400).send('Error in json request format')
  }
})

app.get('/result', (req,res) => {
  Vote.find({}, (err, users: Db[]) => {
    let ballots = users.map(user => {
        return user.votes
    })
    const fptpRes = fptp(ballots, 1).map(winner => {
      return {index: winner,party: parties[winner]}
    })
    const stvRes = stv(ballots, 1).winners.map(winner => {
      return {index: winner, party: parties[winner]}
    })
    const schulzeRes = schulze(ballots, 1).map(winner => {
      return {index: winner,party: parties[winner]}
    })
    res.send({fptp: fptpRes, stv: stvRes, schulze: schulzeRes})
  })
})



app.listen((process.env.PORT || 3000), function () {
  console.log('App listening on port 3000!')
})