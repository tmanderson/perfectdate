function perfectDate(val, format) {
	if(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/.test(val)) return val;
	
	//Find all possible parts of a balid test string...
	var val = val.match(/([a-z]{3,9}|[0-9]{1,4})/ig),
		m, d, y;

	if(val.length < 3) return val;

	while(val.length) {
		var c = val.shift(),
			m;
		if(c.match(/^\D+/)) {
			//Checking for month names
			c = /^(?:(ja)|(f)|(mar)|(ap)|(may)|(jun)|(jul)|(au)|(s)|(o)|(n)|(d))/i.exec(c);
			//If we already have a month, this could be the day...
			m = c.lastIndexOf(c[0]);
			continue;
		}

		//Work numbers from highest values back
		//Y -> d -> m
		//2011 -> 31 -> 12
		if(c > 1900 && !y) {
			y = c;
			continue;
		} else if(c > 12 && c <= 31 && !d) {
			d = c;
			continue;
		} else if(c <= 12 && !m) {
			m = c;
			continue;
		}

		//final checks before ending.
		if(c) {
			if(!d) d = c;
			if(!y && d != c) y = c;
			if(!m && y != c) m = c;
		}
	}

	if(y < 1000) {
		//If our year seems low, we'll put it in context to the current year
		var c = new Date().getFullYear().toString().substr(0,2);
		if(parseInt(c + '' + y) > new Date().getFullYear()) {
			y = (c - 1) + '' + y;
		}
	}

	//	F d, Y 		- January 01, 2011
	//	m/d/Y 		- 01/01/2011
	//	M j, y    	- Jan 1, 2011
	//	n/d/Y 		- 1/01/2011

	//Avoid overwriting parts by building the date in reverse...
	var parts = format.match(/[djFmMnYy]/g).reverse();
	while(parts.length) {
		var val = parts.shift();
		switch(val) {
		case 'd':
			if(parseInt(d) < 10) d = '0' + d;
			format = format.replace('d', d);
			break;
		case 'j':
			format = format.replace('j', d);
			break;
		case 'F':
			format = format.replace('F', new Date(y, m - 1).toLocaleDateString().match(/[a-zA-Z]+/g)[1]);
			break;
		case 'm':
			if(parseInt(m) < 10) m = '0' + m;
			format = format.replace('m', m);
			break;
		case 'M':
			format = format.replace('M', new Date(y, m - 1).toLocaleDateString().match(/[a-zA-Z]+/g)[1].substr(0,3));
			break;
		case 'n':
			format = format.replace('n', m);
			break;
		case 'Y':
			format = format.replace('Y', y);
			break;
		case 'y':
			format = format.replace('y', y.toString().substr(2));
		}
	}
	
	return format;
}