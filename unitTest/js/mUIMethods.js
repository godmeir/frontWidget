/**
 * Created by zyj on 2017/1/10.
 */
function uiMethods() {
    var storageData;
    //默认不可以直接进入控制界面
    this.isClickPause = false;
    var _self = this;

    document.documentElement.style.webkitUserSelect='none';
    document.documentElement.style.webkitTouchCallout='none';
    $('body').height($(window).height());

    //设备名称点击事件
    var txtEditClick = document.getElementById('txtEdit');
    txtEditClick.addEventListener('click', function (event) {
        if (g_functype == FuncType.Mode_Control) {
            navigator.PluginInterface.editDevice(g_mac);
        }
    }, false);

    //title的颜色62,178204    58 176 202
    var coolColor = "#3ab0ca";
    setTimeout(function () {
        if (IsDebug == false){
            navigator.PluginInterface.changeBarColor(coolColor);
        }
    }, 500);

    //设置运行状态时的progressbar
    var vd=$("#vader").ProgressBarWars({porcentaje:10,estilo:"vader"});

    //初始化UI方法
    this.srv_renew = function(jsonData) {
        console.log("renewSRV" + jsonData);
        storageData = jsonData;
        //界面选择
        initUI(storageData);
    };




    /**
     *根据刷新所得的数据更新页面，主要更新：是否开机界面，是否故障界面，修改UI
     * 1：是否开机
     * 2：是否故障
     * 3：运行状态
     * 4：控制界面
     *
     * @param jsonData
     */
    /**
     * 刷新方式需要修改了：
     * 修改为针对性的方法
     * 1：针对控制界面，只刷新控制界面
     * 2：运行界面，此界面隐含包括洗衣完成的界面，洗衣完成的时候默认不能返回控制界面
     * 3：故障界面和关机界面比较简单，合并一个方法处理
     *
     * 针对性的方案
     *
     */
    function initUI(jsonData) {
        if (jsonData.power == 0 && jsonData.stage != 6){
            disOverlay();
            _self.isClickPause = true;

            $("#close-page-name")[0].innerHTML = jsonData.name;
            //关机状态
            $("#powerMask").css({"visibility":"visible"});
            $("#errorMask").css({"visibility":"hidden"});
            $("#runMask").css({"visibility":"hidden"});

        }else if(jsonData.er.length > 0){
            disOverlay();
            _self.isClickPause = true;

            $("#error-page-name")[0].innerHTML = jsonData.name;
            //故障状态
            $("#powerMask").css({"visibility":"hidden"});
            $("#errorMask").css({"visibility":"visible"});
            $("#runMask").css({"visibility":"hidden"});

            //故障解析方法
            errorCodeHandler(jsonData.er);
        }else if(Math.abs(jsonData.runState) ==2 || jsonData.stage == 5 || jsonData.stage == 6){
            disOverlay();
            _self.isClickPause = false;//未点击返回就不能退回控制页
            $("#powerMask").css({"visibility":"hidden"});
            $("#errorMask").css({"visibility":"hidden"});
            //必须可见
            $("#runMask").css({"visibility":"visible"});

            setRunMaskUI(jsonData);
        }else {
            $("#powerMask").css({"visibility":"hidden"});
            $("#errorMask").css({"visibility":"hidden"});
            $("#mainName")[0].innerHTML = jsonData.name;
            //在运行状态点击暂停后，此时runState == 1,但是不点击返回依旧不能显示
            //控制界面，需要设置一个标志位
            if(_self.isClickPause){
                //点击返回按键后的状态,隐藏但状态应该开始刷新了
                $("#runMask").css({"visibility":"hidden"});
            }else {
                setRunMaskUI(jsonData);
            }
            //修改模式，同时修改是否显示烘干的部分
            _self.setModeImg(jsonData.washMode);
            //高级选型，只有在未启动的条件下才有刷新的意义
            setAdvUI(jsonData);
        }
    }

    /**
     * 隐藏overlay
     */
    var disOverlay = function () {
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
        }
    }

    /**
     * 运行状态的UI
     * @param jsonData
     */
    function setRunMaskUI(jsonData) {
        //title是当前的模式
        $("#runTitleMode")[0].innerText = lang.modeWash[jsonData.washMode - 1];

        if (jsonData.order != -1 && jsonData.order != 1){
            $("#runLeftTime")[0].innerText = getFoamatTime(Math.abs(jsonData.order));
        }else {
            $("#runLeftTime")[0].innerText = getFoamatTime(jsonData.timeLeft);
        }

        //童锁
        if (jsonData.childLock == -1 || jsonData.childLock == 1){
            $("#chlidLock_img")[0].src = "img/adv_childLock_unset.png"
        }else {
            $("#chlidLock_img")[0].src = "img/adv_childLock_set.png"
        }

        //显示暂停
        //显示暂停
        if(Math.abs(jsonData.runState) == 1){
            $("#pauseTxt")[0].innerText = "继续";
        }else {
            $("#pauseTxt")[0].innerText = "暂停";
        }
        //设置进度条下的进度
        setRunStateBar(jsonData);

        if (jsonData.stage == 5){
            $("#pauseTxt")[0].innerText = "完成";
            $("#runPause").hide();
            $("#midWSTimer2")[0].innerText = lang.washEnd;

        }else if(jsonData.stage == 6){
            $("#pauseTxt")[0].innerText = "完成";
            $("#runPause").hide();
            $("#midWSTimer2")[0].innerText = lang.cooling;
        }else {
            $("#runPause").show();

            if(jsonData.order != -1 && jsonData.order != 1){
                $("#midWSTimer2")[0].innerText = lang.runStateOrder;
            }else {
                switch (jsonData.stage){
                    case 1:
                        $("#midWSTimer2")[0].innerText = lang.runState1;
                        break;
                    case 2:
                        $("#midWSTimer2")[0].innerText = lang.runState2;
                        break;
                    case 3:
                        $("#midWSTimer2")[0].innerText = lang.runState3;
                        break;
                    case 4:
                        $("#midWSTimer2")[0].innerText = lang.runState4;
                        break;
                }
            }

        }
    }

    /**
     * 进度条的及进度条下端的文字的动态修改
     * @param jsonData
     */
    var setRunStateBar = function (jsonData) {
            switch (jsonData.washMode){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 10:
                case 11:
                case 12:
                    if (Math.abs(jsonData.dryMode) == 1){
                        //没有烘干的时候
                        $("#runPos1")[0].innerText = lang.runState1;
                        $("#runPos2")[0].innerText = "";
                        $("#runPos3")[0].innerText = lang.runState2;
                        $("#runPos4")[0].innerText = "";
                        $("#runPos5")[0].innerText = lang.runState3;
                    }else {
                    //    有烘干
                        $("#runPos1")[0].innerText = lang.runState1;
                        $("#runPos2")[0].innerText = lang.runState2;
                        $("#runPos3")[0].innerText = "";
                        $("#runPos4")[0].innerText = lang.runState3;
                        $("#runPos5")[0].innerText = lang.runState4;
                    }

                    break;
                case 8:
            //        漂洗，脱水
                    if (Math.abs(jsonData.dryMode) == 1){
                        //没有烘干的时候
                        $("#runPos1")[0].innerText = "";
                        $("#runPos2")[0].innerText = lang.runState2;
                        $("#runPos3")[0].innerText = "";
                        $("#runPos4")[0].innerText = lang.runState3;
                        $("#runPos5")[0].innerText = "";
                    }else {
                        //    有烘干
                        $("#runPos1")[0].innerText = lang.runState2;
                        $("#runPos2")[0].innerText = "";
                        $("#runPos3")[0].innerText = lang.runState3;
                        $("#runPos4")[0].innerText = "";
                        $("#runPos5")[0].innerText = lang.runState4;
                    }

                    break;
                case 9:
            //        脱水
                    if (Math.abs(jsonData.dryMode) == 1){
                        //没有烘干的时候
                        $("#runPos1")[0].innerText = "";
                        $("#runPos2")[0].innerText = "";
                        $("#runPos3")[0].innerText = lang.runState3;
                        $("#runPos4")[0].innerText = "";
                        $("#runPos5")[0].innerText = "";
                    }else {
                        //    有烘干
                        $("#runPos1")[0].innerText = "";
                        $("#runPos2")[0].innerText = lang.runState3;
                        $("#runPos3")[0].innerText = "";
                        $("#runPos4")[0].innerText = lang.runState4;
                        $("#runPos5")[0].innerText = "";
                    }

                    break;
                case 13:
                case 14:
                    //烘干
                    $("#runPos1")[0].innerText = "";
                    $("#runPos2")[0].innerText = "";
                    $("#runPos3")[0].innerText = lang.runState4;
                    $("#runPos4")[0].innerText = "";
                    $("#runPos5")[0].innerText = "";
                    break;
                default:
                    break;
            }
        if(jsonData.timeAll == 0){
            vd.mover(100);
        }else {
            vd.mover((1-(jsonData.timeLeft)/(jsonData.timeAll))*100);
        }

    }

    /**
     * 根据滚动和浮动的点击来确定当前的mode，并设置相应的图片
     * @param jsonData
     */
    this.setModeImg = function (modeIndex) {
        console.log("renewSRV" + modeIndex);

        _self.modifyModeDry(modeIndex);

        for(var i = 1; i<15;i++){
            for (var j = 1; j<15; j++){
                var modeId = "mode_" + i + "_" + j;
                if($("#"+modeId).size() !== 0){
                    if (modeId.split("_")[2] == modeIndex){
                        console.log(modeId+"被选中~~~~~~~");
                        //模式Pop图片
                        var imgPath = "img/"+modeId+"_set.png";
                        $("#"+modeId).css({"background-image":"url("+imgPath+")"});
                        //模式背景
                        var imgBgPath = "img/mode_bg_"+modeIndex+".png";
                        // $("#mainUpBg").css({"background-image":"url("+imgBgPath+")"});
                        // $("#runUpBg").css({"background-image":"url("+imgBgPath+")"});
                        $("#mainUpBg").css({"background-image":"url("+modeImgCache[modeIndex].src+")"});
                        $("#runUpBg").css({"background-image":"url("+modeImgCache[modeIndex].src+")"});
                    }else {
                        // console.log(modeId+"未被选中");
                        var imgPath = "img/"+modeId+"_unset.png"
                        $("#"+modeId).css({"background-image":"url("+imgPath+")"})
                    }

                }
            }
        }
    }

    /**
     * 控制后拿到时间，修改UI
     * @param timeLeftByCmd
     */
    this.modifyTimeByCmd = function (timeLeftByCmd) {
        storageData.timeLeft = timeLeftByCmd;
        //时间
        if (timeLeftByCmd != 0){
            if (storageData.order != -1 && storageData.order != 1){
                $("#midWSTimer")[0].innerText = getFoamatTime(Math.abs(storageData.order));
                $("#runLeftTime")[0].innerText = getFoamatTime(Math.abs(storageData.order));
            }else {
                $("#midWSTimer")[0].innerText = getFoamatTime(timeLeftByCmd);
                $("#runLeftTime")[0].innerText = getFoamatTime(timeLeftByCmd);
            }

        }
    }



    /**
     * 触发至html的绑定事件
     * @param obj
     * @param state
     */
    this.srv_btn = function(obj,state) {
        switch (obj.id) { //此处传来的obj即为界面控件,id需要跟html对应
            case "powerMaskBack":
                navigator.PluginInterface.closePage();
                clearInterval(_timer);
                break;
            case "powerMaskOpen":

                $("#ControlLoading").show();
                setTimeout(function () {
                    $("#ControlLoading").hide();
                    $("#powerMask").css({"visibility":"hidden"});
                    _self.isClickPause = true;
                    storageData.runState = 1;
                    storageData.stage = 1;
                    initUI(storageData);
                },1500);

                break;

            case "errorMaskBack":
                navigator.PluginInterface.closePage();
                clearInterval(_timer);
                break;

            case "runBackBtn":
                if(state == 0){
                    if(storageData.stage == 5){
                        navigator.PluginInterface.closePage();
                        clearInterval(_timer);
                    }else if(storageData.stage == 6){
                        navigator.PluginInterface.closePage();
                        clearInterval(_timer);
                    }else {
                        _self.isClickPause = true;
                        initUI(storageData);
                        $("#pauseTxt")[0].innerText = "暂停";
                    }
                }else{
                    navigator.PluginInterface.closePage();
                    clearInterval(_timer);
                }
                break;
            case "runPowerBtn":

                $("#ControlLoading").show();
                setTimeout(function () {
                    $("#ControlLoading").hide();

                    $("#powerMask").css({"visibility":"visible"});
                    $("#runMask").css({"visibility":"hidden"});
                },2500);

                break;
            case "error-page-Btn":
                $("#ControlLoading").show();
                setTimeout(function () {
                    $("#ControlLoading").hide();

                    $("#powerMask").css({"visibility":"visible"});
                    $("#errorMask").css({"visibility":"hidden"});
                },2500);
                break;
            case "runPause":

                $("#ControlLoading").show();
                setTimeout(function () {
                    $("#ControlLoading").hide();
                    (state == 1)
                        ?($("#pauseTxt")[0].innerText = "继续")
                        :($("#pauseTxt")[0].innerText = "暂停");
                },1500);


                break;

            case "mainBackBtn":
                navigator.PluginInterface.closePage();
                clearInterval(_timer);
                break;
            case "mainPowerBtn":
                $("#ControlLoading").show();
                setTimeout(function () {
                    $("#ControlLoading").hide();
                    $("#powerMask").css({"visibility":"visible"});
                },2500);


                break;
            case "fotStart":
                $("#ControlLoading").show();
                setTimeout(function () {
                    $("#ControlLoading").hide();
                    initUI(storageData);
                    $("#runMask").css({"visibility":"visible"});
                    $("#pauseTxt")[0].innerText = "暂停";
                }, 1500);


                break;

            case "adv_preWash":
                (state == -1 || state == 1)
                    ?($("#adv_preWash").css({ "background-image":"url(img/adv_preWash_unset.png)"}))
                    :(($("#adv_preWash").css({ "background-image":"url(img/adv_preWash_set.png)"})));
                // $("#advice")[0].innerHTML = lang.up_advice;
                break;
            case "adv_creaseRes":
                (state == -1 || state == 1)
                    ?($("#adv_creaseRes").css({ "background-image":"url(img/adv_creaseRes_unset.png)"}))
                    :($("#adv_creaseRes").css({ "background-image":"url(img/adv_creaseRes_set.png)"}));
                break;
            case "adv_highWater":
                (state == -1 || state == 1)
                    ?($("#adv_highWater").css({ "background-image":"url(img/adv_highWater_unset.png)"}))
                    :($("#adv_highWater").css({ "background-image":"url(img/adv_highWater_set.png)"}));
                ;
                break;
            case "adv_energySave":
                (state == -1 || state == 1)
                    ?($("#adv_energySave").css({ "background-image":"url(img/adv_energySave_unset.png)"}))
                    :($("#adv_energySave").css({ "background-image":"url(img/adv_energySave_set.png)"}));

                break;
            case "adv_childLock":
                (state == -1 || state == 1)
                    ?($("#chlidLock_img")[0].src = "img/adv_childLock_unset.png")
                    :($("#chlidLock_img")[0].src = "img/adv_childLock_set.png");

                break;
            case "adv_quiet":
                (state == -1 || state == 1)
                    ?($("#adv_quiet").css({ "background-image":"url(img/adv_quiet_unset.png)"}))
                    :($("#adv_quiet").css({ "background-image":"url(img/adv_quiet_set.png)"}));

                break;
            case "adv_noDrain":
                (state == -1 || state == 1)
                    ?($("#adv_noDrain").css({ "background-image":"url(img/adv_noDrain_unset.png)"}))
                    :($("#adv_noDrain").css({ "background-image":"url(img/adv_noDrain_set.png)"}));

                break;
            case "adv_nightWash":
                (state == -1 || state == 1)
                    ?($("#adv_nightWash").css({ "background-image":"url(img/adv_nightWash_unset.png)"}))
                    :($("#adv_nightWash").css({ "background-image":"url(img/adv_nightWash_set.png)"}));
                ;
                break;
            case "adv_dry1":
            case "adv_dry2":
                if (state == -1){
                    $("#adv_dry1").css({"background-image":"url(img/adv_dry1_unset.png)"});
                    $("#adv_dry2").css({"background-image":"url(img/adv_dry2_unset.png)"});
                }else if (state == 0){
                    $("#adv_dry1").css({"background-image":"url(img/adv_dry1_unset.png)"});
                    $("#adv_dry2").css({"background-image":"url(img/adv_dry2_unset.png)"});
                }else if (state == 1){
                    $("#adv_dry1").css({"background-image":"url(img/adv_dry1_set.png)"});
                    $("#adv_dry2").css({"background-image":"url(img/adv_dry2_unset.png)"});
                }else if (state == 2){
                    $("#adv_dry1").css({"background-image":"url(img/adv_dry1_unset.png)"});
                    $("#adv_dry2").css({"background-image":"url(img/adv_dry2_set.png)"});
                }
                break;

            default:
                break;
        };
    };


    function setAdvUI(jsonData) {

        //是否是预约
        if (jsonData.order != -1 && jsonData.order != 1){
            $("#midWSTimer")[0].innerText = getFoamatTime(Math.abs(jsonData.order));
            $("#orderText").show();
        }else {
            //时间
            $("#midWSTimer")[0].innerText = getFoamatTime(jsonData.timeLeft);
            $("#orderText").hide();
        }

        //定时烘干
        if (jsonData.washMode == 13 || jsonData.washMode == 14){
            if (Math.abs(jsonData.dryMode) == 2 || Math.abs(jsonData.dryMode) == 3){
                $("#pop_washText6").css({"color":"#666666"});
                $("#pop_washText6")[0].innerHTML = "--" + "<br><br>烘干时长";
            }else {
                $("#pop_washText6").css({"color":"#ffffff"});
                $("#pop_washText6")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" + getFoamatTime(Math.abs(jsonData.dryMode)) + "</p>" + "<br><br>烘干时长";
            }
        }
        //某些模式下不涉及这些功能，
        //模式8，漂洗+脱水时无可调洗涤
        if (jsonData.washMode == 8 || jsonData.washMode == 9){
            $("#pop_washText1").css({"color":"#666666"});
            $("#pop_washText1")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" +  00 + "</p>" + "分<br><br>洗涤";
        }else {
            $("#pop_washText1").css({"color":"#FFFFFF"});
        }

        //模式8，模式9（单脱水）无可调洗涤和漂洗次数
        if (jsonData.washMode == 9){
            $("#pop_washText3").css({"color":"#666666"});
            $("#pop_washText3")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" +  0 + "</p>" + "次<br><br>漂洗";
        }else {
            $("#pop_washText3").css({"color":"#FFFFFF"});
        }




        //预洗
        if (jsonData.preWash == -1 || jsonData.preWash == 1 ){
            $("#adv_preWash").css({"background-image":"url(img/adv_preWash_unset.png)"});
        }else {
            $("#adv_preWash").css({"background-image":"url(img/adv_preWash_set.png)"});
        }
        //防皱
        if (jsonData.creaseRes == -1 || jsonData.creaseRes == 1){
            $("#adv_creaseRes").css({"background-image":"url(img/adv_creaseRes_unset.png)"});
        }else {
            $("#adv_creaseRes").css({"background-image":"url(img/adv_creaseRes_set.png)"});
        }
        //高水位
        if (jsonData.highWater == -1 || jsonData.highWater == 1){
            $("#adv_highWater").css({"background-image":"url(img/adv_highWater_unset.png)"});
        }else {
            $("#adv_highWater").css({"background-image":"url(img/adv_highWater_set.png)"});
        }
        //节能ECO
        if (jsonData.energySave == -1 || jsonData.energySave == 1){
            $("#adv_energySave").css({"background-image":"url(img/adv_energySave_unset.png)"});
        }else {
            $("#adv_energySave").css({"background-image":"url(img/adv_energySave_set.png)"});
        }

        //童锁
        if (jsonData.childLock == -1 || jsonData.childLock == 1){
            $("#chlidLock_img")[0].src = "img/adv_childLock_unset.png"
        }else {
            $("#chlidLock_img")[0].src = "img/adv_childLock_set.png"
        }
        //静音
        if (jsonData.quiet == -1 || jsonData.quiet == 1){
            $("#adv_quiet").css({"background-image":"url(img/adv_quiet_unset.png)"});
        }else {
            $("#adv_quiet").css({"background-image":"url(img/adv_quiet_set.png)"});
        }
        //免排水
        if (jsonData.noDrain == -1 || jsonData.noDrain == 1){
            $("#adv_noDrain").css({"background-image":"url(img/adv_noDrain_unset.png)"});
        }else {
            $("#adv_noDrain").css({"background-image":"url(img/adv_noDrain_set.png)"});
        }
        //夜间洗
        if (jsonData.nightWash == -1 || jsonData.nightWash == 1){
            $("#adv_nightWash").css({"background-image":"url(img/adv_nightWash_unset.png)"});
        }else {
            $("#adv_nightWash").css({"background-image":"url(img/adv_nightWash_set.png)"});
        }
        //烘干模式
        // if (jsonData.washMode != 13 && jsonData != 14){
            if (Math.abs(jsonData.dryMode) == 1){
                $("#adv_dry1").css({"background-image":"url(img/adv_dry1_unset.png)"});
                $("#adv_dry2").css({"background-image":"url(img/adv_dry2_unset.png)"});
            }else if (Math.abs(jsonData.dryMode) == 2){
                $("#adv_dry1").css({"background-image":"url(img/adv_dry1_set.png)"});
                $("#adv_dry2").css({"background-image":"url(img/adv_dry2_unset.png)"});
            }else if (Math.abs(jsonData.dryMode) == 3){
                $("#adv_dry1").css({"background-image":"url(img/adv_dry1_unset.png)"});
                $("#adv_dry2").css({"background-image":"url(img/adv_dry2_set.png)"});
            }else {
                $("#adv_dry1").css({"background-image":"url(img/adv_dry1_unset.png)"});
                $("#adv_dry2").css({"background-image":"url(img/adv_dry2_unset.png)"});
            }
        // }else {
        //     $("#adv_dry1").css({"background-image":"url(img/adv_nightWash_unable.png)"});
        //     $("#adv_dry2").css({"background-image":"url(img/adv_nightWash_unable.png)"});
        // }

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
                case 28:
                    errorObj.errorCode = 'EE';
                    errorObj.errorReason = lang.erReason_EE;
                    errorObj.errorSolve = lang.erSolve_EE;
                    break;
                case 29:
                    errorObj.errorCode = 'Std';
                    errorObj.errorReason = lang.erReason_Std;
                    errorObj.errorSolve = lang.erSolve_Std;
                    break;

            }
            return errorObj;
    }


    /**
     * 烘干机会有界面的不同
     * @param washMode
     */
    this.modifyModeDry = function(washMode) {
        if (washMode == 13 || washMode == 14){
            $("#midStaHelp").css({"visibility":"hidden"});
            $("#midStaHelpDry").css({"visibility":"visible"});
        }else {
            $("#midStaHelp").css({"visibility":"visible"});
            $("#midStaHelpDry").css({"visibility":"hidden"});
        }
    }


    /**
     * 根据时间生成预约的时间数组
     * @param timeLeft
     * @returns {Array}
     */
    function getOrderTime(timeLeft) {
        var hour = Math.ceil(timeLeft / 60);

        var orderArr = [];
        var dataObj0 = new Object();
        dataObj0.value = 0;
        dataObj0.display = "00" +":00";
        orderArr.push(dataObj0);
        for (var start = hour; start <24; start++){
            var dataObj = new Object();
            var dataObj1 = new Object();
            var dataObj2 = new Object();
            var hourTxt;
            var timeAll;
            if (start<10){
                hourTxt = "0" + start;
            }else {
                hourTxt = "" + start;
            }
            timeAll = start * 60;

            dataObj1.value = timeAll;
            dataObj1.display = hourTxt +":00";
            orderArr.push(dataObj1);

            timeAll = start * 60 + 30 ;
            dataObj2.value = timeAll;
            dataObj2.display = hourTxt +":30";
            orderArr.push(dataObj2);

            if (start == 23){
                timeAll = 24 * 60 ;
                dataObj.value = timeAll;
                dataObj.display = "24" +":00";
                orderArr.push(dataObj);
            }

        }
        return orderArr;
    }

    function getFoamatTime(timeLeft) {
        var hour = Math.floor(timeLeft / 60);
        if (hour<10) hour = "0" + hour;
        var minute = timeLeft % 60;
        if (minute<10) minute = "0" + minute;

        return hour +":" + minute
    }

    //语音
    var btnVoice = document.getElementById('fotVoice');
    btnVoice.addEventListener('touchend', function (event) {
        if (g_functype == FuncType.Mode_Control && g_CurrentLang == "zh_CN"){
            if (!IsDebug){
                navigator.PluginInterface.changeBarColor("#345A6D");
            }
            isVoiceing=true;
            voiceManager.startVoice();
        }else {
            if (IsDebug){
                console.log("语音当前不可用");
            }else {
                console.log("语音当前不可用");
                navigator.PluginInterface.showToast(lang.no_voice,0);
            }
        }
    }, false);


    var btnVoicePower = document.getElementById('powerVoice');
    btnVoicePower.addEventListener('touchend', function (event) {
        if (g_functype == FuncType.Mode_Control && g_CurrentLang == "zh_CN"){
            if (!IsDebug){
                navigator.PluginInterface.changeBarColor("#345A6D");
            }
            isVoiceing=true;
            voiceManager.startVoice();
        }else {
            if (IsDebug){
                console.log("语音当前不可用");
            }else {
                console.log("语音当前不可用");
                navigator.PluginInterface.showToast(lang.no_voice,0);
            }
        }
    }, false);
};