import {Ideology, IdeologyWithProbabilities, IdeologyWithCandidates, Candidate} from './interfaces'

// Creates the parties and assigns them an ideology based on their relative sizes.
export function createCandidates(numberOfCandidates: number, ideologies: Ideology[]): Candidate[] {
    const tempIdeologies: IdeologyWithCandidates[] = ideologies.map((ideology) => {
        return Object.assign({}, ideology, { numberOfCandidates: 0 })
    })

    let candidates: Candidate[] = []
    const initialNumberOfCandidates = numberOfCandidates
    // Loops while not every party has an ideology
    while (numberOfCandidates > 0) {
        // Loops though all future party indexes
        for (let candidateIndex = 0; candidateIndex < initialNumberOfCandidates; candidateIndex++) {

            // Loops through all ideologies
            for (let ideologyIndex = 0; ideologyIndex < tempIdeologies.length; ideologyIndex++) {
                if(numberOfCandidates <= 0)
                    break
                
                // Current ideology in loop
                const ideology = tempIdeologies[ideologyIndex]
                //Gets the number of parties that should belong to an ideology
                const size = Math.round(initialNumberOfCandidates * ideology.size)
                // An ideology needs to have at least one party
                if ((size === 0 ? 1 : size) > ideology.numberOfCandidates) {
                    ideology.numberOfCandidates++
                    numberOfCandidates--
                    // Pushes thae new party to the array
                    candidates.push({ ideology: ideologyIndex, size: undefined })
                }
            }
        }
        // Solves rounding errors with infinite loops
        if (numberOfCandidates === 1) {
            tempIdeologies[tempIdeologies.length-1].numberOfCandidates ++
            numberOfCandidates--
            candidates.push({ ideology: tempIdeologies.length-1, size: undefined })

        }
    }
    // Assigns the sizes of the parties and then returns them
    const candidatesWithSizes = assignCandidateSizes(candidates, tempIdeologies)
    return candidatesWithSizes
}


// Assigns the probability of the voters within an ideology
export function assignProbabilityToIdeology(ideologies: Ideology[], candidates: Candidate[]): IdeologyWithProbabilities[] {
    let result: IdeologyWithProbabilities[] = []

    // Loops through each ideology
    for (var ideologyIndex = 0; ideologyIndex < ideologies.length; ideologyIndex++) {
        let ideology = ideologies[ideologyIndex]
        // Maps parties and sets the size according to ideology
        const withProbabilities = candidates.map(candidate => {
            if (candidate.ideology === ideologyIndex) {
                // Increases probability of voting for party aligned with ideology
                return candidate.size * 8 * (ideology.ideologyPower**2)
            } else {
                return candidate.size
            }
        })

        const normalized = normalize(withProbabilities)

        // IDK why I have it here. Not needed but who knows. Creates array of 1,2,3...
        const candidateList = Array(candidates.length).fill(0).map((val, index) => index)
        // Assigns values to ideology
        result = [...result, {probabilities: normalized, candidates: candidateList}]
        //ideologies[ideologyIndex] = Object.assign({}, ideology, {probabilities: normalized, parties: partyList})

    }
    return result
}



// Assigns relative sizes to all parties based on their ideologies
function assignCandidateSizes(candidates: Candidate[], ideologies: IdeologyWithCandidates[]): Candidate[] {
    // Loops through all ideologies
    for (var ideologyIndex = 0; ideologyIndex < ideologies.length; ideologyIndex++) {
        const ideology = ideologies[ideologyIndex]
        // Calculates a distribution of sizes of parties within an ideology
        let ideologySizeList = calculateDistribution(ideology.numberOfCandidates, ideology.candidatePower)
        
        // Maps over parties and changes the size if the party ideology matches that of the state of the loop
        candidates = candidates.map((candidate) => {
            if (candidate.ideology === ideologyIndex) {
                // Shifts the size from the array
                const size = ideologySizeList.shift() * ideology.size
                // Creates a new object and returns it to the array
                const newCandidate = Object.assign({}, candidate, {size})
                return newCandidate
            } else {
                return candidate
            }
        })
    }
    return candidates
}
// f(x) = ke^(-kx)
function fx (x: number,k: number): number {
    return k*(Math.E**(-k*x))
}

// f(y) = - ln(y/k)/k
function fy (y: number, k: number): number {
    return -(Math.log(y/k)/k)
}

// Normalizes an array of numbers so that the sum is 1
function normalize(array: (number | undefined)[]): number[] {
    const sum = array.reduce((acc, val) => acc + val)
    const normalized = array.map(val => val/sum)
    return normalized
}

// Calculates the distribution of votes as a negative exponential distribution
function calculateDistribution (candidates: number, k:number): number[] {
    // Adjusts the constant to vary more and set 0.5 as the default
    const adjustedK = (k**2)*0.5
    // Defines the range of the distribution where y > 0.01
    const xLimit = fy(0.01, adjustedK)
    const stepSize = xLimit/candidates
    const xValues = calculateXValues(candidates,adjustedK,stepSize,0,[])
    const normalized = normalize(xValues)
    return normalized
}

// Finds x values recursively and returns the result
function calculateXValues(candidates: number, k: number, stepSize: number, x: number, result: number[]):number[] {
    if (candidates === 0) {
        // Returns result at the end of recursion
        return result
    } else {
        result.push(fx(x, k))
        // Recusive call with decremented number of parties and incremented x value
        return calculateXValues(candidates-1, k, stepSize, x+stepSize, result)
    }
}

