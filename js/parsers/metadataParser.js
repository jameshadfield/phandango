import Papa from 'papaparse';
import chroma from 'chroma-js'; // big import!!!!

/*    metaParser

*/
export function metaParser(csvString) {
  const papa = Papa.parse(csvString);
  const [ headerNames, headerLookupIdx, info, groups ] = getHeaderInfo(papa.data[0]);
  const numFields = headerNames.length;
  const toggles = Array(...Array(numFields)).map(()=>true);
  const rawValues = getAllValues(papa.data.slice(1), headerLookupIdx); // set
  // dev only
  // console.log('headerLookupIdx: ', headerLookupIdx);
  // console.log('rawValues: ', rawValues);

  // classify the (sets of) rawValues, then sort them
  const values = []; // sorted
  for (let i = 0; i < numFields; i++) {
    if (!info[i].userTypeDefined) {
      info[i].type = classifyValues(new Set(rawValues[i]));
    }
    values[i] = sortValues(rawValues[i], info[i].type);
  }

  // for the groups -> pool values and give them a colour scale
  for (const groupId of Object.keys(groups)) {
    const pooledValues = new Set();
    for (const headerIdx of groups[groupId].indexes) {
      rawValues[headerIdx - 1].forEach( (v) => {pooledValues.add(v);});
    }
    const groupType = info[groups[groupId].indexes[0]].type;
    groups[groupId].sortedValues = sortValues(pooledValues, groupType);
    groups[groupId].scale = getColourScale(groupType, groups[groupId].sortedValues.length);
  }

  // associate with a colour
  const colours = [];
  // process each column seperately
  for (let i = 0; i < numFields; i++) {
    const n = values[i].length;
    if (info[i].inGroup) {
      const groupId = info[i].groupId;
      colours[i] = Array(...Array(n)).map(
        (e, idx) => {
          // work out idx of value in group values
          const idxInGroup = groups[groupId].sortedValues.indexOf(values[i][idx]);
          // assign colour
          return groups[groupId].scale(idxInGroup).hex();
        }
      );
    } else {
      const scale = getColourScale(info[i].type, n);
      colours[i] = Array(...Array(n)).map((e, idx) => scale(idx).hex());
    }
  }

  // create the actual data mapping
  const data = {};
  for (const row of papa.data.slice(1)) {
    data[row[0]] = [];
    for (let retIdx = 0; retIdx < headerLookupIdx.length; retIdx++) {
      const value = row[headerLookupIdx[retIdx]];
      const valueIdx = values[retIdx].indexOf(value);
      if (valueIdx === -1) {
        data[row[0]][retIdx] = undefined;
      } else {
        data[row[0]][retIdx] = valueIdx;
      }
    }
  }
  // debugger;
  // console.log('------ returns-----', { data, values, colours, headerNames, info, toggles });
  return { data, values, colours, headerNames, info, toggles };
}

/*      chroma-js
https://vis4.net/blog/posts/mastering-multi-hued-color-scales/
https://github.com/gka/chroma.js
https://vis4.net/blog/posts/avoid-equidistant-hsv-colors/
*/
export function getColourScale(type, n) {
  switch (type) {
  case 'binary':
    return chroma.scale([ 'purple', 'orange' ]).mode('hsl').domain([ 0, 1 ]);
  case 'ordinal':
    return chroma.scale('Spectral').mode('hcl').domain([ n, 0 ]);
  case 'continuous':
    return chroma.scale([ 'navy', 'orange' ]).mode('lch').domain([ 0, n ]);
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

function getAllValues(data, headerLookupIdx) {
  const ret = [];
  for (const idx of headerLookupIdx) {
    const values = new Set;
    for (const row of data) {
      values.add(row[idx]);
    }
    values.delete('unknown');
    values.delete('Unknown');
    values.delete(undefined); // not displayed
    values.delete(''); // not displayed
    ret.push(values);
  }
  // dev only
  if (headerLookupIdx.length !== ret.length) {
    throw new Error('rawValues length != headerLookupIdx');
  }
  return ret;
}

function getHeaderInfo(line) {
  const headerNames = [];
  const headerLookupIdx = [];
  const info = [];
  const groups = {};
  // populate the header arrays
  let indexInFinalArray = 0;
  for (let i = 1; i < line.length; i++) {
    let name = line[i];
    // dev only
    if (name === '__colour__') {
      throw new Error('header name should never be __colour__');
    }
    let inGroup = false;
    let userTypeDefined = false;
    let type = undefined;
    let groupId = false;
    if (name.indexOf(':') > -1) {
      // console.log(name);
      userTypeDefined = true;
      const userString = name.split(':')[1];
      name = name.split(':')[0];
      switch (userString.slice(0, 1).toLowerCase()) {
      case 'o':
        type = 'ordinal';
        break;
      case 'c':
        type = 'continuous';
        break;
      default:
        userTypeDefined = false;
      }
      if (userString.length > 1) {
        inGroup = true;
        groupId = parseInt(userString.slice(1), 10);
        if (!groups[groupId]) {
          groups[groupId] = { indexes: [] };
        }
        groups[groupId].indexes.push(i);
      }
      // console.log(name);
      // console.log(type);
      // console.log(inGroup);
      // console.log(groupId);
    }

    headerNames.push(name);
    headerLookupIdx.push(i);
    info.push({
      userColour: false,
      userTypeDefined,
      type,
      inGroup,
      groupId,
    });

    if (line[i + 1] === '___colour___') {
      info[indexInFinalArray].userColour = true;
      i++;
    }

    // dev only
    if (headerNames.length !== indexInFinalArray + 1) {
      throw new Error('header indexing problem');
    }
    indexInFinalArray++;
  }
  return [ headerNames, headerLookupIdx, info, groups ];
}
