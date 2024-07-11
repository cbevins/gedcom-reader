
export function intFormat(val, width=4) {
    return val.toLocaleString('en-US').padStart(width)
}
