import { file2JsonArray } from '../index.js'
import { parseGedcomTextLines } from './parseGedcomTextLines.js'
import { writeGedcomJsFile } from './writeGedcomJsFile.js'

function intFormat(val, width=4) { return val.toLocaleString('en-US').padStart(width) }

const fileName = '../data/RootsMagic.ged'   // './Sample.ged'
const outputName = 'Sample.js'

const time1 = new Date()
const lines = await file2JsonArray(fileName)
const time2 = new Date()
const gedcom = parseGedcomTextLines(lines)
const time3 = new Date()
writeGedcomJsFile(gedcom, outputName)
const time4 = new Date()

console.log(`${fileName} with ${lines.length} lines has ${gedcom.length} records.`)
console.log(`file2JsonArray()  : ${intFormat(time2-time1)} msec`)
console.log(`gedcomFile2Array() : ${intFormat(time3-time2)} msec`)
console.log(`writeGedcomFile() : ${intFormat(time4-time3)} msec`)
