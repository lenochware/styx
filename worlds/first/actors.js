{
	"player": {
		"lvl": 1,
		"xp": 0,
		"gold": 0,
		"armor": 0,
		"tags": ["player", "actor"],
		"render": {"char": "@", "color": "white" },
		"health": 100,
		"strength": 3,
		"attacks": ["punch"],
		"name": "you",
		"desc": "Warriors start with 11 points of Strength."
	},

	"ghost": {
		"lvl": 1,
		"xp": 3,
		"tags": ["actor", "ghost", "flying", "neutral", "moving-random", "awake"],
		"render": {"char": "G", "color": "green" },
		"health": 10,
		"attacks": ["touch"],
		"name": "green ghost",
		"desc": "Strange transparent humanoid form.",
		"death-message": "{0} disappears."
	},

	"rat": {
		"lvl": 1,
		"xp": 3,
		"tags": ["actor", "rat", "fast"],
		"render": {"char": "r", "color": "brown" },
		"health": 20,
		"attacks": ["hit"],
		"bones": "skull",
		"name": "giant rat",
		"desc": "It is rat with size of lion and red glowing eyes."
	},

	"worm": {
		"lvl": 1,
		"xp": 6,
		"tags": ["actor", "worm"],
		"render": {"char": "w", "color": "white" },
		"health": 25,
		"attacks": ["hit"],
		"name": "huge worm",
		"desc": "Huge worm with giant mouth filled with teeth."
	},

	"skeleton": {
		"lvl": 2,
		"xp": 10,
		"tags": ["actor", "skeleton", "fast"],
		"render": {"char": "S", "color": "white" },
		"health": 20,
		"attacks": ["hit"],
		"bones": "skull",
		"name": "skeleton",
		"desc": "Skeleton with sword and shield is moving to you."
	},

	"snake": {
		"lvl": 1,
		"xp": 6,
		"tags": ["actor", "neutral", "moving-random", "awake", "slow", "swimmer"],
		"render": {"char": "J", "color": "yellow" },
		"health": 10,
		"attacks": ["bite", "poison-bite"],
		"attack-chances": [3,1],
		"name": "great yellow snake",
		"desc": "Great yellow snake is moving slowly on the floor."
	}
}