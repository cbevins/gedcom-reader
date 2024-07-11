# file-reader Subpackage

The **file-reader** subpackage contains functions and scripts to:
- asynchronously read newline-delimited text files from the local file system into a simple Javascript array, and
- write the Javascript array as a 'export const varName = [...]' statement to a Javascript file back onto the local file system.

## Function File: **file2JsonArray.js**

**export async function file2JsonArray(fileName, onCloseCallback=null)**

Function that asynchronously reads a newline-delimited text file from the local file system into a plain-old JSON array.

## Script File: **runFile2JsonArray.js**

USAGE: **node runFile2JsonArray.js *inputFileName* [*outputFileName.js*]**

```bash
node runFile2JsonArray.js
```

Reads the **inputFileName** into a JSON array and displays it. Then it creates an executable Javascript statement assigning the array to a **const export** variable.  Finally, it writes the executable JS to the **outputFileName**.

## Sample files

- **Trees.txt** is a sample text input file
- **Trees.js** is the output produced by:

```bash
node runFile2JsonArray.js
```
with no input file name.