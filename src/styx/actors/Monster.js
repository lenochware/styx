var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Monster = class extends Styx.actors.Actor
{
	constructor(params)
	{
		super(params);
		this.level = null;
	}

	update()
	{
		this.walk(_.random(-1,1), _.random(-1,1));
	}

}