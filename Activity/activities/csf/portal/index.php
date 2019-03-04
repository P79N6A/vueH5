<?php

require "Slim/Slim.php";

$app = new Slim(array(
	"templates.path"=>__DIR__
	));

$app->get("/",function(){
	echo "portal api working...";
});

require_once(__DIR__."/api/route.php");


$app->run();
