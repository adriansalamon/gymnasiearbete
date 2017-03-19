import { Ideology } from './generator/interfaces'
import generateBallots from './generator'

import fptp from './fptp'
import { runElection as stv } from './stv'
import schulze from './schulze'


const ballots = 500

const candidates = 8
const seats = 1

const ideologies: Ideology[] = [{
    size: 0.3,
    candidatePower: 0.6,
    ideologyPower: 0.8
}, {
    size: 0.3,
    candidatePower: 0.8,
    ideologyPower: 0.7
}, {
    size: 0.4,
    candidatePower: 0.5,
    ideologyPower: 0.8,
}]


//let input = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]

let results: Array<{ stv: number[], fptp: number[], schulze: number[], }> = []

for (var j = 0; j < 1000; j++) {
    console.log(j)
    let input = generateBallots(ideologies, candidates, ballots)

    results.push({ stv: stv(input, seats).winners, fptp: fptp(input, seats), schulze: schulze(input, seats) })
}

interface FormattedResults {
    stv: Array<{
        candidate: number,
        wins: number
    }>,
    fptp: Array<{
        candidate: number,
        wins: number
    }>,
    schulze: Array<{
        candidate: number,
        wins: number
    }>
}

let formattedResults: FormattedResults = { stv: [], fptp: [], schulze: [] }

for (let i = 0; i < results.length; i++) {
    let election = results[i];
    formattedResults.fptp = [...addVotes(candidates, election.fptp, formattedResults.fptp)]
    formattedResults.stv = [...addVotes(candidates, election.stv, formattedResults.stv)]
    formattedResults.schulze = [...addVotes(candidates, election.schulze, formattedResults.schulze)]

}

function addVotes(candidates: number, results: number[], formattedResults: Array<{ candidate: number, wins: number }>): Array<{ candidate: number, wins: number }> {
    for (var i = 0; i < candidates; i++) {
        let winnerIndex = results.findIndex(num => num === i)
        let resultsIndex = formattedResults.findIndex(obj => obj.candidate === i)
        if (winnerIndex !== -1) {
            if (resultsIndex === -1) {
                formattedResults.push({ candidate: i, wins: 1 })
            } else {
                formattedResults[resultsIndex].wins += 1;
            }
        } else {
            if (resultsIndex === -1) {
                formattedResults.push({ candidate: i, wins: 0 })
            }
        }


    }
    /*
    for (let i = 0; i < results.length; i++) {
        let winner = results[i];
        let index = formattedResults.findIndex(obj => obj.party === winner)
        if (index === -1) {
            formattedResults.push({party: winner, wins: 1})
        } else {
            formattedResults[index].wins += 1;
        }
    }*/
    return formattedResults
}

console.log(formattedResults)
/*
let input = createInput(ideologies, parties, ballots)
results.push({stv: stv(input, seats).winners, fptp: fptp(input, seats), schulze: schulze(input, seats)})
*/


let plots: string = ''
for (var i = 0; i < 3; i++) {
    plots += '\\addplot coordinates \n{'
    for (var j = 0; j < formattedResults.fptp.length; j++) {
        let result = formattedResults.fptp[j]
        if(i == 0){
            result = formattedResults.fptp[j]
        } else if (i == 1){
            result = formattedResults.stv[j]
        } else {
            result = formattedResults.schulze[j]
        }
        plots += `(${j}, ${result.wins})`
    }
    plots += '};\n'
}

import { findVariance } from './testmethod';

let variacnes: number[] = []

variacnes.push(findVariance(formattedResults.fptp.map(res => res.wins)))
variacnes.push(findVariance(formattedResults.stv.map(res => res.wins)))
variacnes.push(findVariance(formattedResults.schulze.map(res => res.wins)))

console.log(variacnes)

//let input = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]
/*let testGraph: {candidate: number, votes: number}[] = []

for (var i = 0; i < input.length; i++) {
    let firstVote: number = input[i][0]
    let voteIndex = testGraph.findIndex(obj => obj.candidate === firstVote)
    if(voteIndex === -1) {
        testGraph.push({candidate: firstVote, votes: 1})
    }else{
        testGraph[voteIndex].votes += 1
    }

}

testGraph.sort((a,b) => {
    if (a.candidate > b.candidate) {
        return 1
    } else if (a.candidate < b.candidate){
        return -1
    }
    return 0
})


let testplot = '\\addplot coordinates \n{'
for (var i = 0; i < testGraph.length; i++) {
    let element = testGraph[i];
    testplot += `(${element.candidate}, ${element.votes})`
}
testplot += '}; \n'

console.log(testplot)
*/
var fs = require('fs')
fs.writeFile('plots.txt', plots)

