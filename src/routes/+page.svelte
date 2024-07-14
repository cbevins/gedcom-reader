<script>
    $: fileName = '[No file Selected]'
    $: fileSize = 0
    $: text = 'None'
    $: settings = {name: 'No one', age: 0, city: 'Nowhere'}

    async function readLines(ev) {
        text = await readTextFile(ev.target.files[0])
        try {
            settings = JSON.parse(text)
        } catch (e) {
            return console.error(e)
        }
        console.log('SETTINGS', settings)
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

<h1>Select a File</h1>
<input type="file" id="file-selector" accept="*" on:change={readLines}>
<hr>
{text}
<hr>
{settings.name} is {settings.age} years old and lives in {settings.city}.
