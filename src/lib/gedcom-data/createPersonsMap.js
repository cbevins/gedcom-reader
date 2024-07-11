import { INDEX, LINENO, LEVEL, TYPE, CONTENT, PARENT, CHILDREN } from './_GedcomDataJsArray.js'

export function createPersonsMap(gedcomDataAccess) {
    const indices = gedcomDataAccess.toplevelIndices('INDI')
    const map = new Map()
    for(let i=0; i<indices.length; i++) {
        const record = createPerson(gedcomDataAccess, indices[i])
        map.set(record.key, record)
    }
    return map
}

/*
    Contexts      Ancestry    RootsMagic
    INDI            1753        1723
    INDI-BIRT       1723        1723
    INDI-BIRT-DATE  1718        1718
    INDI-BIRT-PLAC  1655        1655
    INDI-BIRT-SOUR  1975        1975
    INDI-DEAT       1684        1684
    INDI-DEAT-DATE  1369        1369
    INDI-DEAT-PLAC  1316        1316
    INDI-DEAT-SOUR  793         793
    INDI-FAMC       1351        1351
    INDI-FAMS       887         887
    INDI-NAME       1787        1787
    INDI-NAME-GIVN  1786        1786
    INDI-NAME-NSFX  453         453
    INDI-NAME-SOUR  2732        2732
    INDI-NAME-SUR   1780        1780
    INDI-NOTE       880         880
    INDI-RESI       1379        1379
    INDI-RESI-DATE  1258        1258
    INDI-RESI-PLAC  1365        1365
    INDI-RESI-SOUR  1422        1422
    INDI-SEX        1726        1726
    INDI-SOUR       214         214
*/

export function createPerson(gedcomDataAccess, headIdx) {
    const gda = gedcomDataAccess
    const name = {}
    name.name = gda.first(headIdx, ['NAME'], '')
    name.surname = gda.first(headIdx, ['NAME', 'SURN'], '')
    name.given = gda.first(headIdx, ['NAME', 'GIVN'], '')
    name.suffix = gda.first(headIdx, ['NAME', 'NSFX'], '')

    const full = []
    if (name.given !== '') full.push(name.given)
    if (name.surname !== '') full.push(name.surname.toUpperCase())
    if (name.suffix !== '') full.push(name.suffix)
    name.full = full.join(' ')

    const birth = {}
    birth.date = gda.first(headIdx, ['BIRT', 'DATE'], '')
    birth.place = gda.first(headIdx, ['BIRT', 'PLAC'], '')

    const death = {}
    death.date = gda.first(headIdx, ['DEAT', 'DATE'], '')
    death.place = gda.first(headIdx, ['DEAT', 'PLAC'], '')

    const span = `(${birth.date} - ${death.date})`
    const label = name.full + ' ' + span

    const unions = []
    let indices = gda.getContextIndices(headIdx, ['FAMS'])
    for(let i=0; i<indices.length; i++) unions.push(gda.field(indices[i], CONTENT))

    const families = []
    indices = gda.getContextIndices(headIdx, ['FAMC'])
    for(let i=0; i<indices.length; i++) families.push(gda.field(indices[i], CONTENT))

    const person = {
        key: gda.field(headIdx, CONTENT),
        sex: gda.first(headIdx, ['SEX']),
        name: name,
        birth: birth,
        death: death,
        span: `(${birth.date} - ${death.date})`,
        label: label,
        families: families,
        unions: unions,
        notes: gda.first(headIdx, ['NOTE'], [])
    }
    return person
}
