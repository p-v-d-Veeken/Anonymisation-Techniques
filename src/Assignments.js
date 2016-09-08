/************************************************************************************************************
 *                                                                                                          *
 * In this file the actual anonymisation techniques are used to anonymize the dataset and perform the tasks *
 * specified in the assignment.                                                                             *
 *                                                                                                          *
 ************************************************************************************************************/

const gen = require('./Generalisation');
const localSup = require('./LocalSuppression');
const precision = require('./Precision');
const cols = require('../data/cols.json');
const qIds = require('../data/QIDs.json');
const sEs = require('../data/SEs.json');
const pubData = require('../data/public_data.json');

/****************
 * Assignment 1 *
 ****************/

function a1(data)
{
	const found = {};

	Object.keys(pubData).forEach(function(name) //Iterate over all the persons in public_data.json
	{
		found[name] = []; //Initialize an object with the persons' names as the keys, i.e: {"Patricia Conner":[], ...}
	});
	data.forEach(function(person, rowId) //Iterate over the entire dataset
	{
		Object.keys(pubData).forEach(function(name) //Iterate over all the persons we wish to identify
		{
			var matches = true;
			//Iterate over the QIDs and check whether they match the person in the dataset
			for(var i = 0; i < qIds.length; i++)
			{
				if(pubData[name].person[cols[qIds[i]]] != person[cols[qIds[i]]])
				{
					matches = false;
					return;
				}
			}
			if(matches)
			{  found[name].push(rowId); } //All QIDs match, add the row number to the list of possible matches
		})
	});
	console.log(found);
}

/********************
 * Assignment 3 & 4 *
 ********************/

function a3And4(a, data, k) //Assignment 3 and 4 require the same computations, so they're rolled into 1 function
{
	gen.resetLevels(qIds); //Resets all DGH levels to 0
	var nData = clone(data);

	switch(k) //Depending on the specified k, generalize the dataset according to the DGHs. See: ./data/DGHs.json, report
	{
		case 3:
			nData = gen.generalize(nData, 6, ["age"]); //Generalize the age attribute of the dataset to degree 6
			break;
		case 5:
			nData = gen.generalize(nData, 4, ["age"]);
			nData = gen.generalize(nData, 1, ["education"]);
			break;
		case 10:
			nData = gen.generalize(nData, 4, ["age"]);
			nData = gen.generalize(nData, 1, ["education", "race"]);
			break;
		case 50:
		case 100:
			nData = gen.generalize(nData, 5, ["age"]);
			nData = gen.generalize(nData, 2, ["education", "race"]);
			break;
	}
	const levels = formatLevels(gen.levels); //Remove unused DGHs to reduce clutter in the terminal window
	//Apply local suppression to suppress entries violating k-anonymity
	nData = a < 6 ? localSup.findAndRemoveViolations(nData, k) : nData;

	if(a < 5)
	{
		console.log("DGHs: " + JSON.stringify(levels));
		console.log("Entries suppressed: " + (data.length - nData.length));
		console.log(a == 3
			? gen.getStats(nData)
			: "Precision: " + precision(data, nData, gen.levels));
	}
	return nData;
}

/****************
 * Assignment 5 *
 ****************/

function a5(data, k)
{
	data = a3And4(5, data, k); //Apply the desired degree of generalization
	const pub_data = clone(pubData);
	const found = {};

	Object.keys(pubData).forEach(function(name) //Iterate over all persons in the public data
	{
		//Apply the desired degree of generalization to the public data
		pub_data[name].person = a3And4(6, [pubData[name].person], k)[0];
		found[name] = {};

		//Initialize an object with the persons' names as the keys, i.e: {"Patricia Conner":{"income":{}, "occupation":{}}, ...}
		sEs.forEach(function(sE)
		{  found[name][sE] = {}; });
	});
	Object.keys(pub_data).forEach(function(name) //Iterate over all persons in the public data
	{
		data.forEach(function(person) //Iterate over all persons in the dataset
		{
			var matches = true;

			//Iterate over the QIDs and check whether they match the person in the dataset
			for(var i = 0; i < qIds.length; i++)
			{
				if(pub_data[name].person[cols[qIds[i]]] != person[cols[qIds[i]]])
				{
					matches = false;
					return;
				}
			}
			if(matches)
			{
				sEs.forEach(function(sE)
				{
					if(!(person[cols[sE]] in found[name][sE]))
					{  found[name][sE][person[cols[sE]]] = 0}

					found[name][sE][person[cols[sE]]]++; //Add the count of an SE of a person to the object.
					// i.e: {"Patricia Conner":{"income":{"<=50K":10}, "occupation":{"Sales":7}}, ...}
				});
			}
		});
	});
	console.log(found);
}
function formatLevels(levels)
{
	return Object.keys(levels).reduce(function(pv, cv)
	{
		if(levels[cv].current != 0)
		{  pv[cv] = "Z" + levels[cv].current }

		return pv;
	}, {});
}
function clone(data)
{
	return JSON.parse(JSON.stringify(data));
}
module.exports =
{
	a1: a1,
	a3And4: a3And4,
	a5: a5
};