var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Player = class extends Styx.actors.Actor
{
	constructor(params = {})
	{
		params.id = 'player';
		super(params);
	}

	execute(command)
	{
		if (this.isDestroyed()) return;

		switch(command.command) {
			case 'walk':
				this.walk(command.dir[0], command.dir[1]);
			break;				
			case 'search':
			break;
			// case 'attack':
			// break;
			default: throw `Invalid command '${command.command}'.`;
		}
	}

}