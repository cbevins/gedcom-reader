/**
 * Collection of review and test methods
 */
export class Review {
    constructor(people, families, places, locations) {
        this._data = {
            families: families,
            people: people,
            places: places,
            locations: locations
        }
    }

    families() { return this._data.families }
    locations() { return this._data.locations }
    people() { return this._data.people }
    places() { return this._data.places }

    // Returns array of *references* to People who are list as children in more than 1 family
    checkMultipleParentalFamilies() {
        const people = []
        for (const [gedKey, person] of this.gedKeyMap().entries()) {
            if (person.familyParents().length > 1) people.push(person)
        }
        return people
    }

    // Returns an array of Persons with more than 1 father
    multipleFathers() {
        const results = []
        for (const [gedKey, person] of this.people().gedKeyMap().entries())
            if (person.fathers().length > 1) results.push(person)
        return results
    }

    multipleFatherMessages() {
        const msg = []
        const persons = this.multipleFathers()
        for (let i=0; i<persons.length; i++) {
            const person = persons[i]
            let str = `Person ${person.label()} has ${person.fathers().length} fathers:`
            for (let j=0; j<person.fathers().length; j++) {
                const father = person.father(j)
                str += ` ${i+1}: ${father.label()} [${father.gedKey()}]`
            }
            msg.push(str)
        }
        return msg
    }

    // Returns an array of Persons with more than 1 mother
    multipleMothers() {
        const results = []
        for (const [gedKey, person] of this.people().gedKeyMap().entries())
            if (person.mothers().length > 1) results.push(person)
        return results
    }

    multipleMotherMessages() {
        const msg = []
        const persons = this.multipleMothers()
        for (let i=0; i<persons.length; i++) {
            const person = persons[i]
            let str = `Person ${person.label()} has ${person.mothers().length} mothers:`
            for (let j=0; j<person.mothers().length; j++) {
                const mother = person.mother(j)
                str += ` ${i+1}: ${mother.label()} [${mother.gedKey()}]`
            }
            msg.push(str)
        }
        return msg
    }
}