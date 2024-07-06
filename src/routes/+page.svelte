<script>
    $: fileName = '[No file Selected]'
    $: fileSize = 0
    $: lines = []
    $: time1 = 0
    $: time2 = 0

    async function readLines(ev) {
        const file = ev.target.files[0]
        // Not supported in Safari for iOS.
        fileName = file.name ? file.name : 'NOT SUPPORTED'
        // Not supported in Firefox for Android or Opera for Android.
        const type = file.type ? file.type : 'NOT SUPPORTED'
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
        const time0 = new Date()
        const text = await file.text()
        time1 = new Date() - time0
        lines = text.split('\n')
        time2 = new Date() - time0 - time1
    }
</script>

<h1>Select a File</h1>
<input type="file" id="file-selector" accept=".ged" on:change={readLines}>
<hr>
<table>
    <tr><td>File</td><td>{fileName}</td></tr>
    <tr><td>Bytes</td><td>{fileSize}</td></tr>
    <tr><td>Lines</td><td>{lines.length}</td></tr>
    <tr><td>msec for text()</td><td>{time1}</td></tr>
    <tr><td>msec to split()</td><td>{time2}</td></tr>
</table>
