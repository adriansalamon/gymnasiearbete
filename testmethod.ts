export function findVariance(numbers: number[]): number {
    let n = numbers.length
    let s = (numbers.reduce((a,b) => a+b)**2)/n
    let sSquared = numbers.map(a => a**2).reduce((a,b) => a+b)

    let d = sSquared - s

    let variance = (d/(n-1))

    return variance
}

