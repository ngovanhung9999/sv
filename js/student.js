(function() {
    //Request voi callback voi 2 tham so do du lieu

    function loadStudent(callback = function() {}, url = "", para = "") {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText, deletes, edits);
            }
        }
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send("obj=" + para);
    }

    //Request voi callback voi 1 tham so--thuc hien truy van

    function queryStudent(callback = function() {}, url = "", para = "") {
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

    //kiem tra xem dang nhap chua

    function checkLogin(myObj) {
        let obj = JSON.parse(myObj);
        if (obj.hasOwnProperty("username")) {
            document.getElementById("username").innerHTML = obj["username"];
        } else {
            window.location = obj["page"];
        }
    }
    queryStudent(checkLogin, "http://localhost/sv/model/Student.php", JSON.stringify({
        methodStudent: "checkLogin",
        para: []
    }));

    // thoat nguoi dang nhap

    const btnExit = document.getElementById("btnExit");
    btnExit.addEventListener('click', function() {
        queryStudent(checkLogin, "http://localhost/sv/model/Student.php", JSON.stringify({
            methodStudent: "exitLogin",
            para: []
        }));
    });

    //show danh sach sinh vien trong table

    function showListStudent(myObj, callbackDeletes, callbackEdit) {
        let obj = JSON.parse(myObj);
        const tableStudent = document.getElementById("listStudent");
        let res = '<tr><th>Mã SV</th><th>Họ Tên</th><th>Ngày Sinh</th><th>Giới Tính</th><th>Quên Quán</th><th>Sửa</th><th>Xóa</th></tr>';
        obj.forEach(value => {
            res += `<tr><td>${value.masv}</td>
            <td>${value.hoten}</td>
            <td>${value.ngaysinh}</td>
            <td>${value.gioitinh==1? "Nam":"Nữ"}</td>
            <td>${value.quequan}</td>
            <td><button class="btnEdit" value="${value.masv}">sửa</button></td>
            <td><button class="btnDelete" value="${value.masv}">xóa</button></td></tr>`;
        });
        tableStudent.innerHTML = res;
        callbackDeletes();
        callbackEdit(obj);
    }
    loadStudent(showListStudent, "http://localhost/sv/model/Student.php", JSON.stringify({
        methodStudent: "getStudent",
        para: []
    }));

    //kiem tra form input

    function checkForm() {
        let formStudent = document.getElementById("studentInput");
        let errorMessageFullName = document.getElementById("errorMessageFullName");
        let errorMessageDateOfBirth = document.getElementById("errorMessageDateOfBirth");
        let errorMessageHomeTown = document.getElementById("errorMessageHomeTown");
        let arrStudent = [];
        let anchor1 = false,
            anchor2 = false,
            anchor3 = false;
        const hexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
        let hex = "SV";
        for (let i = 0; i < 8; i++) {
            hex += hexValues[Math.floor(Math.random() * hexValues.length)];
        }
        arrStudent.push(hex);

        if (formStudent["fullName"].value == "") {
            errorMessageFullName.innerHTML = "Bạn chưa nhập họ và tên";
        } else {
            anchor1 = true;
            arrStudent.push(formStudent["fullName"].value);
            errorMessageFullName.innerHTML = "";
        }

        if (formStudent["dateOfBirth"].value == "") {
            errorMessageDateOfBirth.innerHTML = "Bạn chưa nhập ngày sinh";
        } else {
            anchor2 = true;
            arrStudent.push(formStudent["dateOfBirth"].value);
            errorMessageDateOfBirth.innerHTML = "";
        }

        arrStudent.push(parseInt(formStudent["gender"].value));

        if (formStudent["homeTown"].value == "") {
            errorMessageHomeTown.innerHTML = "Bạn chưa nhập quê quán";
        } else {
            anchor3 = true;
            arrStudent.push(formStudent["homeTown"].value);
            errorMessageHomeTown.innerHTML = "";
        }
        if (anchor1 && anchor2 && anchor3) {
            return arrStudent;
        }
    }

    //them sinh vien

    const btnAdd = document.getElementById("add");
    btnAdd.addEventListener('click', function() {
        let arr = checkForm()
        if (arr !== undefined) {
            queryStudent(showRes, "http://localhost/sv/model/Student.php", JSON.stringify({
                methodStudent: "setStudent",
                para: arr
            }));
        }

    });

    //show ket qua khi da truy van xong va load lai table

    function showRes(myObj) {
        alert(myObj);
        loadStudent(showListStudent, "http://localhost/sv/model/Student.php", JSON.stringify({
            methodStudent: "getStudent",
            para: []
        }));
        clearInput();
    }

    //xoa sinh vien

    function deletes() {
        const btnDeletes = document.querySelectorAll(".btnDelete");
        btnDeletes.forEach(function(button) {
            button.addEventListener('click', function() {
                let arr = [];
                arr.push(button.value);
                queryStudent(showRes, "http://localhost/sv/model/Student.php", JSON.stringify({
                    methodStudent: "deleteStudent",
                    para: arr
                }));
            });
        });
    }
    //sua sinh vien
    function edits(ls) {
        let btnEdits = document.querySelectorAll(".btnEdit");
        let btnEdit = document.getElementById("edit");
        let btnAdd = document.getElementById("add");
        btnEdits.forEach(function(button) {
            button.addEventListener('click', function() {
                document.getElementById("errorMessageFullName").innerHTML = "";
                document.getElementById("errorMessageDateOfBirth").innerHTML = "";
                document.getElementById("errorMessageHomeTown").innerHTML = "";
                let maSVEdit = button.value;
                ls.forEach(function(s) {
                    if (s["masv"] === maSVEdit) {
                        let formStudent = document.getElementById("studentInput");
                        formStudent["fullName"].value = s["hoten"];
                        formStudent["dateOfBirth"].value = s["ngaysinh"];
                        formStudent["gender"].value = s["gioitinh"];
                        formStudent["homeTown"].value = s["quequan"];
                    }
                });
                btnEdit.removeAttribute("hidden");
                btnEdit.value = maSVEdit;
                btnAdd.hidden = "hidden";

            });
        });
    }

    let btnEdit = document.getElementById("edit");
    btnEdit.addEventListener('click', function() {
        let arr = [];
        arr = checkForm();
        if (arr !== undefined) {
            arr[0] = btnEdit.value;
            queryStudent(showRes, "http://localhost/sv/model/Student.php", JSON.stringify({
                methodStudent: "editStudent",
                para: arr
            }));
        }

    });

    function clearInput() {
        let btnEdit = document.getElementById("edit");
        let btnAdd = document.getElementById("add");
        let formStudent = document.getElementById("studentInput");
        formStudent["fullName"].value = "";
        formStudent["dateOfBirth"].value = "";
        formStudent["gender"].value = "";
        formStudent["homeTown"].value = "";
        btnAdd.removeAttribute("hidden");
        btnEdit.hidden = "hidden";
    }
})();