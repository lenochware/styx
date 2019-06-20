var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RoomBuilder = class
{
	constructor(params = {})
	{
		this.game = game;
		this.params = params;
		this.roomsIndex = _.keys(this.game.db.getCategory('rooms'));
	}

	get(room)
	{
		var r = null;

		if (room.is('room')) {
			while(true) {
				r = new Styx.levels.Room(_.sample(this.roomsIndex));
				if (r.is('corridor')) break;
			}
		}
		else {
			r = new Styx.levels.Room(_.sample(this.roomsIndex));
		}

		if(!r.is('no-rotate') && Math.random() < 0.5) r.rotate();

		return r;		
	}
}