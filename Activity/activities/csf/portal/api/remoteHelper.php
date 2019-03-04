<?php
class  RemoteHelper{
	
	var $parameters;
	// @todo: 构造
	public function __construct(){
	}
	
	function setParameter($parameter, $parameterValue) {
		$this->parameters[$parameter] = $parameterValue;
	}
	
	function getParameter($parameter) {
		return $this->parameters[$parameter];
	}
	
	function curlpost($url) {
		$curlPost = "";
		foreach($this->parameters as $key => $value){
			$curlPost = $curlPost . $key . "=" . $value . "&";
		}
		if(strlen($curlPost) > 0){
			$curlPost = substr($curlPost, 0, strlen($curlPost) - 1);
		}
		
		$ch = curl_init();//初始化curl  
		curl_setopt($ch, CURLOPT_URL, $url);//抓取指定网页  
		curl_setopt($ch, CURLOPT_HEADER, 0);//设置header  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上  
		curl_setopt($ch, CURLOPT_POST, 1);//post提交方式  
		curl_setopt($ch, CURLOPT_POSTFIELDS, $curlPost); 
		curl_setopt($ch, CURLOPT_TIMEOUT, 10); //超时时间
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); //连接超时时间
		$data = curl_exec($ch);//运行curl  
		curl_close($ch);  
		return $data;
	}
	
	static function https_request($url, $data = null){
 	    $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
	    //curl_setopt($curl, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1);
        if (!empty($data)){
            curl_setopt($curl, CURLOPT_POST, 1);
	        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
        }
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);
	    curl_close($curl);
        return $output;
	}
}

?>