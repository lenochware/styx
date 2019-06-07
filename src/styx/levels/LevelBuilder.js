var Styx = Styx || {};
Styx.levels = Styx.levels || {};


Styx.levels.LevelBuilder = class
{

	build(params)
	{
		var builder = this.get(params);
		return builder.build();
	}

	get(params)
	{
		switch (params.type) {
			case 'regular-level': return new Styx.levels.RegularLevelBuilder(params);
			case 'arena-level': return new Styx.levels.ArenaLevelBuilder(params);
			case 'test-level': return new Styx.levels.TestLevelBuilder(params);
			case 'random-level': return new Styx.levels.TestLevelBuilder(params);
			default: throw new Error("Unknown level type.");
		}
	}

}