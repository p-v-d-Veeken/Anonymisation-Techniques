/****************************************************************************************************************
 *                                                                                                              *
 * This file Provides the functionality to perform suppression on the adult dataset.                            *
 *                                                                                                              *
 ****************************************************************************************************************/

var cols = require('./../data/cols');
var qIds = require('./../data/QIDs').map(function(qId)
{
	return cols[qId];
});
var counts;

//Find all entries in the dataset which violate the k-anonymity
function findViolations(data, k)
{
	counts = {};
	var violations = [];

	data.forEach(function(person, rowId) //Iterate over all persons in the dataset
	{  enterIntoCounts(person, k, rowId) }); //Count how often this particular combination of QIDs has occurred
	Object.keys(counts).forEach(function(key) //After the entire dataset has been iterated, find all offending entries
	{
		if(counts[key].length < k)
		{  violations.push.apply(violations, counts[key]) }
	});
	return violations.reverse(); //This is done so that indices of the other violations don't move in the dataset.
}
//Removes specified violations from the dataset.
function removeViolations(violations, data)
{
	violations.forEach(function(violation)
	{
		data.splice(violation, 1)
	});
	return data
}
//Finds and removes all entries in the dataset which violate k-anonymity
function findAndRemoveViolations(data, k)
{
	return removeViolations(
		findViolations(data, k),
		data
	)
}
function enterIntoCounts(person, k, rowId) //Keeps track of how often each combination of QIDs occurs in the dataset
{
	var selectorStr = "";
	var vals = qIds.map(function(qId) //Get the values corresponding to the QIDs
	{
		return person[qId];
	});
	for(var i = 0; i < vals.length; i++) //Iterate over the QID values
	{
		selectorStr += vals[i];
		selectorStr += i != vals.length - 1 ?  "." : ""; //Build selector string. i.e "39.Masters.Black.Female
	}
	if(!Array.isArray(counts[selectorStr]))
	{  counts[selectorStr] = []}
	if(counts[selectorStr].length < k) //If one particular combination of QIDS satisfies k, no need to track it anymore.
	{ counts[selectorStr].push(rowId);}
}
module.exports =
{
	findViolations: findViolations,
	removeViolations: removeViolations,
	findAndRemoveViolations: findAndRemoveViolations
};