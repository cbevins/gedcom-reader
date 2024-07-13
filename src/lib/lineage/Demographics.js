export class Demographics {
    constructor(persons) {
        this._data = {
            cols: ['1400s', '1500s', '1600s', '1700s', '1800s', '1900s', '2000s', 'Totals'],
            persons: persons,
            props: ['Age at Death', 'Number of Spouses', 'Number of Children'],
            rows: ['Female', 'Male', 'Totals'],
            stats: [],
            yearCats: [1500, 1600, 1700, 1800, 1900, 2000, 2100]
        }
        this.collectData(persons)
    }
    col(idx) { return this._data.cols[idx] }
    cols() { return this._data.cols }
    prop(idx) { return this._data.props[idx] }
    props() { return this._data.props }
    row(idx) { return this._data.rows[idx] }
    rows() { return this._data.rows }
    stat(idx) { return this._data.stats[idx] }
    stats() { return this._data.stats }

    // row is gender [0-1] and col is century [0-6]
    // values is an array of [years, spouses, children]
    _addDatum(row, col, values) {
        // Gender-Century crosstab totals
        let idx = col + row * this.cols().length
        this._addDataRec(idx, values)
        // Gender category totals (idx 5, 11)
        idx = ((row+1) * this.cols().length) - 1
        this._addDataRec(idx, values)
        // Century category totals
        idx = (this.rows().length-1) * this.cols().length + col
        this._addDataRec(idx, values)
        // Grand totals
        idx = this.rows().length * this.cols().length - 1
        this._addDataRec(idx, values)
    }

    _addDataRec(idx, values) {
        const d = this.stats()[idx]
        for(let i=0; i<values.length; i++) {
            const prop = d.props[i]
            prop.n++
            prop.sum += values[i]
            prop.mean = (prop.sum / prop.n) // .toFixed(2)
            if (values[i] > prop.max) prop.max = values[i] // .toFixed(2)
        }
    }

    _century(year) {
        const cats = this._data.yearCats
        for (let i=0; i<cats.length-1; i++) {   // 0-6 are centuries, 7 is total
            if (year <= cats[i]) return i
        }
        return cats.length - 1
    }

    _init() {
        this._data.stats = []
        for(let row=0; row<this.rows().length; row++) {
            for(let col=0; col<this.cols().length; col++) {
                this._data.stats.push({row: row, col: col, props: [
                    {n: 0, sum: 0, mean: 0, max: 0},    // 0 = AGE
                    {n: 0, sum: 0, mean: 0, max: 0},    // 1 = SPOUSE
                    {n: 0, sum: 0, mean: 0, max: 0}]    // 2 = CHILD
                })
            }
        }
    }

    collectData(persons) {
        this._init()
        for (let i=0; i<persons.length; i++) {
            const person = persons[i]
            if (person.birthYear() && person.deathYear()) {
                const gender = person.isFemale() ? 0 : 1
                const century = this._century(person.birthYear())
                // Calculate age at death
                const ages = person.age()
                const decAge = ages[0] + (ages[1] ? (ages[1]-1)/12 + ages[2]/30/12 : 0)
                this._addDatum(gender, century, [decAge, person.spouses().length, person.children().length])
            }
        }
    }

    // Demonstrates how to display the Demographic table
    // 0=age, 1=spouses, 2=children
    ageDemographics() { return this.demoArray(0) }
    chilrenDemographics() { return this.demoArray(1) }
    spouseDemographics() { return this.demoArray(2) }
    demoArray(propIdx=0) {
        const msg = ['']
        let n = 2
        msg.push(`                Demographics for: ${this.prop(propIdx)}`)
        let idx
        let str = 'Gender   Prop'
        for(let col=0; col<this.cols().length; col++) {
            str += this.col(col).toString().padStart(8, ' ')
        }
        msg.push(str)
        for(let row=0; row<this.rows().length; row++) {
            str = (this.row(row)).padEnd(8, ' ') + ' Mean'
            idx = row * this.cols().length
            for(let col=0; col<this.cols().length; col++) {
                const prop = this.stat(idx).props[propIdx]
                // console.log('Column', col, 'Mean',prop.mean, 'N', prop.n)
                str += (prop.mean).toFixed(n).padStart(8, ' ')
                idx++
            }
            msg.push(str)

            str = (this.row(row)).padEnd(8, ' ') + ' Max '
            idx = row * this.cols().length
            for(let col=0; col<this.cols().length; col++) {
                const prop = this.stat(idx).props[propIdx]
                str += (prop.max).toFixed(n).padStart(8, ' ')
                idx++
            }
            msg.push(str)

            str = (this.row(row)).padEnd(8, ' ') + ' N   '
            idx = row * this.cols().length
            for(let col=0; col<this.cols().length; col++) {
                const prop = this.stat(idx).props[propIdx]
                str += (prop.n).toFixed(0).padStart(8, ' ')
                idx++
            }
            msg.push(str)
        }
        return msg
    }
}
