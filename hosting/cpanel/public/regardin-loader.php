<?php
declare(strict_types=1);
ini_set('display_errors', '0');
// Package layout: private/ and public_html/ are siblings, never nested.
$private = getenv('REGARDIN_PRIVATE') ?: dirname(__DIR__).'/private';
require $private.'/app.php';
