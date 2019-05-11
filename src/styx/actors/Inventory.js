var Styx = Styx || {};
Styx.actors = Styx.actors || {};


Styx.actors.Inventory = class
{
	constructor(owner)
	{
		this.owner = owner;
		this.belongings = {};
	}

	remove(key)
	{
		var item = this.belongings[key];
		this.belongings[key] = null;
		return item;
	}

	get(key)
	{
		return this.belongings[key];
	}

	set(key, item)
	{
		if (this.belongings[key]) {
			game.debugLog("Cannot wear this item.");
			return false;			
		}

		this.belongings[key] = item;
	}

	wear(key)
	{
		var item = this.get(key);
		if (!item || !item.is('wearable')) {
			game.debugLog("Cannot wear this item.");
			return false;
		}
		
		if (/\d/.test(key)) {
			var newKey = this.freeKey();
		}
		else {
			var newKey = this.getWearKey(item);
		}

		if (!newKey) {
			console.log("Inventory is full.");
			return false;
		}

		this.set(newKey, item);
		this.remove(key);
	}

	freeKey()
	{
		var keys = "abcdefghijklmnop".split("");
		return _.find(keys, key => this.belongings[key] == null);
	}

	getWearKey(item) {
		return "1";
	}

}