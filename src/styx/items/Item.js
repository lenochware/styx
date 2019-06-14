var Styx = Styx || {};
Styx.items = Styx.items || {};

Styx.items.Item = class extends Styx.DungeonObject
{
	constructor(params)
	{
		super('items', params.id, params);
	}

	getAttack()
	{
		if (!this.is('weapon')) return null;
		return 'hit';
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