<?php

//keo thu vien class DB vao
require_once "../model/DB.php";

//lay doi tuong gui tu Request qua
header("Content-Type: application/json; charset=UTF-8");
$obj = json_decode($_POST["obj"], false);

class Student extends DB
{

    public function getStudent()
    {
        $stmt = $this->conn->prepare("SELECT * FROM sv");
        $stmt->execute();
        $result = $stmt->get_result();
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        return json_encode($outp);
    }
    public function setStudent($masv, $hoten, $ngaysinh, $gioitinh, $quequan)
    {
        $res = "";
        $stmt = $this->conn->prepare("INSERT INTO sv(masv, hoten, ngaysinh, gioitinh, quequan) VALUES (?,?,?,?,?)");
        $stmt->bind_param("sssis", $masv, $hoten, $ngaysinh, $gioitinh, $quequan);
        if ($stmt->execute()) {
            $res = "Thêm sinh viên thành công";
        } else {
            $res = "Lỗi: (" . $stmt->errno . ") " . $stmt->error;
        }
        return $res;
    }
    public function deleteStudent($masv)
    {
        $res = "";
        $stmt = $this->conn->prepare("DELETE FROM sv WHERE masv=?");
        $stmt->bind_param("s", $masv);
        if ($stmt->execute()) {
            $res = "Xóa sinh viên thành công";
        } else {
            $res = "Lỗi: (" . $stmt->errno . ") " . $stmt->error;
        }
        return $res;
    }
    public function editStudent($masv, $hoten, $ngaysinh, $gioitinh, $quequan)
    {
        $res = "";
        //UPDATE sv SET hoten='hung',ngaysinh='2000-2-20',gioitinh=0,quequan='ha noi' WHERE masv='SVB436166A'
        $stmt = $this->conn->prepare("UPDATE sv SET hoten=?,ngaysinh=?,gioitinh=?,quequan=? WHERE masv=?");
        $stmt->bind_param("ssiss", $hoten, $ngaysinh, $gioitinh, $quequan, $masv);
        if ($stmt->execute()) {
            $res = "Sửa sinh viên thành công";
        } else {
            $res = "Lỗi: (" . $stmt->errno . ") " . $stmt->error;
        }
        return $res;
    }
    public function checkLogin()
    {
        $arr = [];
        if (isset($_SESSION["username"])) {
            $arr["username"] = $_SESSION["username"];
        } else {
            $arr["page"] = "http://localhost/sv/index.html";
        }
        return json_encode($arr);
    }

    public function exitLogin()
    {
        $arr = [];
        if (isset($_SESSION["username"])) {
            unset($_SESSION["username"]);
        }
        $arr["page"] = "http://localhost/sv/index.html";
        return json_encode($arr);
    }
}
$student = new Student();
echo call_user_func_array([$student, $obj->methodStudent], $obj->para);
