import { Ideology } from './generator/interfaces'
import createInput from './generator'

import fptp from './fptp'
import stv from './stv'
import schulze from './schulze'

const seats = 5;

const parties = 16
const ballots = 200

const ideologies: Array<Ideology> = [{
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

let input = createInput(ideologies, parties, ballots)

console.log(stv(input, seats))
console.log(fptp(input, seats))
console.log(schulze(input, seats))