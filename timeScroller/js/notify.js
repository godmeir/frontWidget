/**
 * Created by zyj on 2017/2/28.
 *
 * 推送
 */

var isDebug = false;

var path = "";//插件所在位置

var deviceInfo;//getInfo获取回来的对象

//当前选择值
var g_functype = 0;
var fadeOutTime = 1000;//滑动后其它选择消失时间
var data = "";
var _timer;
var g_mac = "";
var ext = "";

var FuncType = {
    Mode_Control: "0",//普通控制
    Mode_Center_Control: "1"//集中控制页
}


var DataObject = {
    "mac":"",
    "mid":"",
    "data":"",
    "t":"",
    "itemId":[],
    "code":[],
    "evt":0
};

//根据QueryString参数名称获取值
function getQueryStringByName(name) {
    var href = decodeURI(location.href);//转义
    var result = href.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

//解析url初始值
function parseUrlData() {
    //消除移动端300ms延时
    FastClick.attach(document.body);

    g_mac=getQueryStringByName("mac");
    ext=getQueryStringByName("ext");

    if (isDebug) {
        setTimeout(loadTestData,300);
    } else {
        setTimeout(loadData,300);
    }
}
//需要等原生js加载完，触发init.js 会加载
function loadData() {
    try {
        navigator.PluginInterface.getInfo(g_mac, loadDataFinish);
    } catch (e) {
        console.log(e);
    }
}

function loadDataFinish(jsonData) {
    try {
        //加载语言
        deviceInfo = JSON.parse(jsonData);
        if (deviceInfo.lang == "zh_CN") {
            $.getScript('./js/lang/zh_CN.js', function () {
                init(ext);
                setTimeout(function () {
                    $("#loading").hide();
                }, 500);
            });
        }
        else {
            $.getScript('./js/lang/en.js', function () {
                init(ext);
                setTimeout(function () {
                    $("#loading").hide();
                }, 500);
            });
        }
    } catch (e) {
        console.log(e);
    }
}

function loadTestData(){
    if(ext==""){
        ext='{"data":{"t":"error","code":[25,26,21],"evt":1},"mac":"2059a0b42168","mid":"30000"}';

        // ext='{"data":{"t":"washingDone","code":25,"evt":1},"mac":"2059a0b42168","mid":"30000"}';
    }
    //加载语言
    $.getScript('./js/lang/en.js',function(){
        init(ext);
    });
    setTimeout(function(){
        $("#loading").hide();
    },300);
}


//解析statue data数据
function parseStates(pushData)
{
    //是否是数组
    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    if(pushData!=""){
        try{
            console.log("解析传进来的推送json,内容:"+pushData);
            var jsonData = JSON.parse(pushData);

            DataObject.mac = jsonData.mac;
            DataObject.mid = jsonData.mid;
            DataObject.data = jsonData.data;

            // var dataKeyword = JSON.parse(DataObject.data);
            DataObject.t = DataObject.data.t;

            if(DataObject.t =="error"){
                DataObject.evt = DataObject.data.evt;
                // DataObject.code = DataObject.data.code;
                //现在收到的仅仅是一个数据而不是一个数组，先处理一下
                if(isArray(DataObject.data.code)){
                    DataObject.code = DataObject.data.code;
                }else{
                    (DataObject.code).push(DataObject.data.code);
                }

            }
        }
        catch(e)
        {
            console.log(e);
        }
    }
    else{
        navigator.PluginInterface.closePage();
    }

}

function init(data) {
    //解析后得到最新DataObject
    parseStates(data);
    try {
        if(DataObject.t =="error"){
            $("#singleErr").show();
            $("#mulErr").hide();
            $("#noErr").hide();
            //显示故障
            // var erArr = [];
            // erArr.push(DataObject.code);
            errorCodeHandler(DataObject.code);
        } else if(DataObject.t == "washingDone"){

            $("#singleErr").hide();
            $("#mulErr").hide();
            $("#noErr").show();

            $("#show-notify")[0].innerText = lang.wash_complete;
        } else if(DataObject.t == "washBegin") {
            $("#singleErr").hide();
            $("#mulErr").hide();
            $("#noErr").show();

            $("#show-notify")[0].innerText = lang.wash_coming;
        } else{
            //非法数据过滤
            $("#singleErr").hide();
            $("#mulErr").hide();
            $("#noErr").hide();
        }
    } catch (e) {
        console.log(e);
    }
    //每隔5秒刷新一次界面

}

/**
 * 故障解析方法
 * @param erArr
 */
function errorCodeHandler(erArr) {
    console.log("在故障处理方法里出现的故障数组："+erArr);
    var erObjArr = [];
    if (erArr){
        for (var i = 0; i< erArr.length; i++) {
            erObjArr.push(parseErrorCode(erArr[i]));
        }

        //单个故障
        if (erObjArr.length == 1){
            $("#singleErr").show();
            $("#mulErr").hide();

            //故障代码
            $("#errorCode")[0].innerText = erObjArr[0].errorCode;
            //故障详情
            $("#errorReason")[0].innerText = erObjArr[0].errorReason;
            //故障解决方案
            $("#errorSolve")[0].innerText = erObjArr[0].errorSolve;
            //多个故障
        }else {
            $("#singleErr").hide();
            $("#mulErr").show();

            var strContent = "";
            for (var i = 0; i < erObjArr.length; i++){
                strContent += getChildContent(erObjArr[i]);
            }
            $("#mulErrUl").html(strContent);
        }
    }
}

function getChildContent(erObj) {
    var nodeLi = "<li>\n<div>"+
        "<p class = \"mulErCode\">"+erObj.errorCode+"</p>\n"+
        "<p class = \"mulEr\">"+"故障原因："+"</p>\n"+
        "<p class = \"mulEr\">"+erObj.errorReason+"</p>\n"+
        "<p class = \"mulEr\">"+"解除条件："+"</p>\n"+
        "<p class = \"mulEr\">"+erObj.errorSolve+"</p>\n"+
        "<p class = \"mulEr\">"+"若仍不能恢复，请联系售后解决"+"</p>\n"+
        "</li>\n</div>" ;
    return nodeLi;
}

/**
 * 传入故障index,故障解析
 * @param errorIndex
 * @returns {Object}
 */
function parseErrorCode(errorIndex) {
    var errorObj = new Object();

    switch (Number(errorIndex)) {
        case 1:
            errorObj.errorCode = 'E1';
            errorObj.errorReason = lang.erReason_E1;
            errorObj.errorSolve = lang.erSolve_E1;
            break;
        case 2:
            errorObj.errorCode = 'E2';
            errorObj.errorReason = lang.erReason_E2;
            errorObj.errorSolve = lang.erSolve_E2;
            break;
        case 3:
            errorObj.errorCode = 'E3';
            errorObj.errorReason = lang.erReason_E3;
            errorObj.errorSolve = lang.erSolve_E3;
            break;
        case 4:
            errorObj.errorCode = 'E4';
            errorObj.errorReason = lang.erReason_E4;
            errorObj.errorSolve = lang.erSolve_E4;
            break;
        case 5:
            errorObj.errorCode = 'E5';
            errorObj.errorReason = lang.erReason_E5;
            errorObj.errorSolve = lang.erSolve_E5;
            break;
        case 6:
            errorObj.errorCode = 'E6';
            errorObj.errorReason = lang.erReason_E6;
            errorObj.errorSolve = lang.erSolve_E6;
            break;
        case 7:
            errorObj.errorCode = 'E7';
            errorObj.errorReason = lang.erReason_E7;
            errorObj.errorSolve = lang.erSolve_E7;
            break;
        case 8:
            errorObj.errorCode = 'E8';
            errorObj.errorReason = lang.erReason_E8;
            errorObj.errorSolve = lang.erSolve_E8;
            break;
        case 9:
            errorObj.errorCode = 'E9';
            errorObj.errorReason = lang.erReason_E9;
            errorObj.errorSolve = lang.erSolve_E9;
            break;
        case 10:
            errorObj.errorCode = 'E10';
            errorObj.errorReason = lang.erReason_E10;
            errorObj.errorSolve = lang.erSolve_E10;
            break;
        case 11:
            errorObj.errorCode = 'E11';
            errorObj.errorReason = lang.erReason_E11;
            errorObj.errorSolve = lang.erSolve_E11;
            break;
        case 12:
            errorObj.errorCode = 'E12';
            errorObj.errorReason = lang.erReason_E12;
            errorObj.errorSolve = lang.erSolve_E12;
            break;
        case 13:
            errorObj.errorCode = 'EH1';
            errorObj.errorReason = lang.erReason_EH1;
            errorObj.errorSolve = lang.erSolve_EH1;
            break;
        case 14:
            errorObj.errorCode = 'EH2';
            errorObj.errorReason = lang.erReason_EH2;
            errorObj.errorSolve = lang.erSolve_EH2;
            break;
        case 15:
            errorObj.errorCode = 'EH3';
            errorObj.errorReason = lang.erReason_EH3;
            errorObj.errorSolve = lang.erSolve_EH3;
            break;
        case 16:
            errorObj.errorCode = 'EH4';
            errorObj.errorReason = lang.erReason_EH4;
            errorObj.errorSolve = lang.erSolve_EH4;
            break;
        case 17:
            errorObj.errorCode = 'EH5';
            errorObj.errorReason = lang.erReason_EH5;
            errorObj.errorSolve = lang.erSolve_EH5;
            break;
        case 18:
            errorObj.errorCode = 'EH6';
            errorObj.errorReason = lang.erReason_EH6;
            errorObj.errorSolve = lang.erSolve_EH6;
            break;
        case 19:
            errorObj.errorCode = 'EH7';
            errorObj.errorReason = lang.erReason_EH7;
            errorObj.errorSolve = lang.erSolve_EH7;
            break;
        case 20:
            errorObj.errorCode = 'EH8';
            errorObj.errorReason = lang.erReason_EH8;
            errorObj.errorSolve = lang.erSolve_EH8;
            break;
        case 21:
            errorObj.errorCode = 'JF';
            errorObj.errorReason = lang.erReason_JF;
            errorObj.errorSolve = lang.erSolve_JF;
            break;
        case 22:
            errorObj.errorCode = 'Lt';
            errorObj.errorReason = lang.erReason_Lt;
            errorObj.errorSolve = lang.erSolve_Lt;
            break;
        case 23:
            errorObj.errorCode = 'UL';
            errorObj.errorReason = lang.erReason_UL;
            errorObj.errorSolve = lang.erSolve_UL;
            break;
        case 24:
            errorObj.errorCode = 'Ub';
            errorObj.errorReason = lang.erReason_Ub;
            errorObj.errorSolve = lang.erSolve_Ub;
            break;
        case 25:
            errorObj.errorCode = 'HHt';
            errorObj.errorReason = lang.erReason_HHt;
            errorObj.errorSolve = lang.erSolve_HHt;
            break;
        case 26:
            errorObj.errorCode = 'HLt';
            errorObj.errorReason = lang.erReason_HLt;
            errorObj.errorSolve = lang.erSolve_HLt;
            break;
        case 27:
            errorObj.errorCode = 'op';
            errorObj.errorReason = lang.erReason_op;
            errorObj.errorSolve = lang.erSolve_op;
            break;

    }
    return errorObj;
}




/**********复写andorid事件，包括resume事件等等**********/
function backButton() {
    navigator.PluginInterface.closePage();
}

var backBtn = document.getElementById('errorMaskBack');
backBtn.addEventListener('touchend', function (event) {
    navigator.PluginInterface.closePage();
}, false);

/**********复写andorid事件，包括resume事件等等**********/

window.addEventListener('DOMContentLoaded', parseUrlData, false);
