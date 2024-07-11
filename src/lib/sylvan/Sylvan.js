/**
 */
import { createGedcom } from '../gedcom/createGedcom.js'    // or from '$lib/index.js' if using SvelteKit

import { Locations } from './Locations.js'
import { Families } from './Families.js'
import { People } from './People.js'
import { Places } from './Places.js'

export class Sylvan {
    constructor(_gedcomData) {
        this._data = {
            families: null,     // Families reference
            gedcom: null,       // Gedcom reference
            locations: null,    // Locations reference
            people: null,       // People reference
            places: null,       // Places reference
        }
        this._init(_gedcomData)
    }

    // Returns an array of [context, count] arrays sorted by context
    contexts() { return this.gedcom().contexts() }

    // Returns date the original GEDCOM file was created
    created() { return this.gedcom().findFirstContent('', ['HEAD','DATE']) }

    // Returns an array of [<type>, <text>] pairs
    duplicatePersons() { return this._data.messages.duplicatePersons }

    // Returns reference to a Families instance
    families() { return this._data.families }

    // Returns the name of the original GEDCOM file
    gedcomFile() { return this._data.gedcom.fileName }

    // Returns reference to the Gedcom
    gedcom() { return this._data.gedcom }

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
    source() { return this.gedcom().findFirstContent('', ['HEAD','SOUR','NAME']) }

    // Returns array of [type0, count] arrays of all Level 0 record types
    // topLevelRecords() { return this._data.gedcom.level0 }

    _init(_gedcomData) {
        // Step 1 - Create the Gedcom instance
        this._data.gedcom = createGedcom(_gedcomData)
    
        // Step 2 - Create Places instance
        this._data.places = new Places()
        
        // Step 3 - Create the People instance
        this._data.people = new People(this.gedcom(), this.places())
        
        // Step 4 - Create the Families instance
        this._data.families = new Families(this.gedcom(), this.people(), this.places())

        // Step 5 - Create the Locations instance
        this._data.locations = new Locations(this.gedcom())
    }
}