/*
    By Adrian Salamon
*/

import { Ideology, IdeologyWithProbabilities } from './interfaces'
import { createCandidates, assignProbabilityToIdeology } from './candidates'
import { createAllBallots } from './ballots'

export default function generateBallots(ideologies: Ideology[], numberOfcandidates: number, numberOfBallots: number): number[][] {
    const candidates = createCandidates(numberOfcandidates, ideologies)

    const ideologyProbabilities: IdeologyWithProbabilities[] = assignProbabilityToIdeology(ideologies, candidates)

    const result = createAllBallots(ideologies, ideologyProbabilities, numberOfBallots)

    return result
}