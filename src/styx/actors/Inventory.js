var Styx = Styx || {};
Styx.actors = Styx.actors || {};


Styx.actors.Inventory = class
{
	constructor(owner)
	{
		this.owner = owner;
		this.belongings = {};
		this.slots = "abcdefghijklmn".split("");
		this.bodySlots = {1: "on head", 2: "on body", 3: "in right hand", 4: "in left hand", 5: "on feet"};
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

		var wearKey = this._getWearKey(item);
		var wearItem = this.remove(wearKey);

		this.set(wearKey, item);
		this.remove(key);

		if (wearItem) {
			this.set(this.getFreeKey(), wearItem);		
		}

		this.updateOwner();
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
		this.updateOwner();
	}

	getWeapon()
	{
		return this.get('3');
	}

	getShield()
	{
		return this.get('4');
	}

	getFreeKey()
	{
		return _.find(this.slots, key => this.belongings[key] == null);
	}

	getKey(item)
	{
		for (let key in this.belongings) {
			if (this.belongings[key] == item) return key;
		}

		return null;
	}

	has(item)
	{
		return this.getKey(item);
	}

	isWearing(item)
	{
		var key = this._getWearKey(item);
		if (!key || !item) return false;
		
		return (this.belongings[key] == item);
	}

	_getWearKey(item)
	{
		if (item.is('weapon')) return "3";
		else if (item.is('shield')) return "4";
		else if (item.is('cap')) return "1";
		else if (item.is('armor')) return "2";
		else if (item.is('boots')) return "5";
	}

	updateOwner()
	{
		this.owner.armor = this.owner.baseArmor + this.getArmorPoints();
	}

	getArmorPoints()
	{
		var points = 0;

		for (let i of [1,2,5]) {
			var item = this.get(i);
			if (!item) continue;
			points += item.getAttrib('points', 0);
		}

		return points;
	}


	getContent()
	{
		var output = { backpack: [], body: [] };
		
		for(var i = 0; i < this.slots.length; i++) {
			var key = this.slots[i];

			if (this.belongings[key] == null) {
				output.backpack[i] = {key: key, name: '(nothing)', item: null, cssClass: 'ui-gray'}
			}
			else {
				output.backpack[i] = {
					key: key, 
					name: this.belongings[key].name(), 
					item: this.belongings[key],
					cssClass: 'ui-white'
				}
			}
		}

		for (var key in this.bodySlots) {
			if (this.belongings[key] == null) {
				var slot = {key: key, keyName: this.bodySlots[key], name: '(nothing)', item: null, cssClass: 'ui-gray'};
			}
			else {
				var slot = {
					key: key, 
					keyName: this.bodySlots[key], 
					name: this.belongings[key].name(), 
					item: this.belongings[key],
					cssClass: 'ui-white'
				}
			}

			output.body.push(slot);
		}

		return output;
	}

}