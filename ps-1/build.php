<?php
/**
 * Created by PhpStorm.
 * User: caoyang
 * Date: 2019/7/29 0029
 * Time: 11:44
 */
$raw_success = array('code' => 1, 'msg' => '验证码正确');

$raw_fail = array('code' => 2, 'msg' => '验证码错误');

$res_success = json_encode($raw_success);
$res_fail = json_encode($raw_fail);

$stuName = trim($_POST['stuName']);

//$stuGender = $_POST['stuGender'];
//
//$stuAge = $_POST['stuAge'];
//
//$stuNumber = $_POST['stuNumber'];
//
//$stuScore = $_POST['stuScore'];
header('Content-Type:application/json');
echo json_encode($raw_fail);
//$this->ajaxReturn($data,'json');

//$arr = $_POST;
//print_r($arr);
//exit;
//$con = mysqli_connect('localhost','root','','frankdb');
/**
 *
 */
//php环境 和服务 apach nginx  用到还需要mysql   或者只用安装 集成工具 mamp / phpstudy
?>