var Styx = Styx || {};
/**
 * Querying and accessing informations about dungeon objects.
 * It is database with data stored in json files internally.
 * Category is json file - its similar to database table. It contains objects (table rows) and attributes (table cells).
 * Example of the categories are monsters, items, tiles, levels, rooms...
 * Database objects supports inheritance and can be different for different worlds.
 */
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
		if (this.data[category] && this.data[category][id]) {
			return this.data[category][id];
		}
		else {
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

	categoryOf(id)
	{
		for(let category of ['actors', 'items', 'tiles']) {
			if (this.data[category][id]) return category;
		}
		return null;
	}

	find(category, tag)
	{
		return _.chain(this.data[category]).filter(obj => obj.tags.includes(tag));
	}

	findKey(category, tag)
	{
		return _.chain(_.keys(this.data[category])).filter(i => this.data[category][i].tags.includes(tag));
	}

}