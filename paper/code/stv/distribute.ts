// Distributes nodes onto the tree. Returns new tree.
function distribute(nodeList: CandidateNode[], tree: CandidateNode[], winners: number[]): CandidateNode[] {
    // Loops through each candidate node in the list
    for (let i = 0; i < nodeList.length; i++) {
        let cand = nodeList[i];
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
