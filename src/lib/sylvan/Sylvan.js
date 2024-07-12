/**
 * Sylvan holds all the pertinent genealogy data from a Gedcom,
 * complete with hydrated with objects references.
 * No reference is stored to the Gedcom so that it may be garbage collected.
 */
import { constructGedcom } from '../gedcom/constructGedcom.js'    // or from '$lib/index.js' if using SvelteKit

import { Locations } from './Locations.js'
import { Families } from './Families.js'
import { People } from './People.js'
import { Places } from './Places.js'

export class Sylvan {
    constructor(_gedcomData) {
        this._data = {
            families: null,     // Families reference
            info: {             // additional items so we can release _gedcomData
                contexts: [],
                created: '',
                source: '',
                topLevels: [],
            },
            locations: null,    // Locations reference
            people: null,       // People reference
            places: null,       // Places reference
        }
        this._init(_gedcomData)
    }

    // Returns an array of [context, count] arrays sorted by context
    contexts() { return this.info().contexts }

    // Returns date the original GEDCOM file was created
    created() { return this.info().created }

    // Returns an array of [<type>, <text>] pairs
    duplicatePersons() { return this._data.messages.duplicatePersons }

    info() { return this._data.info }

    // Returns reference to a Families instance
    families() { return this._data.families }

    // Returns reference to a Locations instance
    locations() { return this._data.locations }

    // Returns an array of Persons with more than 1 father
    multipleFathers() { return this._data.messages.multipleFathers }
    
    // Returns an array of Persons with more than 1 mother
    multipleMothers() { return this._data.messages.multipleMothers }

    // Returns reference to a People instance
    people() { return this._data.people }

    // Returns reference to a Places instance
    places() { return this._data.places }

    // Returns name of the GEDCOM file source
    source() { return this.info().source }

    // Returns array of [type0, count] arrays of all Level 0 record types
    topLevels() { return this.info().topLevels }

    _init(_gedcomData) {
        // Step 1 - Create the Gedcom instance
        const gedcom = constructGedcom(_gedcomData)
    
        // Step 2 - Create Places instance
        this._data.places = new Places()
        
        // Step 3 - Create the People instance
        this._data.people = new People(gedcom, this.places())
        
        // Step 4 - Create the Families instance
        this._data.families = new Families(gedcom, this.people(), this.places())

        // Step 5 - Create the Locations instance
        this._data.locations = new Locations(gedcom)

        // Step 6 - STore any additional info from _gedcomData, so we can garbage collect it
        this._data.info.contexts = gedcom.contexts()
        this._data.info.created = gedcom.findFirstContent('', ['HEAD','DATE'])
        this._data.info.source = gedcom.findFirstContent('', ['HEAD','SOUR','NAME'])
        this._data.info.topLevels = Array.from(gedcom.topLevelMap())
    }
}