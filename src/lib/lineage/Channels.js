/**
 * Lineage data structure used to construct lineage diagrams
 * based on birth date.
 */
import { Lineage } from './Lineage.js'
import { idGenCount } from '../helpers/generations.js'

export class Channels extends Lineage {
    constructor(rootPerson, centerRoot=true, startGen=0, startSeq=1) {
        super(rootPerson, startGen, startSeq)
        this._data.channels = 0     // number of channels
        this._data.yearMax = 0      // earliest ancestral birth year
        this._data.yearMin = 9999   // last ancestral birth year

        this._addAncestorCounts(this.rootNode()) // Lineage class method
        this._decorateNodes()
        this._data.channels = this._traverse(this.rootNode(), 0)
        if (centerRoot) this.centerRootChannel()
        // this._flipFathersChannels()
        // this.summary()
    }

    //--------------------------------------------------------------------------
    // Public property access methods
    //--------------------------------------------------------------------------

    // Moves the subject to a channel midway between father and mother
    centerRootChannel() {
        const root = this.rootNode()
        const f = this.father ? this.father.channel : 1
        const m = this.mother ? this.mother.channel : this.channelMaxCount()
        root.channel = Math.trunc((f + m) / 2)
    }

    // Returns the number of channels in the Lineage
    channelMaxCount() { return this.data().channels }
    
    summary() {
        console.log(`Channels Summary for subject '${this.rootPerson().label()}':`)
        console.log(`  - ${this.years()} years from ${this.yearMin()} - ${this.yearMax()} (grid cols))`)
        console.log(`  - ${this.nodes().length} ancestors `)
        console.log(`  - ${this.channelMaxCount()} channels.`)
    }

    // Returns the total number of years (cols) from min birth through max birth
    years() { return this.yearMax() - this.yearMin() +1 }

    yearMax() { return this.data().yearMax }
    
    yearMin() { return this.data().yearMin }

    // Returns the index into channel.years[yidx] given the year
    yearIdx(year) { return year - this.channel().yearMin }

    // Returns the year given the channel.years[] index
    year(yearIdx) { return this.channel().yearMin + yearIdx }

    //--------------------------------------------------------------------------
    // Private methods
    //--------------------------------------------------------------------------

    // Adds the subject's 'label', 'birthCountry', 'birthState', and 'birthYear' {node} properties.
    // Adds the 'yearMax' and 'yearMin' Channel class properties.
    _decorateNodes() {
        this._data.yearMax = 0      // earliest ancestral birth year
        this._data.yearMin = 9999   // last ancestral birth year
        for(let i=0; i<this.nodes().length; i++) {
            const node = this.node(i)
            node.birthCountry = node.person.birthCountry()
            node.birthState = node.person.birthState()
            node.birthYear = node.person.birthYear()
            node.label = node.person.label()
            node.sheets = new Array(10).fill(false)
            this._data.yearMin = Math.min(this._data.yearMin, node.birthYear)
            this._data.yearMax = Math.max(this._data.yearMax, node.birthYear)
        }
    }

    _flipFathersChannels() {
        const chan = this.rootNode().mother.channel
        for (let i=0; i<this.nodes().length; i++) {
            const cnode = this.node(i)
            if (cnode.channel < chan)  cnode.channel = Math.abs(cnode.channel - chan)
        }
    }
    
    // Adds the subject's 'channel' {node} property.
    // Adds the 'channels' Channel class properties.
    // Returns the next available channel index
    _traverse(node, channel) {
        let chan = channel
        node.channel = channel // channel used to connect this {node} with its child {node}
        const count = idGenCount(node.gen) // number of slots in this generation
        const slot = (node.seq - count)    // slot number (base 0) of this {node}
        if (node.father) {
            chan = this._traverse(node.father, channel)
            if (node.mother) {
                chan = this._traverse(node.mother, chan+1)
            }
        } else if (node.mother) {
            chan = this._traverse(node.mother, channel)
        }
        // console.log(`${channel}, next: ${chan}, ${node.person.label()}`)
        return chan
    }

