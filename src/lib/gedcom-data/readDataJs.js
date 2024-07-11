import { gedcomData } from './_GedcomDataJsArray.js'
import { familiesMap } from './_FamiliesMap.js'
import { personsMap } from './_PersonsMap.js'

console.log('GedcomDataJsArray length:', gedcomData.length)
console.log('FamiliesMap size        :', familiesMap.size)
console.log('PersonsMap size         :', personsMap.size)
console.log(personsMap.get('@I874@'))
console.log(familiesMap.get('@F239@'))
console.log(familiesMap.get('@F385@'))

// Get parents
const childKey = "@I861@"
const childRec = personsMap.get(childKey)
const fatherRec = fatherOfKey(childKey)
console.log(`The father of ${childRec.label} is ${fatherRec.label}`)

function fatherOfKey(childKey) {
    const childRec = personsMap.get(childKey)
    const familyRec = familiesMap.get(childRec.families[0])
    return personsMap.get(familyRec.husband)
}