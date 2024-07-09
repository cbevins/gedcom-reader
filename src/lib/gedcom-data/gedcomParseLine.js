function isKey(field) { return field[0] === '@' }

// Returns an object {error: <integer>, msg: <string>, lineNo: <integer>, level: <integer>, type: <string>, content: <string>}
export function gedcomParseLine(line, lineNo) {
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
    for(let i=2; i<fields.length; i++) data.content += ' ' + fields[i]
    return data
}
