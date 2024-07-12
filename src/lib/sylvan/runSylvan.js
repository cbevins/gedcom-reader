import { Sylvan } from './Sylvan.js'
import { intFormat } from '../helpers/formatters.js'
import { lineagePathway } from '../lineage/lineagePathway.js'
import { nationalOrigins } from '../lineage/nationalOrigins.js'
import { personProfile } from './personProfile.js'
import { reviewAll } from './sylvanReviews.js'
import { Channels } from '../lineage/Channels.js'
import { GenerationStats } from '../lineage/GenerationStats.js'

// import { _gedcomData } from '../gedcom/_gedcomAncestry.js'
import { _gedcomData } from '../gedcom/_gedcomDataRootsMagic.js'

const Args = [
    ['generations', "display generational stats for 'CollinDouglasBevins1952'"],
    ['origins', "displays national origins for 'CollinDouglasBevins1952'"],
    ['pathway', "displays lineage pathway from 'CollinDouglasBevins1952','HannahHunter1753'"],
    ['profile', "displays Person profile for 'WilliamLongfordBevins1815'"],
    ['summary', "displays Sylvan records summary"],
]

const started = new Date()
const parms = getArgs()
main(parms)
console.log(`\nElapsed : ${(new Date()-started).toString().padStart(5)} msec`)

function getArgs() {
    const parms = {}
    if (process.argv.length < 3) {
        const msg = ['***\n*** usage: node runSylvan.js <args> where <args> are 1 or more of:']
        for(let i=0; i<Args.length; i++) msg.push(`    ${Args[i][0].padEnd(8)} : ${Args[i][1]}`)
        display(msg)
    }
    for (let i=2; i<process.argv.length; i++) {
        parms[(process.argv[i]).toLowerCase()] = true
    }
    return parms
}

function main() {
    const sylvan = new Sylvan(_gedcomData)
    if (parms.generations) display(generations(sylvan, 'CollinDouglasBevins1952'))
    if (parms.origins) display(origins(sylvan, 'CollinDouglasBevins1952'))
    if (parms.pathway) display(pathway(sylvan, 'CollinDouglasBevins1952','HannahHunter1753'))
    if (parms.profile) display(profile(sylvan, 'WilliamLongfordBevins1815'))
    if (parms.summary) display(summary(sylvan))
}

function generations(sylvan) {
    const gen = new GenerationStats(sylvan)
    const subject = sylvan.people().find('CollinDouglasBevins1952')
    gen.calc(subject)
    return gen.lines()
}

function pathway(sylvan, subjectKey, targetKey) {
    const subject = sylvan.people().find(subjectKey)
    const target = sylvan.people().find(targetKey)
    const path = lineagePathway(subject, target).reverse()
    const msg = [[`Lineage pathway from ${subject.fullName()} to ${target.fullName()} has ${path.length} links:`],
        [`  0. ${subject.label()}`]]
    for (let i=0; i< path.length; i++) {
        msg.push(`  ${i+1}: ${path[i][0].fullName()} by ${path[i][1].fullName()}`)
    }
    return msg
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

