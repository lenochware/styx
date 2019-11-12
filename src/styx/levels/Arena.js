var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Arena = class extends Styx.levels.Room
{
	constructor(builder)
	{
		super(builder.level, 0, 0, 0, 0);
		this.builder = builder;
		this.rooms = [];
		this.used = [];
	}

	setSize(x, y, width, height)
	{
		this.assign(x, y, width, height);
		this.align(this.builder.level);
		this.init();
	}

	init()
	{
		this.rooms = [];
		var garbage = [];

		var bounds = this.clone().expand(1,1);

		for (let r of this.builder.rooms) {
			if (!r.intersect(bounds)) continue;

			this.rooms.push(r);

			if (r.inside(this)) {
				r.addTag('arena');
				if (r.isConnected()) garbage.push(r);
			}
			else {
				r.addTag('arena-border');
			}
		}

		this.builder.remove(garbage);
	}

	connect()
	{
		for (let room of this.builder.connected) {
			for(let nb of room.neighbours) {
				if (nb.is('arena')) {
					if (!room.isConnectedWith(nb)) room.addDoor(nb, 'door');
					break;
				}
			}
		}
	}

	addRooms(p)
	{
		for (let r of this.rooms) {
			if (!r.is('arena')) continue;
			if (Styx.Random.bet(p)) this.add(r);
		}
	}

	add(room)
	{
		this.builder.connected.push(room);
		this.used.push(room);
	}

	paint()
	{
		this.fill('floor');
	}

	build()
	{
		this.connect();
		this.paint();
	}
}