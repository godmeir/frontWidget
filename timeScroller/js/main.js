/**
 * Created by zyj on 2017/1/5.
 */
/*
 * author：XianJunHe
 * date：2016/8/15
 * description：主控 控制入口 初始化等操作
 */
var IsDebug = true;
var isQuery = true;

var path = "";//插件所在位置

var deviceInfo;//getInfo获取回来的对象

//当前选择值
var g_CurrentMode;
var g_CurrentMode_txt;
var g_CurrentFan;
var g_CurrentFan_txt;
var g_CurrentTemp = 16;
var g_functype = 0;
var fadeOutTime = 1000;//滑动后其它选择消失时间

var g_CurrentLang;//当前语言

var objForCenter = {};

var controlOBJ;//控制
var uiMethodObj;//UI相关对象

var voiceManager;//语音
var v_understand;//语义包
var v_common;//词条包
var v_extra;//特殊语音关键词

var mutexManager;//互斥关系管理
var data = "";
var _timer;

var FuncType = {
    Mode_Control: "0",//普通控制
    Mode_Center_Control: "1"//集中控制页
}

var isVoiceing = false;

//洗衣模式定义
var mode = {
    standard: 1,
    mix: 2,
    jean: 3,
    big: 4,
    underclothes: 5,
    sport: 6,
    clean: 7,
    potchAndDry: 8,
    noWater: 9,
    chemical: 10,
    shirts: 11,
    fast: 12,
    weakDry: 13,
    powerDry:14,
    wool:15,
    soft:16

}

//定义温度单位
//[1.0,0.0,3.0,800.0,30.0,
// 1.0,66.0,0.0,0.0,0.0,
// 0.0,15.0,2.0,0.0,0.0,
// 0.0,-1.0,-1.0,0.0,0.0,
// [],"洗衣机"]
var TemUn = {C: 0, F: 1};
var DataObject = {
    "power": 0, "runState": 0, "washMode": 0, "speed": 0, "washTemp": 0,
    "stage": 0, "timeLeft": 0, "timeAll": 0,"energySave": 0, "preWash": 0, "creaseRes": 0,
    "noDrain": 0, "adjustWash": 0, "potch": 0, "nightWash": 0, "highWater": 0,
    "order": 0, "dryMode": 0, "childLock": 0, "quiet": 0, "noFoam": 0,
    "er": [], "name": ""
}

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
    g_mac = getQueryStringByName("mac");
    g_functype = getQueryStringByName("functype");
    data = getQueryStringByName("data");
    if (IsDebug)
        setTimeout(loadTestData, 500);
    else
        setTimeout(loadData, 500);
}

//需要等原生js加载完，触发init.js 会加载
function loadData() {
    navigator.PluginInterface.getInfo(g_mac, loadDataFinish);
}


function loadDataFinish(jsonData) {
    try {
        deviceInfo = JSON.parse(jsonData);
        /*参数1: fullstatueJson   (config.xml对应值)
         参数2: lock   (设备是否锁定)
         参数3:lang  (系统语言)
         参数4：name(设备名称)
         参数5：host（设备服务器）
         */
        g_CurrentLang = deviceInfo.lang;
        path = deviceInfo.path;
        searchJson = deviceInfo.fullstatueJson;
        console.log("data:" + data);
        if (data == "" || data == "null") {
            //集中控制使用默认值
            data = "[1.0,0.0,1.0,1000.0,40.0,1.0,87.0,87.0," +
                "1.0,1.0,1.0,1.0,15.0,2.0,1.0,1.0,1.0,-1.0,-1.0,1.0,0.0,[],\"洗衣机\"]";
        }


        if (deviceInfo.lock == 0) {
            $("#modeLock").hide();
        } else {
            $("#modeLock").show();
        }

        //加载语言
        if (deviceInfo.lang == "zh_CN") {
            $.getScript('./js/lang/zh_CN.js', function () {
                init(data);
                setTimeout(function () {
                    $("#loading").hide();
                }, 100);
            });
        }
        else {
            $.getScript('./js/lang/en.js', function () {
                init(data);
                setTimeout(function () {
                    $("#loading").hide();
                }, 100);
            });
        }
    } catch (e) {
        console.log(e);
    }
}

