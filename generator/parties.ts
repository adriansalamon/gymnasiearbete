import {Ideology, IdeologyWithProbabilities, IdeologyWithParties, Party} from './interfaces'

// Creates the parties and assigns them an ideology based on their relative sizes.
export function createParties(numberOfParties: number, ideologies: Ideology[]): Party[] {

    const tempIdeologies: IdeologyWithParties[] = ideologies.map((ideology) => {
        return Object.assign({}, ideology, { numberOfParties: 0 })
    })

    let parties: Party[] = []
    const initialNumberOfParties = numberOfParties
    // Loops while not every party has an ideology
    while (numberOfParties > 0) {
        // Loops though all future party indexes
        for (let partyIndex = 0; partyIndex < initialNumberOfParties; partyIndex++) {

            // Loops through all ideologies
            for (let ideologyIndex = 0; ideologyIndex < tempIdeologies.length; ideologyIndex++) {
                if(numberOfParties <= 0)
                    break
                // Current ideology in loop
                const ideology = tempIdeologies[ideologyIndex]
                //Gets the number of parties that should belong to an ideology
                const size = Math.round(initialNumberOfParties * ideology.size)
                // An ideology needs to have at least one party
                if ((size === 0 ? 1 : size) > ideology.numberOfParties) {
                    ideology.numberOfParties++
                    numberOfParties--
                    // Pushes thae new party to the array
                    parties.push({ ideology: ideologyIndex, size: undefined })
                }
            }
        }
    }
    // Assigns the sizes of the parties and then returns them
    const partiesWithSizes = assignPartySizes(parties, tempIdeologies)
    return partiesWithSizes
}


// Assigns the probability of the voters within an ideology
export function assignProbabilityToIdeology(ideologies: Ideology[], parties: Party[]): IdeologyWithProbabilities[] {
    let result: IdeologyWithProbabilities[] = []

    // Loops through each ideology
    for (var ideologyIndex = 0; ideologyIndex < ideologies.length; ideologyIndex++) {
        let ideology = ideologies[ideologyIndex]
        // Maps parties and sets the size according to ideology
        const withProbabilities = parties.map(party => {
            if (party.ideology === ideologyIndex) {
                // Increases probability of voting for party aligned with ideology
                return party.size * 8 * (ideology.ideologyPower**2)
            } else {
                return party.size
            }
        })

        const normalized = normalize(withProbabilities)

        // IDK why I have it here. Not needed but who knows. Creates array of 1,2,3...
        const partyList = Array(parties.length).fill(0).map((val, index) => index)
        // Assigns values to ideology
        result = [...result, {probabilities: normalized, parties: partyList}]
        //ideologies[ideologyIndex] = Object.assign({}, ideology, {probabilities: normalized, parties: partyList})

    }
    return result
}



// Assigns relative sizes to all parties based on their ideologies
function assignPartySizes(parties: Party[], ideologies: IdeologyWithParties[]): Party[] {
    // Loops through all ideologies
    for (var ideologyIndex = 0; ideologyIndex < ideologies.length; ideologyIndex++) {
        const ideology = ideologies[ideologyIndex]
        // Calculates a distribution of sizes of parties within an ideology
        let ideologySizeList = calculateDistribution(ideology.numberOfParties, ideology.partyPower)
        
        // Maps over parties and changes the size if the party ideology matches that of the state of the loop
        parties = parties.map((party) => {
            if (party.ideology === ideologyIndex) {
                // Shifts the size from the array
                const size = ideologySizeList.shift() * ideology.size
                // Creates a new object and returns it to the array
                const newParty = Object.assign({}, party, {size})
                return newParty
            } else {
                return party
            }
        })
    }
    return parties
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
function calculateDistribution (parties: number, k:number): number[] {
    // Adjusts the constant to vary more and set 0.5 as the default
    const adjustedK = (k**2)*0.5
    // Defines the range of the distribution where y > 0.01
    const xLimit = fy(0.01, adjustedK)
    const stepSize = xLimit/parties
    const xValues = calculateXValues(parties,adjustedK,stepSize,0,[])
    const normalized = normalize(xValues)
    return normalized
}

// Finds x values recursively and returns the result
function calculateXValues(parties: number, k: number, stepSize: number, x: number, result: number[]):number[] {
    if (parties === 0) {
        // Returns result at the end of recursion
        return result
    } else {
        result.push(fx(x, k))
        // Recusive call with decremented number of parties and incremented x value
        return calculateXValues(parties-1, k, stepSize, x+stepSize, result)
    }
}

