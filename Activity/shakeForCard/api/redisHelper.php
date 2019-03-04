<?php
	require_once(__DIR__."/config.php");
	class RedisHelper{
		/*注:
			1. 在判断方法的返回是不是NULL时，最好使用"===",因为"=="会将false和NULL判断为相等
		*/
		
		public function __construct(){
		}
		/*获取Redis连接*/
		static function getRedis() {
			$redis = new Redis();
			$redis_hostname = REDISHOSTNAME;
			$redis_port = REDISPORT;
			if($redis->connect($redis_hostname, $redis_port) == FALSE){
				return NULL;
			}

			$redis_password = REDISPASSWORD;
			if($redis_password != ''){
				$redis->auth($redis_password);
			}

			return $redis;
		}
		/*向hash中添加元素*/
		static public function setHashSet($key,$field,$value){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result = $redis->hSet($key,$field,$value);
			$redis->close();
			return $result;
		}
		/*向SortedSet中添加元素*/
		static public function setSortedSet($key,$score,$member){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result = $redis->zAdd($key,$score,$member);
			$redis->close();
			return $result;
		}
		/*添加键值对*/
		static public function setKeyValue($key,$value){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result = $redis -> set($key,$value);
			$redis->close();
			return $result;
		}
		/*添加带过期时间的键值对*/
		static public function setKeyValueEx($key,$expiry,$value){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result = $redis->setex($key,$expiry,$value);
			$redis->close();
			return $result;
		}
		/*根据Key获取Value*/
		static public function getValueByKey($key){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result = $redis->get($key);
			$redis->close();
			return $result;
		}
		/*获取满足pattern的所有的Key*/
		static public function getKeys($key){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result = $redis->keys($key);
			$redis->close();
			return $result;
		}
		/*获取Hash中field对应的value*/
		static public function getHashValue($key,$field){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result = $redis -> hGet($key,$field);
			$redis->close();
			return $result;
		}
		/*获取hash中key对应的所有键*/
		static public function getHashKeys($key){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result = $redis -> hKeys($key);
			$redis->close();
			return $result;
		}
		/*返回hash中的所有field及对应的value*/
		static public function getHashAll($key){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result =$redis->hGetAll($key);
			$redis->close();
			return $result;
		}

		/*查找集合中是否包含某元素*/
		static public function isMember($key,$value){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result =$redis->sIsMember($key,$value);
			$redis->close();
			return $result;
		}

		/*删除Key*/
		static public function deleteKey($key){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result =$redis->delete($key);
			$redis->close();
			return $result;
		}

		/*删除Hash的某个field*/
		static public function deleteHashField($key,$field){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result =$redis->hDel($key,$field);
			$redis->close();
			return $result;
		}
		/*查找集合中是否包含某元素*/
		static public function expireAt($key,$time){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result =$redis->expireAt($key,$time);
			$redis->close();
			return $result;
		}

		/*Key中的值自增*/
		static public function IncrBy($key,$num){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result =$redis->incrBy($key,$num);
			$redis->close();
			return $result;
		}
		/*Hash中field的值自增*/
		static public function HashIncrBy($key,$field,$num){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result =$redis->hIncrBy($key,$field,$num);
			$redis->close();
			return $result;
		}

		/*发布内容到某一个通道*/
		static public function publish($channel,$message){
			$redis = self::getRedis();
			if($redis === NULL){
				return NULL;
			}
			$result =$redis->publish($channel,$message);
			$redis->close();
			return $result;
		}
	}

?>