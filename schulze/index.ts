//let fakeData = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]


interface Pair {
    a: number,
    b: number,
    num: number
}

// Gets the pairwise comparison between all candidates and the number of prefrences. Ex. 120 ballots prefer a > b
function getPairs(ballots: Array<Array<number>>): Array<Pair> {
    let result: Array<Pair> = []
    // Loops throug all ballots
    for (var k = 0; k < ballots.length; k++) {
        var ballot = ballots[k];
        // Temp array that stores which candidates are prefered over current candidate in the loop
        let preferred: Array<number> = []
        //Loops through each ballot
        for (var i = 0; i < ballot.length; i++) {
            var vote = ballot[i];
            // Loops through the preferred array
            for (var j = 0; j < preferred.length; j++) {
                // Current preferred vote
                let preferredVote = preferred[j];
                // Gets the index of where preferredvote > vote are stored
                let indexOfPair = result.findIndex(obj => (obj.a === preferred[j] && obj.b === vote))
                // If the pairwise comparison exists already increment the number of prefrences for that pair
                if (indexOfPair !== -1) {
                    result[indexOfPair].num += 1;
                } else {
                    // If the comparison doesn't exist in result, push to results
                    result.push({ a: preferred[j], b: vote, num: 1 })
                }
            }
            // Prefers current candidate over next candidates in loop
            preferred.push(vote)
        }

    }
    return result
}

// Finds number of prefrences for a > b and returns that value
function d(a: number, b: number, pairs: Array<Pair>) {
    // Finds pair index
    let pairIndex = pairs.findIndex(obj => obj.a === a && obj.b === b)
    // If index exists return the number of prefrences at that index
    if (pairIndex !== -1)
        return pairs[pairIndex].num
    return 0
}

// Adds a path to the strongest path array and returns the new array
function addPath(a: number, b: number, num: number, strongestPaths: Array<Pair>): Array<Pair> {
    strongestPaths.push({ a, b, num })
    return strongestPaths
}

// Gets the strongest path between a and b in the strongestPaths array
function getStrongestPath(a: number, b: number, strongestPaths: Array<Pair>): number {
    // Gets all paths
    let allPaths = strongestPaths.filter(obj => obj.a === a && obj.b === b)
    // Gets their values
    const values = allPaths.map(val => val.num)
    // Gets the max of those values
    const maxValue = values.reduce((a, b) => Math.max(a, b))
    return maxValue
}

function getResult(strongestPaths: Array<Pair>, seats: number, c: number): Array<number> {
    let wins: Object = {}
    // Loops through strongest paths and adds results onto the wins object
    for (var i = 0; i < c; i++) {
        for (var j = 0; j < c; j++) {
            if (i !== j) {
                if (getStrongestPath(i, j, strongestPaths) > getStrongestPath(j, i, strongestPaths)) {
                    if (wins[i]) {
                        wins[i] = [j, ...wins[i]]
                    } else {
                        wins[i] = [j]
                    }
                }
            }
        }
    }
    interface Result {
        key: number,
        wins: Array<number>
    }

    let winsArray: Array<Result> = []
    let losers: Array<number> = []
    // Converts the object into an array
    for (var i = 0; i <= Object.keys(wins).length; i++) {
        if (wins[i]) {
            // Pushes result onto array§
            winsArray.push({ key: i, wins: wins[i] })
        } else {
            // If no wins push to losers array
            losers.push(i)
        }

    }
    // Sorts the array based on number of pairwise strongest path comparisons won
    winsArray.sort((a, b) => {
        if (a.wins.length > b.wins.length) {
            return -1
        } if (a.wins.length < b.wins.length) {
            return 1
        }
        return 0
    })
    // Adds candidates that did not win any pairwise strongest path comparisons
    for (var i = 0; i < losers.length; i++) {
        winsArray.push({ key: losers[i], wins: [] })
    }

    // Gets final winners by slicing and mapping array
    let result = winsArray.slice(0, seats).map(val => val.key)
    return result
}

// Finds max as a step in the algorithm for finding strongest path
function findMax(j: number, k: number, i: number, strongestPaths: Array<Pair>) {
     let min = Math.min(getStrongestPath(j, i, strongestPaths), getStrongestPath(i, k, strongestPaths))
     let max = Math.max(getStrongestPath(j, k, strongestPaths), min)
     return max
}

// Calculates  result in a Schulze method election
export default function calculateResult(input: Array<Array<number>>, seats: number): Array<number> {
    // Gets the pairs of candidates and their count
    // Ex 120 votes prefer a > b
    let pairs: Array<Pair> = getPairs(input)

    let strongestPaths: Array<Pair> = []
    // Number of candidates
    let c = input[0].length

    // Computing strongest path strength. Variant of the Floyd-Warshall algorithm

    for (var i = 0; i < c; i++) {
        for (var j = 0; j < c; j++) {
            if (i !== j) {
                if (d(i, j, pairs) > d(j, i, pairs)) {
                    strongestPaths = [...addPath(i, j, d(i, j, pairs), strongestPaths)]
                } else {
                    strongestPaths = [...addPath(i, j, 0, strongestPaths)]
                }
            }
        }
    }

    for (var i = 0; i < c; i++) {
        for (var j = 0; j < c; j++) {
            if (i !== j) {
                for (var k = 0; k < c; k++) {
                    if (i !== k && j !== k) {
                        strongestPaths = [...addPath(j, k, findMax(j, k, i, strongestPaths), strongestPaths)]
                    }
                }
            }
        }
    }

    // Sorts and gets the winners based on the strongest paths
    let result = getResult(strongestPaths, seats, c)

    return result;
}