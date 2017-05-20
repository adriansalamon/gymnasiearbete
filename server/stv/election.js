"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_1 = require("./tree");
// Calculates election result in an STV election
function runElection(input, seats) {
    let winners = [];
    let log = [];
    // Droop quota
    const quota = Math.floor((input.length / (seats + 1)) + 1);
    log.push(`Quota: ${quota}`);
    // Build the base tree based in input
    let tree = tree_1.buildTree(input);
    // Loop through while all seats are not filled
    while (seats > winners.length) {
        // Check for winners
        let newWinners = [];
        // Loops through tree
        for (let i = 0; i < tree.length; i++) {
            const cand = tree[i];
            // If the count of candidate is greater than quota and the candidate is not a winner
            if (cand.count >= quota && !winners.includes(cand.cand)) {
                // Add to winners
                winners = [...winners, cand.cand];
                newWinners.push(cand.cand);
            }
        }
        if (newWinners.length > 0) {
            // If there are winners, loop back to beginning
            log.push(`New winners are: ${newWinners.join(', ')}`);
            continue;
        }
        // Check for surplus
        let hadSurplus = [];
        // Loop while there is a surplus of votes for a candidate
        while (tree_1.isSurplus(tree, quota)) {
            // Loop through tree 
            for (let i = 0; i < tree.length; i++) {
                const cand = tree[i];
                if (cand.count >= quota) {
                    // Transfer the surplus
                    tree = [...tree_1.transferSurplus(cand.cand, tree, quota, winners)];
                    hadSurplus.push(cand.cand);
                }
            }
        }
        if (hadSurplus.length > 0) {
            // If someone had surplus, loop back to beginning
            log.push(`Transferred surplus from ${hadSurplus.filter((item, index, array) => array.indexOf(item) === index).join(', ')}`);
            continue;
        }
        // Checks if there are an equal number of candidates left as seats to be elected. If so, elect all
        let allSeatsFilled = false;
        if (tree.length === seats) {
            for (let i = 0; i < tree.length; i++) {
                let cand = tree[i];
                if (!winners.includes(cand.cand)) {
                    allSeatsFilled = true;
                    winners = [...winners, cand.cand];
                }
            }
        }
        if (allSeatsFilled) {
            continue;
        }
        // Eliminate lowest ranked
        // Finds the lowest ranked candidate. This is a bad algorithm I will need to fix later.
        let lowestRanked = 0;
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].count < tree[lowestRanked].count) {
                lowestRanked = i;
            }
        }
        log.push(`Eliminated candidate ${tree[lowestRanked].cand}`);
        // Eliminates candidate
        tree = [...tree_1.eliminate(lowestRanked, tree, winners)];
    }
    log.push('Finished');
    // Returns log and winners
    return { log, winners };
}
exports.default = runElection;
