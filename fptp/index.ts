interface Result {
    cand: number,
    votes: number
}

// Calculates the winners in a First-past-the-post election
export default function calculateWinners(input: number[][], seats: number) {

    // Maps input to first preferences
    let firstPreferences = input.map(el => {
        return el[0]
    })

    let results: Result[] = []
    // Loops over preferences and adds/increments result
    for (let i = 0; i < firstPreferences.length; i++) {
        // Finds index in results array of candidate at i
        let index = results.findIndex(obj => obj.cand === firstPreferences[i])
        // If candidate is not added to results
        if (index === -1) {
            results.push({ cand: firstPreferences[i], votes: 1 })
        } else {
            // Increment count if already added in results
            results[index].votes += 1
        }
    }

    // Sorts array by number of votes
    results.sort((a, b) => {
        if (a.votes > b.votes) {
            return -1
        } else if (a.votes < b.votes) {
            return 1
        }
        return 0
    })

    // Gets the first elements in the sorted array i.e the winners
    let winners = results.slice(0, seats)

    // Returns array of winners
    return winners.map(cand => cand.cand)
}