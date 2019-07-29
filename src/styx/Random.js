var Styx = Styx || {};

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

	static float(max = null)
	{
		return max? ROT.RNG.getUniform() * max : ROT.RNG.getUniform();
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
