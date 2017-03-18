    
export interface Ideology {
    size: number,
    partyPower: number,
    ideologyPower: number
}

export interface IdeologyWithParties {
    size: number,
    partyPower: number,
    ideologyPower: number,
    numberOfParties: number
}

export interface IdeologyWithProbabilities {
    probabilities: number[],
    parties: number[]
}

export interface Party {
    ideology: number,
    size: number | undefined
}
