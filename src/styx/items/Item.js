var Styx = Styx || {};
Styx.items = Styx.items || {};

Styx.items.Item = class extends Styx.Entity
{
	constructor(params)
	{
		super('items', params.id, params);
	}

	getAttack(target, type)
	{
		if (!this.is('weapon')) return null;
		return {type: 'hit', points: 1};
	}

	longDesc()
	{
		var desc = super.longDesc();

		if (this.is('gold')) {
			desc = desc.format(this.getAttrib('amount', 10));
		}

		return desc;
	}	
}