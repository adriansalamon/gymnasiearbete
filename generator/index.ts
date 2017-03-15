/*
    By Adrian Salamon
*/

import { Ideology, IdeologyWithProbabilities } from './interfaces'
import { createParties, assignProbabilityToIdeology } from './parties'
import { createAllBallots } from './ballots'

export default function generateInput(ideologies: Array<Ideology>, numberOfParties: number, numberOfBallots: number): Array<Array<number>> {
    
    const parties = createParties(numberOfParties, ideologies)
    
    const ideologyProbabilities: Array<IdeologyWithProbabilities> = assignProbabilityToIdeology(ideologies, parties)
    
    const result = createAllBallots(ideologies, ideologyProbabilities, numberOfBallots)

    return result
}