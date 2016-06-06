var rl = require('linebyline');
var dataStream = rl('./data/adult.data');
var data = [];

module.exports = 
{
	load: function(callback)
	{
		dataStream.on('line', function(line)
		{
			parsePerson(line);
		});
		dataStream.on('end', function()
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