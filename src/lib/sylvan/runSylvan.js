import { Sylvan } from './Sylvan.js'
import { intFormat } from '../helpers/formatters.js'
import { nationalOrigins } from '../lineage/nationalOrigins.js'
import { personProfile } from './personProfile.js'
import { reviewAll } from './sylvanReviews.js'
import { Channels } from '../lineage/Channels.js'

// import { _gedcomData } from '../gedcom/_gedcomAncestry.js'
import { _gedcomData } from '../gedcom/_gedcomDataRootsMagic.js'

const time1 = new Date()
const parms = getArgs()
main(parms)
const time2 = new Date()
console.log(`\nElapsed : ${(time2-time1).toString().padStart(5)} msec`)

function main() {
    const sylvan = new Sylvan(_gedcomData)
    if (parms.origins) display(origins(sylvan, 'CollinDouglasBevins1952'))
    if (parms.profile) display(profile(sylvan, 'WilliamLongfordBevins1815'))
    if (parms.summary) display(summary(sylvan))
}

function display(lines) { console.log(lines.join('\n')) }

function origins(sylvan, nameKey) {
    const person = sylvan.people().find(nameKey)
    let msg = [`National Origins for ${person.label()}`]
    const map = nationalOrigins(person)
    const ar = Array.from(map).sort((a,b) => { return b[1] - a[1]})
    for (let i=0; i<ar.length; i++) {
        const [country, value] = ar[i]
        msg.push(`${country.padEnd(16)} ${value.toFixed(6)}`)
    }
    return msg
}

// Illustrates how to hydrate the entire GEDCOM Tree
function profile(sylvan, nameKey) {
    const person = sylvan.people().find(nameKey)
    return personProfile(person)
}

function displayProfile(sylvan) {
    const people = sylvan.people()
    const subject = people.find('CollinDouglasBevins1952')
    // console.log(profile(subject))
    return
}

function summary(sylvan) {
    const reviews =  reviewAll(sylvan)
    return [`Sylvan Summary`,
        `GEDCOM    : ${sylvan.source()}`,
        `Created   : ${sylvan.created()}`,
        `Places    : ${intFormat(sylvan.places().size(), 6)}`,
        `People    : ${intFormat(sylvan.people().size(), 6)}`,
        `Places    : ${intFormat(sylvan.places().size(), 6)}`,
        `Families  : ${intFormat(sylvan.families().size(), 6)}`,
        `Locations : ${intFormat(sylvan.locations().size(), 6)}`,
        `Reviews   : ${intFormat(reviews.length, 6)}`,
        `Top Levels: ${intFormat(sylvan.topLevels().length, 6)}`,
        `Contexts  : ${intFormat(sylvan.contexts().length, 6)}`]
}

function getArgs() {
    if (process.argv.length < 3) {
        console.log('***\n*** usage: node runSylvan.js ["summary", "origins",  "profile"] where:')
        // console.log("   ancestors: displays my ancestors")
        // console.log("   block: displays GEDCOM top level block for 'INDI @I896@'")
        // console.log("   contexts: displays all the GEDCOM record type contexts and their counts")
        // console.log("   demographics: displays demographics for CDB")
        // console.log("   find: displays finding all the GEDCOM records for @I896@ with context INDI-NAME-GIVN")
        // console.log("   lineage: displays lineage from CDB to Hannah Hunter")
        console.log("   origins: displays national origins for 'CollinDouglasBevins1952'")
        // console.log("   nodes: FamilyTree and FamilyTreeNodes")
        console.log("   profile: displays Person profile for 'WilliamLongfordBevins1815'")
        console.log("   summary: displays Sylvan records summary")
        // console.log("   toplevels: displays all the GEDCOM Level 0 command types and their counts")
        // console.log("   vines: displays the family Vine and VineNodes")
        // process.exit()
    }
    const parms = {}
    for (let i=2; i<process.argv.length; i++) {
        const arg = (process.argv[i]).toLowerCase()
        const a = arg.substring(0, 1)
        if (a === 's') parms.summary = true
        // else if (a === 'b') parms.block = true
        // else if (a === 'c') parms.contexts = true
        // else if (a === 'd') parms.demographics = true
        // else if (a === 'f') parms.findall = true
        // else if (a === 'g') parms.generations = true
        // else if (a === 'l') parms.lineage = true
        // else if (a === 'n') parms.familyTree = true
        else if (a === 'o') parms.origins = true
        else if (a === 'p') parms.profile = true
        // else if (a === 't') parms.toplevels = true
        // else if (a === 'v') parms.vines = true
    }
    return parms
}

