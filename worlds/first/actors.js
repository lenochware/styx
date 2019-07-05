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

	"kobold": {
		"lvl": 1,
		"xp": 3,
		"tags": ["actor", "kobold", "fast"],
		"render": {"char": "k", "color": "green" },
		"health": 20,
		"attacks": ["hit"],
		"bones": "skull",
		"name": "gnoll kobold",
		"desc": "Kobolds are the largest, strongest and toughest of all gnolls. When severely wounded, they go berserk, inflicting even more damage to their enemies."
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