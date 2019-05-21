var Styx = Styx || {};
Styx.items = Styx.items || {};

Styx.items.Item = class extends Styx.Entity
{
	constructor(params)
	{
		super('items', params.id, params);
	}

	getDamage(target, type)
	{
		if (!this.is('weapon')) return null;

		var dmg = {
			actor: this,
			type: type,
			points: 1, 
			message: "{0} hit[s] {1}"
		};

		return dmg;
	}
}