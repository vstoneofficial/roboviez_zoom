(function(){

	console.log('checkSystemRequirements');
	console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

    // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
    // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.8/lib', '/av'); // CDN version default
    // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.7.8/lib', '/av'); // china cdn option 
    // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    
    $.i18n.reload("jp-JP");
    ZoomMtg.reRender({lang: "jp-JP"});

    var meetConfig = {
        apiKey: apikey,
        meetingNumber: meetingNum,
        userName: display_name,
        passWord: password,
        leaveUrl: `https://${hostname}:8080/index.html`,
        role: role,
    };

    ZoomMtg.init({
        leaveUrl: meetConfig.leaveUrl,
        success: function () {
            ZoomMtg.join(
                {
                    meetingNumber: meetConfig.meetingNumber,
                    userName: meetConfig.userName,
                    signature: signature,
                    apiKey: meetConfig.apiKey,
                    passWord: meetConfig.passWord,
                    success: function(res){
                        $('#nav-tool').hide();
                        console.log('join meeting success');
                    },
                    error: function(res) {
                        console.log(res);
                    }
                }
            );
        },
        error: function(res) {
            console.log(res);
        }
    });
})();

document.getElementById('show-ctrl-btn').addEventListener("click", function(e){
    var textContent = e.target.textContent;
    if (textContent === '表示') {
        document.getElementById('controller').style.display = 'block';
        document.getElementById('show-ctrl-btn').textContent = '非表示';
    }
    else {
        document.getElementById('controller').style.display = 'none';
        document.getElementById('show-ctrl-btn').textContent = '表示';
    }
})

document.getElementById('servo_on_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "on"
    postData(JSON.stringify(params))
})
document.getElementById('servo_off_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "off"
    postData(JSON.stringify(params))
})

document.getElementById('cam_up_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "cam_up"
    postData(JSON.stringify(params))
})
document.getElementById('cam_left_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "cam_left"
    postData(JSON.stringify(params))
})
document.getElementById('cam_right_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "cam_right"
    postData(JSON.stringify(params))
})
document.getElementById('cam_down_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "cam_down"
    postData(JSON.stringify(params));
})

document.getElementById('shak_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "shak"
    postData(JSON.stringify(params))
})
document.getElementById('point_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "point"
    postData(JSON.stringify(params))
})
document.getElementById('wave_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "wave"
    postData(JSON.stringify(params))
})

function postData(value){
    $.ajax({
        type: 'POST',
        url: '/index.html',
        data: {"json":value},
        dataType: 'text'
    }).done(function(data){
        console.log(data);
    }).fail(function(xhr,err){
        console.log(err);
    });
}