    // Returns a reference to the {node} with the nameKey, or NULL if not found.
    findNodeByNameKey(nameKey) {
        return this._findNodeByNameKey(this.rootNode(), nameKey)
    }
    _findNodeByNameKey(node, nameKey) {
        // console.log('Checking', node.person.nameKey(), nameKey)
        if (node.person.nameKey() === nameKey) return node
        if (node.father) {
            const found = this._findNodeByNameKey(node.father, nameKey)
            if (found) {
                // console.log('Found', found.person.nameKey(), nameKey)
                return found
            }
        }
        if (node.mother) {
            const found = this._findNodeByNameKey(node.mother, nameKey)
            if (found) {
                // console.log('Found', found.person.nameKey(), nameKey)
                return found
            }
        }
        return null
    }

    // Returns an array of {node} references, sorted by birth date,
    // extracted from the Channels node list, but starting with the {node}
    // matching the nameKey.  Node generation, sequence, channel index, etc
    // are all mainatined relative to the Channels rootNode()
    findBranchByNameKey(nameKey) {
        const node = this.findNodeByNameKey(nameKey)
        if (! node) return null
        const ar = []
        this._getBranch(node, ar)
        return ar.sort((a, b) => { return a.seq - b.seq })

    }
    _getBranch(node, ar) {
        if (node.father) ar = this._getBranch(node.father, ar)
        if (node.mother) ar = this._getBranch(node.mother, ar)
        ar.push(node)
        return ar
    }

    // Clone's the sheetDef,
    // adds a 'sheet.nodes' prop filled its with CLONED nodes with a node.sheets[] property,
    // adds a 'sheet.startNode' property to reference the starting node,
    // adds a 'sheet.channels' property indicating next available channel index
    // Returns a reference to the newly CLONED sheet
    getSheetNodes(sheetDef) {
        const sheet = {...sheetDef}
        sheet.nodes = []
        const startNode = this.findNodeByNameKey(sheet.start)
        if (!startNode) throw new Error(`Bad sheet.start nameKey ${sheet.start}`)
        sheet.startNode = {...startNode}
        this._getSheetNodes(sheet.startNode, sheet)
        this._packChannels(sheet)
        return sheet
    }
    // Adds CLONED nodes to the sheet
    // Each cloned node has a sheets[] property with TRUE where present on a sheet
    _getSheetNodes(node, sheet) {
        let father = null
        let mother = null
        for(let i=0; i<sheet.stops.length; i++) {
            if(node.father) {
                if (node.father.person.nameKey() === sheet.stops[i].after) {
                    father = {...node.father}
                    father.father = null
                    father.mother = null
                    father.sheets[sheet.number] = true
                    sheet.nodes.push(father)
                }
            }
            if (node.mother) {
                if (node.mother.person.nameKey() === sheet.stops[i].after) {
                    mother = {...node.mother}
                    mother.father = null
                    mother.mother = null
                    mother.sheets[sheet.number] = true
                    sheet.nodes.push(mother)
                }
            }
        }
        if (node.father && ! father) this._getSheetNodes(node.father, sheet)
        if (node.mother && ! mother) this._getSheetNodes(node.mother, sheet)
        const self = {...node}
        self.sheets[sheet.number] = true
        sheet.nodes.push(self)
        return sheet
    }
    _packChannels(sheet) {
        const oldChan = new Array(300).fill(0)
        const newChan = new Array(300).fill(0)
        sheet.nodes.forEach((node)=>{oldChan[node.channel]++})
        let counter = 0
        oldChan.forEach((n, idx) => { if (n) newChan[idx] = counter++ })
        sheet.nodes.forEach((node)=>{
            const was = node.channel
            const now = newChan[was]
            // console.log(`${sheet.number}: ${node.label}  ${was} => ${now}`)
            node.channel = now
        })
        sheet.nodes.sort((a, b) => { return a.channel - b.channel })
        return sheet
    }
}