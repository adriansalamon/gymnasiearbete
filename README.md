Paper can be found [here](paper/paper.pdf). All individual modules/programs can be found in their respective folders. All source code is commented with documentation. If you want to run the programs yourself, you will first need to transpile all .ts files to .js files with the typescript transpiler. Then you can run any module with node.js. For example, to run a shulze election:
```javascript
import schulze from '/path/to/schulze'
const ballots = [[0,1,2],[2,1,0],[0,2,1]]
const seats = 1
const result = schulze(ballots, seats)
