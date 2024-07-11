// Helper class to read a GEDCOM Javascript data file and access its record contents
export const INDEX = 0    // rec[INDEX] is this record's index integer in the gedcomData GEDCOM array below
export const LINENO = 1   // rec[LINENO] is the record's original GEDCOM file line number integer
export const LEVEL = 2    // rec[LEVEL] is the record's base 0 GEDCOM hierarchical level integer
export const TYPE = 3     // rec[TYPE] is the record's type string, like 'INDI', 'FAM', 'DATE', 'PLAC', etc.
export const CONTENT = 4  // rec[CONTENT] is whatever string content the record may contain
export const PARENT = 5   // rec[PARENT] is this record's parent array index integer, or 0 if no parent (level 0)
export const CHILDREN = 6 // rec[CHILDREN] is a (possibly empty) array of this record's child array indices

export class GedcomDataAccess {
    constructor(gedcomDataArray) {
        this._data = {gedcom: gedcomDataArray}
    }

    // Returns an array of all the *indices* of the parent record's children with the specifid type
    childIndices(parentIdx, type=null) {
        const children = this.field(parentIdx, CHILDREN)
        if (!type) return children
        const list = []
        for(let i=0; i<children.length; i++) {
            if (this.field(children[i], TYPE) === type) list.push(children[i])
        }
        return list
    }

    getContextContents(headIdx, context) {
        if (!Array.isArray(context)) context = [context]
        const ar = []
        const found = this.getContextIndices(headIdx, context)
        for (let i=0; i<found.length; i++) ar.push(this.field(found[i], CONTENT)) 
        return ar
    }

    // Shorter call
    first(headIdx, context, missing=null) { return this.getFirstContextContent(headIdx, context, missing) }

    getFirstContextContent(headIdx, context, missing=null) {
        if (!Array.isArray(context)) context = [context]
        const found = this.getContextContents(headIdx, context)
        return found.length ? found[0] : missing
    }

    getContextIndices(headIdx, context) {
        if (!Array.isArray(context)) context = [context]
        return this._getContextIndex(headIdx, context)
    }

    _getContextIndex(headIdx, context, found=[]) {
        const type = context.shift()
        // Get every immediate child with this type
        const children = this.childIndices(headIdx, type)
        if (! children.length) return found
        // If end of context chain, return all the found children
        if (! context.length) return found.concat(children)
        // Search each matching child for the next subcontext
        for (let i=0; i<children.length; i++) {
            found = found.concat(this._getContextIndex(children[i], context))
        }
        return found
    }

    // Returns index of a toplevel record with *key*
    // i.e., getKeyedRecord('INDI', '@I875') returns the record index for '0 INDI @I875@'
    getKeyedRecordIndex(type, key) {
        const recs = this.toplevelIndices(type)
        for(let i=0; i<recs.length; i++) {
            if (this.field(recs[i], CONTENT) === key) return recs[i]
        }
        return 0
    }

    // Returns the field value for record[idx]
    field(idx, field) { return this._data.gedcom[idx][field] }
    
    // Return reference to the entire record array
    gedcomData() { return this._data.gedcom }
    
    // Returns the entire record (array) for record[idx]
    record(idx) { return this._data.gedcom[idx] }

    // Returns an array of all the *indices* of the top level (Level 0) records with the specifid type
    toplevelIndices(type=null) { return this.childIndices(0, type) }
}
