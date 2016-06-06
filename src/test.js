var dl = require('./DataLoader');
var gen = require('./Generalisation');
var localSup = require('./LocalSuppression');
var precision = require('./Precision');

dl.load(function()
{
	var data = gen.k_anonymity(dl.data, 1);
	var violations = localSup.findViolations(data, 1);

	console.log(gen.getStats());
	console.log(violations.length, data.length);

	data = localSup.removeViolations(violations, data);
	violations = localSup.findViolations(data, 1);

	console.log(violations.length, data.length);
	console.log(precision(dl.data, data, {
		0: {
			current: 1,
			max: 3
		},
		3: {
			current: 1,
			max: 3
		},
		8: {
			current: 1,
			max: 3
		},
		9: {
			current: 1,
			max: 2
		}
	}))
});