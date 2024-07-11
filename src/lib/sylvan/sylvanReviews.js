// Returns an array of [<errorType>, <details>] arrays
export function reviewAll(sylvan) {
    let ar = []
    ar.concat(
        multipleMotherMessages(sylvan.people()),
        multipleFatherMessages(sylvan.people()),
        multipleParentalFamiliesMessages(sylvan.people())
    )
    return ar
}

// Returns an array of references to Persons with more than 1 father
export function multipleFathers(people) {
    const results = []
    for (const [gedKey, person] of people.gedKeyMap().entries())
        if (person.fathers().length > 1) results.push(person)
    return results
}

// Returns an array of ['MULTIPLE FATHERS', <details>] arrays
export function multipleFatherMessages(people) {
    const msg = []
    const persons = multipleFathers(people)
    // console.log('Fathers', persons.length)
    for (let i=0; i<persons.length; i++) {
        const person = persons[i]
        let str = `Person ${person.label()} has ${person.fathers().length} fathers:`
        for (let j=0; j<person.fathers().length; j++) {
            const father = person.father(j)
            str += ` ${i+1}: ${father.label()} [${father.gedKey()}]`
        }
        msg.push(['MULTIPLE FATHERS', str])
    }
    return msg
}

// Returns an array of references to Persons with more than 1 mother
export function multipleMothers(people) {
    const results = []
    for (const [gedKey, person] of people.gedKeyMap().entries())
        if (person.mothers().length > 1) results.push(person)
    return results
}

// Returns an array of ['MULTIPLE MOTHERS', <details>] arrays
export function multipleMotherMessages(people) {
    const msg = []
    const persons = multipleMothers(people)
    // console.log('Mothers', persons.length)
    for (let i=0; i<persons.length; i++) {
        const person = persons[i]
        let str = `Person ${person.label()} has ${person.mothers().length} mothers:`
        for (let j=0; j<person.mothers().length; j++) {
            const mother = person.mother(j)
            str += ` ${i+1}: ${mother.label()} [${mother.gedKey()}]`
        }
        msg.push(['MULTIPLE MOTHERS', str])
    }
    return msg
}

// Returns array of references to People who are listed as children in more than 1 family
export function multipleParentalFamilies(people) {
    const results = []
    for (const [gedKey, person] of people.gedKeyMap().entries()) {
        if (person.familyParents().length > 1) results.push(person)
    }
    return results
}

// Returns an array of ['MULTIPLE MOTHERS', <details>] arrays
export function multipleParentalFamiliesMessages(people) {
    const msg = []
    const persons = multipleParentalFamilies(people)
    // console.log('Families', persons.length)
    for (let i=0; i<persons.length; i++) {
        const person = persons[i]
        let str = `Person ${person.label()} has ${person.familyParents().length} parental families:`
        msg.push(['MULTIPLE PARENTAL FAMILIES', str])
    }
    return msg
}
