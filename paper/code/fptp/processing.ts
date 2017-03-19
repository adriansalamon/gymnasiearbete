let results: Result[] = []
// Loops over prefrences and adds/increments result
for (var i = 0; i < firstPrefrences.length; i++) {
    // Finds index in results array of candidate at i
    let index = results.findIndex(obj => obj.cand === firstPrefrences[i])
    // If candidate is not added to results
    if (index === -1) {
        results.push({ cand: firstPrefrences[i], votes: 1 })
    } else {
        // Increment count if already added in results
        results[index].votes += 1;
    }
}
