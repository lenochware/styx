{
	"rats": {
		"common-monsters": ["rat"],
		"rare-monsters": ["rat","worm","skeleton"],
		"common-items": ["bread", "bones", "copper_coins", "rusty_dagger"],
		"rare-tiles": ["high_grass", "blood_floor"]
	},

	"rat-room": {
		"name": "Rat room",

		"monsters": {
			"list": ["rat"],
			"fill-percent": 50
		},

		"boss": {
			"list": ["rat-king"],
			"count": 0.5
		},

		"items": {
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