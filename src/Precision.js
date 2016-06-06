var cols = require('./../data/cols');
var qIds = require('./../data/QIDs').map(function(qId)
{
	return cols[qId];
});
console.log(qIds);
var DGHs = require('./../data/DGHs.json');

function precision(oldData, newData, levels)
{
	var sum = 0;

	qIds.forEach(function(qId)
	{
		sum += newData.length * levels[qId].current / levels[qId].max
	});
	return 1 - sum / (oldData.length * qIds.length)
}
module.exports = precision;