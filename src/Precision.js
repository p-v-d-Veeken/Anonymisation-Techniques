/****************************************************************************************************************
 *                                                                                                              *
 * This file Provides the functionality to calculate the precision of a generalized dataset.                    *
 *                                                                                                              *
 ****************************************************************************************************************/

var qIds = require('./../data/QIDs');

function precision(oldData, newData, levels)
{
	var sum = 0;
	var Na = qIds.length;

	qIds.forEach(function(qId)
	{
		sum += levels[qId].current / levels[qId].max
	});
	return 1 - sum * newData.length / (oldData.length * Na)
}
module.exports = precision;