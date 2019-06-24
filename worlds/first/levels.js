{
	"first": {
		"name": "The Town",
		"type": "arena",
		"tags": ["small"],
		"exits": [
			{"id": "small-cave", "tile": "stairs-down"},
			{"id": "wilderness", "tile": "stairs-down"}
		]
	},

	"small-cave": {
		"name": "Small cave",
		"type": "regular",
		"tags": ["small"],
		"exits": [
			{"id": "first", "tile": "stairs-up"}
		]
	},

	"wilderness": {
		"name": "Wilderness",
		"type": "arena",
		"tags": ["big"],
		"exits": [
			{"id": "first", "tile": "stairs-up"}
		]
	}


}