function loadTestData() {
    if (data == "" || data == "null") {
        //集中控制使用默认值
        // data = "[1.0,0.0,1.0,16.0,0.0,0.0,0.0,-1.0,1.0,0.0,0.0,0.0," +
        //     "0.0,0.0,0.0,200.0,1.0,0.0,0.0,0.0,[],\"洗衣机\"]";
        data = "[1.0,0.0,1.0,1000.0,40.0,1.0,87.0,87.0,1.0,1.0,1.0,1.0," +
            "15.0,2.0,1.0,1.0,1.0,1.0,-1.0,1.0,0.0,[],\"洗衣机\"]";
    }
    //加载语言
    $.getScript('./js/lang/zh_CN.js', function () {
        try {
            deviceInfo = {};
            deviceInfo.lang = "zh_CN";
            g_CurrentLang = deviceInfo.lang;
            init(data);
        } catch (e) {
            console.log(e);
        }
    });

    setTimeout(function () {
        $("#loading").hide();
        // modeManager.setMode(DataObject.washMode);
        // controlOBJ.init_storage(DataObject);
    }, 100);
}


//解析statue data数据
function parseStates(data) {
    if (data != "") {
        try {
            var obj = JSON.parse(data);

            DataObject.power = parseInt(obj[0]);
            DataObject.runState = parseInt(obj[1]);
            DataObject.washMode = parseInt(obj[2]);
            DataObject.speed = parseInt(obj[3]);
            DataObject.washTemp = parseInt(obj[4]);

            DataObject.stage = parseInt(obj[5]);
            DataObject.timeLeft = parseInt(obj[6]);
            DataObject.timeAll = parseInt(obj[7]);
            DataObject.energySave = parseInt(obj[8]);
            DataObject.preWash = parseInt(obj[9]);
            DataObject.creaseRes = parseInt(obj[10]);

            DataObject.noDrain = parseInt(obj[11]);
            DataObject.adjustWash = parseInt(obj[12]);
            DataObject.potch = parseInt(obj[13]);
            DataObject.nightWash = parseInt(obj[14]);
            DataObject.highWater = parseInt(obj[15]);

            DataObject.order = parseInt(obj[16]);
            DataObject.dryMode = parseInt(obj[17]);
            DataObject.childLock = parseInt(obj[18]);
            DataObject.quiet = parseInt(obj[19]);
            DataObject.noFoam = parseInt(obj[20]);

            var errorTem = [];
            errorTem = obj[21];
            DataObject.er=[];
            for(var i=0;i<errorTem.length;i++){
                DataObject.er.push(parseInt(errorTem[i]));
            }

            //console.log("定时:長度"+DataObject.Er.length+",錯誤碼："+DataObject.Er);
            DataObject.name=obj[22];

        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        // navigator.PluginInterface.closePage();
    }
}

//初始化赋值
function init(data) {

    if (IsDebug){
        voiceManager = new voiceWidget(changCallback);
    }

    //所有UI元素样式等操作
    if (uiMethodObj == null) {
        uiMethodObj = new uiMethods();
    }

    if (g_functype == FuncType.Mode_Control) {
        controlOBJ = new mControl(changCallback);
        //仅仅在中文环境下才会初始化语音
        if (deviceInfo.lang == "zh_CN") {
            voiceManager = new voiceWidget(changCallback);
        } else {
            voiceManager = new voiceWidget(changCallback);
        }
    } else {
        //集中控制不需要回调，直接修改DataObject对象 Save的时候再处理
        controlOBJ = new mControl();
    }
    //解析后得到最新DataObject
    parseStates(data);
    try{
        //此时的数据已经完全更新，使用实际数据更新UI
        controlOBJ.init_storage(DataObject);
    }catch (e){
        console.log("刷新页面出错："+e);
    }
    //启动定时5秒获取一次状态
    if (g_functype == FuncType.Mode_Control) {
        $("#mainPowerBtn").show();
        $("#fotStart").show();
        $("#center-save").hide();
        //开始定时器之前先刷新一次
        navigator.PluginInterface.sendDataToDevice(g_mac, searchJson, false, _timeCallback);
        //启动定时5秒获取一次状态
        _timer = setInterval(_timerGetStates, 5000);
    } else {
        $("#mainPowerBtn").hide();
        $("#fotStart").hide();
        $("#center-save").show();
        $("#center-save").click(function () {
            Save();
        });
    }
}


function changCallback(jsonData) {
    console.log("jsonData:" + jsonData);
    try {
        //此时可以轮询状态
        isQuery=false;
        navigator.PluginInterface.sendDataToDevice(g_mac, jsonData, true, callback);
    } catch (e) {
        console.log("e:" + e);
    }


}

//定时获取状态
function _timerGetStates() {
    console.log("定时");
    try {
        console.log();
        if(isQuery){
            navigator.PluginInterface.sendDataToDevice(g_mac, searchJson, false, _timeCallback);
        }
    } catch (e) {
        console.log("e:" + e);
    }
}

//定时回调
function _timeCallback(result) {

    console.log("定时回调:" + result);
    parseStates(result);
    updateUI();
    // navigator.PluginInterface.getInfo(g_mac, upLockState);
}

function upLockState(jsonData) {
    try {
        deviceInfo = JSON.parse(jsonData);

        if (deviceInfo.lock == 0) {
            $("#modeLock").hide();
        } else {
            $("#modeLock").show();
        }

    } catch (e) {
        console.log(e);
    }
}

/**
 *
 * 即时刷新界面
 *
 */
function updateUI() {
    if (isVoiceing) {
        return;
    }
    controlOBJ.init_storage(DataObject);
}
/**
 * 语音接口主要在用
 * @param json
 * @param callBack
 */
function sendDataAndCallback(json, callBack) {
    try {
        navigator.PluginInterface.sendDataToDevice(g_mac, json, false, callBack);
    } catch (e) {
        console.log(e);
    }

}

/**
 * 控制结果的回调
 * @param result
 */
function callback(result) {
    console.log("result:" + result);
    isQuery = true;
    if ("" == result || result == null) {
        // navigator.PluginInterface.showToast(lang.warning_network);
        navigator.PluginInterface.sendDataToDevice(g_mac, searchJson,false, _timeCallback);
        return;
    }else {
        console.log("控制指令应答:" + result);
        if(JSON.parse(result).p.length==2){
            try{
                var obj=JSON.parse(result).p;

                DataObject.timeLeft = parseInt(obj[1]);
                //更新界面
                uiMethodObj.modifyTimeByCmd(DataObject.timeLeft);
            }
            catch(e)
            {
                //console.log(e);
            }
        }
    }
    //此处需要更新页面？？？
    // navigator.PluginInterface.updateStates(g_mac, json);
}

/**********集中控制模块**********/
function Save() {
    //var str=JSON.stringify(DataObject);
    var sendDat = getSentCenterJson();
    var dat = getDat();

    var jsonData = "{\"opt\":[\"power\",\"runState\",\"washMode\",\"speed\",\"washTemp\",";
    jsonData += "\"energySave\",\"preWash\",\"creaseRes\",\"noDrain\",\"adjustWash\",";
    jsonData += "\"potch\",\"nightWash\",\"highWater\",\"order\",\"dryMode\",";
    jsonData += "\"quiet\"],\"p\":" + sendDat + ",\"t\":\"cmd\"}";
    console.log(jsonData);

    var remarks = getRemarks();
    console.log(remarks);
    navigator.PluginInterface.getCCcmd(g_mac, jsonData, remarks, dat);

}
function getDat() {
    var arrs = [];

    objForCenter = controlOBJ.getCenterParam();

    arrs.push(1);
    arrs.push(0);
    arrs.push(objForCenter.washMode);
    arrs.push(objForCenter.speed);
    arrs.push(objForCenter.washTemp);

    arrs.push(objForCenter.stage);
    arrs.push(objForCenter.timeLeft);
    arrs.push(objForCenter.timeAll);
    arrs.push(objForCenter.energySave);
    arrs.push(objForCenter.preWash);
    arrs.push(objForCenter.creaseRes);

    arrs.push(objForCenter.noDrain);
    arrs.push(objForCenter.adjustWash);
    arrs.push(objForCenter.potch);
    arrs.push(objForCenter.nightWash);
    arrs.push(objForCenter.highWater);

    arrs.push(objForCenter.order);
    arrs.push(objForCenter.dryMode);
    arrs.push(objForCenter.childLock);
    arrs.push(objForCenter.quiet);
    arrs.push(objForCenter.noFoam);

    arrs.push([]);
    arrs.push(objForCenter.name);

    return JSON.stringify(arrs);

}

function getSentCenterJson() {
    var arrs = [];

    objForCenter = controlOBJ.getCenterParam();

    arrs.push(1);
    arrs.push(1);
    arrs.push(objForCenter.washMode);
    arrs.push(objForCenter.speed);
    arrs.push(objForCenter.washTemp);
    arrs.push(objForCenter.energySave);
    arrs.push(objForCenter.preWash);
    arrs.push(objForCenter.creaseRes);
    arrs.push(objForCenter.noDrain);
    arrs.push(objForCenter.adjustWash);
    arrs.push(objForCenter.potch);
    arrs.push(objForCenter.nightWash);
    arrs.push(objForCenter.highWater);
    arrs.push(objForCenter.order);
    arrs.push(objForCenter.dryMode);
    arrs.push(objForCenter.quiet);

    return JSON.stringify(arrs);
}

function getRemarks() {
    var remarks = lang.g_CurrentPow + " ";//开关机状态
    remarks += lang.modeWash[objForCenter.washMode - 1] + " ";//模式显示
    remarks += "转速" + objForCenter.speed + " ";
    remarks += "洗衣温度" + objForCenter.washTemp + " ";
    remarks += "...";
    return remarks;
}

/**********集中控制模块**********/


/**********主体主动控制控制模块与语音接口在用**********/
function updateKeyValue(key, val) {
    updateObject(key, val);
    updateUI();
}
function updateObject(key, val) {
    //主体数据灌入
    switch (key) {
        case "power":
            DataObject.power = parseInt(val);
            break;
        case "runState":
            DataObject.runState = parseInt(val);
            break;
        case "washMode":
            DataObject.washMode = parseInt(val);
            break;
    }
}
/**
 * 把一个命令更新到key value
 * 0 风挡
 * 1 模式
 * 2 温度
 * 3 功能
 * @param json
 */
function updateFromCmd(obj, type) {
    for (var i = 0; i < obj.opt.length; i++) {
        updateObject(obj.opt[i], obj.p[i]);
        console.log("opt:" + obj.opt[i] + " p:" + obj.p[i]);
    }
    //先不做刷新
    // refreshUI(type);
}
/**********主体主动控制控制模块**********/

/**********复写andorid事件，包括resume事件等等**********/
function backButton() {
    if ($("#overlayAdv").hasClass("open")) {
        $("#overlayAdv").removeClass("open");
        $("#mask").hide();
    } else if (!$("#pagevoice").is(":hidden")) {
        console.log("hidden")
        voiceManager.finishPage();
    } else if ($("#overlayMode").hasClass("open")) {
        $("#overlayMode").removeClass("open");
        $("#mask").hide();
    }else if ($("#overlayOrder").hasClass("open")) {
        $("#overlayOrder").removeClass("open");
        $("#mask").hide();
    //    我们此处使用的是style="visibility: hidden;看不见但是实际还在，浏览器的逻辑
    //    在判断时认为此时的offset都在，所以可见，直接这样判断$("#runMask").is(":hidden")会一直都是true
    //    display = none 时才是真的不可见
    //
    //    在点击了暂停，并且runMask依然可见的时候，点击返回键返回到控制页面，否则返回设备列表页
    }else if(($("#pauseTxt").text() == "继续") && (($("#runMask").css('visibility') != 'hidden'))){
        $("#runMask").css({"visibility":"hidden"});
        //隐藏后需要重新刷新页面
        controlOBJ.init_storage(DataObject);
    } else {
        navigator.PluginInterface.closePage();
    }
}
function onResume() {
    if (g_functype == FuncType.Mode_Control) {
        console.log(_timer);
        if (_timer == 0) {
            //启动定时5秒获取一次状态
            _timer = setInterval(_timerGetStates, 5000);
        }

        navigator.PluginInterface.getInfo(g_mac, resumeCallBack);

        //刷新界面状态
        navigator.PluginInterface.sendDataToDevice(g_mac, searchJson, false, _timeCallback);
    }
}
function onReFocus() {
    console.log("onReFocus")
    if (isVoiceing) {
        return;
    }
}
function resumeCallBack(jsonData) {
    // deviceInfo = JSON.parse(jsonData);
    // //刷新页面
    // //编辑按钮
    // var txtEdit = $("#txtEdit");
    // if (deviceInfo == undefined) {
    //     txtEdit.text("Dingner Room");
    // } else {
    //     txtEdit.text(deviceInfo.name);
    // }
    //
    // if (deviceInfo.lock == 0) {
    //     $("#modeLock").hide();
    // } else {
    //     $("#modeLock").show();
    // }
}
/**********复写andorid事件，包括resume事件等等**********/

window.addEventListener('DOMContentLoaded', parseUrlData, false);
