function Stats(dghs, cols)
{
	this.stats = {};
	this.cols = cols;
	this.keys = [];
	var $this = this;

	Object.keys(dghs["k1"]).forEach(function(key)
	{
		$this.keys.push(key);
		$this.stats[key] = {"categories":{}};
	})
}
Stats.prototype.calcStats = function(data)
{
	var $this = this;
	
	data.forEach(function(person)
	{
		$this.update(person);
	});
	this.finalize();
};
Stats.prototype.update = function(person)
{
	var $this = this;

	this.keys.forEach(function(statKey)
	{
		var value = person[$this.cols[statKey]];

		if(!(value in $this.stats[statKey]["categories"]))
		{  $this.stats[statKey]["categories"][value] = 0}

		$this.stats[statKey]["categories"][value]++;
	})
};
Stats.prototype.finalize = function()
{
	var stats = this.stats;

	this.keys.forEach(function(statKey)
	{
		var min = Number.MAX_VALUE;
		var cats = stats[statKey]["categories"];
		var numCats = Object.keys(stats[statKey]["categories"]).length;
		var meanSize = Object.keys(stats[statKey]["categories"]).reduce(function(pv, cv)
			{
				cv = Number(cats[cv]);
				min = cv < min ? cv : min;

				return pv + cv;
			}, 0) / numCats;

		stats[statKey] = {
			numCats: numCats,
			meanSize: meanSize,
			smallestCat: min,
			cats: cats
		}
	})
};
Stats.prototype.getStats = function()
{
	return this.stats;
};
module.exports = Stats;