var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RoomBuilder = class
{
	constructor(params = {})
	{
		this.game = game;
		this.params = params;

    this.roomsIndex = _.keys(this.game.db.getCategory('rooms'));

		this.rooms = this.game.db.getCategory('rooms');
	}

	find(tag)
	{
		return _.chain(_.keys(this.rooms)).filter(i => this.rooms[i].tags.includes(tag));
	}

	make(id)
	{
		return (id == 'corridor')? new Styx.levels.Corridor(3,3) : new Styx.levels.Room(id);
	}


	build(room)
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