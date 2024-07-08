# gedcom Subpackage

The **gedcom** subpackage contains functions and scripts to parse a GEDCOM file (that has been processed by file2JsonArray) into a Javascript structure of nested GEDCOM records.

## GedcomRecord.js Defines the GedcomRecord Class

GedcomRecord class instances contain a single record of a GEDCOM file.  Because the GEDCOM file represents a nested file structure, the GedcomRecord class maintains references to its parent record and all its child records.

#### Methods

- context() returns this instance's record type lineage as an array of strings
- content() return this GedcomRecord's content as a (possibly empty) string
- level() returns this instance's nesting level as a base-0 integer
- lineNo() returns this instance's line number in the original GEDCOM file
- lines() returns the number of lines this record occupied in the original GEDCOM file
- parent() returns a reference to this instance's parent GedcomRecord
- subs() returns an array of references to this instance's child GedcomRecord
- type() returns this instance's record type string ('INDI', 'NAME', 'DATE', etc)

## GedcomRecords.js Defines the GedcomRecords Class

The GedcomRecords class holds all the records from a GEDCOM file in a Map() object whose key is the top level 0 record type ('INDI', 'FAM', '_PLAC', etc),
and whose entries are another Map() of all associated level 0 records with their nested subrecords.

The GedcomRecords class is created and hydrated internally by the GedcomReader class constructor.

#### Methods

- **contexts()** returns an array of [context, count] arrays sorted by context
- **dateCreated()** returns the date the GEDCOM file was created
- **findAllContent(key, context, missing='')** finds ALL GedcomRecords matching the *type* and *context* starting at the top level and returns their content strings in an array
- **findAllRecords(key, context)** finds ALL GedcomRecords matching the *type* and *context* starting at the top level and returns their <GedcomRecord> references in an array
- **findFirstContent(key, context, missing='')** finds FIRST GedcomRecords matching the *type* and *context* starting at the top level and returns its contents as a string
- **findFirstRecord(key, context)** finds FIRST GedcomRecords matching the *type* and *context* starting at the top level and returns its reference or NULL
- **findHead(type, key)** returns reference to the Level 0 GedcomRecord with *key*
- **isAncestry()** returns TRUE if the GEDCOM file was created by Ancestry.com
- **isRootsMagic()** returns TRUE if the GEDCOM file was created by RootsMagic

- **topLevel()** returns a reference to the Map() of top-level (Level 0) GedcomRecord instances
- **topLevelCounts()** returns array of [type0, count] arrays of all Level 0 record types
- **topLevelRecordsFor(key)** returns a reference to the Map() of all GedcomRecord instances for top-level *key*

## GedcomReader.js Defins the GedcomReader Class

#### Methods

- **GedcomReader(fileArray)** parses the *fileArray* of GEDCOM records into a GedcomRecords instance.
- **gedcom()** returns the GedcomRecords instance created by the constructor
- **lines()** returns the *fileArray* passed to the constructor
- **messages()** returns a (possibly empoty) array of warning and error messages generated while parsing the GEDCOM file

