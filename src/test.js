var dl = require('./DataLoader');
var dgh = require('./dgh');
var localSup = require('./LocalSuppression');

dl.load(function()
{
	var data = dgh.k_anonymity(dl.data, 1);
	var violations = localSup.findViolations(data, 2);

	console.log(violations.length, data.length);

	data = localSup.removeViolations(violations, data);
	violations = localSup.findViolations(data, 2);

	console.log(violations.length, data.length);
});