
export function parseLines(lines) {
    let lineNo = 0
    const msg = []
    for(let i=0; i<lines.length; i++) {
        lineNo++
        const line = lines[i]
        const fields = lines.split(' ')
        if (fields.length < 2) {
            msg.push(['WARN', lineNo, 'Line has less than 2 fields'])
        }
        // First field must be a level integer (base 0)
        const level = Number(fields[0])

        // If the second field is like a @A123@ style GEDCOM key field ...
        if (fields[1][0] === '@') {
            // ... there must be a third field with the GedcomRecord *type* (like 'INDI' or 'FAM')
            if (fields.length < 3) {
                msg.push('FATAL', lineNo, `Line has a key field '${fields[1]}' but no record type field`])
            }
            return {}
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
