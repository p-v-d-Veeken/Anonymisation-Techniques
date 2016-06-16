/****************************************************************************************************************
 *                                                                                                              *
 * This file reads the data file and parses the values within it. Entries with unknown values are automatically *
 * skipped.                                                                                                     *
 *                                                                                                              *
 ****************************************************************************************************************/

const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
	input: fs.createReadStream('./data/adult.data')
});
const data = [];

module.exports = 
{
	load: function(callback)
	{
		if(data.length > 0) 
		{
			callback();
			return;
		}
		rl.on('line', function(line)
		{
			parsePerson(line);
		});
		rl.on('close', function()
		{
			callback();
		})
	},
	data: data
};
function parsePerson(line)
{
	var person = line.split(", ");

	if(person.length != 15)
	{  return; }
	for(var i = 0; i < person.length; i++)
	{
		if(person[i] == "?")
		{  return; }
	}
	data.push(person);
}