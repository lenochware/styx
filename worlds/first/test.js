{
	"actors": {
		"kobold": {
			"tags": ["alive", "kobold", "slow"],
			"render": {"char": "k", "color": "green" },
			"health": 10,
			"attack": 1,
			"name": "gnoll kobold",
			"desc": "Kobolds are the largest, strongest and toughest of all gnolls. When severely wounded, they go berserk, inflicting even more damage to their enemies."
		},

		"player": {
			"tags": ["player", "alive"],
			"render": {"char": "@", "color": "white" },
			"health": 10,
			"attack": 5,
			"name": "you",
			"desc": "Warriors start with 11 points of Strength."
		}
	},

	"items": {
		"bones": {
			"render": {"char": "~", "color": "gray" },
			"tags": ["item", "useless"],
			"name": "bones",
			"desc": "Who left his bones in this sad place?"
		},
		"short_sword": {
			"render": {"char": "|", "color": "white" },
			"tags": ["item", "wearable", "weapon"],
			"name": "short sword",
			"desc": "It is indeed quite short, just a few inches longer than a dagger."
		},
		"gold": {
			"render": {"char": "$", "color": "yellow" },
			"tags": ["item", "money"],
			"name": "gold",
			"desc": "A pile of %d gold coins."
		},
		"food": {
			"render": {"char": ",", "color": "brown" },
			"tags": ["item", "food"],
			"name": "ration of food",
			"desc": "Nothing fancy here: dried meat, some biscuits - things like that."
		}
	},

	"tiles": {
		"null": {
			"render": {"char": " ", "color": "black" },
			"tags": ["wall"],
			"name": "unknown grid",
			"desc": "You see nothing."
		},

		"wall": {
			"render": {"char": "#", "color": "gray" },
			"tags": ["wall"],
			"name": "stone wallx",
			"desc": "You see nothing interesting."
		},

		"fake_wall": {
			"render": {"char": "#", "color": "gray" },
			"tags": [],
			"name": "stone wall",
			"desc": "You see nothing interesting."
		},

		"floor": {
			"render": {"char": ".", "color": "gray" },
			"tags": ["floor"],
			"name": "stone floor",
			"desc": "You see nothing interesting."
		}
	}	
}