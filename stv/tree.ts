import CandidateNode from './candidate'

// Builds the initial tree structure
export function buildTree(ballots: number[][]): CandidateNode[] {

    // Reduces the ballots into a tree via the addBallot function
    const trees = ballots.reduce(addBallot, [])

    // Reducer function for the ballots
    function addBallot(tree: CandidateNode[], ballot: number[]) {
        let level = tree

        // For each vote in ballot, call the addVote function
        ballot.forEach(addVote)

        // Return the tree for next iteration of the reducer function
        return tree

        function addVote(cand: number, index: number) {
            // Create node if node candidate does not have not at the specific level
            if (!hasCandidateNode(level, cand)){
                level.push(new CandidateNode(cand, 0))
            }
            // Find index of current candidate in tree
            const candIndex = level.findIndex(item => item.cand === cand)
            // Increment the count for the node
            level[candIndex].count += 1
            // Move down one level
            level = level[candIndex].children

        }
    }
    return trees
}

// Checks if candidate has a node already at a level.
function hasCandidateNode(level: CandidateNode[], cand: number): boolean {
    return level.some(obj => obj.cand === cand)
}

// Eliminates a candidate, returns a new tree.
export function eliminate(lowestRanked: number, tree: CandidateNode[], winners: number[]): CandidateNode[] {
    // New tree
    let newTree = [...tree]
    // Save the children for transferring
    let children = newTree[lowestRanked].children
    // Remove node from array
    newTree = [ ...newTree.slice(0, lowestRanked), ...newTree.slice(lowestRanked +1) ]
    // Distribute the children onto the tree i.e transferring
    return distribute(children, newTree, winners)
}

// Checks if any candidate has surplus votes
export function isSurplus(tree: CandidateNode[], quota: number): boolean {
    // Maps array and compares count to quota and then reduces to find if any comparison returned true.
    let surplus = tree.map(cand => (cand.count > quota)).reduce((a,b) => a || b)
    return surplus
}

// Transfers the surplus from a candidate. Returns a new tree.
export function transferSurplus(candNumber: number, tree: CandidateNode[], quota: number, winners: number[]): CandidateNode[] {
    // Find index of candidate in tree
    let candIndex = tree.findIndex(cand => cand.cand === candNumber)
    let cand = tree[candIndex]
    const totalVotes = cand.count
    const surplusVotes = totalVotes - quota
    const surplusFrac = surplusVotes / totalVotes
    const nonSurplusFrac = 1 - surplusFrac

    // Multiplies values in surplus branch to decrease to be equal to quota
    tree[candIndex] = tree[candIndex].multiply(nonSurplusFrac)
    
    // Maps over all the children, multiplies their branches by the surplus fraction and returns.
    let transferChildren = tree[candIndex].children.map(child => {
        child = child.multiply(surplusFrac)
        return child
    })

    // Distributes the tree of children into the tree. 
    return distribute(transferChildren, tree, winners)    

}

// Distributes a list of nodes onto the tree. Returns a new tree.
function distribute(nodeList: CandidateNode[], tree: CandidateNode[], winners: number[]): CandidateNode[] {
    // Loops through each candidate node in the list
    for (let i = 0; i < nodeList.length; i++) {
        let cand = nodeList[i]
        // Find if candidate is in the tree and/or is a winner
        let itExistsInTree = tree.some(obj => obj.cand === cand.cand)
        let isWinner = winners.includes(cand.cand)
        
        // If it doesn't exist in tree (eliminated or no votes) or is a winner, distribute its children instead (recursive).
        if (!itExistsInTree || isWinner) {
            tree = distribute(cand.children, tree, winners)
        } else {
            // Find the index of candidate in tree
            let treeIndex = tree.findIndex(item => item.cand === cand.cand)
            // Add the trees/branches together
            tree[treeIndex] = tree[treeIndex].add(nodeList[i])         
        }
    }
    return tree
}