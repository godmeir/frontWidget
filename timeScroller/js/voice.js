/**
 * Created by 680590 on 2016/10/12.
 */
function voiceWidget(callback) {


    //语音提示
    var speakMsg = "";
    var tag = 0;//单双
    /**
     * 显示语音蒙版
     */
    this.startVoice = function () {
        $("#pagevoice").show();
        $("#convo_tips").show();
        $("#convo").hide();
        $("#chatmsg").html("");
        $("#chatmsg").html("<li style='display: none'>今天我能为您做什么？</li>");
        tag = 0;
    };

    /**
     * 隐藏蒙版
     */
    this.finishPage = function () {
        isVoiceing = false;
        speakMsg = "";
        stopSpeak();
        $("#pagevoice").hide();
        //恢復狀態欄顏色
        //title的颜色62,178204    58 176 202
        var coolColor = "#3ab0ca";
        if (IsDebug == false){
            navigator.PluginInterface.changeBarColor(coolColor);
        }
    };

    /**
     *  加载语言
     */
    if (deviceInfo == undefined) {
        $.getScript('./js/voice/zh_CN_Extra.js', function () {
        });
        $.getScript('./js/voice/zh_CN_Common.js', function () {
        });
        $.getScript('./js/voice/zh_CN_Understand.js', function () {
        });
    } else if (deviceInfo.lang == "zh_CN") {
        $.getScript('./js/voice/zh_CN_Extra.js');
        $.getScript('./js/voice/zh_CN_Common.js');
        $.getScript('./js/voice/zh_CN_Understand.js');
    }

    var btnCloseVoice = document.getElementById('btnCloseVoice');
    btnCloseVoice.addEventListener('click', function (event) {
        isVoiceing = false;
        speakMsg = "";
        stopSpeak();
        $("#pagevoice").hide();

        //title的颜色62,178204    58 176 202
        var coolColor = "#3ab0ca";
        if (IsDebug == false){
            navigator.PluginInterface.changeBarColor(coolColor);
        }
    }, false);

    var btnVoiceTips = document.getElementById('btnVoiceTips');
    btnVoiceTips.addEventListener('touchend', function (event) {
        $("#convo_tips").show();
        $("#convo").hide();
    }, false);

    var startvoice = document.getElementById('startvoice');
    startvoice.addEventListener('touchend', function (event) {
        $("#convo_tips").hide();
        $("#convo").show();
        //调用原生接口
        navigator.PluginInterface.startVoice(voiceCallback);
        console.log("111111startvoice");
    }, false);

    /**
     *  语音回调 type : 1 语义  0词条
     */
    this.parseVoiceText = function (data) {
        var obj = JSON.parse(data);
        addMsg(obj.text, 0);
        var hasKey = false;
        if (matchExtra(obj.key)) {
            //特殊关键词匹配词条
            hasKey = matchCommon(obj.text);
        } else {
            if (obj.type == 0) {
                //词条匹配
                hasKey = matchCommon(obj.key);
            } else {
                //语义匹配
                hasKey = matchUnderstand(obj.key);
            }
        }
        if (!hasKey) {
            speakMsg = lang.voice_cmd_not_found;
            speak(speakMsg);
            addMsg(speakMsg, 1);
            speakMsg = "";
        }
    };

    /**
     * 遍历特殊词条
     */
    function matchExtra(key) {
        for (var i = 0; i < v_extra.length; i++) {
            if (key.indexOf(v_extra[i].key) >= 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 遍历词条
     */
    function matchCommon(key) {
        var haskey = false;
        for (var i = 0; i < v_common.length; i++) {
            var word = v_common[i].key;
            if (word.indexOf("-") >= 0) {
                var array = word.split("-");
                for (var j = 0; j < array.length; j++) {
                    if (key.indexOf(array[j]) >= 0) {
                        haskey = true;
                        break;
                    }
                }
            } else {
                if (key.indexOf(word) >= 0) {
                    haskey = true;
                }
            }
            if (haskey) {
                sendCmd(v_common[i].opt, v_common[i].p, v_common[i].msg);
                break;
            }
        }
        return haskey;
    }

    /**
     * 遍历语义
     */
    function matchUnderstand(key) {
        for (var i = 0; i < v_understand.length; i++) {
            if (v_understand[i].key.indexOf(key) >= 0) {
                sendCmd(v_understand[i].opt, v_understand[i].p, v_understand[i].msg);
                return true;
            }
        }
        return false;
    }


    /**
     * 发送指令
     */
    function sendCmd(opt, p, msg) {
        var json = cmdmutex(getCmdKey(opt), getCmdValue(p));
        if ("" == json) {
            speakMsg = msg;
            var cmd = getCmd(opt, p);
            updateFromCmd(JSON.parse(cmd), -1);
            sendDataAndCallback(cmd, sendCallBack);
        } else {
            var dat = JSON.parse(json);
            console.log(dat);
            if (dat.type == 0) {
                addMsg(dat.msg, 1);
                speak(dat.msg);
            } else {
                speakMsg = msg;
                var cmd = dat.cmd;
                updateFromCmd(cmd, -1);
                sendDataAndCallback(JSON.stringify(cmd), sendCallBack);
            }
        }
    }

    /**
     * 停止播报
     */
    function stopSpeak() {
        try {
            navigator.PluginInterface.stopSpeak();
        } catch (e) {
        }
    }

    /**
     * 播报提示
     */
    function speak(text) {
        try {
            navigator.PluginInterface.startSpeak(text);
        } catch (e) {
        }
    }

    /**
     * 接收结果并刷新界面
     * @param json
     */
    this.parseResult = function (json) {
        if (json == "" || json == "null") {
            speakMsg = lang.warning_network;
        }
        if (speakMsg != "") {
            addMsg(speakMsg, 1);
            speak(speakMsg);
            speakMsg = "";
        }
    };

    /**
     * 解析指令值
     * @param p
     */
    function getCmdValue(p) {
        var result = p.substring(1, p.indexOf("]"));
        if (result.indexOf(",") >= 0) {
            var arr = result.split(",");
            return parseInt(arr[0]);
        } else {
            return parseInt(result);
        }
    }

    /**
     * 解析指令名
     * @param opt
     * @returns {*}
     */
    function getCmdKey(opt) {
        var result = opt.substring(2, opt.indexOf("]") - 1);
        if (result.indexOf(",") > 0) {
            var arr = result.split(",");
            var arr0 = arr[0];
            arr0 = arr0.substring(0, arr0.indexOf("\""));
            return arr0;
        } else {
            return result;
        }
    }

    /**
     * 获取指令
     * @param opt
     * @param p
     * @returns {string}
     */
    function getCmd(opt, p) {
        return "{\"opt\":" + opt + ",\"p\":" + p + ",\"t\":\"cmd\"}";
    }

    /**
     * 添加对话
     * @param msg
     * @param lf   0是右是自己 1是左边机器人
     */
    function addMsg(msg, lr) {
        var txt = "";// $("#chatmsg").html();
        //获取奇偶
        var ret = tag % 2;
        if (ret == 0) {
            //当前是自己
            if (lr == 0) {
                txt += "<li style='display: none'></li>";
                txt += "<li>" + msg + "</li>";
            } else {
                txt += "<li>" + msg + "</li>";
            }
        } else {
            if (lr == 0) {
                txt += "<li>" + msg + "</li>";
            } else {
                txt += "<li style='display: none'></li>";
                txt += "<li>" + msg + "</li>";
            }
        }
        $("#chatmsg").append(txt);
        scrollToBottom();
        tag = lr;
    }

    //一直底部
    function scrollToBottom() {
        var div = $("#page_voice_content");
        $("#page_voice_content").animate({scrollTop: div[0].scrollHeight}, 500);
    }

    /**
     * 发送命令互斥
     * @param key
     * @param val
     * @returns {string}
     */
    function cmdmutex(key, val) {
        console.log("key:"+key);
        //开机提示
        if(DataObject.Pow==0&&"Pow"!=key&&"Lig"!=key){
            var msg = lang.warning_pow_off;
            var cmd = null;
            console.log("msg:"+msg);
            return "{\"type\":" + 0 + ",\"cmd\":" + cmd + ",\"msg\":\"" + msg + "\"}";
        }
        var data = "";
        switch (key) {
            case "Pow":
                break;
            case "Mod":
                // tips = mutexManager.modemutex(val, false);
                data = mutexManager.getModeCmd(val);
                break;
            case "TemUn":
                break;
            case "SetTem":
                data = mutexManager.getTempCmd(val,false);
                break;
            case "TemRec":
                break;
            case "HeatCoolType":
                break;
            case "WdSpd":
                // tips = mutexManager.fanmutex(val, false);
                data = mutexManager.getFanCmd(val, false);
                break;
            case "Tur":
                // tips = mutexManager.fanmutex(val, false);
                data = mutexManager.getFanCmd(val, false);
                break;
            case "Quiet":
                // tips = mutexManager.fanmutex(val, false);
                data = mutexManager.getFanCmd(val, false);
                break;
            case "SwUpDn":
                break;
            case "SwingLfRig":
                break;
            case "Air":
                // tips = mutexManager.funcmutex(0, false);
                data = mutexManager.getFuncCmd(0, val, false);
                break;
            case "Blo":
                // tips = mutexManager.funcmutex(1, false);
                data = mutexManager.getFuncCmd(1, val, false);
                break;
            case "Health":
                // tips = mutexManager.funcmutex(2, false);
                data = mutexManager.getFuncCmd(2, val, false);
                break;
            case "SvSt":
                // tips = mutexManager.funcmutex(4, false);
                data = mutexManager.getFuncCmd(4, val, false);
                break;
            case "Lig":
                // tips = mutexManager.funcmutex(3, false);
                data = mutexManager.getFuncCmd(3, val, false);
                break;
            case "StHt":
                // tips = mutexManager.funcmutex(7, false);
                data = mutexManager.getFuncCmd(7, val, false);
                break;
            case "SwhSlp":
                // tips = mutexManager.funcmutex(8, false);
                data = mutexManager.getFuncCmd(8, val, false);
                break;
        }
        return data;
    }

}


/**
 * 回调发送命令结果
 * @param data
 */
function sendCallBack(data) {
    voiceManager.parseResult(data);
}
/**
 * 语音回调
 * @param data
 */
function voiceCallback(data) {
    console.log("211111startvoice");
    voiceManager.parseVoiceText(data);
}