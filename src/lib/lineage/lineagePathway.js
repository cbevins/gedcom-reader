/**
 * Determines the lineage path between two generations of Persons.
 * @param {*} subject Person at bottom of the lineage
 * @param {*} target Person at the top of the lineage
 * @returns An array of [Person, Person] pairs, where
 *  the first Person is the ancestor of lineage and the second Person is the consort,
 *  and the top of the lineage is the first element
 *  and the subject Person is NOT appended to the array
 */
export function lineagePathway(subject, target) {
    const path = []
    lineage(subject, target, path)
    return path
}

function lineage(subject, target, path=[]) {
    if (subject === target) {
        return path
    } else if (subject.mother() && lineage(subject.mother(), target, path)) {
        path.push([subject.mother(), subject.father()])
        return path
    } else if (subject.father() && lineage(subject.father(), target, path)) {
        path.push([subject.father(), subject.mother()])
        return path
    }
    return false
}
