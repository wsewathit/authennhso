const execSeries = require('exec-series');
new Vue({
    el: '#IndexController',
    data: {
        "OnDataFirst": true,
        "OnDataSecond": false,
        "OnDataThird": false,
        "text_authen": "",
        "correlationId": "",
        "MyPhone": "",
        "MyCid": "",
        "Department": {},
        "patient": {},
        "AuthDetail": {}
    },
    mounted() {},
    beforeMount() {},
    methods: {
        PrintQueue (vn){
            console.log('vn',vn);
            execSeries(['D:\\NHSOAUTHEN65\\Print_QOPD.exe '+vn]);
        },
        async focusInput() {},
        async actionload() {},
        async PostData() {
            Swal.fire({
                title: 'กรุณารอซักครู่',
                text: `กำลังประมวลผล`,
                imageUrl: './assets/images/reload.gif',
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            this.OnDataFirst = false;
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            await fetch(`http://localhost:8189/api/smartcard/read`, requestOptions).then(responses => responses.json()).then(results => {
                swal.close({});
                console.log('reultsChecKPttypeNhso', results)
                if (results.status == 500) {
                    this.OnDataFirst = true;
                    Swal.fire({
                        title: 'กรุณาติดต่อผู้ดูแลระบบ',
                        text: "ระบบขัดคล่อง",
                        icon: 'error',
                        allowOutsideClick: false,
                    })
                } else {
                    let mainInscl = results.mainInscl.split(" ");
                    let correlationId = results.correlationId;
                    let claimTypes = results.claimTypes;
                    let MyCid = results.pid;
                    // if (mainInscl[0] == '(UCS)') {
                    // this.OnDataFirst = false;
                    this.text_authen = JSON.stringify(results);
                    this.correlationId = correlationId;
                    this.AuthDetail = claimTypes;
                    this.MyCid = MyCid;
                    this.GetPateintByCid(this.MyCid);
                    // } else {
                    // this.OnDataFirst = true;
                    // }
                }
            }).catch(error => {
                console.log('error', error);
                // this.SwalCloseButtonLoadTrue()
            });
        },
        async GetPateintByCid(cid) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            await fetch(`http://172.199.9.239/coreapi/api/v1/get_patient/${cid}`, requestOptions).then(responses => responses.json()).then(results => {
                console.log('reultsCheckPatient', results)
                if (results.status == true) {
                    this.OnDataFirst = false;
                    this.OnDataSecond = true;
                    this.MyPhone = results.data[0].phone;
                } else {
                    this.OnDataFirst = true;
                    this.OnDataSecond = false;
                }
            }).catch(error => {
                console.log('error', error)
                this.SwalCloseButtonLoadTrue()
            });
        },
        async SavePhone() {
            Swal.fire({
                title: 'กรุณารอซักครู่',
                text: `กำลังบันทึกเบอร์โทรศัพท์`,
                imageUrl: './assets/images/reload.gif',
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            var myHeaders = new Headers();
            var urlencoded = new URLSearchParams();
            urlencoded.append("authenval", this.text_authen);
            urlencoded.append("cid", this.MyCid);
            urlencoded.append("phone", this.MyPhone);
            urlencoded.append("correlationId", this.correlationId);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
            fetch("http://172.199.9.239/coreapi/api/v1/post_authen", requestOptions).then(response => response.json()).then(result => {
                swal.close({});
                if (result.status == true) {
                    this.OnDataFirst = false;
                    this.OnDataSecond = false;
                    this.OnDataThird = true;
                    if (result.data.status == true) {
                        this.Department = result.data.ovst;
                        this.patient = result.data.patient;
                    } else {
                        this.Department = {};
                    }
                } else {
                    Swal.fire({
                        title: 'กรุณาติดต่อผู้ดูแลระบบ',
                        text: "ระบบขัดคล่อง",
                        icon: 'error',
                        allowOutsideClick: false,
                    })
                    this.OnDataFirst = true;
                    this.OnDataSecond = false;
                }
                // console.log(result)
            }).catch(error => {
                console.log('error', error);
                // this.SwalCloseButtonLoadTrue();
            });
        },
        async BackMain() {
            this.OnDataFirst = true;
            this.OnDataSecond = false;
            this.OnDataThird = false;
        }
    }
});