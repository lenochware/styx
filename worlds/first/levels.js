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
		]
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