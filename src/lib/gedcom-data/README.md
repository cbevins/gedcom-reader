# **gedcom-data** Subpackage

The **gedcom-data** subpackage explores an alternative method for getting GEDCOM data into the client-side browser.  The aim is to avoid forcing the server to send the GEDCOM file to the client on the initial invocation, and then having to reload and reprocess it with every page load.

The **gedcomFile2Array.js** script:
- reads a GEDCOM text file produced by either Ancestry.com or RootsMagic,
- parses each record into an array containing of [array index, line number, hierarchy level, record type, record contents],
- links each record to its parent and children using array indices, rather than references, thus enabling it to be stored as a netwrok-transportable data file,
- writing all the records to a Javascript file as a simple array.

Any Javascript file on the client-side may then easily import the (persistent) gedcom data for further processing and analysis:
```js
import { gedcomData } from './gedcomData.js'
```

Additional functions will be added to search the array to, for example,
- create *Person* instances,
- *Lineage* chains,
- process *Date* and/or *Place* objects.


#### Search Methods

- new Gedcom(gedcomDataArray)

- **contexts()** returns an array of [context, count] arrays sorted by context

- **dateCreated()** returns the date the GEDCOM file was created

- **findAllContent(key, context, missing='')** finds ALL GedcomRecords matching the *type* and *context* starting at the top level and returns their content strings in an array

- **findAllRecords(key, context)** finds ALL GedcomRecords matching the *type* and *context* starting at the top level and returns their GedcomRecord references in an array

- **findFirstContent(key, context, missing='')** finds FIRST GedcomRecords matching the *type* and *context* starting at the top level and returns its contents as a string

- **findFirstRecord(key, context)** finds FIRST GedcomRecords matching the *type* and *context* starting at the top level and returns its reference or NULL

- **findHead(type, key)** returns reference to the Level 0 GedcomRecord with *key*

- **isAncestry()** returns TRUE if the GEDCOM file was created by Ancestry.com

- **isRootsMagic()** returns TRUE if the GEDCOM file was created by RootsMagic

- **topLevel()** returns a reference to the Map() of top-level (Level 0) GedcomRecord instances

- **topLevelCounts()** returns array of [type0, count] arrays of all Level 0 record types

- **topLevelRecordsFor(key)** returns a reference to the Map() of all GedcomRecord instances for top-level *key*
