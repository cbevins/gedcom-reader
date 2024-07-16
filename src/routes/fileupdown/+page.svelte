<script>
    $: fileName = '[No file Selected]'
    $: fileSize = 0
    $: text = 'None'
    $: settings0 = {name: 'No one', age: 0, city: 'Nowhere'}
    $: settings1 = {name: 'No one', age: 0, city: 'Nowhere'}
    $: dataBlob = new Blob([JSON.stringify(settings1, null, 2)], {
            type: "application/json",})
    $: dataUrl = URL.createObjectURL(dataBlob)

    async function readLines(ev) {
        text = await readTextFile(ev.target.files[0])
        try {
            settings0 = JSON.parse(text)
        } catch (e) {
            return console.error(e)
        }

        // The following should got in an editor onChange callback function
        // Pretend user has edited the downloaded settings...
        settings1 = {...settings0, updated: new Date(), age: 73, name: 'Bumpa'}

        dataBlob = new Blob([JSON.stringify(settings1, null, 2)], {
            type: "application/json",})
        URL.revokeObjectURL(dataUrl)
        dataUrl = URL.createObjectURL(dataBlob)
    }

    // Generic function that reads a File from an <input type="file"> into an JSON record array.
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
</script>
<div class="container">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/fileupdown">File Upload Download</a></li>
        <li><a href="/svgbutton">SVG Button</a></li>
    </ul>
    <hr>
    <h1>Select a Settings File</h1>
    <input type="file" id="file-selector" accept="*" on:change={readLines}>
    <hr>
    
    <h2>Last Saved Settings</h2>
    {text}
    <hr>
    
    <h2>Settings Editor</h2>
    <p>
        {settings1.name} is {settings1.age} years old and lives in {settings1.city}.
    </p>
    <hr>
    <a id="dwn" href={dataUrl} download><h3>Save Edited Settings</h3></a>
    The settings will be downloaded to your device as <b>{dataUrl}</b>
</div>
