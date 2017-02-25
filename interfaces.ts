    
export interface ideology {
    size: number,
    partyPower: number,
    ideologyPower: number
}

export interface ideologyWithParties {
    size: number,
    partyPower: number,
    ideologyPower: number,
    numberOfParties: number
}

export interface ideologyWithProbabilities {
    probabilities: Array<number>,
    parties: Array<number>
}

export interface party {
    ideology: number,
    size: number | undefined
}
