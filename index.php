<?php

$template = ['scripts' => scripts(file('build.txt'))];
print paramStr(file_get_contents('index.tpl'), $template);
die();

function scripts($files)
{
	$html = '';
	foreach ($files as $file) {
		$html .= "<script type=\"text/javascript\" src=\"".trim($file)."\"></script>\n";
	}
	return $html;
}

function paramStr($str, $param, $keepEmpty = false)
{
	preg_match_all("/{([a-z0-9_.]+)}/i", $str, $found);
	if (!$found[1]) return $str;
	if (!is_array($param[0])) $param = array($param);

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

?>