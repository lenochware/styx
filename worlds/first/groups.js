{
	"rats": {
		"common-monsters": ["rat"],
		"rare-monsters": ["rat","worm","skeleton"],
		"common-items": ["bread", "bones", "copper_coins", "rusty_dagger"],
		"rare-tiles": ["high_grass", "blood_floor"]
	},

	"forest": {
	  "common-tiles": ["tree", "shallow_water"],
	  "common-monsters": ["snake"],
	  "rare-monsters": ["ghost"],
	  "transform": {"floor": "high_grass"}
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
	}

}