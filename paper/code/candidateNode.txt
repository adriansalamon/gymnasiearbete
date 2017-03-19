class CandidateNode {
  public cand: number
  public count: number
  public children: CandidateNode[]
  // Add this and another branch together. Returns a new branch
  add(other: CandidateNode): CandidateNode {
    //...
  }
  // Multilies the count of this node and all its children and returns the new branch
  multiply(factor: number): CandidateNode {
    //...
  }
}
