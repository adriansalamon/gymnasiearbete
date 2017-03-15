import { Ideology } from './generator/interfaces'
import createInput from './generator'

import fptp from './fptp'
import { runElection as stv} from './stv'
import schulze from './schulze'

const seats = 3;

const parties = 12
const ballots = 1200

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

let results = {stv: stv(input, seats).winners, fptp: fptp(input, seats), schulze: schulze(input, seats) }

console.log(results)
// Hello worlds