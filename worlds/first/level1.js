{
	"map": "assets/tilemaps/maps/test_level.json",
	"tilesets": {
		"tiles1": {
			"image": "assets/tilemaps/tiles/tiles1_big.png",
			"tiles": [
				"?", "stone_floor", "moss_floor", "well", "stone_wall", "door", "door", "stairs_up", "stairs_down", 
				"broken_floor", "locked_door", "?", "?", "?", "?", "grass",
				"fake_wall", "trap", "?", "trap", "?", "trap", "?", "trap", "blood_stain", "door", "door", 
				"trap", "?", "sign", "trap", "?"
			]
		},
		
		"items": {
			"image": "assets/tilemaps/tiles/items_big.png",
			"tiles": [
				"bones", "ankh", "short_sword", "staff", "food", "?", "?", "?",
				"brass_key", "silver_key", "gold_key", "chest", "chest_locked", "tombstone", "gold", "ninja_star"
			]
		}
	},

	"sprites": {
		"brute": {
			"image": "assets/sprites/brute_big.png",
			"width": 24,
			"height": 32,

			"animations": {
				"idle": {
					"frames": [0, 0, 0, 1, 0, 0, 1, 1],
					"frameRate": 2,
					"loop": true
				},
				"search": {
					"frames": [0, 0, 1, 1],
					"frameRate": 15,
				},				
				"walk": {
					"frames": [4, 5, 6, 7],
					"frameRate": 12
				},
				"attack": {
					"frames": [2, 3, 0],
					"frameRate": 10
				},				
				"die": {
					"frames": [8, 9, 10],
					"frameRate": 8
				}
			}
		},
		"warrior": {
			"image": "assets/sprites/warrior_big.png",
			"width": 24,
			"height": 29,

			"animations": {
				"idle": {
					"frames": [0, 0, 0, 1, 0, 0, 1, 1],
					"frameRate": 2,
					"loop": true
				},
				"search": {
					"frames": [0, 0, 1, 1],
					"frameRate": 15,
				},				
				"walk": {
					"frames": [2, 3, 4, 5, 6, 7],
					"frameRate": 25,
					"loop": true
				},
				"attack": {
					"frames": [13, 14, 15, 0],
					"frameRate": 10
				},				
				"die": {
					"frames": [8, 9, 10, 11, 12, 11],
					"frameRate": 8
				}
			}
		}
	},

	"monsters": {
		"brute": {
			"tags": ["monster", "brute", "slow"],
			"sprite": "brute",
			"health": 10,
			"attack": 1,
			"name": "gnoll brute",
			"desc": "Brutes are the largest, strongest and toughest of all gnolls. When severely wounded, they go berserk, inflicting even more damage to their enemies."
		},

		"warrior": {
			"tags": [],
			"sprite": "warrior",
			"health": 10,
			"attack": 5,
			"name": "you",
			"desc": "Warriors start with 11 points of Strength."
		}
	},

	"items": {
		"nothing": {
			"tags": ["useless"],
			"name": "nothing",
			"desc": "Nothing."
		},
		"bones": {
			"tags": ["useless"],
			"name": "bones",
			"desc": "Who left his bones in this sad place?"
		},
		"short_sword": {
			"tags": ["equipment", "weapon"],
			"name": "short sword",
			"desc": "It is indeed quite short, just a few inches longer than a dagger."
		},
		"gold": {
			"tags": ["money"],
			"name": "gold",
			"desc": "A pile of %d gold coins."
		},
		"food": {
			"tags": ["food"],
			"name": "ration of food",
			"desc": "Nothing fancy here: dried meat, some biscuits - things like that."
		}
	},

	"tiles": {
		"stone_wall": {
			"tags": ["wall"],
			"name": "stone wallx",
			"desc": "You see nothing interesting."
		},

		"fake_wall": {
			"tags": ["wall"],
			"name": "stone wall",
			"desc": "You see nothing interesting."
		},

		"stone_floor": {
			"tags": ["floor"],
			"name": "stone floor",
			"desc": "You see nothing interesting."
		}
	}
}