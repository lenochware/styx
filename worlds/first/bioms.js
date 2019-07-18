{
	"rats": {
		"name": "Rats",

		"monsters": {
			"type": "actors",
			"list": ["rat", "worm", "skeleton"],
			"chances": [8, 3, 1],
			"count": [5,10],
			"location": "spread"
		},

		"items": {
			"type": "items",
			"list": ["bread", "bones", "copper_coins", "rusty_dagger"],
			"chances": [3, 3, 3, 1],
			"count": [5,10]
		},

		"tiles": {
			"type": "tiles",			
			"list": ["high_grass", "blood_floor"],
			"chances": [1, 4],
			"count": [0,20]
		},

		//pridat k default-rooms, pomer corridor/room, pouzit pouze tyto...

		"rooms": {
			"type": "rooms",
			"list": ["r1", "r2", "r3", "r4", "r5", "r6"]
		},

		"special-rooms": {
			"type": "rooms",
			"chance": 0.5,
			"list": ["rat-room"],
			"count": [1,1]
		}


		// "spec-tiles": {
		// 	"list": ["rat-spawner-well"],
		// 	"probability": [0.5]
		// },

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