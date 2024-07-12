/**
 * Determines the representative fraction by country of origin of a subject's ancestors
 * @param {Person} subject 
 * @returns A Map object of country => fraction pairs
 */
export function nationalOrigins(subject) {
    const maternal = subject.mother() ? nationalOrigins(subject.mother()) : new Map([[subject.birthCountry(),1]])
    const paternal = subject.father() ? nationalOrigins(subject.father()) : new Map([[subject.birthCountry(),1]])
    const combined = new Map()
    maternal.forEach((value, key) => { combined.set(key, value/2) })
    paternal.forEach((value, key) => {
        if (combined.has(key)) {
            combined.set(key, (combined.get(key) + value/2))
        } else {
            combined.set(key, value/2)
        }
    })
    return combined
}