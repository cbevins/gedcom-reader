import { Place } from './Place.js'
import {Countries, Regions, States} from './_placesData.js'

export class Places {
    constructor() {
        this._data = {
            textMap: new Map()  // PLAC content => Place
        }
    }

    // ----------------------------------------------------------------------
    // Public data access methods
    // ----------------------------------------------------------------------

    countries() {
        const country = new Set()
        for(const [text, place] of this.map().entries()) {
            country.add(place.country())
        }
        return Array.from(country).sort()
    }

    get(text) { return this.map().get(text) }

    has(text) { return this.map().has(text) }

    map() { return this._data.textMap }

    // ----------------------------------------------------------------------
    // Private methods
    // ----------------------------------------------------------------------

    // text is, hopefully, a comma-delimited place name
    parsePlace(text) {
        const [parts, messages] = this._recodePlace(text)
        if (! this.has(text)) {
            this.map().set(text, new Place(text, parts, messages))
        }
        const place = this.get(text)
        place.increment()
        return place
    }

    size() { return this.map().size }

    // Attempts to resolve each segment into a standard place string.
    // Returns an array of place name segments and error messages
    _recodePlace(text) {
        if (! text || text === '') return [[], ['missing place text']]
        const messages = []
        // Split place name on commas, trim, and convert to lowercase
        const fields = text.split(',')
        const parts = [] 
        for (let i=0; i<fields.length; i++) {
            fields[i] = fields[i].trim()
            if (fields[i] !== '') parts.push(fields[i].toLowerCase())
        }

        let country = null
        let state = null
        // Last field must be a known country
        if (parts.length) {
            let last = parts[parts.length-1]
            if (Countries.has(last)) {
                country = Countries.get(last)
                parts.pop()
            }
            else if (States.has(last)) { // If the last field is a known state or region, add the country
                country = 'USA'
                state = States.get(last)
                parts.pop()
            } else if (Regions.has(last)) {
                [state, country] = Regions.get(last)
                parts.pop()
            } else {
                messages.push(`unknown country [${text}]`)
            }
        }

        // Second to last field, if present, must be a known state, province, or region
        if (country && ! state && parts.length) {
            let last = parts[parts.length-1]
            if (States.has(last)) {
                state = States.get(last)
                parts.pop()
            } else if (Regions.has(last)) {
                state = Regions.get(last)[0]
                parts.pop()
            } else {
                messages.push(`unknown state [${text}]`)
            }
        }

        // Check all other fields for a possible recode
        const segments = []
        for (let i=0; i<parts.length; i++) {
            segments.push(fields[i])
        }
        segments.push(state ? state : 'unknown state')
        segments.push(country ? country : 'unknown country')
        return [segments, messages]
    }
}