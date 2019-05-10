<!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Styx</title>
		<meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0 minimal-ui">
		<link rel="stylesheet" type="text/css" href="styles.css">
		<script src="lib/underscore.1.9.1.min.js" type="text/javascript"></script>
		<script src="lib/jquery.1.12.4.min.js" type="text/javascript"></script>
		{scripts}

	<style>
		.game-container {
		  display: grid;
		  grid-template-columns: 1fr 4fr;
		}

		#side-bar {
			grid-column: 1/2;
		}

		#level-map {
			grid-column: 2/3;
		}

		#messages {
			grid-column: 1/3;
			grid-row: 2/3;
		}
	</style>		
	</head>
	<body>
		<div class="game-container">
			<div id="side-bar"></div>
			<div id="level-map"></div>
			<div id="messages"></div>			
		</div>
		<script type="text/javascript" src="src/styx.js"></script>
	</body>
</html>