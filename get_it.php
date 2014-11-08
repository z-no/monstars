<?php

require_once('simple_html_dom.php');

function parse_name($last, $first)
{
	$first_letter = $last[0];

	$full = $first . ' ' . $last;

	$last = substr($last, 0, 5);

	$first = substr($first, 0, 2);

	return array($first_letter, $last, $first, $full);
}

function get_it_bro($parsed_name)
{
	$pgl = file_get_html("http://www.basketball-reference.com/players/" . $parsed_name[0] . "/" . $parsed_name[1] . $parsed_name[2] . "01/gamelog/2014/#pgl_basic::none");

	if(stristr($pgl->plaintext, $parsed_name[3]) === false)
	{
		$pgl = file_get_html("http://www.basketball-reference.com/players/" . $parsed_name[0] . "/" . $parsed_name[1] . $parsed_name[2] . "02/gamelog/2014/#pgl_basic::none");
	}
	else
	{
		return $pgl;
	}

	if(stristr($pgl->plaintext, $parsed_name[3]) === false)
	{
		return false;
	}

	return $pgl;
}

function build_header($pgl)
{
	$header_row = $pgl->find('table#pgl_basic thead tr', 1);

	$headers = new Array();

	foreach($header_row as $e)
	{
		$headers[] = $e->plaintext;
	}

	return $headers;
}

$pgl = get_it_bro(parse_name("allen", "ray"));

$headers = build_header($pgl);

$first_row = $pgl->find('table#pgl_basic tbody tr', 1);

foreach($first_row->find('td') as $e)
	var_dump($e->plaintext);


