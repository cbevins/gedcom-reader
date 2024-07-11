/**
 * Example of reading a GEDCOM file exported by Ancestry.com or Roots Magic
 * into a GedcomRecords instance for further parsing and analysis.
 */
import { GedcomReader } from './GedcomReader.js'
// import { _gedcomData } from './_gedcomAncestry.js'
import { _gedcomData } from './_gedcomDataRootsMagic.js'

const time1 = new Date()
mission()
const time2 = new Date()
console.log(`Elapsed : ${(time2-time1).toString().padStart(5)} msec`)

function intFormat(val, width=4) { return val.toLocaleString('en-US').padStart(width) }

function mission() {
    // Read the GEDCOM data into a Gedcom instance
    const reader = new GedcomReader(_gedcomData)
    const gedcom = reader.gedcom()

    // Access content of interest from the Gedcom
    const source = gedcom.findFirstContent('', ['HEAD','SOUR','NAME'])
    const created = gedcom.findFirstContent('', ['HEAD','DATE'])

    console.log(`\nRead GEDCOM File ...`)
    console.log(`    ... created by ${source} on ${created}`)
    console.log(`    ... generated ${reader.messages().length} messages:`)
    if (reader.messages().length) console.log(reader.messages())

    // Show the toplevel command set
    const top = gedcom.topLevelCounts()
    console.log(`Resulting GedcomRecords data structure has:`)
    console.log(`  ${top.length} Level 0 record types:`)
    for(const pair of top) console.log(`    ${intFormat(pair[1], 8)} ${pair[0]}`)

    // Show the command contexts
    const contexts = gedcom.contexts()
    console.log(` ${contexts.length} record contexts:`)
    // for(const pair of contexts.sort()) console.log(`  ${pair[1]} ${pair[0]}`)
}
