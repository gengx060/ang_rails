if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (searchString, position) {
		return this.substr(position || 0, searchString.length) === searchString;
	};
}
if (!Object.entries) {
	Object.entries = function (obj) {
		var ownProps = Object.keys(obj),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--)
			resArray[i] = [ownProps[i], obj[ownProps[i]]];
		
		return resArray;
	};
}
if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
		value: function (predicate) {
			// 1. Let O be ? ToObject(this value).
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}
			
			var o = Object(this);
			
			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;
			
			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			
			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
			var thisArg = arguments[1];
			
			// 5. Let k be 0.
			var k = 0;
			
			// 6. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ! ToString(k).
				// b. Let kValue be ? Get(O, Pk).
				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
				// d. If testResult is true, return kValue.
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return kValue;
				}
				// e. Increase k by 1.
				k++;
			}
			
			// 7. Return undefined.
			return undefined;
		}
	});
}

window.jsonEqual = function (obj, obj1) {
	return Enumerable.From(Object.entries(obj).map(function (i) {
			return i.join(',')
		})).OrderBy().ToArray().join(',')
		== Enumerable.From(Object.entries(obj1).map(function (i) {
			return i.join(',')
		})).OrderBy().ToArray().join(',')
};

(function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));