var Styx = Styx || {};
Styx.levels = Styx.levels || {};


Styx.levels.LevelBuilder = class
{
	constructor()
	{
		this.game = game;
	}

	build(id)
	{
		var level = new Styx.levels.Level(id);
		var builder = this.getBuilder(level.getAttrib('type'));
		builder.level = level;

		return builder.build();
	}

	getBuilder(type)
	{
		switch (type) {
			case 'regular': return new Styx.levels.RegularLevelBuilder();
			case 'arena': return new Styx.levels.ArenaLevelBuilder();
			case 'test': return new Styx.levels.TestLevelBuilder();
			case 'random': return new Styx.levels.TestLevelBuilder();
			default: throw new Error("Unknown level type.");
		}
	}
}