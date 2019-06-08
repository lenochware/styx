var Styx = Styx || {};

Styx.DungeonBase = class
{
	constructor()
	{
		this.game = game;
		this.data = this.game.data["dungeon-base"];
	}

	getAttrib(category, id, attrib)
	{
		try {
			return this.data[category][id][attrib];
		}
		catch(err) {
			console.warn(category+'.'+id+'.'+attrib+' not found.');
			return null;
		}
	}

	getObject(category, id)
	{
		try {
			return this.data[category][id];
		}
		catch(err) {
			console.warn(category+'.'+id+' not found.');
			return null;
		}
	}

	getCategory(category)
	{
		try {
			return this.data[category];
		}
		catch(err) {
			console.warn(category+' not found.');
			return null;
		}
	}

}