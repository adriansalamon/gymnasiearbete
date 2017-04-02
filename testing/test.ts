// This file was used in doing the testing needed to obtain results for the paper


import { Ideology, IdeologyWithProbabilities } from '../generator/interfaces'
import { createIdeologyProbabilities, generateBallots} from '../generator'
import getStandardDeviation from './standardDeviation'

import fptp from '../fptp'
import stv  from '../stv'
import schulze from '../schulze'

interface Result {
    stv: number[], 
    fptp: number[], 
    schulze: number[]
}

interface FormattedResults {
    stv: {
        candidate: number,
        wins: number
    }[],
    fptp: {
        candidate: number,
        wins: number
    }[],
    schulze:{
        candidate: number,
        wins: number
    }[]
}

interface Candidate {
    candidate: number,
    wins: number
}


const ballots = 500

const candidates = 9
const seats = 3
const ideologies: Ideology[] = [{
    size: 0.2,
    candidatePower: 1.8,
    ideologyPower: 0.6
}, {
    size: 0.3,
    candidatePower: 1.6,
    ideologyPower: 0.6
}, {
    size: 0.5,
    candidatePower: 2,
    ideologyPower: 0.6
}]

//let input = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]

let results: Result[] = []

let ideologyData: IdeologyWithProbabilities[] = createIdeologyProbabilities(ideologies, candidates)

let start = Date.now()
for (let t = 0; t < 1000; t++) {
    console.log(t)
    let input = generateBallots(ideologyData, ballots)
    results.push({ stv: stv(input, seats).winners, fptp: fptp(input, seats), schulze: schulze(input, seats) })
}

console.log(`Done loop. Took ${(Date.now()-start)/1000} s`)



let formattedResults: FormattedResults = { stv: [], fptp: [], schulze: [] }

for (let i = 0; i < results.length; i++) {
    let election = results[i]
    formattedResults.fptp = [...addVotes(candidates, election.fptp, formattedResults.fptp)]
    formattedResults.stv = [...addVotes(candidates, election.stv, formattedResults.stv)]
    formattedResults.schulze = [...addVotes(candidates, election.schulze, formattedResults.schulze)]

}

function addVotes(candidates: number, results: number[], formattedResults: Candidate[]): Candidate[] {
    for (let i = 0; i < candidates; i++) {
        let winnerIndex = results.findIndex(num => num === i)
        let resultsIndex = formattedResults.findIndex(obj => obj.candidate === i)
        if (winnerIndex !== -1) {
            if (resultsIndex === -1) {
                formattedResults.push({ candidate: i, wins: 1 })
            } else {
                formattedResults[resultsIndex].wins += 1
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

let plots: string = ''
for (let i = 0; i < 3; i++) {
    plots += '\\addplot coordinates \n{'
    for (let j = 0; j < formattedResults.fptp.length; j++) {
        let result = formattedResults.fptp[j]
        if(i === 0){
            result = formattedResults.fptp[j]
        } else if (i === 1){
            result = formattedResults.stv[j]
        } else {
            result = formattedResults.schulze[j]
        }
        plots += `(${j}, ${result.wins})`
    }
    plots += '};\n'
}

let standardDeviations: number[] = []

standardDeviations.push(getStandardDeviation(formattedResults.fptp.map(res => res.wins)))
standardDeviations.push(getStandardDeviation(formattedResults.stv.map(res => res.wins)))
standardDeviations.push(getStandardDeviation(formattedResults.schulze.map(res => res.wins)))

console.log(standardDeviations)

//let input = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]

let testGraph: {candidate: number, votes: number}[] = []
let input = generateBallots(ideologyData, ballots)

for (let i = 0; i < input.length; i++) {
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
for (let i = 0; i < testGraph.length; i++) {
    let element = testGraph[i]
    testplot += `(${element.candidate}, ${element.votes})`
}
testplot += '}; \n'

console.log(testplot)

let fs = require('fs')
fs.writeFile('plots.txt', plots)

