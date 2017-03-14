/*
    By Adrian Salamon
*/

import { ideology, ideologyWithProbabilities } from './interfaces'
import { createParties, assignProbabilityToIdeology } from './parties'
import { generateBallots, createAllBallots } from './ballots'
const fs = require('fs')

const start = Date.now()

const numberOfParties: number = 8
const numberOfBallots: number = 100

const ideologies: Array<ideology> = [{
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
}];

const parties = createParties(numberOfParties, ideologies)

const ideologyProbabilities: Array<ideologyWithProbabilities> = assignProbabilityToIdeology(ideologies, parties)

const result = createAllBallots(ideologies, ideologyProbabilities, numberOfBallots)

fs.writeFile('out.json', JSON.stringify(result));

console.log(`Finished. Took ${(Date.now() - start)/1000} s`)
