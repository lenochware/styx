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

	longDesc()
	{
		var desc = super.longDesc();

		if (this.is('gold')) {
			desc = desc.format(this.getAttrib('amount', 10));
		}

		return desc;
	}	
}