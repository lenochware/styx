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
		"tags": ["actor", "rat", "fast", "aggresive"],
		"render": {"char": "r", "color": "brown" },
		"health": 20,
		"attacks": ["bite"],
		"corpse": ["rat's skull", "bones", "bone"],
		"drop": ["none", "corpse"],
		"name": "giant rat",
		"desc": "It is rat with size of lion and red glowing eyes."
	},

	"worm": {
		"lvl": 1,
		"xp": 6,
		"tags": ["actor", "worm"],
		"render": {"char": "w", "color": "white" },
		"health": 25,
		"attacks": ["bite"],
		"corpse": "strange slime",
		"name": "huge worm",
		"desc": "Huge worm with giant mouth filled with teeth."
	},

	"skeleton": {
		"lvl": 2,
		"xp": 10,
		"tags": ["actor", "skeleton", "fast", "swimmer"],
		"render": {"char": "S", "color": "white" },
		"health": 20,
		"attacks": ["hit"],
		"corpse": "skull",
		"drop": ["none", "corpse"],
		"name": "skeleton",
		"desc": "Skeleton with sword and shield is moving to you."
	},

	"wall_monster": {
		"lvl": 2,
		"xp": 10,
		"tags": ["actor", "wall_monster", "unmovable"],
		"render": {"char": "m", "color": "brown" },
		"health": 20,
		"attacks": ["hit"],
		"corpse": "dust",
		"drop": ["none", "rock", "rubble"],
		"name": "wall monster",
		"desc": "Huge boulder with stone fist."
	},

	"snake": {
		"lvl": 1,
		"xp": 6,
		"tags": ["actor", "neutral", "moving-random", "awake", "slow", "swimmer"],
		"render": {"char": "J", "color": "yellow" },
		"health": 10,
		"attacks": ["bite"],
		"name": "great yellow snake",
		"corpse": "snake skin",
		"drop": ["none", "fish_food"],
		"drop-chances": [5,1],
		"desc": "Great yellow snake is moving slowly on the floor."
	},

	"poisonous_snake": {
		"extends": "snake",
		"attacks": ["bite", "poison-bite"],
		"attack-chances": [3,1]
	}

}