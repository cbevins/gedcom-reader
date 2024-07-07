<script>
    import { GedcomReader } from '$lib/gedcom/GedcomReader.js'

    $: fileName = '[No file Selected]'
    $: fileSize = 0
    $: lines = []
    $: time0 = 0
    $: time1 = 0
    $: time2 = 0
    $: time3 = 0
    $: gedcom = null// GedcomRecords instance

    async function readLines(ev) {
        time0 = new Date()
        const text = await readTextFile(ev.target.files[0])
        time1 = new Date()
        
        lines = text.split('\n')
        time2 = new Date()

        gedcom = gedcomLines2Json(lines)
        time3 = new Date()
        // const source = gedcom.isAncestry() ? 'Accestry.com' : 'Roots Magic'
    }

    // Generic function that reads a File from an <input type="file">
    // into an JSON record array.
    async function readTextFile(file) {
        // Not supported in Safari for iOS.
        fileName = file.name ? file.name : 'NOT SUPPORTED'
        // Unknown cross-browser support.
        fileSize = file.size ? file.size : 'NOT SUPPORTED'

        // File.text() (e.g., Blob.text()) is supported by:
        // Chrome >= 76, Jul 2019
        // Chrom for Android >= 126, Jun 10, 2024
        // Edge >= 79, Jan 2020
        // Firefox >= 69, Sep 2019
        // Firefox for Android >= 127, Jun 10, 2024
        // IE - NOT SUPPORTED
        // Opera >= 63, Aug 2019
        // Opera Mini, All
        // Opera Mobile, >= 80, Mar 6, 2024
        // Safari >= 14, Sep 2020
        // Safari for iOS >= 14.5, Apr 25, 2021
        // Samsung Internet >= 12, Jun 29, 2020
        const text = await file.text()
        return text
    }

    // Converts an array of GEDCOM text records into a JSON object
    function gedcomLines2Json(lines) {
        const reader = new GedcomReader(lines)
        return reader.gedcom()
    }
</script>

<h1>Select a File</h1>
<input type="file" id="file-selector" accept=".ged" on:change={readLines}>
<hr>
<table>
    <tr><td>File</td><td>{fileName}</td></tr>
    <tr><td>Bytes</td><td>{fileSize}</td></tr>
    <tr><td>Lines</td><td>{lines.length}</td></tr>
    <tr><td>msec File.text()</td><td>{time1-time0}</td></tr>
    <tr><td>msec text.split()</td><td>{time2-time1}</td></tr>
    <tr><td>msec GedcomReader</td><td>{time3-time2}</td></tr>
    <tr><td>msec total</td><td>{time3-time0}</td></tr>
</table>
