import CandidateNode from './candidate'

export function buildTree(ballots: Array<Array<number>>) {

    const trees = ballots.reduce(addBallot, [])

    function addBallot(tree: Array<CandidateNode>, ballot: Array<number>) {
        let level = tree

        ballot.forEach(addVote)
        return tree

        function addVote(cand: number, index) {
            if (!hasCandidateNode(level, cand)){
                level.push(new CandidateNode(cand, 0))
            }
            const candIndex = level.findIndex(item => item.cand == cand)
            level[candIndex].count += 1
            level = level[candIndex].children

        }
    }
    return trees
}

function hasCandidateNode(level: Array<CandidateNode>, cand: number) {
    return level.some(obj => obj.cand === cand)
}


export function eliminate(lowestRanked: number, tree: Array<CandidateNode>, winners: Array<number>): Array<CandidateNode> {
    let newTree = [...tree]
    let children = newTree[lowestRanked].children
    newTree = [ ...newTree.slice(0, lowestRanked), ...newTree.slice(lowestRanked +1) ]
    //console.log(tree)
    return distribute(children, newTree, winners)
}


export function isSurplus(tree: Array<CandidateNode>, quota: number): boolean {
    let surplus = tree.map(cand => (cand.count > quota)).reduce((a,b) => a || b)
    return surplus
    
}

export function transferSurplus(candNumber: number, tree: Array<CandidateNode>, quota: number, winners: Array<number>): Array<CandidateNode> {
    let candIndex = tree.findIndex(cand => cand.cand === candNumber)
    let cand = tree[candIndex]
    const totalVotes = cand.count
    const surplusVotes = totalVotes - quota
    const surplusFrac = surplusVotes / totalVotes
    const nonSurplusFrac = 1 - surplusFrac

    tree[candIndex] = tree[candIndex].multiply(nonSurplusFrac)
    
    let transferChildren = tree[candIndex].children.map(child => {
        child = child.multiply(surplusFrac)
        return child
    })

    return distribute(transferChildren, tree, winners)    

}

function distribute(treeList: Array<CandidateNode>, tree: Array<CandidateNode>, winners: Array<number>): Array<CandidateNode> {
    for (let i = 0; i < treeList.length; i++) {
        let cand = treeList[i];
        let itExistsInTree = tree.some(obj => obj.cand === cand.cand)
        let isWinner = winners.includes(cand.cand)
        


        if (!itExistsInTree || isWinner) {
            tree = distribute(cand.children, tree, winners)
        } else {
            let treeKey = tree.findIndex(item => item.cand === cand.cand)
            tree[treeKey] = tree[treeKey].add(treeList[i])         
        }
    }
    return tree
}