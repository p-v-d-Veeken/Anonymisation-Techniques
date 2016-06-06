var dghs = require('./../data/DGHs.json');
var cols = require('./../data/cols.json');
var Stats = require('./Stats');
var stats = null;

function k_anonymity(data, k)
{
	stats = new Stats(dghs, cols);
	data = data.map(function(person)
	{
		person = age(person, dghs["k" + k].age);
		
		for(var i = 1; i <= k; i++)
		{
			person = education(person, dghs["k" + i].education);
		}
		stats.update(person);
		
		return person;
	});
	stats.finalize();
	
	return data;
}
function age(person, ageDgh)
{
	var ageKey = cols["age"];
	var age = Number(person[ageKey]);

	if(age < ageDgh.startBin)
	{  person[ageKey] = ageDgh.startBin;}
	else
	{  person[ageKey] = Math.ceil(age / ageDgh.binSize) * ageDgh.binSize;}

	return person;
}
function education(person, dgh)
{
	var key = cols["education"];

	person[key] = dgh[person[key]];

	return person;
}
function race(person, dgh)
{
	var key = cols["race"];

	person[key] = dgh[person[key]];

	return person;
}
function sex(person, dgh)
{
	var key = cols["sex"];

	person[key] = dgh[person[key]];

	return person;
}
module.exports =
{
	"k_anonymity": k_anonymity,
	"age": age,
	"education": education,
	"race": race,
	"sex": sex,
	"getStats": function(refresh)
	{
		if(stats == null || refresh)
		{
			stats = new Stats(dghs, cols);
			stats.calcStats();
		}
		return stats.getStats();
	}
};