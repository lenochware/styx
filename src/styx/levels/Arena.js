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

		for (let r of this.builder.rooms) {
			if (r.intersect(this)) {
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

	}

	// connectArena(rooms)
	// {
	// 	for (let room of rooms) {
	// 		for(let nb of room.neighbours) {				
	// 			if (!nb.isConnected()) {
	// 				if (Styx.Random.bet(.5)) {
	// 					room.addDoor(nb, this.params.door_type);
	// 				}
	// 				break;
	// 			}
	// 		}
	// 	}
	// }

	//paintBorder(room)	{}

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
		//if (Styx.Random.bet(.5)) room.addTag('outside');
	}

	paint()
	{
		this.fill('blood_floor');
		// for (let r of this.rooms) {
		// 	if (r.isConnected() && !r.is('outside')) this.paintBorder(r);
		// }
	}

	build()
	{
		this.init();
		this.addRooms();
		this.connect();
		this.paint();
	}
}