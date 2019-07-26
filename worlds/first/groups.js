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
	  "transform": {"floor": ["high_grass", "mud"], "wall": "earth_wall"}
	},

	"water-room": {
	  "transform": {"floor": "shallow_water"}
	},

	"dead-hero-site": {
	   "common-tiles": ["blood_floor"],
	   "common-items": ["weapon", "food", "bones"]
	},

	"common_bindings": {
		"rat": {
			"groups": ["rat1", "rat2"]
		},

		"rat1": {
	    "items": ["food"],
	    "tags": ["rare", "around"]
	  },

	  "rat2": {
	    "items": ["bones"],
	    "tags": ["common", "anywhere"]
	  },

		"shallow_water": {
	    "items": ["rusty_dagger", "copper_coins", "fish_food"],
	    "tags": ["rare", "in-place"]			
		}
	}

}