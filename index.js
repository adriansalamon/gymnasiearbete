"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const fptp_1 = require("./server/fptp");
const stv_1 = require("./server/stv");
const schulze_1 = require("./server/schulze");
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
];
var mongoUri = "mongodb://adrian:salamon@ds151049.mlab.com:51049/heroku_m3710js3";
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function () { console.log("Great success!"); });
var schema = new Schema({
    votes: [Number]
});
var Vote = mongoose.model('Votes', schema);
app.use(bodyParser.json());
app.post('/submit', (req, res) => {
    var json = req.body;
    if (json.votes) {
        var vote = new Vote(json);
        vote.save((err) => {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else {
                return res.send('Result submitted');
            }
        });
    }
    else {
        return res.send('Error in json request format');
    }
});
app.get('/result', (req, res) => {
    Vote.find({}, (err, users) => {
        let ballots = users.map(user => {
            return user.votes;
        });
        const fptpRes = fptp_1.default(ballots, 1).map(winner => {
            return { index: winner, party: parties[winner] };
        });
        const stvRes = stv_1.default(ballots, 1).winners.map(winner => {
            return { index: winner, party: parties[winner] };
        });
        const schulzeRes = schulze_1.default(ballots, 1).map(winner => {
            return { index: winner, party: parties[winner] };
        });
        res.send({ fptp: fptpRes, stv: stvRes, schulze: schulzeRes });
    });
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});