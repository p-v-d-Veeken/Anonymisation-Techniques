/****************************************************************************************************************
 *                                                                                                              *
 * This file Provides the functionality to perform generalization on the adult dataset.                         *
 *                                                                                                              *
 ****************************************************************************************************************/

var dghs = require('./../data/DGHs.json');
var cols = require('./../data/cols.json');
var Stats = require('./Stats');
var stats = null;
var levels = { //Specify the max heights of the DGHs
	"age": {max: 6},
	"education": {max: 4},
	"race": {max: 3},
	"sex": {max: 1}
};
//Generalizes the specified QIDs to the specified degree in the specified data set
function generalize(data, degree, qIds)  
{
	if(!("current" in levels[qIds[0]]))
	{  resetLevels(qIds);} //Set for all DGHs in levels the `current` value to 0. i.e {age:{current:0, max:6}}
	//Initialize a new Stats instance which keeps for each DGH track of a number of metrics. See Stats.js for a more detailed description
	stats = new Stats(dghs, cols);
	data = data.map(function(person) //Iterate over all persons in the adult data set
	{
		for(var i = 1; i <= degree; i++) // Apply the DGH degrees sequentially. i.e Z1 -> Z2 -> Z3->...->Z6
		{
			qIds.forEach(function(qId)
			{
				person = generalizeQid(person, qId, dghs["Z" + i][qId])
			});
		}
		stats.update(person); //Update the DGH stat tracker
		
		return person;
	});
	updateLevels(degree, qIds); //Update the current degree of generalization for each DGH
	stats.finalize(); //Notify the stat tracker that the generalization is finished so that stuff can be calculated
	
	return data;
}
//Generalizes the specified QID to the DGH degree for a single person in the dataset
function generalizeQid(person, qId, dgh)
{
	var key = cols[qId]; //Look op the index of the QID being generalized (for example, age has index 0)

	if(qId == "age") //See ./data/DGHs.json
	{
		var age = Number(person[key]);

		if(age < dgh.startBin)
		{  person[key] = dgh.startBin;}
		else
		{  person[key] = Math.ceil(age / dgh.binSize) * dgh.binSize;} //Generalize the age QID
	}
	else
	{
		person[key] = dgh != null && person[key] in dgh //Map the QID value to that of a higher DGH degree
			? dgh[person[key]]
			: person[key];
	}
	return person;
}
function updateLevels(k, qIds) //Update the current degree of generalization for each DGH
{
	qIds.forEach(function(qId)
	{
		levels[qId].current = k > levels[qId].current
			? k
			: levels[qId].current;
		levels[qId].current = levels[qId].current > levels[qId].max
			? levels[qId].max
			: levels[qId].current;
	});
}
function resetLevels(qIds)
{
	qIds.forEach(function(qId)
	{
		levels[qId].current = 0;
	});
}
module.exports =
{
	"generalize": generalize,
	"getStats": function(data)
	{
		if(stats == null || data != null)
		{
			stats = new Stats(dghs, cols);
			stats.calcStats(data);
		}
		return stats.getStats();
	},
	"resetLevels": resetLevels,
	"levels": levels
};