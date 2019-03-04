<?php 
    include('phpqrcode.php');
    generateQRCode();
    function generateQRCode(){
		$cardNumber = $_GET["cardNumber"];
		QRcode::png($cardNumber);
	}
?>