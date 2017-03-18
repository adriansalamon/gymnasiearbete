//let fakeData = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]

interface PairMap {
    [key: number]: {
        [key: number]: number
    }
}

// Calculates  result in a Schulze method election
export default function calculateResult(input: number[][], seats: number): number[] {
    // Gets the pairs of candidates and their count
    // Ex 120 votes prefer a > b

    // d[i][j] gives the number of ballots prefering i > j
    let d: PairMap = getPairs(input)
    // o[i][j] stores the strongest path between i and j
    let p: PairMap = {}
    // Number of candidates
    let c = input[0].length

    // Fills p with a bunch of zeroes
    for (var i = 0; i < c; i++) {
        p[i] = {}
        for (var j = 0; j < c; j++) {
            if (i !== j) {
                p[i][j] = 0
            }
        }
    }

    // Computing strongest path strength. Variant of the Floyd-Warshall algorithm
    for (var i = 0; i < c; i++) {
        for (var j = 0; j < c; j++) {
            if (i !== j) {
                if (d[i][j] > d[j][i]) {
                    p[i][j] = d[i][j]
                } else {
                    p[i][j] = 0
                }
            }
        }
    }

    for (var i = 0; i < c; i++) {
        for (var j = 0; j < c; j++) {
            if (i !== j) {
                for (var k = 0; k < c; k++) {
                    if (i !== k && j !== k) {
                        p[j][k] = Math.max(p[j][k], Math.min(p[j][i], p[i][k]))
                    }
                }
            }
        }
    }

    // Gets the result
    let result: number[] = getResult(p, c, seats)

    return result
}

// Gets the pairwise comparison between all candidates and the number of prefrences. Ex. 120 ballots prefer a > b
function getPairs(ballots: number[][]): PairMap {
    let p = {}

    // Loops throug all ballots
    for (var k = 0; k < ballots.length; k++) {
        var ballot = ballots[k];
        // Temp array that stores which candidates are prefered over current candidate in the loop
        let preferred: number[] = []
        //Loops through each ballot
        for (var i = 0; i < ballot.length; i++) {
            var vote = ballot[i];
            // Loops through the preferred array
            for (var j = 0; j < preferred.length; j++) {
                // Current preferred vote
                let preferredVote = preferred[j];
                // Gets the index of where preferredvote > vote are stored
                p[preferredVote] = p[preferredVote] || {}

                p[preferredVote][vote] = p[preferredVote][vote] + 1 || 1
            }
            // Prefers current candidate over next candidates in loop
            preferred.push(vote)
        }

    }

    return p
}

// Processes, formats and returns result
function getResult(p: PairMap, c: number, seats: number): number[] {
    let wins: number[][] = []

    // Loops through the strongest paths
    for (var i = 0; i < c; i++) {
        for (var j = 0; j < c; j++) {
            if (i !== j) {
                // If path is stronger between i and j than j and i, i wins over j
                if (p[i][j] > p[j][i]) {
                    wins[i] = wins[i] ? [...wins[i], j] : [j]
                }
                // Add empty array object for candidates without wins
                if (!wins[i]) {
                    wins[i] = []
                }
            }
        }
    }
    // Map it, sort it, slice it, map it! Harder better faster stronger! Formats the result.
    let formatted = wins.map((cand, index) => {
        return { cand: index, wins: cand.length }
    }).sort((a, b) => {
        if (a.wins > b.wins) {
            return -1
        } else if (a.wins < b.wins) {
            return 1
        }
        return 0
    }).slice(0, seats).map(cand => cand.cand)

    return formatted
}