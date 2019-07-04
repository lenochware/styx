var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Player = class extends Styx.actors.Actor
{
	constructor(params = {})
	{
		params.id = 'player';
		super(params);
		this.inventory = new Styx.actors.Inventory(this);
		this.gold = this.getAttrib('gold');
		this.lvl = this.getAttrib('lvl');
		this.xp = this.getAttrib('xp');
		this.nextXp = 20 * Math.pow(2, this.lvl - 1);
		this.tick = 10;
		this.game.player = this;
	}

	get()
	{
		var tile = this.getTile();
		if (!tile.item) {
			this.game.info("There is nothing to get.");
			return;
		}

		var freeKey = this.inventory.getFreeKey();
		if (!freeKey) {
			this.game.info("Inventory is full.");
			return;
		}

		this.inventory.set(freeKey, tile.item);
		this.game.info("You got {0}.", tile.item);
		this.level.remove(tile.item);
		this.spendTime();
	}

	name()
	{
		return "you";
	}

	isPlayer()
	{
		return true;
	}

	search()
	{
		this.spendTime();
	}

	rest()
	{
		if (!this.canRest()) return;

		if (this.game.random.bet(.3)) {
			this.health++;
			this.game.message("You are sleeping...", "msg-info");
		}

		if (this.health > this.maxHealth) {
			this.health = this.maxHealth;
		}

		this.spendTime();
	}

	canRest()
	{
		if (this.health == this.maxHealth) {
			this.game.info("You are in full condition now.");
			return false;
		}

		if (this.conditions.is('Poisoned')) {
			this.game.info("You cannot rest while poisoned!");
			return false;
		}

		return true;
	}

	enter(pos)
	{
		var tile = this.level.get(pos, 'tile');

		if (tile.item && tile.item.is('gold')) {
			var amount = tile.item.getAttrib('amount', 10);
			this.gold += amount;
			this.game.info("You collected {1} {0}.", tile.item, amount);
			this.level.remove(tile.item);
		}

		if (tile.item) {
			this.game.info('You are on <span class="link tile-info" data-pos="{1}">{0}</span>.', 
				tile.item.shortDesc(), pos.x + ',' + pos.y);
		}

		if (tile.is('exit')) {
			this.game.message("You climb the {0}.", 'msg-info', tile);
			var exit = this.level.exits[tile.pos.x + ',' + tile.pos.y];
			this.game.on('game-loop', () => this.game.changeLevel(exit.id), {run: 'once'});
		}

		super.enter(pos);
	}

	wear(key)
	{
		var item = this.inventory.get(key);
		this.inventory.wear(key);
		this.game.info("You are wearing {0}.", item);
		this.spendTime();
	}

	unwear(key)
	{
		var item = this.inventory.get(key);
		this.inventory.unwear(key);
		this.game.info("You take off {0}.", item);
		this.spendTime();
	}

	drop(key)
	{
		if (this.getTile().item) {
			this.game.info("There is no place to drop item.");
		}

		var item = this.inventory.remove(key);
		if (!item) return;

		this.level.set(this.pos, 'item', item);
		this.game.info("You drop {0}.", item);
		this.spendTime();
	}

	eat(key)
	{
		var item = this.inventory.remove(key);
		this.game.info("You eat {0}.", item);
		this.spendTime();
	}

	defense(attack)
	{
		var attack = super.defense(attack);
		
		var shield = this.inventory.getShield();
		if (shield && shield.pickAttack().type == 'block') {
			attack.points = 0;
		}

		return attack;
	}

	pickAttack()
	{
		var weapon = this.inventory.getWeapon();
		var attack =  weapon? weapon.pickAttack() : super.pickAttack();
		return attack;
	}

	die(src)
	{
		super.die(src);
		this.params.render = {char: '~', color: 'red'};
	}

	addExperience(src)
	{
		this.xp += src.getAttrib('xp');
		if (this.xp >= this.nextXp) {
			this.levelUp();
			this.nextXp *= 2;
		}
	}

	levelUp()
	{
		this.lvl++;
		this.game.message("Welcome to level {0}!", "msg-good", this.lvl);
	}

	spendTime()
	{
		this.conditions.update();
		this.game.time += this.tick;
	}

}