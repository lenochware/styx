var Styx = Styx || {};
Styx.items = Styx.items || {};

Styx.items.Item = class extends Styx.Entity
{
	constructor(params)
	{
		super('items', params.id, params);
	}

	getDamage(actor, type)
	{
		return {points:1, message: "You are attacked!" };
	}
}