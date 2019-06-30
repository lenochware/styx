var Styx = Styx || {};
Styx.items = Styx.items || {};

Styx.items.Item = class extends Styx.DungeonObject
{
	constructor(params)
	{
		super('items', params.id, params);
	}

	storeInBundle(bundle) {
		super.storeInBundle(bundle);
		bundle.put('_className_', 'Styx.items.Item');
		bundle.put('_args_', [this.params]);
	}

	restoreFromBundle(bundle) {
		super.restoreFromBundle(bundle);
	}

	getAvgDamage()
	{
		var sum = 0;

		for (let i = 0; i < 10; i++) {
			sum += this.pickAttack().points;
		}

		return sum / 10;
	}

	longDesc()
	{
		var desc = super.longDesc();

		if (this.is('gold')) {
			desc = desc.format(this.getAttrib('amount', 10));
		}

		if (this.is('armor')) {
			desc += '<br>Armor: +' + this.getAttrib('points');
		}

		if (this.is('weapon')) {
			desc += '<br>Attack: +' + this.getAvgDamage();
		}

		if (this.is('shield')) {
			desc += '<br>Level: ' + this.getAttrib('lvl', 0);
		}

		return desc;
	}	
}