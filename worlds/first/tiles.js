{
	"null": {
		"render": {"char": " ", "color": "black" },
		"tags": ["wall", "inpenetrable"],
		"name": "unknown grid",
		"desc": "You see nothing."
	},

	"wall": {
		"render": {"char": "#", "color": "gray" },
		"tags": ["wall", "hiding"],
		"name": "stone wall",
		"desc": "You see nothing interesting."
	},

	"fake_wall": {
		"render": {"char": "#", "color": "gray" },
		"tags": ["hiding"],
		"name": "stone wall",
		"desc": "You see nothing interesting."
	},

	"water": {
		"render": {"char": "~", "color": "light-blue" },
		"tags": ["water", "hiding"],
		"name": "deep water",
		"attacks": ["drowning"],
		"desc": "You see nothing interesting."
	},

	"shallow_water": {
		"render": {"char": "~", "color": "light-blue" },
		"tags": ["water", "hiding"],
		"name": "shallow water",
		"desc": "You see nothing interesting."
	},

	"high_grass": {
		"render": {"char": ";", "color": "dark-green" },
		"tags": ["hiding", "hiding_mon"],
		"name": "high grass",
		"desc": "You see nothing interesting."
	},

	"floor": {
		"render": {"char": ".", "color": "gray" },
		"tags": ["floor"],
		"name": "stone floor",
		"desc": "You see nothing interesting."
	},

	"blood_floor": {
		"render": {"char": ".", "color": "red" },
		"tags": ["floor"],
		"name": "blood stains",
		"desc": "Blood stains on the floor looks suspicious."
	},

	"door": {
		"render": {"char": "+", "color": "brown" },
		"tags": ["hiding", "door"],
		"name": "wooden door",
		"desc": "You see nothing interesting."
	},

	"open_door": {
		"render": {"char": "`", "color": "brown" },
		"tags": ["door", "open"],
		"name": "open wooden door",
		"desc": "You see nothing interesting."
	}
}