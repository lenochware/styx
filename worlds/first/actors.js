{
	"player": {
		"tags": ["player", "actor"],
		"render": {"char": "@", "color": "white" },
		"health": 10,
		"attack": {"type": "hit", "points": 5},
		"name": "you",
		"desc": "Warriors start with 11 points of Strength."
	},

	"kobold": {
		"tags": ["actor", "kobold", "fast"],
		"render": {"char": "k", "color": "green" },
		"health": 20,
		"attack": {"type": "hit", "points": 1},
		"bones": "skull",
		"name": "gnoll kobold",
		"desc": "Kobolds are the largest, strongest and toughest of all gnolls. When severely wounded, they go berserk, inflicting even more damage to their enemies."
	},

	"ghost": {
		"tags": ["actor", "ghost", "flying", "neutral", "moving-random", "awake"],
		"render": {"char": "G", "color": "green" },
		"health": 10,
		"attack": {"type": "touch", "points": 5},
		"name": "green ghost",
		"desc": "Strange transparent humanoid form."
	}
}