import Papa from 'papaparse';
import chroma from 'chroma-js'; // big import!!!!

/*    metaParser

*/
export function metaParser(csvString) {
  const papa = Papa.parse(csvString);
  const [ headerNames, headerLookupIdx, info ] = _getHeaderInfo(papa.data[0]);
  const numFields = headerNames.length;
  const toggles = Array(...Array(numFields)).map(()=>true);
  const rawValues = _getAllValues(papa.data.slice(1), headerLookupIdx); // set
  // dev only
  // console.log('headerNames: ', headerNames);
  // console.log('headerLookupIdx: ', headerLookupIdx);
  // console.log('info: ', info);
  // console.log('rawValues: ', rawValues);


  // classify the (sets of) rawValues, then sort them
  const values = []; // sorted
  for (let i = 0; i < numFields; i++) {
    [ info[i].type, info[i].binary ] = _classifyValues(new Set(rawValues[i]));
    values[i] = _sortValues(rawValues[i], info[i].type);
  }

  // associate with a colour
  const colours = [];
  // process each header (column) seperately
  for (let i = 0; i < numFields; i++) {
    const n = values[i].length;
    const scale = _getColourScale(n, info[i].type, info[i].binary);
    colours[i] = Array(...Array(n)).map((e, idx) => scale(idx).hex());
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
export function _getColourScale(n, type, binary) {
  let ret;
  if (binary) {
    ret = chroma.scale([ 'purple', 'orange' ]).mode('hsl').domain([ 0, 1 ]);
  } else {
    if (type === 'float') {
      ret = chroma.scale('RdPu').mode('rgb').domain([ 0, n ]);
    } else if (type === 'int') {
      ret = chroma.scale([ '#fec44f', '#253494' ]).mode('hsl').domain([ 0, n ]);
    } else {
      ret = chroma.scale('Spectral').mode('rgb').domain([ 0, n ]);
    }
  }
  return ret;
}

function _sortValues(vals, type) {
  let ret;
  if (type === 'string') {
    ret = Array.from(vals).sort((a, b)=>a.toLowerCase().localeCompare(b.toLowerCase()));
  } else {
    ret = Array.from(vals).sort( (a, b) => a - b);
  }
  return ret;
}

function _classifyValues(vals) {
  let type = 'string'; // string
  const arr = Array.from(vals);
  const binary = arr.length <= 2 ? true : false;
  if (arr.every( (e) => !isNaN(parseFloat(e)) )) {
    type = 'float';
    if (arr.every( (e) => !(parseFloat(e) % 1))) {
      type = 'int';
    }
  }
  return [ type, binary ];
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

function _getAllValues(data, headerLookupIdx) {
  const ret = [];
  for (const idx of headerLookupIdx) {
    const values = new Set;
    for (const row of data) {
      values.add(row[idx]);
    }
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

function _getHeaderInfo(line) {
  const headerNames = [];
  const headerLookupIdx = [];
  const info = [];
  // populate the header arrays
  let indexInFinalArray = 0;
  for (let i = 1; i < line.length; i++) {
    const name = line[i];
    // dev only
    if (name === '__colour__') {
      throw new Error('header name should never be __colour__');
    }
    headerNames.push(name);
    headerLookupIdx.push(i);
    info.push({
      userColour: false,
      continuous: false,
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
  return [ headerNames, headerLookupIdx, info ];
}
