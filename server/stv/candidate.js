"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Candidate node in tree
class CandidateNode {
    constructor(cand, count) {
        this.cand = cand;
        this.count = count;
        this.children = [];
    }
    // Add this tree and another tree. Used to merge trees. Returns a new node.
    add(other) {
        // Create new node
        let newNode = new CandidateNode(this.cand, this.count + other.count);
        // Get the children from both nodes
        let children = this.children.map(child => child.cand);
        let otherChildren = other.children.map(child => child.cand);
        // Get the union of all the children
        children = children.concat(otherChildren.filter(child => children.indexOf(child) < 0));
        // Loops through children and pushes them to new node
        for (let i = 0; i < children.length; i++) {
            newNode.children.push(addChildren(this.children, other.children, children[i]));
        }
        return newNode;
    }
    // Multiplies votes for the candidate and its children. Returns a new node. Used when transferring votes.
    multiply(factor) {
        // New node to return
        let newNode = new CandidateNode(this.cand, this.count * factor);
        newNode.children = this.children;
        // Maps over children recursively and multiplies their votes with the same factor
        newNode.children = newNode.children.map(child => {
            return child.multiply(factor);
        });
        return newNode;
    }
}
exports.default = CandidateNode;
// Combines children for two arrays at a specific child and returns a node
function addChildren(aChildren, bChildren, child) {
    // A has the child and B has the child
    const aHas = aChildren.some(obj => obj.cand === child);
    const bHas = bChildren.some(obj => obj.cand === child);
    let aIndex, bIndex;
    // Finds index of child if they exist in array
    if (aHas) {
        aIndex = aChildren.findIndex(item => item.cand === child);
    }
    if (bHas) {
        bIndex = bChildren.findIndex(item => item.cand === child);
    }
    /*
    If they both have the child, add the trees together
    Else return the node that exclusively has the child
    */
    if (aHas && bHas) {
        return aChildren[aIndex].add(bChildren[bIndex]);
    }
    else if (aHas) {
        return aChildren[aIndex];
    }
    else {
        return bChildren[bIndex];
    }
}
