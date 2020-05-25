(function() {
    //Request voi callback voi 1 tham so--thuc hien truy van

    function queryUser(callback = function() {}, url = "", para = "") {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        }
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send("obj=" + para);
    }
    // kiem tra du lieu form
    function checkForm() {
        let formlogin = document.getElementById("formlogin");
        let errorMessageUser = document.getElementById("errorMessageUser");
        let errorMessagePass = document.getElementById("errorMessagePass");
        let arrUser = [];
        let anchor1 = false,
            anchor2 = false;
        if (formlogin["username"].value == "") {
            errorMessageUser.innerHTML = "Bạn chưa nhập tên tài khoản";
        } else {
            anchor1 = true;
            arrUser.push(formlogin["username"].value);
            errorMessageUser.innerHTML = "";
        }
        if (formlogin["pass"].value == "") {
            errorMessagePass.innerHTML = "Bạn chưa nhập mật khẩu";
        } else {
            anchor2 = true;
            arrUser.push(formlogin["pass"].value);
            errorMessagePass.innerHTML = "";
        }

        if (anchor1 && anchor2) {
            return arrUser;
        }
    }
    //dang nhap tai khoan
    const btnLogin = document.getElementById("login");
    btnLogin.addEventListener('click', function() {
        let arr = checkForm();
        if (arr !== undefined) {
            queryUser(resLogin, "http://localhost/sv/model/User.php", JSON.stringify({
                methodStudent: "checkUser",
                para: arr
            }));
        }
    });

    function resLogin(myObj) {
        let obj = JSON.parse(myObj);
        if (obj.hasOwnProperty("page")) {
            window.location = obj["page"];
        } else {
            document.getElementById("resLogin").innerHTML = obj["res"];
        }
    }
})()