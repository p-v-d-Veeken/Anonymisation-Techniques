var cols = require('./../data/cols');
var qIds = ["age", "sex", "race", "education"].map(function(qId)
{
	return cols[qId];
});
var counts;

function findViolations(data, k)
{
	counts = {};
	var violations = [];

	data.forEach(function(person, rowId)
	{  enterIntoCounts(person, k, rowId) });
	Object.keys(counts).forEach(function(key)
	{
		if(counts[key].length < k)
		{  violations.push.apply(violations, counts[key]) }
	});
	return violations.reverse();
}
function removeViolations(violations, data)
{
	violations.forEach(function(violation)
	{
		data.splice(violation, 1)
	});
	return data
}
function findAndRemoveViolations(data, k)
{
	return removeViolations(
		findViolations(data, k),
		data
	)
}
function enterIntoCounts(person, k, rowId)
{
	var selectorStr = "";
	var vals = qIds.map(function(qId)
	{
		return person[qId];
	});
	for(var i = 0; i < vals.length; i++)
	{
		selectorStr += vals[i];
		selectorStr += i != vals.length - 1 ?  "." : "";
	}
	if(!Array.isArray(counts[selectorStr]))
	{  counts[selectorStr] = []}
	if(counts[selectorStr].length < k)
	{ counts[selectorStr].push(rowId);}
}
module.exports =
{
	findViolations: findViolations,
	removeViolations: removeViolations,
	findAndRemoveViolations: findAndRemoveViolations
};