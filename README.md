Senior thesis at Kungsholmens gymnasium, Stockholm. 
### Software implementations and analysis of three voting systems
#### Abstract
Various voting methods are in use across the world. They range from simple processes that everyone can understand to complex mathematical systems. This essay examines differences and similarities of the behavior of three voting methods: the Single Transferable Vote (STV), first-past-the-post (FPTP), and Schulze Method. This is done by implementing each voting method in Typescript and then running election data into them. This paper provides descriptions, pseudocode and implementations of each method. A program to generate voting results was developed in order to test the voting methods. The methods are evaluated in both singe-seat and multi-seat elections. No revolutionary results are presented, but the behavior of each method is evaluated experimentally. Several conclusions are drawn about the behavior of the methods, including to what degree the different methods provided proportionate results.

Full paper can be found [here](paper/Opposition.pdf)

#### Code implementation
All individual modules/programs can be found in their respective folders. All source code is commented with documentation and features extensive type annotations. If you want to run the programs yourself, you will first need to transpile all Typescript (`.ts`) files to JavaScript (`.js`) files with the Typescript transpiler. Then you can run any module with Node.js. For example, to run a schulze election:
```javascript
import schulze from '/path/to/schulze'
const ballots = [[0,1,2],[2,1,0],[0,2,1]]
const seats = 1
const result = schulze(ballots, seats)
```
