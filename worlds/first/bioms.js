{
	"rats": {
		"name": "Rats",

		"monsters": {
			"list": ["rat", "worm", "skeleton"],
			"chances": [8, 3, 1],
			"count": [5,10]
		},

		"special-rooms": ["rat-room"],

		"rooms": {
			"list": ["r1", "r2", "r3", "r4", "r5", "r6"],
			"chances": [8, 3, 1]
		},

		"items": {
			"list": ["bread", "bones", "copper_coins", "rusty_dagger"],
			"chances": [3, 3, 3, 1],
			"count": [5,10]
		},

		"tiles": {
			"list": ["high_grass", "blood_floor"],
			"chances": [1, 4],
			"count": [0,20]
		},

		"tags": []
	},

	"rat-room": {
		"name": "Rat room",

		"monsters": {
			"list": ["rat", "rat-king"],
			"chances": [8, 1],
			"count": [3,6]
		},

		"monsters": {
			"list": ["food", "bones", "coins", "sword"],
			"chances": [3, 3, 2, 1],
			"count": [3,6]
		},

		"tiles": {
			"list": ["blood_floor"],
			"chances": [1],
			"count": [0,5]
		}
	},

	"water-room": {
		"name": "Water room"
	},


	"water": {
		"name": "Water biom"
	},

	"forest": {
		"name": "Forest biom"
	}

}