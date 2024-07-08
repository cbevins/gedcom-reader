/**
 * Example of reading a GEDCOM file exported by Ancestry.com or Roots Magic
 * into a GedcomRecords instance for further parsing and analysis.
 */
import { file2JsonArray } from '../index.js'
import { GedcomReader } from './GedcomReader.js'
const ancestry = "../data/Ancestry.ged"
const rootsMagic = "../data/RootsMagic.ged"
const fileName = rootsMagic

const time1 = new Date()
await mission()
const time2 = new Date()
console.log(`Elapsed : ${(time2-time1).toString().padStart(5)} msec`)

async function mission() {
    // Read the GEDCOM text file into an array of text lines
    const lines = await file2JsonArray(fileName)

    // Read the text lines and parse them into a GedcomRecords instance
    const reader = new GedcomReader(lines)

    // Get the new GedcomRecords instance from the GedcomReader
    const gedcom = reader.gedcom()

    // Display some info about it
    const source = gedcom.isAncestry() ? 'Accestry.com' : 'Roots Magic'
    const created = gedcom.dateCreated()
    console.log(`\nRead GEDCOM File '${fileName}' ...`)
    console.log(`    ... created by ${source} on ${created}`)
    console.log(`    ... contains ${reader.lines().length.toLocaleString('en-US')} lines and generated ${reader.messages().length} messages:`)
    if (reader.messages().length) console.log(reader.messages())

    const top = gedcom.topLevelCounts()
    console.log(`Resulting GedcomRecords data structure has:`)
    console.log(`  ${top.length} Level 0 record types:`)
    for(const pair of top) console.log(`    ${pair[1]} ${pair[0]}`)

    const contexts = gedcom.contexts()
    console.log(` ${contexts.length} record contexts:`)
    // for(const pair of contexts) console.log(`  ${pair[1]} ${pair[0]}`)
}
