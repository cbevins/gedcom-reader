import { Sylvan } from './Sylvan.js'
import { intFormat } from '../helpers/formatters.js'
import { reviewAll } from './sylvanReviews.js'
import { Channels } from '../lineage/Channels.js'

// import { _gedcomData } from '../gedcom/_gedcomAncestry.js'
import { _gedcomData } from '../gedcom/_gedcomDataRootsMagic.js'

const sylvan = new Sylvan(_gedcomData)
const reviews =  reviewAll(sylvan)
console.log(`Sylvan    : `)
console.log(`GEDCOM    : ${sylvan.source()}`)
console.log(`Created   : ${sylvan.created()}`)
console.log('Places    :', intFormat(sylvan.places().size(), 6))
console.log('People    :', intFormat(sylvan.people().size(), 6))
console.log('Families  :', intFormat(sylvan.families().size(), 6))
console.log('Locations :', intFormat(sylvan.locations().size(), 6))
console.log('Reviews   :', intFormat(reviews.length, 6))
console.log('Top Levels:', intFormat(sylvan.topLevels().length, 6))
console.log('Contexts  :', intFormat(sylvan.contexts().length, 6))

const person = sylvan.people().find('CollinDouglasBevins1952')
const channels = new Channels(person)
console.log('Lineage   :', intFormat(channels.nodes().length, 6), person.label())
