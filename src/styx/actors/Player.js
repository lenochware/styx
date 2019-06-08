var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Player = class extends Styx.actors.Actor
{
	constructor(params = {})
	{
		params.id = 'player';
		super(params);
		this.inventory = new Styx.actors.Inventory(this);
		this.gold = 0;
		this.tick = 10;
	}

	get()
	{
		var tile = this.getTile();
		if (!tile.item) {
			this.game.message("There is nothing to get.");
			return;
		}

		var freeKey = this.inventory.getFreeKey();
		if (!freeKey) {
			this.game.message("Inventory is full.");
			return;
		}

		this.inventory.set(freeKey, tile.item);
		this.game.message("You got {0}.", 'msg-info', tile.item.name());
		this.level.remove(tile.item);
		this.spendTime();
	}

	search()
	{
		this.spendTime();
	}

	enter(pos)
	{
		var tile = this.level.get(pos, 'tile');

		if (tile.item && tile.item.is('gold')) {
			var amount = tile.item.getAttrib('amount', 10);
			this.gold += amount;
			this.game.message("You collected {1} {0}.", 'msg-info', tile.item.name(), amount);
			this.level.remove(tile.item);
		}
		super.enter(pos);
	}

	wear(key)
	{
		var item = this.inventory.get(key);
		this.inventory.wear(key);
		this.game.message("You are wearing {0}.", 'msg-info', item.name());
		this.spendTime();
	}

	unwear(key)
	{
		var item = this.inventory.get(key);
		this.inventory.unwear(key);
		this.game.message("You take off {0}.", 'msg-info', item.name());
		this.spendTime();
	}

	drop(key)
	{
		if (this.getTile().item) {
			this.game.message("There is no place to drop item.");
		}

		var item = this.inventory.remove(key);
		if (!item) return;

		this.level.set(this.pos, 'item', item);
		this.game.message("You drop {0}.", 'msg-info', item.name());
		this.spendTime();
	}

	eat(key)
	{
		var item = this.inventory.remove(key);
		this.game.message("You eat {0}.", 'msg-info', item.name());
		this.spendTime();
	}

	getDamage(target, type)
	{
		var weapon = this.inventory.get('3');
		var dmg = weapon? weapon.getDamage(target, type) : super.getDamage(target, type);
		return dmg;
	}

	spendTime()
	{
		this.game.time += this.tick;
	}

}