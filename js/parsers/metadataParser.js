import Papa from 'papaparse';
import chroma from 'chroma-js'; // big import!!!!

/*    metaParser
 * summary of data format:
 * headerNames: array of header names (with type info stripped)
 * headerLookupIdx: corresponding index of header field in the raw data
 *  i.e. the column for headerNames[2] is at index headerLookupIdx[2]
 *  this is becuase there could be columns specifying colour e.t.c.
 * toggles: array of true, as all columns are toggled on at loading
 * info: an array of objects, each corresponding to a column
 *  with keys:
 *    groupId: false || string (e.g. "o1", "c2")
 *    inGroup: bool
 *    type: undefined || "ordinal" || "bool" || "continuous" || "userColours"
 *    userColour" false || int (index of data to find colours)
 * groups: object with keys corresponding to the groupId
 *  keys:
 *    indexes: indexes of data in the raw data (papa) belonging to group
 *    values: sorted values (unique listing)
 *    colours: colours of values (same indexes as values)
 * rawValueSets: sets of values with indexes according to CSV NOT headerIdx
 *    (i.e. this is why you need headerLookupIndex)
 * values: array corresponding to headerNames containing all unique values in column
 * colours: same as values but with hex codes
 *
 * what data is returned:
 *
*/


export function metaParser(csvString) {
  const papa = Papa.parse(csvString);
  const [ headerNames, headerLookupIdx, info, groups ] = getHeaderInfo(papa.data[0]);
  const numColumns = headerNames.length;
  const toggles = Array(...Array(numColumns)).map(()=>true);
  const rawValueSets = getAllValues(papa.data.slice(1), headerLookupIdx); // array of sets

  /* Now that we have rawValueSets, infer the type for those without user defined type */
  for (let i = 0; i < numColumns; i++) {
    if (info[i].type === undefined) {
      info[i].type = classifyValues(new Set(rawValueSets[headerLookupIdx[i]]));
    }
  }

  /* for each column not in a group sort the raw values and store in values array
   * then allocate hex values to colours array
   */
  const colours = [];
  const values = [];
  for (let i = 0; i < numColumns; i++) {
    if (!info[i].inGroup) {
      values[i] = sortValues(rawValueSets[headerLookupIdx[i]], info[i].type);
      if (info[i].type === 'userColours') {
        colours[i] = allocateUserColours(papa.data, values[i], headerLookupIdx[i], info[i].userColour);
      } else {
        colours[i] = populateColours(info[i].type, values[i]);
      }
    }
  }

  /* for those columns in groups, pool all the values & save them, and allocate colours */
  for (const groupId of Object.keys(groups)) {
    const pooledValues = new Set();
    for (const headerIdx of groups[groupId].indexes) {
      rawValueSets[headerIdx].forEach( (v) => {pooledValues.add(v);});
    }
    const groupType = groups[groupId].type;
    groups[groupId].values = sortValues(pooledValues, groupType);
    groups[groupId].colours = populateColours(groupType, groups[groupId].values);
  }

  /* now, for each and every row of the raw data
   * get the taxon and associate it to the index of the value (and therefore colour)
   * of either the values array or the groups.groupId.values array
   */
  const data = {};
  for (const row of papa.data.slice(1)) {
    const taxon = row[0];
    data[taxon] = [];
    for (let headerIdx = 0; headerIdx < numColumns; headerIdx++) {
      const rawValue = row[headerLookupIdx[headerIdx]];
      if (info[headerIdx].inGroup) {
        data[taxon][headerIdx] = groups[info[headerIdx].groupId].values.indexOf(rawValue);
      } else {
        data[taxon][headerIdx] = values[headerIdx].indexOf(rawValue);
      }
      if (data[taxon][headerIdx] === -1) {
        data[taxon][headerIdx] = undefined;
      }
    }
  }

  return { data, values, colours, headerNames, info, toggles, groups };
}

/*      chroma-js
https://vis4.net/blog/posts/mastering-multi-hued-color-scales/
https://github.com/gka/chroma.js
https://vis4.net/blog/posts/avoid-equidistant-hsv-colors/
*/

function populateColours(type, values) {
  const scale = getColourScale(type, values);
  if (type === 'continuous') {
    return (Array(...Array(values.length)).map((e, idx) => scale(values[idx]).hex()));
  }
  return (Array(...Array(values.length)).map((e, idx) => scale(idx).hex()));
}

export function getColourScale(type, values) {
  switch (type) {
  case 'binary':
    return chroma.scale([ 'purple', 'orange' ]).mode('hsl').domain([ 0, 1 ]);
  case 'ordinal':
    return chroma.scale('Spectral').mode('hcl').domain([ values.length, 0 ]);
  case 'continuous':
    const numericalValues = values.map(parseFloat).filter( (e) => !isNaN(e) );
    return chroma.scale([ 'navy', 'orange' ]).mode('lch').domain([ Math.min.apply(null, numericalValues), Math.max.apply(null, numericalValues) ]);
  default:
    throw new Error('getScale fallthrough');
  }
}

