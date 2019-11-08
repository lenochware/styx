var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Arena = class extends Styx.levels.Room
{
	constructor(builder, x, y, width, height)
	{
		super(builder.level, x, y, width, height);
		this.builder = builder;
		this.rooms = [];
	}

	init()
	{
		var garbage = [];

		var bounds = this.clone().expand(1,1);

		for (let r of this.builder.rooms) {
			if (r.intersect(bounds)) {
				this.rooms.push(r);
				if (r.inside(this)) {
					r.addTag('arena');
					if (r.isConnected()) garbage.push(r);
				}
				else {
					r.addTag('arena-border');
				}
			}
		}

		this.builder.remove(garbage);
	}

	connect()
	{
		for (let room of this.builder.connected) {
			for(let nb of room.neighbours) {
				if (nb.is('arena')) {
					if (!nb.isConnectedWith(room)) room.addDoor(nb, 'door');
					break;
				}
			}
		}
	}

	addRooms()
	{
		for (let r of this.rooms) {
			if (!r.is('arena')) continue;
			if (Styx.Random.bet(.2)) this.add(r);
		}
	}

	add(room)
	{
		this.builder.connected.push(room);
	}

	paint()
	{
		this.fill('floor');
	}

	build()
	{
		this.init();
		this.addRooms();
		this.connect();
		this.paint();
	}
}