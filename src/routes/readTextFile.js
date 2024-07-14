
// Generic function that reads a **File** object from an <input type="file"> into an JSON record array.
export async function readTextFile(file) {
    console.log('Rading')
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
