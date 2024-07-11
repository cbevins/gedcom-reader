import { Sylvan } from './Sylvan.js'
import { intFormat } from '../helpers/formatters.js'
import { reviewAll } from './sylvanReviews.js'

// import { _gedcomData } from '../gedcom/_gedcomAncestry.js'
import { _gedcomData } from '../gedcom/_gedcomDataRootsMagic.js'

const sylvan = new Sylvan(_gedcomData)
const reviews =  reviewAll(sylvan)
console.log(`Sylvan   : Created from ${sylvan.source()} GEDCOM file created on ${sylvan.created()}`)
console.log('Places   :', intFormat(sylvan.places().size(), 6))
console.log('People   :', intFormat(sylvan.people().size(), 6))
console.log('Families :', intFormat(sylvan.families().size(), 6))
console.log('Locations:', intFormat(sylvan.locations().size(), 6))
console.log('Reviews  :', intFormat(reviews.length, 6))