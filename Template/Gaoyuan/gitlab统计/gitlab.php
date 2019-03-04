<?php
$token = 'VBzfsC5aYTobJgg1_ye8';
$url = 'http://192.168.2.3/api/v4/';
$after = '2018-08-01';
$before = '2018-09-01';

//apis
$get_projects = $url . 'projects?per_page=100&page=PAGE';
$get_commits = $url . "projects/ID/repository/commits?with_stats=1&ref_name=BRANCH_NAME&since={$after}&until={$before}";
$get_details = $url . '';

//获取项目列表
$i = 0;
$projects = [];
do {
    $this_get_projects = str_replace('PAGE', $i, $get_projects);
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => $this_get_projects,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Cache-Control: no-cache",
        "PRIVATE-TOKEN: {$token}"
      ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
      echo "cURL Error #:" . $err;
    }

    //获取每个项目的提交记录
    $response = json_decode($response, true);
    $projects = array_merge($projects, $response);
    $i ++;
} while (count($response));
    
$tol = count($projects);
echo "一共{$tol}个项目\n\r";
foreach($projects as $key => $value){
    
    //所有分支
    $branch_url = $value['_links']['repo_branches'];

    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => $branch_url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "PRIVATE-TOKEN: {$token}"
      ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
      echo "cURL Error #:" . $err;
    }


    $id = $value['id'];
    $branch_list = array_column(json_decode($response, true), 'name');
    foreach($branch_list as $branch){
        $this_url = str_replace('ID', $id, $get_commits);
        $this_url = str_replace('BRANCH_NAME', $branch, $this_url);

        $curl = curl_init();
        curl_setopt_array($curl, array(
          CURLOPT_URL => $this_url,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "GET",
          CURLOPT_HTTPHEADER => array(
            "PRIVATE-TOKEN: {$token}"
          ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
          echo "cURL Error #:" . $err;
        }

        $response = json_decode($response, true);
        foreach ($response as $commit) {
            $statistics[$commit['author_name']]['additions'] += $commit['stats']['additions'];
            $statistics[$commit['author_name']]['deletions'] += $commit['stats']['deletions'];
            $statistics[$commit['author_name']]['count'] += 1;
        }
    }
echo "第{$key}个项目“{$value['name_with_namespace']}”统计完成\n\r";
}
echo "\n\r\n\r\n\r统计结果\n\r";
echo "用户|增加行数|删除行数|提交次数\n\r";
foreach ($statistics as $key => $data) {
    echo "{$key}|{$data['additions']}|{$data['deletions']}|{$data['count']}\n\r";
}