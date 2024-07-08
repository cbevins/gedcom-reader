/**
 * Returns a newline-delimited text file as an array of plain-old JSON strings.
 */
import fs from 'fs'
import readline from 'readline'

export async function file2JsonArray(fileName, onCloseCallback=null) {
    const stream = fs.createReadStream(fileName)
    const reader = readline.createInterface({ input: stream })
    reader.on('error', (err) => { throw new Error(`Unable to read file '${fileName}': ${err}`) })
    reader.on('close', () => { if (onCloseCallback) onCloseCallback(this) })
    const lines = []
    for await (const line of reader) { lines.push(line) }
    return lines
}
