import { Ideology } from './generator/interfaces'
import createInput from './generator'

import fptp from './fptp'
import { runElection as stv } from './stv'
import schulze from './schulze'

const seats = 3;

const parties = 7
const ballots = 100

const ideologies: Ideology[] = [{
    size: 0.2,
    partyPower: 0.2,
    ideologyPower: 1.2
}, {
    size: 0.3,
    partyPower: 2,
    ideologyPower: 1.6
}, {
    size: 0.5,
    partyPower: 1.3,
    ideologyPower: 0.7,
}]


let results: Array<{ stv: number[], fptp: number[], schulze: number[], }> = []
const input = createInput(ideologies, parties, ballots)

for (var j = 0; j <= 0; j++) {
    console.log(j)
    //let input = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]

    results.push({ stv: stv(input, seats).winners, fptp: fptp(input, seats), schulze: schulze(input, seats) })
}

interface FormattedResults {
    stv: Array<{
        party: number,
        wins: number
    }>,
    fptp: Array<{
        party: number,
        wins: number
    }>,
    schulze: Array<{
        party: number,
        wins: number
    }>
}

let formattedResults: FormattedResults = { stv: [], fptp: [], schulze: [] }

for (let i = 0; i < results.length; i++) {
    let election = results[i];
    formattedResults.fptp = [...addVotes(parties, election.fptp, formattedResults.fptp)]
    formattedResults.stv = [...addVotes(parties, election.stv, formattedResults.stv)]
    formattedResults.schulze = [...addVotes(parties, election.schulze, formattedResults.schulze)]

}

function addVotes(parties: number, results: number[], formattedResults: Array<{ party: number, wins: number }>): Array<{ party: number, wins: number }> {
    for (var i = 0; i < parties; i++) {
        let winnerIndex = results.findIndex(num => num === i)
        let resultsIndex = formattedResults.findIndex(obj => obj.party === i)
        if (winnerIndex !== -1) {
            if (resultsIndex === -1) {
                formattedResults.push({ party: i, wins: 1 })
            } else {
                formattedResults[resultsIndex].wins += 1;
            }
        } else {
            if (resultsIndex === -1) {
                formattedResults.push({ party: i, wins: 0 })
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


//let input = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]
let testGraph: {party: number, votes: number}[] = []

for (var i = 0; i < input.length; i++) {
    let firstVote: number = input[i][0]
    let voteIndex = testGraph.findIndex(obj => obj.party === firstVote)
    if(voteIndex === -1) {
        testGraph.push({party: firstVote, votes: 1})
    }else{
        testGraph[voteIndex].votes += 1
    }

}

testGraph.sort((a,b) => {
    if (a.party > b.party) {
        return 1
    } else if (a.party < b.party){
        return -1
    }
    return 0
})


let testplot = '\\addplot coordinates \n{'
for (var i = 0; i < testGraph.length; i++) {
    let element = testGraph[i];
    testplot += `(${element.party}, ${element.votes})`
}
testplot += '}; \n'

console.log(testplot)

var fs = require('fs')
fs.writeFile('plots.txt', plots)