function sortValues(vals, type) {
  let ret;
  if (type === 'string') {
    ret = Array.from(vals).sort((a, b)=>a.toLowerCase().localeCompare(b.toLowerCase()));
  } else {
    ret = Array.from(vals).sort( (a, b) => a - b);
  }
  return ret;
}

function classifyValues(vals) {
  const arr = Array.from(vals);
  if (arr.length <= 2) {
    return 'binary';
  }
  if (arr.every( (e) => !isNaN(parseFloat(e)) )) {
    return 'continuous';
  }
  // if (arr.every( (e) => !(parseFloat(e) % 1))) {
  //   return 'ordinal';
  // }
  return 'ordinal';
}
/*    from stackoverflow
function isNumber(obj) { return !isNaN(parseFloat(obj)) }
function isNumeric(num){
    return !isNaN(num)
}
function isInt(n) {
   return n % 1 === 0;
}
*/

function getAllValues(data) {
  const ret = [ undefined ]; // the first entry is taxon names -> don't need
  const numColsInData = data[0].length;
  for (let i = 1; i < numColsInData; i++) {
    const values = new Set;
    for (const row of data) {
      values.add(row[i]);
    }
    values.delete('unknown');
    values.delete('Unknown');
    values.delete(undefined); // not displayed
    values.delete(''); // not displayed
    ret.push(values);
  }
  // dev only
  if (numColsInData !== ret.length) {
    throw new Error('rawValues length != numColsInData');
  }
  return ret;
}

/* getHeaderInfo
 * taking only an array of header strings
 * return:
 *  headerNames (to be used, type info stripped off)
 *  headerLookupIndex (mapping from headerNames -> rawData)
 *  info objects
 *  group objects
 */

function getHeaderInfo(line) {
  const headerNames = [];
  const headerLookupIdx = [];
  const info = [];
  const groups = {};

  // populate the header arrays
  for (let i = 1; i < line.length; i++) {
    let name = line[i];
    // default values
    let inGroup = false;
    let type = undefined;
    let groupId = false;
    let validColumn = true;

    // is there some "type" information in the header?
    if (name.indexOf(':') > -1) {
      const typeString = name.split(':')[1].toLowerCase();
      name = name.split(':')[0];
      if (typeString === 'colour' || typeString === 'color') {
        validColumn = false; // don't use as a column!
        // the name should already have been processed. find the index!
        const headerIdxOfData = headerNames.indexOf(name);
        if (headerIdxOfData > -1) {
          console.log('headerIdxOfData', headerIdxOfData);
          info[headerIdxOfData].userColour = i;
          info[headerIdxOfData].type = 'userColours';
          info[headerIdxOfData].inGroup = false;
          info[headerIdxOfData].groupId = false;
          // check if headerIdxOfData is in some group.indexes and remove
        }
      } else if (typeString.slice(0, 1) === 'o') {
        type = 'ordinal';
      } else if (typeString.slice(0, 1) === 'c') {
        type = 'continuous';
      } else {
        console.log('unknown data type supplied: ', typeString, ' (ignored)');
      }
      if (type && typeString.length > 1) { // colour won't hit this
        inGroup = true;
        groupId = typeString;
        // have we seen this group yet?
        if (!groups[groupId]) {
          groups[groupId] = { indexes: [], type };
        }
        groups[groupId].indexes.push(i);
      }
      // console.log(name);
      // console.log(type);
      // console.log(inGroup);
      // console.log(groupId);
      // console.log(validColumn);
    }

    if (validColumn) {
      headerNames.push(name);
      headerLookupIdx.push(i);
      info.push({
        userColour: false, // may get overwritten later
        type,
        inGroup,
        groupId,
      });
    }
  }
  return [ headerNames, headerLookupIdx, info, groups ];
}


function allocateUserColours(papaData, sortedValues, papaValueIdx, papaColourIdx) {
  const rawValues = [];
  const rawColours = [];
  for (const row of papaData) {
    rawValues.push(row[papaValueIdx]);
    rawColours.push(row[papaColourIdx]);
  }
  const ret = [];
  for (const value of sortedValues) {
    let colour = rawColours[rawValues.indexOf(value)];
    // check it's a valid hex here!
    if (colour.length === 7) {
      if (colour.slice(0, 1) !== '#') {
        // console.log('user colour (', colour, ') not hex 1');
        colour = '#000000'; // blck
      }
    } else if (colour.length === 6) {
      colour = '#' + colour;
    } else {
      // console.log('user colour (', colour, ') not hex 4');
      colour = '#000000'; // blck
    }
    // console.log(value, ' -> ', colour);
    ret.push(colour);
  }
  return ret;
}


