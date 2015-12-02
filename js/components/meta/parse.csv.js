function parseCsv(csvString) {
  const lines = csvString.split('\n');
  const header = lines[0].split(',');
  if ([ 'name', 'lane', 'isolate', 'id' ].indexOf(header[0].toLowerCase()) < 0) {
    return false;
  }
  const columnsOnOff = Array.apply(null, new Array(header.length)).map(function () {return 1;});
  columnsOnOff[0] = 0; // by default the names are off (duh)
  const metadata = [];
  for (let i = 1; i < lines.length; i++) {
    // console.log("line...")
    // console.log(lines[i])
    const words = lines[i].split(',');
    if (words.length !== header.length) {
      continue;
    }
    metadata[words[0]] = Array.apply(null, new Array(header.length)).map(function () {return {};});
    for (let j = 1; j < words.length; j++) {
      metadata[words[0]][j].value = words[j];
    }
  }
  return ([ header, columnsOnOff, metadata ]);
}

module.exports = parseCsv;
