var Styx = Styx || {};
Styx.utils = Styx.utils || {};

Styx.utils.Random = class
{
	percent(percent)
	{
		return (Math.floor(Math.random() * 101) < percent);
	}
}