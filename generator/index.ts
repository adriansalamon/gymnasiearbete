/*
    By Adrian Salamon
*/

import { Ideology, IdeologyWithProbabilities } from './interfaces'
import { createCandidates, assignProbabilityToIdeology } from './candidates'
import { createAllBallots } from './ballots'


export function generateBallots(ideologies: IdeologyWithProbabilities[], numberOfBallots: number): number[][] {

    const result = createAllBallots(ideologies, numberOfBallots)
    
    return result
}

export function createIdeologyProbabilities(ideologies: Ideology[], numberOfCandidates: number): IdeologyWithProbabilities[] {
    const candidates = createCandidates(numberOfCandidates, ideologies)

    return assignProbabilityToIdeology(ideologies, candidates)
}