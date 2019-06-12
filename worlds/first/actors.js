{
	"player": {
		"tags": ["player", "actor"],
		"render": {"char": "@", "color": "white" },
		"health": 10,
		"attacks": ["punch"],
		"name": "you",
		"desc": "Warriors start with 11 points of Strength."
	},

	"kobold": {
		"tags": ["actor", "kobold", "fast"],
		"render": {"char": "k", "color": "green" },
		"health": 20,
		"attacks": ["hit"],
		"bones": "skull",
		"name": "gnoll kobold",
		"desc": "Kobolds are the largest, strongest and toughest of all gnolls. When severely wounded, they go berserk, inflicting even more damage to their enemies."
	},

	"ghost": {
		"tags": ["actor", "ghost", "flying", "neutral", "moving-random", "awake"],
		"render": {"char": "G", "color": "green" },
		"health": 10,
		"attacks": ["touch"],
		"name": "green ghost",
		"desc": "Strange transparent humanoid form.",
		"death-message": "{0} disappears."
	},

	"snake": {
		"tags": ["actor", "neutral", "moving-random", "awake", "slow"],
		"render": {"char": "J", "color": "yellow" },
		"health": 10,
		"attacks": ["bite", "poison-bite"],
		"name": "great yellow snake",
		"desc": "Great yellow snake moving slowly on the floor."
	}
}