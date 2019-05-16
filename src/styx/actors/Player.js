var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Player = class extends Styx.actors.Actor
{
	constructor(params = {})
	{
		params.id = 'player';
		super(params);
		this.inventory = new Styx.actors.Inventory(this);
		this.tick = 1;
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
		this.game.message("You got {0}.".format(tile.item.name()));
		this.level.remove(tile.item);
		this.spendTime();
	}

	search()
	{
		this.spendTime();
	}

	spendTime()
	{
		this.game.time += this.tick;
	}

}