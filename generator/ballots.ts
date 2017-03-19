import { Ideology, IdeologyWithProbabilities } from './interfaces'


// Generates the ballots, essentially the output of the program
function generateBallots(numberOfBallots: number, prob: number[], candidates: number[]): number[][] {
    // Create temp array combining probability and possib
    let temp: number[][] = []
    for (var i = 0; i < candidates.length; i++) {
        temp.push([prob[i], candidates[i]])
    }

    //Sorts the temp array
    temp.sort((a, b) => {
        if (a[0] < b[0]) {
            return -1
        } if (a[0] > b[0]) {
            return 1
        }
        return 0
    })

    // Adds upp the probabilities
    temp.map((val, index, arr) => {
        if (index > 0) {
            val[0] += arr[index - 1][0]
        }
        return val
    })

    let ballots: number[][] = []

    for (var i = 0; i < numberOfBallots; i++) {
        const votes = distributeVotes(temp)
        ballots.push(votes)
        //console.log(temp)
    }
    // Distributes the votes into the results array randomly
    
    return ballots
}

export function createAllBallots(ideologies: Ideology[], ideologyProbabilities: IdeologyWithProbabilities[], ballots: number): number[][] {
    let result: number[][] = []

    for (var i = 0; i < ideologies.length; i++) {
        const ideology = ideologies[i]
        const ideologyProbability = ideologyProbabilities[i]

        const arrOfBallots = generateBallots(ideology.size*ballots, ideologyProbability.probabilities , ideologyProbability.candidates)

        result = result.concat(arrOfBallots)
    }
    return result
}



function distributeVotes(temp: number[][]): number[] {
    let candidates = [ ...temp ]
    let index = candidates.length
    let result: number[] = []

    while (index > 0) {
        const rand = Math.random()
        // Loops through the temp array
        for (var i = 0; i < candidates.length; i++) {
            // Gets the value of the party size
            const val = candidates[i][0]
            // The first value that is greater than the random number 
            if (val > rand) {
                // Checks if party has already been voted for
                if (!candidates[i][2]) {
                    // Makes sure that the party isn't voted for again
                    candidates[i] = [ ...candidates[i], 1]
                    result.push(candidates[i][1])
                    index--
                }
                // Breaks the loop so that only the first value greater than the random number is added
                break
            }
        }
    }
    return result
}