"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Calculates  result in a Schulze method election
function calculateResult(input, seats) {
    // Gets the pairs of candidates and their count
    // Ex 120 votes prefer a > b
    // d[i][j] gives the number of ballots preferring candidate i > j
    let d = getPairs(input);
    // o[i][j] stores the strongest path between candidate i and j
    let p = {};
    // Number of candidates
    let c = input[0].length;
    // Fills p with a bunch of zeroes
    for (let i = 0; i < c; i++) {
        p[i] = {};
        for (let j = 0; j < c; j++) {
            if (i !== j) {
                p[i][j] = 0;
            }
        }
    }
    // Computing strongest path strength. variant of the Floyd-Warshall algorithm
    for (let i = 0; i < c; i++) {
        for (let j = 0; j < c; j++) {
            if (i !== j) {
                if (d[i][j] > d[j][i]) {
                    p[i][j] = d[i][j];
                }
                else {
                    p[i][j] = 0;
                }
            }
        }
    }
    for (let i = 0; i < c; i++) {
        for (let j = 0; j < c; j++) {
            if (i !== j) {
                for (let k = 0; k < c; k++) {
                    if (i !== k && j !== k) {
                        p[j][k] = Math.max(p[j][k], Math.min(p[j][i], p[i][k]));
                    }
                }
            }
        }
    }
    // Gets the result
    let result = getResult(p, c, seats);
    return result;
}
exports.default = calculateResult;
// Gets the pairwise comparison between all candidates and the number of preferences. Ex. 120 ballots prefer a > b
function getPairs(ballots) {
    let p = {};
    // Loops through all ballots
    for (let k = 0; k < ballots.length; k++) {
        let ballot = ballots[k];
        // Temp array that stores which candidates are preferred over current candidate in the loop
        let preferred = [];
        //Loops through each ballot
        for (let i = 0; i < ballot.length; i++) {
            let vote = ballot[i];
            // Loops through the preferred array
            for (let j = 0; j < preferred.length; j++) {
                // Current preferred vote
                let preferredVote = preferred[j];
                // Gets the index of where preferred vote > vote are stored
                p[preferredVote] = p[preferredVote] || {};
                p[preferredVote][vote] = p[preferredVote][vote] + 1 || 1;
            }
            // Prefers current candidate over next candidates in loop
            preferred.push(vote);
        }
    }
    return p;
}
// Processes, formats and returns result
function getResult(p, c, seats) {
    let wins = [];
    // Loops through the strongest paths
    for (let i = 0; i < c; i++) {
        for (let j = 0; j < c; j++) {
            if (i !== j) {
                // If path is stronger between i and j than j and i, i wins over j
                if (p[i][j] > p[j][i]) {
                    wins[i] = wins[i] ? [...wins[i], j] : [j];
                }
                // Add empty array object for candidates without wins
                if (!wins[i]) {
                    wins[i] = [];
                }
            }
        }
    }
    // Map it, sort it, slice it, map it! Harder better faster stronger! Formats the result.
    let formatted = wins.map((cand, index) => {
        return { cand: index, wins: cand.length };
    }).sort((a, b) => {
        if (a.wins > b.wins) {
            return -1;
        }
        else if (a.wins < b.wins) {
            return 1;
        }
        return 0;
    }).slice(0, seats).map(cand => cand.cand);
    return formatted;
}
