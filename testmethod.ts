export function findStandardDeviation(numbers: number[]): number {
    let n = numbers.length
    let s = (numbers.reduce((a,b) => a+b)**2)/n
    let sSquared = numbers.map(a => a**2).reduce((a,b) => a+b)

    let d = sSquared - s

    let standardDeviation = (d/(n))**0.5

    return standardDeviation
}

