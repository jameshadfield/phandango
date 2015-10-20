function parse_csv(csv_string) {
	var lines = csv_string.split("\n")
	var header=lines[0].split(',')
	if (['name','lane','isolate'].indexOf(header[0].toLowerCase()) < 0) {
		return false;
	}
	var columns_on_off = Array.apply(null, new Array(header.length)).map(function () {return 1;});
	columns_on_off[0] = 0 // by default the names are off (duh)
	var metadata = []
	for (var i=1; i<lines.length; i++){
		// console.log("line...")
		// console.log(lines[i])
		var words=lines[i].split(",");
		if (words.length != header.length) {
			continue
		}
		metadata[words[0]] = Array.apply(null, new Array(header.length)).map(function () {return {}});
		for (var j=1; j<words.length; j++) {
			metadata[words[0]][j]['value'] = words[j]
		}
	}
	return( [header,columns_on_off,metadata] )
}



module.exports = parse_csv;
