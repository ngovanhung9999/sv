<?php

require_once "../model/DB.php";
header("Content-Type: application/json; charset=UTF-8");
$obj = json_decode($_POST["obj"], false);

class User extends DB
{

    public function checkUser($user,$pass)
    {
        //SELECT * FROM user WHERE username='admin'
        $stmt = $this->conn->prepare("SELECT * FROM user WHERE username=?");
        $stmt->bind_param("s",$user);
        $stmt->execute();
        $result = $stmt->get_result();
        //$outp = $result->fetch_all(MYSQLI_ASSOC);
        //echo json_encode($outp);
        $res="";
        $arr=[];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                //echo 'id='.$row["username"].' pass='.$row["password"].'<br />';
                if($user==$row["username"]){
                    if($pass==$row["password"]){
                        $_SESSION["username"]=$row["username"];
                        $arr["page"]="page/student.html";
                        break;
                    }else{
                        $res="mật khẩu của bạn không đúng";
                        break;
                    }
                }
            } 
        }else{
            $res="tài khoản của bạn không tồn tại";
        }
        $arr["res"]=$res;
        return json_encode($arr);
    }
}
$user = new User();
echo call_user_func_array([$user,$obj->methodStudent],$obj->para);
