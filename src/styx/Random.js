var Styx = Styx || {};

/**
 * The ROT.RNG wrapper. Main feature is that you can set fixed seed for random generator.
 */
Styx.Random = class
{
	static setSeed(seed)
	{
		ROT.RNG.setSeed(seed);
	}

	static percent(percent)
	{
		return (Math.floor(ROT.RNG.getUniform() * 101) < percent);
	}

	static bet(p)
	{
		return (ROT.RNG.getUniform() < p);
	}

	static integer(max)
	{
		return Math.floor(ROT.RNG.getUniform() * ++max);
	}

	static int(min, max = null)
	{
		if (max === null) {
			max = min;
			min = 0;
		}

		return this.integer(max - min) + min;
	}

	static floatmax(max)
	{
		return max * ROT.RNG.getUniform();
	}

	static float(min, max = null)
	{
		if (max === null) {
			max = min;
			min = 0;
			if (max === null) max = 1;
		}

		return this.floatmax(max - min) + min;
	}


	static chances(list)
	{
		var sum = _.reduce(list, (memo, num) =>  memo + num, 0);
		var val = this.float(sum);
		sum = list[0];
		for(let i = 0; i < list.length; i++) {
			if (sum >= val) return i;
			sum += list[i + 1];
		}
	}

	static pick(list, chances = null)
	{
		if (chances) {
			return list[Styx.Random.chances(chances)];
		}
		else {
			return ROT.RNG.getItem(list);
		}
	}

	static shuffle(list)
	{
		return ROT.RNG.shuffle(list);
	}	
}

// Return a random integer between min and max (inclusive).
_.random = function(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(ROT.RNG.getUniform() * (max - min + 1));
};
