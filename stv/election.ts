import { buildTree, eliminate, isSurplus, transferSurplus } from './tree'


export default function runElection(input, seats) {
    let winners: Array<number> = []
    let log: Array<string> = []
    const quota =  Math.floor((input.length / (seats + 1)) + 1)
    let tree = buildTree(input)
    console.log(`Quota: ${quota}`)

    while(seats > winners.length) {
        //console.log(tree)
        // Check for winners
        let newWinners: Array<number> = []
        for (var i = 0; i < tree.length; i++) {
            const cand = tree[i]
            if(cand.count >= quota && !winners.includes(cand.cand)){
                newWinners.push(cand.cand)
                winners = [...winners, cand.cand]
            }
        }
        if (newWinners.length > 0){
            log.push(`New winners are: ${newWinners.join(', ')}`)
            continue
        }
        // Check for surplus
        let hadSurplus: Array<number> = []
        while(isSurplus(tree, quota)) {
            for (var i = 0; i < tree.length; i++) {
                const cand = tree[i]
                if(cand.count >= quota) {
                    hadSurplus.push(cand.cand)
                    tree = [...transferSurplus(cand.cand, tree, quota, winners)]    
                }
            }
        }
        if (hadSurplus.length > 0) {
            log.push(`Transfered surplus from ${hadSurplus.filter((item, index, array) => array.indexOf(item) === index).join(', ')}`)
            continue
        }
        //Eliminate lowest ranked
        let lowestRanked = 0
        for (var i = 0; i < tree.length; i++) {
            if (tree[i].count < tree[lowestRanked].count)
                lowestRanked = i
        }
        log.push(`Eliminated candidate ${tree[lowestRanked].cand}`)
        tree = [ ...eliminate(lowestRanked, tree, winners) ]
    }
    log.push('Finished')
    return {log, winners}
}