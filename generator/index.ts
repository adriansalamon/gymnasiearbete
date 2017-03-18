/*
    By Adrian Salamon
*/

import { Ideology, IdeologyWithProbabilities } from './interfaces'
import { createParties, assignProbabilityToIdeology } from './parties'
import { createAllBallots } from './ballots'

export default function generateInput(ideologies: Ideology[], numberOfParties: number, numberOfBallots: number): number[][] {
    
    const parties = createParties(numberOfParties, ideologies)

    const ideologyProbabilities: IdeologyWithProbabilities[] = assignProbabilityToIdeology(ideologies, parties)
    
    const result = createAllBallots(ideologies, ideologyProbabilities, numberOfBallots)

    return result
}