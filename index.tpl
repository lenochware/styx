<!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Styx</title>
		<meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0 minimal-ui">
		<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css">
		<link rel="stylesheet" type="text/css" href="styles.css">
		<script src="lib/underscore.1.9.1.min.js" type="text/javascript"></script>
		<script src="lib/jquery.1.12.4.min.js" type="text/javascript"></script>

		{scripts}

	<style>
		#game-container {
		  display: grid;
		  grid-template-columns: 1fr 4fr;
		}

		#side-bar {
			grid-column: 1/2;
			grid-row: 1/2;
		}

		#war-messages {
			grid-column: 1/2;
			grid-row: 2/3;
		}


		#level-map {
			grid-column: 2/3;
		}

		#messages {
			grid-column: 2/3;
			grid-row: 2/3;
			height:100px;
		}
		#statusbar {
			grid-column: 1/3;
			grid-row: 3/4;
		}		
	</style>		
	</head>
	<body>
		<div id="game-container">
			<div id="sidebar"></div>
			<div id="war-messages"></div>
			<div id="level-map"></div>
			<div id="messages"></div>			
			<div id="statusbar">
				<span class="command" data-key="Esc"><kbd>[Esc]</kbd> Menu</span> 
				<span class="command" data-key="i"><kbd>I</kbd>nventory</span> 
				<span class="command" data-key="s"><kbd>S</kbd>earch</span> 
				<span class="command" data-key="g"><kbd>G</kbd>et</span> 
				<span class="command" data-key="r"><kbd>R</kbd>est</span> 
				<span class="command"><kbd>&larr;&uarr;&rarr;&darr;</kbd> Move</span>
			</div>
		</div>
		<script type="text/javascript" src="src/styx.js"></script>
	</body>
</html>