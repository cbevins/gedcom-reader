# **helpers** Subpackage

The **helpers** Subpackage is a collection of miscellaneous routines shared by multiple subpackages.

- formatters.js
    - export function intFmt(val, width=0, separators=true)
    - export function numFmt(val, decimals=0, width=0, separators=true)

- generations.js
    - export const GenerationsData = []

    - export function idGen(id)
    
    - export function idGenAbbr(id) { return idGen(id).abbr }

    - export function idGenCount(id) { return idGen(id).count }

    - export function idGenFrom(id) { return idGen(id).from }

    - export function idGenIdx(id) { return idGen(id).gen }

    - export function idGenName(id) { return idGen(id).name }

    - export function idGenSlot(id) { return id - idGen(id).from }

    - export function idGenThru(id) { return idGen(id).thru }
