{
	"null": {
		"render": {"char": " ", "color": "black" },
		"tags": ["wall", "inpenetrable", "opaque", "blocking"],
		"name": "unknown grid",
		"desc": "You see nothing."
	},

	"none": {
		"render": {"char": " ", "color": "black" },
		"tags": ["wall", "inpenetrable", "opaque", "blocking"],
		"name": "unknown grid",
		"desc": "You see nothing."
	},

	"wall": {
		"render": {"char": "#", "color": "gray" },
		"tags": ["wall", "hiding", "opaque", "blocking"],
		"name": "stone wall",
		"desc": "You see nothing interesting."
	},

	"granite-wall": {
		"render": {"char": "#", "color": "gray" },
		"tags": ["wall", "hiding", "opaque", "blocking"],
		"name": "stone wall",
		"desc": "You see nothing interesting."
	},

	"wall-moss": {
		"render": {"char": "#", "color": "dark-green" },
		"tags": ["wall", "hiding", "opaque", "blocking"],
		"name": "moss covered wall",
		"desc": "You see nothing interesting."
	},

	"fake_wall": {
		"render": {"char": "#", "color": "gray" },
		"tags": ["hiding", "opaque"],
		"name": "fake wall",
		"desc": "It looks like a wall but it is only image created by wizzard."
	},

	"invisible_wall": {
		"render": {"char": ".", "color": "gray" },
		"tags": ["wall", "blocking"],
		"name": "invisible wall",
		"desc": "Mage applied invisibility spell on this wall."
	},


	"rubble": {
		"render": {"char": ":", "color": "gray" },
		"tags": ["hiding", "blocking", "diggable"],
		"name": "rubble",
		"desc": "Pile of rubble is blocking a way."
	},

	"water": {
		"render": {"char": "~", "color": "light-blue" },
		"tags": ["water", "hiding", "sticky"],
		"name": "deep water",
		"attacks": ["drowning"],
		"desc": "You see nothing interesting."
	},

	"shallow_water": {
		"render": {"char": "~", "color": "light-blue" },
		"tags": ["water", "hiding", "floor"],
		"name": "shallow water",
		"desc": "You see nothing interesting."
	},

	"mud": {
		"render": {"char": ".", "color": "brown" },
		"tags": ["floor"],
		"name": "mud",
		"desc": "You see nothing interesting."
	},

	"dirt": {
		"render": {"char": ".", "color": "brown" },
		"tags": ["floor"],
		"name": "mud",
		"desc": "You see nothing interesting."
	},

	"rocks": {
		"render": {"char": "^", "color": "gray" },
		"tags": ["sticky"],
		"name": "rocks",
		"desc": "You see nothing interesting."
	},

	"earth_wall": {
		"render": {"char": "#", "color": "brown" },
		"tags": ["wall", "hiding", "opaque", "blocking", "diggable"],
		"name": "earth wall",
		"desc": "You see nothing interesting."
	},

	"grass": {
		"render": {"char": ";", "color": "dark-green" },
		"tags": ["hiding", "hiding_mon","floor"],
		"name": "high grass",
		"desc": "You see nothing interesting."
	},

	"tree": {
		"render": {"char": "%", "color": "green" },
		"tags": ["hiding", "hiding_mon", "blocking", "diggable"],
		"name": "high tree",
		"desc": "You see nothing interesting."
	},

	"floor": {
		"render": {"char": ".", "color": "gray" },
		"tags": ["floor"],
		"name": "stone floor",
		"desc": "You see nothing interesting."
	},

	"blood-floor": {
		"render": {"char": ".", "color": "red" },
		"tags": ["floor"],
		"name": "blood stains",
		"desc": "Blood stains on the floor looks suspicious."
	},

	"blood_floor": {
		"render": {"char": ".", "color": "red" },
		"tags": ["floor"],
		"name": "blood stains",
		"desc": "Blood stains on the floor looks suspicious."
	},

	"wet-floor": {
		"render": {"char": ".", "color": "blue" },
		"tags": ["floor"],
		"name": "wet floor",
		"desc": ""
	},

	"stairs-up": {
		"render": {"char": "<", "color": "white" },
		"tags": ["exit"],
		"name": "stairs up",
		"desc": "You see nothing interesting."
	},

	"stairs-down": {
		"render": {"char": ">", "color": "white" },
		"tags": ["exit"],
		"name": "stairs down",
		"desc": "You see nothing interesting."
	},

	"door": {
		"render": {"char": "+", "color": "brown" },
		"tags": ["hiding", "door", "opaque", "blocking"],
		"name": "wooden door",
		"desc": "You see nothing interesting."
	},

	"secret-door": {
		"render": {"char": "%", "color": "gray" },
		"family": ["ground", "device", "door"],
		"name": "secret door",
		"desc": "You see nothing interesting."
	},

	"open_door": {
		"render": {"char": "`", "color": "brown" },
		"tags": ["door", "open"],
		"name": "open wooden door",
		"desc": "You see nothing interesting."
	}
}