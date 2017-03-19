    
export interface Ideology {
    size: number,
    candidatePower: number,
    ideologyPower: number
}

export interface IdeologyWithCandidates {
    size: number,
    candidatePower: number,
    ideologyPower: number,
    numberOfCandidates: number
}

export interface IdeologyWithProbabilities {
    probabilities: number[],
    candidates: number[]
}

export interface Candidate {
    ideology: number,
    size: number | undefined
}
