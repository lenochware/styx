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
			game.debugLog("Inventory position is occupied.");
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

		var wearKey = this.getWearKey(item);
		var wearItem = this.remove(wearKey);

		this.set(wearKey, item);
		this.remove(key);

		if (wearItem) {
			this.set(this.getFreeKey(), wearItem);		
		}
	}

	unwear(key)
	{
		if (!/\d/.test(key)) return false;
		var item = this.get(key);
		if (!item) return false;

		var freeKey = this.getFreeKey();
		if (!freeKey) {
			game.debugLog("Inventory is full.");
			return false;			
		}

		this.set(freeKey, item);
		this.remove(key);
	}

	getFreeKey()
	{
		var keys = "abcdefghijklmnop".split("");
		return _.find(keys, key => this.belongings[key] == null);
	}

	getWearKey(item) {
		return "1";
	}

}