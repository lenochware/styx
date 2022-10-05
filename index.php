<?php

$template = ['scripts' => scripts(file('build.txt'))];
print paramStr(file_get_contents('index.tpl'), $template);
die();

function scripts($files)
{
	$html = '';
	foreach ($files as $file) {
		$version = filemtime(trim($file));
		$html .= "<script type=\"text/javascript\" src=\"".trim($file)."?v=$version\"></script>\n";
	}
	return $html;
}

function paramStr($str, $param, $keepEmpty = false)
{
	preg_match_all("/{([a-z0-9_.]+)}/i", $str, $found);
	if (!$found[1]) return $str;
	if (!is_array(array_get($param, 0))) $param = array($param);

	$n = count($param);
	$newstr = '';
	for ($i = 0; $i < $n; $i++) {
		$from = $to = null;
		foreach($found[1] as $key) {
			if ($keepEmpty and !isset($param[$i][$key])) continue;
			$from[] = '{'.$key.'}';
			$to[] = $param[$i][$key];
		}
		$newstr .= str_replace($from, $to, $str);
	}
	return $newstr;
}

function array_get($a, $key, $default = null)
{
	if (is_array($key)) {
		return isset($a[$key[0]])? (isset($a[$key[0]][$key[1]])? $a[$key[0]][$key[1]] : $default) : $default;
	}

	return isset($a[$key])? $a[$key] : $default;
}

?>