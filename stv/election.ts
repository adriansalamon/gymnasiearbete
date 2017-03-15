import { buildTree, eliminate, isSurplus, transferSurplus } from './tree'

interface Result {
    log: Array<string>,
    winners: Array<number>
}

// Calculates election result in an STV election
export default function runElection(input: Array<Array<number>>, seats: number): Result {
    let winners: Array<number> = []
    let log: Array<string> = []
    // Droop quota
    const quota =  Math.floor((input.length / (seats + 1)) + 1)
    log.push(`Quota: ${quota}`)

    // Build the base tree based in input
    let tree = buildTree(input)

    var fs = require('fs')
    fs.writeFile('initialInput.json', JSON.stringify(input))
    fs.writeFile('initialTree.json', JSON.stringify(tree))

    // Loop through while all seats are not filled
    while(seats > winners.length) {
        // Check for winners
        let newWinners: Array<number> = []
        // Loops through tree
        for (var i = 0; i < tree.length; i++) {
            const cand = tree[i]
            // If the count of candidate is greater than quota and the candidate is not a winner
            if(cand.count >= quota && !winners.includes(cand.cand)){
                // Add to winners
                winners = [...winners, cand.cand]
                newWinners.push(cand.cand)
            }
        }
        if (newWinners.length > 0){
            // If there are winners, loop back to beginning
            log.push(`New winners are: ${newWinners.join(', ')}`)
            continue
        }
        // Check for surplus
        let hadSurplus: Array<number> = []
        // Loop while there is a surplus of votes for a candidate
        while(isSurplus(tree, quota)) {
            // Loop through tree 
            for (var i = 0; i < tree.length; i++) {
                const cand = tree[i]
                if(cand.count >= quota) {
                    // Transfer the surplus
                    tree = [...transferSurplus(cand.cand, tree, quota, winners)]    
                    hadSurplus.push(cand.cand)
                }
            }
        }
        if (hadSurplus.length > 0) {
            // If someone had surplus, loop back to beginning
            log.push(`Transfered surplus from ${hadSurplus.filter((item, index, array) => array.indexOf(item) === index).join(', ')}`)
            continue
        }
        // Eliminate lowest ranked
        // Finds the lowest ranked candidate. This is a bad algorithm I will need to fix later.
        let lowestRanked = 0
        for (var i = 0; i < tree.length; i++) {
            if (tree[i].count < tree[lowestRanked].count)
                lowestRanked = i
        }
        log.push(`Eliminated candidate ${tree[lowestRanked].cand}`)
        // Eliminates candidate
        tree = [ ...eliminate(lowestRanked, tree, winners) ]
    }
    log.push('Finished')
    // Returns log and winners
    return {log, winners}
}