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
