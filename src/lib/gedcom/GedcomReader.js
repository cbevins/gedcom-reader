/**
 * Reads an array of GEDCOM file lines, such as those produced by Ancestry.com and Roots Magic,
 * and returns a GedcomRecords instance for subsequent parsing, translation, and analysis.
 * 
 * While the existence of any specific set of GEDCOM record types is not assumed,
 * the following GEDCOM input file format rules are enforced:
 * - Every text line is a series of blank-separated fields
 * - Every text line has at least 2 fields
 * - The first field of every text line is a *level* number [0-n]
 * - If the second field is enclosed in '@' characters, it is a GEDCOM *key*, and the record *type* is then in the third field
 * - Otherwise, the second field is the GEDCOM record *type*
 * - Any fields after the record *type* field are all the record *content*
 */
import { GedcomRecords } from './GedcomRecords.js'

export class GedcomReader {
    constructor(gedcomFileArray) {
        this._data = {
            gedcom: new GedcomRecords(),
            lines: gedcomFileArray,
            lineNo: 0,
            msg: []
        }
        for(let i=0; i<this._data.lines.length; i++) {
            this._parseRecord(this._data.lines[i])
        }
    }

    gedcom() { return this._data.gedcom }
    
    lineNo() { return this._data.lineNo }
    
    lines() { return this._data.lines }
    
    messages() { return this._data.msg }

    _addMsg(msg) { this._data.msg.push(msg) }

    _isKey(field) { return field[0] === '@' }

    _parseRecord(line) {
        this._data.lineNo++
        let fields = line.split(' ')
        if (fields[0] === '') return
        if (fields.length < 2) {
            const msg = `Line ${this.lineNo()} has just ${fields.length} fields: [${line}]`
            console.log(msg, fields)
            this._addMsg(msg)
            return
        }
        // First field must be a level integer (base 0)
        const level = Number(fields[0])

        // If the second field is a @A123@ style GEDCOM key field ...
        if (this._isKey(fields[1])) {
            // ... there must be a third field with the GedcomRecord *type* (like 'INDI' or 'FAM')
            if (fields.length < 3) {
                const msg = `Line ${this.lineNo()} has a key field '${fields[1]}' but no type field`
                console.log('FATAL ERROR', msg)
                throw new Error(msg)
            }
            // (lineNo, level, type, content)
            this.gedcom().addLine(this.lineNo(), level, fields[2], fields[1])
        }
        // otherwise the second field is the GedcomRecord *type* and the remaining fields are the content
        else {
            let content = fields.length > 2 ? fields[2] : ''
            for(let i=3; i<fields.length; i++) content += ' ' + fields[i]
            // (lineNo, level, type, content)
            this.gedcom().addLine(this.lineNo(), level, fields[1], content)
        }
    }
}
