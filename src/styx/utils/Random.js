var Styx = Styx || {};
Styx.utils = Styx.utils || {};

Styx.utils.Random = class
{
	percent(percent)
	{
		return (Math.floor(Math.random() * 101) < percent);
	}

	bet(p)
	{
		return (Math.random() < p);
	}

	int(max)
	{
		return Math.floor(Math.random() * ++max);
	}

	float(max)
	{
		return Math.random() * max;
	}

	range(min, max)
	{
		return this.int(max - min) + min;
	}

	chances(list)
	{
		var sum = _.reduce(list, (memo, num) =>  memo + num, 0);
		var val = this.float(sum);
		sum = list[0];
		for(let i = 0; i < list.length; i++) {
			if (sum >= val) return i;
			sum += list[i + 1];
		}
	}

	pick(list)
	{
		return _.sample(list);
	}
}