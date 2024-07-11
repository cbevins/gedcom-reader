// Returns an array of records from the GEDCOM file *lines* array
export function parseGedcomTextLines(lines) {
    // Each record is an array of:
    const INDEX = 0     // rec[INDEX] is the records index in the GEDCOM array
    const LINENO = 1    // rec[LINENO] is the original GEDCOM file line number
    const LEVEL = 2     // rec[LEVEL] is the base 0 record hierarchical level
    const TYPE = 3      // rec[TYPE]
    const CONTENT = 4   // rec[CONTENT]
    const PARENT = 5    // rec[PARENT] contains index of parent, or 0 if no parent (level 0)
    const CHILDREN = 6  // rec[CHILDREN] contains a (possibly empty) array of child indixes

    const ar = [[0, 0, -1, '', '', 0, []]]
    let prevRec = ar[0]
    const stack = []
    for(let i=0; i<lines.length; i++) {
        const data = parseGedcomTextLine(lines[i], i+1)
        // Handle errors
        if (data.error) console.log(data.msg)
        if (data.error === 2) throw new Error(data.msg)
        
        // If 'CONC', simply append content to the current record
        if (data.type === 'CONC') {
            prevRec[CONTENT] += data.content
        }
        // If 'CONT', append both a newline and new content to the current record
        else if (data.type === 'CONT') {
            prevRec[CONTENT] += '/n' + data.content
        }
        // else this is a new record
        else {
            data.index = ar.length
            data.children = []
            if (data.level > prevRec[LEVEL]) {          // If this records descends a LEVEL...
                data.parent = prevRec[INDEX]                // make the previous record this record's PARENT
            } else if (data.level === prevRec[LEVEL]) { // Else if this record is at the same LEVEL as the previous record ...
                data.parent = prevRec[PARENT]               // this record has the same PARENT as the previous record
            } else {                                    // If this record ascends 1 OR MORE LEVELs...
                for(let idx=data.index-1; idx>=0; idx-=1) {  // Traverse up the array until we find the parent
                    if (ar[idx][LEVEL] === data.level-1) {  // If the upper record is one at the LEVEL above this record...
                        data.parent = ar[idx][INDEX]        // set the upper record as this record's PAREMT
                        break
                    }
                }
            }
            // console.log(lines[i], data)
            // const p = ar[data.parent]
            // console.log(`LINE ${data.lineNo} '${data.level} ${data.type}' PARENT IS LINE ${p[LINENO]} '${p[LEVEL]} ${p[TYPE]}'`)
            ar[data.parent][CHILDREN].push(data.index)  // add this record to the parent record's CHILDREN
            ar.push([data.index, data.lineNo, data.level, data.type, data.content, data.parent, data.children])
            prevRec = ar[ar.length-1]
        }
    }
    // for(let i=0; i<ar.length; i++) ar[i][CONTENT] = JSON.stringify(ar[i][CONTENT])
    return ar
}

function isKey(field) { return field[0] === '@' }

// Returns an object {error: <integer>, msg: <string>, lineNo: <integer>, level: <integer>, type: <string>, content: <string>}
export function parseGedcomTextLine(line, lineNo) {
    const data = {error: 0, msg: '', lineNo: lineNo, level: 0, type: '', content: ''}
    let fields = line.split(' ')
    if (fields[0] === '') {
        data.error = 1 // warning
        data.msg = `Line ${lineNo} is empty: [$line}]`
        return data
    }

    // First field must be a level integer (base 0)
    data.level = Number(fields[0])

    if (fields.length < 2) {
        data.error = 1 // warning
        data.msg = `Line ${lineNo} has just ${fields.length} fields: [${line}]`
        return data
    }

    // If the second field is a @A123@ style GEDCOM key field ...
    if (isKey(fields[1])) {
        // ... there must be a third field with the GedcomRecord *type* (like 'INDI' or 'FAM')
        if (fields.length < 3) {
            data.error = 2 // fatal
            data.msg = `FATAL: Line ${lineNo} has a key field '${fields[1]}' but no type field: [${line}]`
            return data
        }
        data.type = fields[2]
        data.content = fields[1]
        return data
    }

    // Otherwise the second field is the Gedcom record *type* and the remaining fields are the content
    data.type = fields[1]
    fields.shift()
    fields.shift()
    data.content = fields.join(' ')
    return data
}
