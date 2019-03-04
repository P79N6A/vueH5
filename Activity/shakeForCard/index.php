<?php 

require 'vendor/autoload.php';

$app = new \Slim\Slim(array(
	"templates.path"=>__DIR__,
	"debug"=>true
	));

require __DIR__.'/route/route.php';
require __DIR__.'/route/route_shake_for_page.php';
require __DIR__.'/route/route_shake_for_web_card.php';
require __DIR__.'/route/route_shake_for_weixin_card.php';
require __DIR__.'/route/route_test.php';


function handleError() {
   echo '<h1>ERROR!</h1>'; 
}
function myErrorHandler ($errorCode, $errorMessage, $errorFile, $errorLinenumber) { 
    handleError();
} 

$app->error('handleError');

set_error_handler("handleError"); 
set_exception_handler("handleError");



$app->run();

?>