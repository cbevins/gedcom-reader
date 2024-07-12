// Just an example of collecting Person data for a family profile
function noteLines(notes) {
    let a = []
    for (let i=0; i<notes.length; i++) a = a.concat(notes[i].split('/n'))
    return a
}

function notesStr(notes, pad) {
    const lines = noteLines(notes)
    const padding = ''.padStart(pad)
    let str = ''
    for (let i=0; i<lines.length; i++) str += padding + lines[i] + '\n'
    return str
}

export function personProfile(subject, recurse=false) {
    const dashes = '---------------------------------------------'
    const msg = [
        `Name: ${subject.label()}`,
        `Born: ${subject.birthLine()}`,
        `      Notes: ${subject.birthNotes()}`,
        `      Source Keys: ${subject.birthSourceKeys()}`,
        `Died: ${subject.deathLine()}`,
        `      Notes: ${subject.deathNotes()}`,
        `      Source Keys: ${subject.deathSourceKeys()}`,
        `Notes: ${notesStr(subject.notes(), 8)}`,
        `Source Keys: ${subject.sourceKeys()}`,
        dashes,
        `Father:   ${subject.father().fullName()}`,
        `Mother:   ${subject.mother().fullName()}`
    ]

    const siblings = subject.siblings()
    msg.push(`Siblings: ${siblings.length}`)
    for (let i=0; i<siblings.length; i++) msg.push(`          ${siblings[i].fullName()}`)

    msg.push(dashes)
    const families = subject.familySpouses()
    msg.push(`Spouses: ${families.length}`)
    for (let i=0; i<families.length; i++) {
        msg.push(dashes)
        const family = families[i]
        const spouse = (subject === family.xParent()) ? family.yParent() : family.xParent()
        msg.push(`Spouse ${i+1}: ${spouse ? spouse.fullName(): 'unknown'}`)
        msg.push(`Married: ${family.unionLine()}`)
        msg.push(`Marr Notes: ${family.unionNotes()}`)
        msg.push(`Marr Source Keys: ${family.unionSourceKeys()}`)
        msg.push(`Children: ${family.children().length}`)
        for (let j=0; j<family.children().length; j++) {
            const child = family.child(j)
            msg.push(`          ${j+1} ${child.fullName()}`)
        }
    }
    return msg
}
