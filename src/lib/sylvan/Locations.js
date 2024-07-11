export function locations(gedcom) {
    if (gedcom.isRootsMagic()){
        return locationsRootsMagic(gedcom)
    } else {
        return []
        // return placesAncestry(gedcom)
    }
}

// Returns an array of [placeText, placeStnd]
function locationsRootsMagic(gedcom) {
    const places = gedcom.topLevelMap().get('_PLAC')
    console.log(`There are ${places.size} _PLAC records`)
    const ar = []
    for(const [key, record] of places.entries()) {
        const stndRec = gedcom.findFirst(key, ['_PLAC', 'STND'])
        const latiRec = gedcom.findFirst(key, ['_PLAC', 'MAP', 'LATI'])
        const lat = latiRec ? latiRec.content() : 0
        const longRec = gedcom.findFirst(key, ['_PLAC', 'MAP', 'LONG'])
        const lon = longRec ? longRec.content() : 0
        ar.push([record.content(), stndRec.content(), lat, lon])
    }
    return ar.sort()
}

export class Location {
    constructor(key, std, lat, lon) {
        this._data = { key: key, std: std, lat: lat, lon: lon}
    }
}

export class Locations {
    constructor(gedcom) {
        this._data = {
            gedcom: gedcom,
            map: null,
            type: '_PLAC'
        }
        this._init()
    }

    // ----------------------------------------------------------------------
    // Public data access methods
    // ----------------------------------------------------------------------

    gedcom() { return this._data.gedcom }

    get(text) { return this.map().get(text) }

    has(text) { return this.map().has(text) }

    map() { return this._data.map }

    size() { return this.map().size }

    type() { return this._data.type }

    // ----------------------------------------------------------------------
    // Private methods
    // ----------------------------------------------------------------------

    _init() {
        this._data.map = new Map()
        const recsMap = this.gedcom().topLevelRecordsFor(this.type())
        if (recsMap) {
            for(const locKey of recsMap.keys()) {
                const std = this._std(locKey)
                const location = new Location(locKey, std,
                    this._lat(locKey),
                    this._lon(locKey)
                )
                this.map().set(locKey, location)
            }
        }
    }

    // ----------------------------------------------------------------------
    // Private methods for accessing GedcomRecords
    // ----------------------------------------------------------------------
    _lat(key) { return this.gedcom().findFirstContent(key, ['_PLAC', 'MAP', 'LATI']) }
    _lon(key) { return this.gedcom().findFirstContent(key, ['_PLAC', 'MAP', 'LONG']) }
    _std(key) { return this.gedcom().findFirstContent(key, ['_PLAC', 'STND']) }
}
