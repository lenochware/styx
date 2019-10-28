{
	"first": {
		"name": "The Town",
		"type": "regular",
		"tags": ["small"],
		"exits": [
			{"id": "small-cave", "tile": "stairs-down"},
			{"id": "wilderness", "tile": "stairs-down"}
		]
	},

	"small-cave": {
		"name": "Small cave",
		"type": "regular",
		"tags": [],
		"exits": [
			{"id": "first", "tile": "stairs-up"}
		],
		
 		"dependencies": {
			"small": { "empty": 0.5, "crap": 0.5, "center-pillar": 0.2, "monsters": -0.1 },
			"large": {"monsters": 0.2, "decor": 0.2},
			"huge": {"special": 0.7, "monsters": 0.3, "decor": 0.2},
			"corridor": {"monsters": -0.1, "trap": 0.3, "obstacle": 0.1 },
			"dead-end": {"monsters": 0.5, "treasure": 0.5, "crap": 0.3},
			"crossroad": {"treasure": 0.2, "crap": 0.3},
			"secret": {"special": 0.7, "valuables": 0.7, "treasure": 0.5},
			"center-pillar": {"monster": 0.5, "item": 0.5, "hidden": 0.5}
		},

		"paint": {
			"monsters": {"painter": "random", "id": "rat"},
			"treasure": {"painter": "random", "id": "copper_coins"},
			"decor": {"painter": "random", "id": "shallow_water"},
			"crap": {"painter": "random", "id": ["slime", "dust", "rock"] },
			"obstacle": {"painter": "random", "id": "rubble"},
			"center-pillar": {"painter": "random", "id": "wall", "pos": "center"},
			"item": {"painter": "random", "id": "small_shield"},
			"valuables": {"painter": "random", "id": "bread"},
			"forest": {"painter": "simplex", "id": ["tree", "high_grass", "none", "none"], "weights": [0.2, 0.4, 0.6, 0.8]},
			"special": [
				{"painter": "mfill", "id": ["high_grass", "rubble"], "pos": "walls"},
				{"painter": "random", "id": ["snake", "#items.weapon"]}
				]
		}


	},

	"test": {
		"name": "Test level",
		"type": "test",
		"tags": ["small"],
		"max-rooms": 5,
		"exits": []
	},

	"wilderness": {
		"name": "Wilderness",
		"type": "regular",
		"tags": ["big"],
		"exits": [
			{"id": "first", "tile": "stairs-up"}
		]
	}


}