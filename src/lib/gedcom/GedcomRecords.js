/**
 * The GedcomRecords class holds all the records from a GEDCOM file
 * in a Map() object whose key is the top level 0 record type ('INDI', 'FAM', '_PLAC', etc),
 * and whose entries are another Map() of all associated level 0 records with their nested subrecords.
 * 
 * Usage:
 * The class instances are created and returned by the GedcomReader class:
 *     const reader = new GedcomReader()
 *     const gedrecs = await reader.readFile(gedcomFileName)
 */
import { GedcomRecord } from './GedcomRecord.js'

export class GedcomRecords {
    constructor () {
        this._data = {
            current: null,    // reference to current
            maxLevel: 0,
            topLevel: new Map() // keys are Level 0 GEDCOM type, entries are a Map of GedcomRecord level 0 key-record
        }
    }

    // Creates a new GedcomRecord and adds it to the collection
    // Returns reference to the *current* GedcomRecord
    addLine(lineNo, level, type, content) {
        if (level === 0) {
            // Get (create if necessary) the GedcomRecord Map object for this record *type*
            if (! this.topLevel().has(type)) this.topLevel().set(type, new Map())
            const recMap = this.topLevel().get(type)
            // Create a new GedcomRecord with no parent
            const gedcomRecord = new GedcomRecord(lineNo, level, type, content, null)
            // Add the new GedcomRecord to its record *type* Map object
            recMap.set(content, gedcomRecord)
            // Make the new level 0  record the current record
            this.setCurrent(gedcomRecord)
        }

        // If 'CONC', simply append content to the current record
        else if (type === 'CONC') {
            this.current().addContent(content)
        }
        // If 'CONT', append both a newline and new content to the current record
        else if (type === 'CONT') {
            this.current().addContent('/n' + content)
        }
        // else this is a new record
        else {
            // if necessary, move pointer upwards to line level's parent
            while(this.current().level() >= level) {
                this.setCurrent(this.current().parent())
            }
            // Create a new GedcomRecord
            const gedcomRecord = new GedcomRecord(lineNo, level, type, content, this.current())
            // Add the new GedcomRecord to its parent record's *subs* array
            this.current().addSub(gedcomRecord)
            // Update the current record reference
            this.setCurrent(gedcomRecord)
        }
        if (level > this._data.maxLevel) this._data.maxLevel = level
        return this.current()
    }

    // Returns an array of [context, count] arrays sorted by context
    contexts() {
        const contextMap = new Map()
        for(const [type0, typeMap] of this.topLevel().entries()) {
            const context = []
            for(const [gedKey, gedRec] of typeMap.entries()) {
                this._contextsRecurse(gedRec, context, contextMap)
            }
        }
        return Array.from(contextMap).sort()
    }

    _contextsRecurse(record, context, contextMap) {
        // Add the current record type to the context array
        context.push(record.type())
        // Get the current record count for this context
        const key = context.join('-')
        if (! contextMap.has(key)) contextMap.set(key, 0)
        let n = contextMap.get(key)
        // Update the current record count for this context
        n++
        contextMap.set(key, n)
        // Recurse
        for(let i=0; i<record.subs().length; i++) {
            this._contextsRecurse(record.sub(i), context, contextMap)
        }
        context.pop()
    }

    current() { return this._data.current }

    // Returns the date the GEDCOM file was created
    dateCreated() {
        return this.findFirstContent('', ['HEAD','DATE'])
    }

    // Finds ALL GedcomRecords matching the *type* and *context* starting at the top level
    // and returns their content strings in an array
    findAllContent(key, context, missing='') {
        const recs = this.findAllRecords(key, context)
        const contents = []
        for (let i=0; i<recs.length; i++) contents.push(recs[i].content())
        return contents
    }

    // Finds ALL GedcomRecords matching the *type* and *context* starting at the top level
    // and returns their <GedcomRecord> references in an array
    findAllRecords(key, context) {
        const found = []
        const head = this.findHead(context[0], key)
        if (head) {
            // Recurse through all the sub records matching the context
            this.findRecurse(head, context, 1, found)
        }
        return found
    }

    // Finds FIRST GedcomRecords matching the *type* and *context* starting at the top level
    // and returns its contents as a string
    findFirstContent(key, context, missing='') {
        const rec = this.findFirstRecord(key, context)
        return rec ? rec.content() : missing
    }

    // Finds FIRST GedcomRecords matching the *type* and *context* starting at the top level
    // and returns its reference or NULL
    findFirstRecord(key, context) {
        const recs = this.findAllRecords(key, context)
        return recs.length ? recs[0] : null
    }
    
    // Returns reference to the Level 0 GedcomRecord with *key*
    findHead(type, key) {
        // The top level type must exist
        if (! this.topLevel().has(type)) return null
        const recMap = this.topLevel().get(type)
        // The record key for this top level context[0] must exist
        if (! recMap.has(key)) return null
        return recMap.get(key)
    }

    // Recursive search
    findRecurse(head, context, lvl, found) {
        for(let i=0; i<head.subs().length; i++) {
            const rec = head.sub(i)
            if (rec.type() === context[lvl]) {
                // If there is another contezxt level to test...
                if (lvl+1 < context.length) {
                    this.findRecurse(rec, context, lvl+1, found)
                } else {
                    found.push(rec)
                }
            }
        }
    }

    isAncestry() {
        return this.findFirstContent('', ['HEAD','SOUR','NAME']) === 'Ancestry.com Member Trees'
    }

    isRootsMagic() {
        return this.findFirstContent('', ['HEAD','SOUR','NAME']) === 'RootsMagic'
    }

    setCurrent(gedcomRecord) { this._data.current = gedcomRecord }

    topLevel() { return this._data.topLevel }

    // Returns array of [type0, count] arrays of all Level 0 record types
    topLevelCounts() {
        const data = []
        for(const [type0, typeMap] of this.topLevel().entries()) {
            data.push([type0, typeMap.size])
        }
        return data
    }

    topLevelMap() { return this._data.topLevel }

    topLevelRecordsFor(key) {
        return this.topLevel().get(key)
    }
}