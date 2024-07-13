export function intFmt(val, wid=0, sep=true) { return numFmt(val, 0, wid, sep) }

export function numFmt(val, dec=0, wid=0, sep=true) {
    return val.toLocaleString('en-US', {
        maximumFractionDigits: dec,
        minimumFractionDigits: dec,
        useGrouping: sep
    }).padStart(wid)
}

export function numFmtDemo() {
    // [value, dec, width, comma]
    const v1 = 12345.6789   // 123456789.123456789
    const values = [
        [v1, 0, 0, false],
        [v1, 0, 0, true],
        [v1, 2, 0, true],
        [v1, 2, 12, true],
        [v1, 0, 12, true],
        [v1, 0, 1, true],
    ]
    for(let i=0; i<values.length; i++) {
        const [val, dec, wid, sep] = values[i]
        console.log( `(${val}, ${dec}, ${wid}, ${sep}) => [${fmt(val, dec, wid, sep)}]`)
    }
}