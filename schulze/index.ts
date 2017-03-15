let fakeData = [[0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 2, 1, 4, 3], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [0, 3, 4, 2, 1], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [1, 4, 3, 0, 2], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 1, 4, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 0, 4, 1, 3], [2, 1, 0, 3, 4], [2, 1, 0, 3, 4], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [3, 2, 4, 1, 0], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2], [4, 1, 0, 3, 2]]


interface PrefrenceThingy {
    a: number,
    b: number,
    num: number
}

function generatePairs(data: Array<Array<number>>): Array<PrefrenceThingy> {
    let result: Array<PrefrenceThingy> = []
    for (var k = 0; k < data.length; k++) {
        var ballot = data[k];

        let over: Array<number> = []
        for (var i = 0; i < ballot.length; i++) {
            var vote = ballot[i];

            for (var j = 0; j < over.length; j++) {
                var overVote = over[j];
                let indexOfPair = result.findIndex(obj => (obj.a === over[j] && obj.b === vote))
                if (indexOfPair !== -1) {
                    result[indexOfPair].num += 1;
                } else {
                    result.push({ a: over[j], b: vote, num: 1 })
                }
            }
            over.push(vote)
        }

    }
    return result
}


let pairs = generatePairs(fakeData)

function d(i: number, j: number) {
    let pairIndex = pairs.findIndex(obj => obj.a === i && obj.b === j)
    if (pairIndex !== -1) 
        return pairs[pairIndex].num
    return 0
}

let c = fakeData[0].length

//console.log(pairs)

let strongestPaths: Array<PrefrenceThingy> = []

for (var i = 0; i < c; i++) {
    for (var j = 0; j < c; j++) {
        if(i !== j) {
            if (d(i,j) > d(j,i)){
                strongestPaths = [...addStrongestPath(i, j, d(i,j), strongestPaths)]
            } else {
                strongestPaths = [...addStrongestPath(i, j, 0, strongestPaths)]
            }
        }        
    }    
}

for (var i = 0; i < c; i++) {
    for (var j = 0; j < c; j++) {
        if (i !== j) {
            for (var k = 0; k < c; k++) {
                if (i !== k && j !== k) {
                   strongestPaths = [...addStrongestPath(j, k, Math.max(getStrongestPath(j,k,strongestPaths), Math.min(getStrongestPath(j,i,strongestPaths), getStrongestPath(i,k,strongestPaths))), strongestPaths)]
                }                
            }
        }
        
    }    
}

function addStrongestPath(a: number, b: number, num: number, strongestPaths: Array<PrefrenceThingy>): Array<PrefrenceThingy> {
    let pathIndex = strongestPaths.findIndex(obj => obj.a === a && obj.b === b)
    strongestPaths.push({a, b, num})
    return strongestPaths
}

function getStrongestPath(a: number, b: number, strongestPaths: Array<PrefrenceThingy>): number {
    let allPaths = strongestPaths.filter(obj => obj.a === a && obj.b === b)
    const values = allPaths.map(val => val.num)
    const maxValue = values.reduce((a, b) => Math.max(a, b))
    return maxValue
}

function sortResult(strongestPaths: Array<PrefrenceThingy>, seats: number): Array<number> {

    let wins: Object = {}
    for (var i = 0; i < c; i++) {
        for (var j = 0; j < c; j++) {
            if(i !== j) {
                if(getStrongestPath(i,j,strongestPaths) > getStrongestPath(j,i,strongestPaths)) {
                    if(wins[i]) {
                        wins[i] = [j, ...wins[i]]
                    } else {
                        wins[i] = [j]
                    }
                }
            }
        }  
    }
    interface test {
        key: number,
        wins: Array<number>
    }
    let arr: Array<test> = []
    let losers: Array<number> = []
    for (var i = 0; i <= Object.keys(wins).length; i++) {
        if (wins[i]) {
            arr.push({key: i, wins: [wins[i]]})
        } else {
            losers.push(i)
        }
        
    }
    arr.sort((a, b) => {
        if (a.wins > b.wins) {
            return -1
        } if (a.wins < b.wins) {
            return 1
        }
        return 0        
    })

    for (var i = 0; i < losers.length; i++) {
        arr.push({key: losers[i], wins: []})
    }

    let result = arr.slice(0,seats).map(val => val.key)
    return result
}

console.log(sortResult(strongestPaths,1))

