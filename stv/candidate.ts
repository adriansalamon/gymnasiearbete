export default class CandidateNode {
    public cand: number
    public count: number
    public children: Array<CandidateNode>
    constructor(cand: number, count: number) {
        this.cand = cand;
        this.count = count;
        this.children = []
    }

    toString(): string {
        return `[ ${this.cand.toString()}: ${this.count} ]`
    }

    // Used to merge trees
    add(other: CandidateNode): CandidateNode {
        let newNode = new CandidateNode(this.cand, this.count + other.count)

        let children = this.children.map(child => child.cand)
        let otherChildren = other.children.map(child => child.cand)
        
        children = children.concat(otherChildren.filter(child => children.indexOf(child) < 0))

        for (var i = 0; i < children.length; i++) {
            newNode.children.push(addChildren(this.children, other.children, children[i]))
        }

        return newNode
    
    }

    multiply(scale: number): CandidateNode {
        let newNode = new CandidateNode(this.cand, this.count * scale)
        newNode.children = this.children
        newNode.children = newNode.children.map(child => {
            return child.multiply(scale)
        })
        return newNode
    }
}

function addChildren(a: Array<CandidateNode>, b: Array<CandidateNode>, child: number) {
    const aHas = a.some(obj => obj.cand === child)
    const bHas = b.some(obj => obj.cand === child)
    let aIndex, bIndex;
    if (aHas)
        aIndex = a.findIndex(item => item.cand == child)
    if (bHas)
        bIndex = b.findIndex(item => item.cand == child)

    if (aHas && bHas)
        return a[aIndex].add(b[bIndex])
    else if (aHas)
        return a[aIndex]
    else
        return b[bIndex]
}


function buildTree(ballots: Array<Array<number>>) {

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