// Computing strongest path strength. Variant of the Floyd-Warshall algorithm
for (var i = 0; i < c; i++) {
    for (var j = 0; j < c; j++) {
        if (i !== j) {
            if (d[i][j] > d[j][i]) {
                p[i][j] = d[i][j]
            } else {
                p[i][j] = 0
            }
        }
    }
}

for (var i = 0; i < c; i++) {
    for (var j = 0; j < c; j++) {
        if (i !== j) {
            for (var k = 0; k < c; k++) {
                if (i !== k && j !== k) {
                    p[j][k] = Math.max(p[j][k], Math.min(p[j][i], p[i][k]))
                }
            }
        }
    }
}
