<?php 

require "libs/DocParser.php";
require "libs/DocHtmlBuilder.php";

$parser = new DocParser;

foreach (rglob('../src/styx/*.js') as $path) {
	$parser->parse($path);
}

$classes = $parser->getData();
$builder = new DocHtmlBuilder($classes);

print "<h1>Table of content</h1>";

print $builder->buildTOC();

foreach ($classes as $c) {
	print "<hr>";
	print $builder->classDetail($c['name']);
}



function rglob($pattern, $flags = 0) {
  $files = glob($pattern, $flags); 
  foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
    $files = array_merge($files, rglob($dir.'/'.basename($pattern), $flags));
  }
  return $files;
}



 ?>