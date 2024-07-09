import fs from 'fs'

export function writeGedcomJsFile(gedcom, outputName, varName='gedcom') {
    // Create some Javascript from the text array
    let js = `// auto-generated by gedcomFile2Array.js on ${new Date().toLocaleString()}\n`
    js += `export const ${varName} = [\n`
    for(let i=0; i<gedcom.length; i++) {
        js += JSON.stringify(gedcom[i]) + ',\n'
    }
    js += ']\n'

    // Write the Javascript to a file for later use
    fs.writeFile(outputName, js, function (err) {
        if (err) throw err
    })
}
