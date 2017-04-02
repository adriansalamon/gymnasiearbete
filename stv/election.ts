import { buildTree, eliminate, isSurplus, transferSurplus } from './tree'

interface Result {
    log: string[],
    winners: number[]
}

// Calculates election result in an STV election
export default function runElection(input: number[][], seats: number): Result {
    let winners: number[] = []
    let log: string[] = []
    // Droop quota
    const quota =  Math.floor((input.length / (seats + 1)) + 1)
    log.push(`Quota: ${quota}`)
    // Build the base tree based in input
    let tree = buildTree(input)

    // Loop through while all seats are not filled
    while(seats > winners.length) {
        // Check for winners
        let newWinners: number[] = []
        // Loops through tree
        for (let i = 0; i < tree.length; i++) {
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
        let hadSurplus: number[] = []
        // Loop while there is a surplus of votes for a candidate
        while(isSurplus(tree, quota)) {
            // Loop through tree 
            for (let i = 0; i < tree.length; i++) {
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

        // Checks if there are an equal number of candidates left as seats to be elected. If so, elect all
        let allSeatsFilled = false
        if (tree.length === seats) {
            for (let i = 0; i < tree.length; i++) {
                let cand = tree[i]
                if (!winners.includes(cand.cand)) {
                    allSeatsFilled = true
                    winners = [...winners, cand.cand]
                }
            }
        }
        if (allSeatsFilled) {
            continue
        }

        // Eliminate lowest ranked
        // Finds the lowest ranked candidate. This is a bad algorithm I will need to fix later.
        let lowestRanked = 0
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].count < tree[lowestRanked].count) {
                lowestRanked = i
            }
        }
        log.push(`Eliminated candidate ${tree[lowestRanked].cand}`)
        // Eliminates candidate
        tree = [ ...eliminate(lowestRanked, tree, winners) ]
    }
    log.push('Finished')
    // Returns log and winners
    return {log, winners}
}