import { Ideology } from './generator/interfaces'
import createInput from './generator'

import fptp from './fptp'
import { runElection as stv} from './stv'
import schulze from './schulze'

const seats = 3;

const parties = 9
const ballots = 500

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


let results: Array<Object> = []

for (var i = 0; i <= 100; i++) {
    console.log(i)
    let input = createInput(ideologies, parties, ballots)
    results.push({stv: stv(input, seats).winners, fptp: fptp(input, seats), schulze: schulze(input, seats)})
}


 /*
 let input = createInput(ideologies, parties, ballots)
 results.push({stv: stv(input, seats).winners, fptp: fptp(input, seats), schulze: schulze(input, seats)})
*/
console.log(results)
