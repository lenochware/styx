var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RoomBuilder = class
{
	constructor(params = {})
	{
		this.game = game;
		this.params = params;

    //this.roomsIndex = _.keys(this.game.db.getCategory('rooms'));
		//this.rooms = this.game.db.getCategory('rooms');
	}

	find(tag)
	{
		return this.game.db.findKey('rooms', tag);
	}

	make(id, params = {})
	{
		if (params.tag) {
			id = this.find(params.tag).sample().value();
		}

		if (!id) {
			console.warn('Room id not found.');
			return null;
		}

		return (id == 'corridor')? new Styx.levels.Corridor(3,3) : new Styx.levels.Room(id);
	}
}