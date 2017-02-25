import { ideology, ideologyWithProbabilities } from './interfaces';


// Generates the ballots, essentially the output of the program
export function generateBallots(numberOfBallots: number, prob: Array<number>, parties: Array<number>): Array<Array<number>> {
    // Create temp array combining probability and possib
    let temp: Array<Array<number>> = []
    for (var i = 0; i < parties.length; i++) {
        temp.push([prob[i], parties[i]])
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

    let ballots: Array<Array<number>> = []

    for (var i = 0; i < numberOfBallots; i++) {
        const votes = distributeVotes(temp)
        ballots.push(votes)
        //console.log(temp)
    }
    // Distributes the votes into the results array randomly
    
    return ballots
}

export function createAllBallots(ideologies: Array<ideology>, ideologyProbabilities: Array<ideologyWithProbabilities>, ballots: number): Array<Array<number>> {
    let result: Array<Array<number>> = []

    for (var i = 0; i < ideologies.length; i++) {
        const ideology = ideologies[i]
        const ideologyProbability = ideologyProbabilities[i]

        const arrOfBallots = generateBallots(ideology.size*ballots, ideologyProbability.probabilities , ideologyProbability.parties)

        result = result.concat(arrOfBallots)
    }
    return result
}



function distributeVotes(temp: Array<Array<number>>): Array<number> {
    let parties = [ ...temp ]
    let index = parties.length
    let result: Array<number> = []

    while (index > 0) {
        const rand = Math.random()
        // Loops through the temp array
        for (var i = 0; i < parties.length; i++) {
            // Gets the value of the party size
            const val = parties[i][0]
            // The first value that is greater than the random number 
            if (val > rand) {
                // Checks if party has already been voted for
                if (!parties[i][2]) {
                    // Makes sure that the party isn't voted for again
                    parties[i] = [ ...parties[i], 1]
                    result.push(parties[i][1])
                    index--
                }
                // Breaks the loop so that only the first value greater than the random number is added
                break
            }
        }
    }
    return result
}