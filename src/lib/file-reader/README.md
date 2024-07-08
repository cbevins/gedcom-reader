# file-reader

## Function File: **file2JsonArray.js**

**export async function file2JsonArray(fileName, onCloseCallback=null)**

Function that asynchronously reads a newline-delimited text file from the local file system into a plain-old JSON array.

## Script File: **runFile2JsonArray.js**

USAGE: **node runFile2JsonArray.js *inputFileName* [*outputFileName.js*]**

Reads the **inputFileName** into a JSON array and displays it. Then it creates an executable Javascript statement assigning the array to a const export variable.  Finally, it writes the executable JS to the **outputFileName**.
