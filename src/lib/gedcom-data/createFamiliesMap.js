import { INDEX, LINENO, LEVEL, TYPE, CONTENT, PARENT, CHILDREN } from './_GedcomDataJsArray.js'

export function createFamiliesMap(gedcomDataAccess) {
    const indices = gedcomDataAccess.toplevelIndices('FAM')
    const map = new Map()
    for(let i=0; i<indices.length; i++) {
        const family = createFamily(gedcomDataAccess, indices[i])
        map.set(family.key, family)
    }
    return map
}

/*
                    Ancestry    RootsMagic
    FAM             503         503
    FAM-CHIL        1351        1351
    FAM-DIV-DATE    5           5
    FAM-DIV-PLAC    5           5
    FAM-DIV-SOUR    5           5
    FAM-HUSB        451         451
    FAM-MARR        402         402
    FAM-MARR-DATE   382         382
    FAM-MARR-PLAC   378         378
    FAM-MARR-SOUR   314         314
    FAM-WIFE        436         436
*/

export function createFamily(gedcomDataAccess, headIdx) {
    const gda = gedcomDataAccess

    const disolved = {}
    disolved.date = gda.first(headIdx, ['DIV', 'DATE'], '')
    disolved.place = gda.first(headIdx, ['DIV', 'PLAC'], '')

    const union = {}
    union.date = gda.first(headIdx, ['MARR', 'DATE'], '')
    union.place = gda.first(headIdx, ['MARR', 'PLAC'], '')

    const children = []
    let indices = gda.getContextIndices(headIdx, ['CHIL'])
    for(let i=0; i<indices.length; i++) children.push(gda.field(indices[i], CONTENT))

    const family = {
        key: gda.field(headIdx, CONTENT),
        husband: gda.first(headIdx, ['HUSB'], ''),
        wife: gda.first(headIdx, ['WIFE'], ''),
        children: children,
        union: union,
        disolved: disolved
    }
    return family
}
