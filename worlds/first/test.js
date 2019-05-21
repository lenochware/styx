{
	"actors": {
		"player": {
			"tags": ["player", "actor"],
			"render": {"char": "@", "color": "white" },
			"health": 10,
			"attack": 5,
			"name": "you",
			"desc": "Warriors start with 11 points of Strength."
		},

		"kobold": {
			"tags": ["actor", "kobold", "slow"],
			"render": {"char": "k", "color": "green" },
			"health": 10,
			"attack": 1,
			"name": "gnoll kobold",
			"desc": "Kobolds are the largest, strongest and toughest of all gnolls. When severely wounded, they go berserk, inflicting even more damage to their enemies."
		},

		"ghost": {
			"tags": ["actor", "ghost", "flying"],
			"render": {"char": "G", "color": "green" },
			"health": 10,
			"attack": 1,
			"name": "green ghost",
			"desc": "Strange transparent humanoid form."
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
		"small_shield": {
			"render": {"char": ")", "color": "white" },
			"tags": ["item", "wearable", "shield"],
			"name": "small wooden shield",
			"desc": "Scratched round small woden shield with brass spice in center."
		},		
		"copper_coins": {
			"render": {"char": "$", "color": "brown" },
			"tags": ["item", "gold"],
			"name": "copper coins",
			"desc": "A pile of %d copper coins."
		},
		"bread": {
			"render": {"char": ",", "color": "brown" },
			"tags": ["item", "food"],
			"name": "piece of bread",
			"desc": "A piece of bread."
		}
	},

	"tiles": {
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
			"on": {"enter": "drowning" },
			"desc": "You see nothing interesting."
		},

		"floor": {
			"render": {"char": ".", "color": "gray" },
			"tags": ["floor"],
			"name": "stone floor",
			"desc": "You see nothing interesting."
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
}