// d[i][j] gives the number of ballots preferring i > j
let d: PairMap = getPairs(input)
// o[i][j] stores the strongest path between i and j
let p: PairMap = {}
// Number of candidates
let c = input[0].length
