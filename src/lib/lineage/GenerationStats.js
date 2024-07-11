import { Ancestors } from './Ancestors.js'
import { GenerationsData } from '../helpers/generations.js'

/**
 * Calculates birth and death year ranges by generation
 */
export class GenerationStats {
    constructor(sylvan) {
        this._data = {
            countries: sylvan.places().countries(),
            gens: [],           // Array of generation data
            sylvan: sylvan,
            totals: null        // Total number of ancestors by country of birth
        }
    }

    country(idx) { return this._data.countries[idx] }
    
    countries() { return this._data.countries }

    gen(idx) { return this._data.gens[idx] }

    gens() { return this._data.gens }

    sylvan() { return this._data.sylvan }

    totals() { return this._data.totals }

    _init() {
        // Create the data structure
        this._data.gens = []
        for (let i=0; i<GenerationsData.length; i++) {
            const record = {birthMin: 9999, birthMax: 0, deathMin: 9999, deathMax: 0, count: 0, country: new Map()}
            for(let j=0; j<this.countries().length; j++) {
                record.country.set(this.country(j), 0)
            }
            this._data.gens.push(record)
        }
        this._data.totals = new Map()
        for(let j=0; j<this.countries().length; j++) {
            this.totals().set(this.country(j), 0)
        }
    }

    // Accumulate stats over the population
    calc(subject) {
        this._init()
        const ancestors = new Ancestors(subject)
        for (const [person, ancestor] of ancestors.map().entries()) {
            const gen = this.gen(ancestor.gen())
            gen.count++
            if (person.birthYear()) {
                gen.birthMax = (person.birthYear() > gen.birthMax) ? person.birthYear() : gen.birthMax
                gen.birthMin = (person.birthYear() < gen.birthMin) ? person.birthYear() : gen.birthMin
            }
            if (person.deathYear()) {
                gen.deathMax = (person.deathYear() > gen.deathMax) ? person.deathYear() : gen.deathMax
                gen.deathMin = (person.deathYear() < gen.deathMin) ? person.deathYear() : gen.deathMin
            }
            gen.country.set(person.birthCountry(), (gen.country.get(person.birthCountry())+1))
            this.totals().set(person.birthCountry(), (this.totals().get(person.birthCountry())+1))
        }
    }

    // Returns generational table as an array of lines
    lines() {
        const lines = []
        // Header row
        let str = 'Gen |  Size | Count | Birth Years | Death Years |'
        for(let i=0; i<this.countries().length; i++) str += ` ${this.country(i).substring(0, 3).padStart(3)} |`
        lines.push(str)
        // Generational rows
        for(let i=0; i<this.gens().length; i++) {
            const gen = this.gen(i)
            if (gen.count) {
                str = `${i.toString().padStart(3)} | ${GenerationsData[i].count.toString().padStart(5)} |`
                str += `${gen.count.toString().padStart(6)} |`
                str += ` ${gen.birthMin} - ${gen.birthMax} | ${gen.deathMin} - ${gen.deathMax.toString().padStart(4)} |`
                for (const [country, count] of gen.country.entries()) {
                    str += count.toString().padStart(4) + ' |'
                }
                lines.push(str)
            }
        }
        // Totals row
        str = '      TOTALS                                    |'
        for (const [country, count] of this.totals().entries()) {
            str += count.toString().padStart(4) + ' |'
        }
        lines.push(str)
        return lines
    }
}