/**
 * Created by zyj on 2017/1/6.
 *
 * 控制widget
 *
 */
function mControl(callback){


    var valueDic;//在本方法中可以全局使用的所有数据
    var isEditTime = 0;//用于记录点击后界面与网络数据冲突问题
    var _selfControl = this;
    //棉麻
    //温度数据与默认温度
    var tempData = [{value: 1, display: '冷'},
        {value: 20, display: '20'},
        {value: 30, display: '30'},
        {value: 40, display: '40'},
        {value: 60, display: '60'},
        {value: 95, display: '95'}];
    var tempDef = 40;
    //脱水转数与默认转数
    var speedData = [{value: 1, display: '0'},
        {value: 400, display: '400'},
        {value: 600, display: '600'},
        {value: 800, display: '800'},
        {value: 1000, display: '1000'},
        {value: 1200, display: '1200'},
        {value: 1400, display: '1400'}];
    var speedDef = 1000;
    var timeDef = 87;//1:27，默认模式时间
    //可调洗涤的时间
    var adjustWashData = [{value: 5, display: '5'},
        {value: 10, display: '10'},
        {value: 15, display: '15'},
        {value: 20, display: '20'},
        {value: 25, display: '25'},
        {value: 30, display: '30'},
        {value: 35, display: '35'},
        {value: 40, display: '40'},
        {value: 45, display: '45'},
        {value: 50, display: '50'},
        {value: 55, display: '55'},
        {value: 60, display: '60'}];
    var adjustWashDef = 15;//打开洗涤的默认时间
    //漂洗次数
    var potchData = [{value: 1, display: '1'},
        {value: 2, display: '2'},
        {value: 3, display: '3'},
        {value: 4, display: '4'},
        {value: 5, display: '5'},
        {value: 6, display: '6'},
        {value: 7, display: '7'},
        {value: 8, display: '8'}];
    var potchDef = 2;


    var renewTimeOut =function(){
        var ret=false;
        var nowTime = Date.now();
        if((nowTime - isEditTime) < 3500){
            ret=true;
        }
        return ret;
    }

    //预约事件
    var orderScroll =  mobiscroll.scroller('#scrollerOrder', {
        theme: 'mobiscroll',
        display: 'inline',
        showLabel: false,
        height:40,
        width: $(window).width(),
        rows: 3,
        closeOnOverlayTap: true,
        circular:false,
        wheels: [
            [{
                label: 'Second wheel',
                data: getOrderTime(310)
            }]
        ],
        onChange: function (event, inst) {
            if (valueDic.order > 0){
                isEditTime = Date.now();
                if (inst.getVal() == 0){
                    console.log("选择时间0，预约取消");
                    valueDic.order = 1;
                    nwBuffer = "{\"opt\":[\"order\"],\"p\":[" + Number(valueDic.order) + "],\"t\":\"cmd\"}";
                    if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
                }else {
                    console.log(inst.getVal());
                    valueDic.order = inst.getVal();
                    nwBuffer = "{\"opt\":[\"order\"],\"p\":[" + Number(valueDic.order) + "],\"t\":\"cmd\"}";
                    if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
                }
            }else {
                if (Math.abs(valueDic.order) > 1){
                    var orderTime = Math.abs((Math.ceil((valueDic.order)/30))*30);
                    inst.setVal(orderTime);
                }else if (Math.abs(valueDic.order) == 1){
                    inst.setVal(0);
                }

                if (IsDebug){
                    console.log("预约功能此时不可修改");
                }else {
                    console.log("预约功能此时不可修改");
                    navigator.PluginInterface.showToast("预约功能此时不可修改",0);
                }

            }


        },
    });


    //洗涤时间
    var touch1 = false;
    var instance1 = mobiscroll.scroller('#scroller1', {
        theme: 'mobiscroll',
        showLabel: false,
        display: 'inline',
        rows: 3,
        height: 30,
        closeOnOverlayTap: false,
        onInit: function (event, inst) {
            inst.setVal(adjustWashDef);
            $("#pop_washText1")[0].innerHTML = "<p style='font-size: 1.5rem;display:inline'>" + adjustWashDef + "</p>" + "分<br><br>洗涤";
        },
        onChange: function (event, inst) {
            if (valueDic.adjustWash > 0){
                isEditTime = Date.now();

                $("#pop_washText1")[0].innerHTML = "<p style='font-size: 1.5rem;display:inline'>" + inst.getVal()  + "</p>" + "分<br><br>洗涤";

                valueDic.adjustWash = inst.getVal();
                nwBuffer = "{\"opt\":[\"adjustWash\"],\"p\":[" + Number(valueDic.adjustWash) + "],\"t\":\"cmd\"}";
                if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            }else {
                inst.setVal(Math.abs(valueDic.adjustWash));

                if (IsDebug){
                    console.log("此时不可修改");
                }else {
                    console.log("此时不可修改");
                    navigator.PluginInterface.showToast("此时不可修改",0);
                }
            }

        },
        wheels: [
            [{
                label: 'Second wheel',
                data: adjustWashData
            }]
        ]
    });
    instance1.hide();
    $("#pop_washText1").bind("click",function(event) {
        if(!(valueDic.washMode == 8 || valueDic.washMode == 9)){
            touch1 = !touch1;
            if (touch1) {
                instance1.show(false,true); // Call the show method
            } else {
                instance1.hide(false,false);
            }
        }

        // return false;
    });


    //设置温度
    var touch2 = false;
    var instance2 = mobiscroll.scroller('#scroller2', {
        theme: 'mobiscroll',
        showLabel: false,
        display: 'inline',
        rows: 3,
        height: 30,
        closeOnOverlayTap: false,
        onInit: function (event, inst) {
            inst.setVal(tempDef);
            if (tempDef == 1){
                $("#pop_washText2")[0].innerHTML = "冷水" + "℃<br><br>温度";
            }else {
                $("#pop_washText2")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" + tempDef + "</p>" +  "℃<br><br>温度";
            }

        },
        onChange: function (event, inst) {
            if (valueDic.washTemp > 0){
                isEditTime = Date.now();
                if (valueDic.washMode != 7){
                    //筒清洁没有冷水
                    if(inst.getVal() == 1){
                        $("#pop_washText2")[0].innerHTML = "冷水<br><br>温度";
                    }else {
                        $("#pop_washText2")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" + inst.getVal() + "</p>" + "℃<br><br>温度";
                    }

                }else {
                    $("#pop_washText2")[0].innerHTML = "<p style='font-size: 1.5rem;display:inline'>" +  inst.getVal() + "</p>" + "℃<br><br>温度";
                }


                valueDic.washTemp = inst.getVal();
                nwBuffer = "{\"opt\":[\"washTemp\"],\"p\":[" + Number(valueDic.washTemp) + "],\"t\":\"cmd\"}";
                if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
                setAdWashByTemp(valueDic.washMode, valueDic.washTemp);
            }else {
                inst.setVal(Math.abs(valueDic.washTemp));

                if (IsDebug){
                    console.log("此时不可修改");
                }else {
                    console.log("此时不可修改");
                    navigator.PluginInterface.showToast("此时不可修改",0);
                }
            }

        },
        wheels: [
            [{
                label: 'Second wheel',
                data: tempData
            }]
        ]
    });
    instance2.hide();
    $("#pop_washText2").bind("click",function(event) {
        touch2 = !touch2;
        if (touch2) {
            instance2.show(false,true); // Call the show method
        } else {
            instance2.hide(false,false);
        }
        // return false;
    });


    var touch3 = false;
    var instance3 = mobiscroll.scroller('#scroller3', {
        theme: 'mobiscroll',
        showLabel: false,
        display: 'inline',
        showOnFocus: true,
        rows: 3,
        height: 30,
        closeOnOverlayTap: false,
        onInit: function (event, inst) {
            inst.setVal(potchDef);
            $("#pop_washText3")[0].innerHTML = "<p style='font-size: 1.5rem;display:inline'>" +  potchDef + "</p>" + "次<br><br>漂洗";
        },
        onChange: function (event, inst) {
            if (valueDic.potch > 0){
                isEditTime = Date.now();
                $("#pop_washText3")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" +  inst.getVal() +"</p>" + "次<br><br>漂洗";

                valueDic.potch = inst.getVal();
                nwBuffer = "{\"opt\":[\"potch\"],\"p\":[" + Number(valueDic.potch) + "],\"t\":\"cmd\"}";
                if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            }else {
                inst.setVal(Math.abs(valueDic.potch));

                if (IsDebug){
                    console.log("此时不可修改");
                }else {
                    console.log("此时不可修改");
                    navigator.PluginInterface.showToast("此时不可修改",0);
                }
            }

        },
        wheels: [
            [{
                label: 'Second wheel',
                data: potchData
            }]
        ]
    });
    instance3.hide();
    $("#pop_washText3").bind("click",function(event) {

        if (!(valueDic.washMode == 9)){
            touch3 = !touch3;
            event.preventDefault();
            if (touch3) {
                instance3.show(false,true); // Call the show method
            } else {
                instance3.hide(false,false);
            }
        }

        // return false;
    });


    var touch4 = false;
    var instance4 = mobiscroll.scroller('#scroller4', {
        theme: 'mobiscroll',
        showLabel: false,
        display: 'inline',
        rows: 3,
        height: 30,
        closeOnOverlayTap: false,
        onInit: function (event, inst) {
            inst.setVal(speedDef);
            if (speedDef == 1){
                $("#pop_washText4")[0].innerHTML = "<p style='font-size: 1.5rem;display:inline'>" +  "0"  + "</p>" + "转<br><br>转速";
            }else {
                $("#pop_washText4")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" + speedDef + "</p>" +"转<br><br>转速";
            }

        },
        onChange: function (event, inst) {
            if (valueDic.speed > 0){
                isEditTime = Date.now();

                if (inst.getVal() == 1){
                    $("#pop_washText4")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" +  "0" + "</p>" + "转<br><br>转速";
                }else {
                    $("#pop_washText4")[0].innerHTML = "<p style='font-size: 1.5rem;display:inline'>" +  inst.getVal() + "</p>" + "转<br><br>转速";
                }


                valueDic.speed = inst.getVal();
                nwBuffer = "{\"opt\":[\"speed\"],\"p\":[" + Number(valueDic.speed) + "],\"t\":\"cmd\"}";
                if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            }else {
                inst.setVal(Math.abs(valueDic.speed));

                if (IsDebug){
                    console.log("此时不可修改");
                }else {
                    console.log("此时不可修改");
                    navigator.PluginInterface.showToast("此时不可修改",0);
                }
            }

        },

        onBeforeShow: function (event, inst) {
            if (touch4 == false){
                inst.hide(false,false);
            }
        },

        wheels: [
            [{
                label: 'Second wheel',
                data: speedData
            }]
        ]
    });
    instance4.hide();
    $("#pop_washText4").bind("click",function(event)                                                                                                                                                                                                                                                                                                                                                              {
        touch4 = !touch4;
        event.preventDefault();
        if (touch4) {
            instance4.show(false,true); // Call the show method
        } else {
            instance4.hide(false,false);
        }
        // return false;
    });





    /**
     * 修改模式后对应的可选wheel内容会变化
     */
    function modifyWheel() {

        //预约的时间变化
        //当查询到预约为1是，是预约关闭但可以设置，
        //当查询到为-1 时都是关闭，
        //只要查询到预约的绝对值大于1时都是预约开的情况

        //至于点击事件就交给点击的结果去处理
        orderScroll.option({
            wheels: [
                [{
                    label: 'Second wheel',
                    data: getOrderTime(valueDic.timeLeft)
                }]
            ]
        });

        //当修改定时时显示没有问题，但是当刷新时，当时间不是30的整数倍就会显示为零，取消的位置
        if (Math.abs(valueDic.order) > 1){
            var orderTime = Math.abs((Math.ceil((valueDic.order)/30))*30);
            orderScroll.setVal(orderTime);
        }else if (Math.abs(valueDic.order) == 1){
            orderScroll.setVal(0);
        }



        tempDef = Math.abs(valueDic.washTemp);
        speedDef = Math.abs(valueDic.speed);
        adjustWashDef = Math.abs(valueDic.adjustWash);
        potchDef = Math.abs(valueDic.potch);

        //洗涤时间
        instance1.option({
            wheels: [
                [{
                    label: 'Second wheel',
                    data: adjustWashData
                }]
            ]
        });
        instance1.setVal(adjustWashDef);
        if(!touch1){
            instance1.hide();
        }


        //温度
        instance2.option({
            wheels: [
                [{
                    label: 'Second wheel',
                    data: tempData
                }]
            ]
        });
        instance2.setVal(tempDef);
        if (valueDic.washMode != 7){
            //筒清洁没有冷水
            if(tempDef == 1){
                $("#pop_washText2")[0].innerHTML =  "冷水<br><br>温度";
            }else {
                $("#pop_washText2")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" +  tempDef + "</p>" + "℃<br><br>温度";
            }

        }else {
            $("#pop_washText2")[0].innerHTML =  "<p style='font-size: 1.5rem;display:inline'>" +  tempDef + "</p>" + "℃<br><br>温度";
        }
        if (!touch2){
            instance2.hide();
        }

        //漂洗次数
        instance3.option({
            wheels: [
                [{
                    label: 'Second wheel',
                    data: potchData
                }]
            ]
        });
        instance3.setVal(potchDef);
        if (!touch3){
            instance3.hide();
        }

        //转数
        instance4.option({
            wheels: [
                [{
                    label: 'Second wheel',
                    data: speedData
                }]
            ]
        });
        instance4.setVal(speedDef);
        if (!touch4){
            instance4.hide();
        }


    }

    var tempDemo = new rollWidget({
        containerID: 'container_temp',//容器ID
        renderTo: 'carousel_temp',//渲染到
        scale: 0.35,//中间值和两边的缩放比
        fontColor: "#ffffff",//字体初始颜色
        focusColor: "f4f4f4",//字体点击后的颜色
        onChange: function (val) {
            disMissTouchPop();
            //假如没有完成一次滑动的话就不改变状态
            if (((valueDic.washMode < 13)&&(valueDic.washMode != val+1)) || ((valueDic.washMode > 12)&&(valueDic.washMode != val+3))){

                isEditTime = Date.now();
                if ((val+1 == 13)|| (val+1 == 14)){
                    valueDic.washMode = val+3;
                }else {
                    valueDic.washMode = val+1;
                }

                //返回index 0开始
                setMode(valueDic,1);
                nwBuffer = "{\"opt\":[\"washMode\"],\"p\":[" + Number(valueDic.washMode) + "],\"t\":\"cmd\"}";
                if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
                //修改滑动的内容
                modifyWheel();
                setSpeedByCre(valueDic.washMode,valueDic.creaseRes, 1);
                setSpeedByNight(valueDic.washMode,valueDic.nightWash, valueDic.creaseRes, 1);
                // uiMethodObj.setModeImg(val+1)
                uiMethodObj.srv_renew(valueDic);
            }

        }
    });
    /**
     * 初始化传入
     * @param vd
     */
    this.init_storage = function(vd) {
        if (!renewTimeOut()) { //不在控制状态时，才刷新界面)
            valueDic = $.extend(true, {}, vd);//DeepCopy


            //在复制前比较这里忘记了当初为什么这样写，后期优化考虑
            // if (vd.washMode == valueDic.washMode){
            //     modifyWheel();
            // }else {
            setMode(valueDic,0);
            modifyWheel();
            setSpeedByCre(valueDic.washMode,valueDic.creaseRes, 0);
            setSpeedByNight(valueDic.washMode,valueDic.nightWash, valueDic.creaseRes, 0);
            if (valueDic.washMode == 15 || valueDic.washMode == 16){
                tempDemo.setValue(valueDic.washMode - 3);//设置index
            }else {
                tempDemo.setValue(valueDic.washMode - 1);//设置index
            }

            // }
            uiMethodObj.srv_renew(valueDic);

        }
    }

    /**
     * 集中控制返回
     * @returns {*}
     */
    this.getCenterParam = function () {
        return valueDic;
    }
    /**
     * 模式点击事件，因为所有的模式都是互斥的，所以只要点击是哪个Index就行
     */
    this.mode_click = function (obj) {
        isEditTime = Date.now();
        var modeIndex = obj.id.split("_")[2];
        console.log("点击的位置是："+obj.id.split("_")[1]+",实际的模式是："+modeIndex);
        valueDic.washMode = parseInt(modeIndex);
        //修改mode
        setMode(valueDic,1);

        modifyWheel();
        setSpeedByCre(valueDic.washMode,valueDic.creaseRes, 1);
        setSpeedByNight(valueDic.washMode,valueDic.nightWash, valueDic.creaseRes, 1);

        if (valueDic.washMode == 15 || valueDic.washMode == 16){
            tempDemo.setValue(valueDic.washMode - 3);//设置index
        }else {
            tempDemo.setValue(valueDic.washMode - 1);//设置index
        }

        nwBuffer = "{\"opt\":[\"washMode\"],\"p\":[" + Number(modeIndex) + "],\"t\":\"cmd\"}";
        if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
        uiMethodObj.srv_renew(valueDic);

    }

    /**
     *
     * 以下为高级功能的按钮点击,高级功能现在的解析方式为：负数为不可控时的状态
     * 1：可控关
     * 2：可控开
     * -1：不可控关
     * -2：不可控开
     *
     * 所以首先判断是不是0,1状态（来自于控制还是刷新），假如不是就直接更新界面就行了，点击事件不用修改
     *
     * 一些受到高级功能开关影响的功能，比如转数就要重新判断，添加判断条件了
     *
     */
    this.preWash_click = function (obj) {
        console.log("预洗");
        if(valueDic.preWash > 0){
            isEditTime = Date.now();
            if(valueDic.preWash ==1){
                valueDic.preWash = 2;
            }else {
                valueDic.preWash = 1;
            }
            nwBuffer = "{\"opt\":[\"preWash\"],\"p\":[" + Number(valueDic.preWash) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            uiMethodObj.srv_btn(obj,valueDic.preWash);
        }else {

            if (IsDebug){
                console.log("该功能在此模式下不可用");
            }else {
                console.log("该功能在此模式下不可用");
                navigator.PluginInterface.showToast("该功能在此模式下不可用",0);
            }

        }



    }
    this.creaseRes_click = function (obj) {
        console.log("防皱");
        if(valueDic.creaseRes > 0){
            isEditTime = Date.now();
            if (valueDic.creaseRes == 1){
                valueDic.creaseRes = 2;
            }else {
                valueDic.creaseRes = 1;
            }
            nwBuffer = "{\"opt\":[\"creaseRes\"],\"p\":[" + Number(valueDic.creaseRes) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            setSpeedByCre(valueDic.washMode,valueDic.creaseRes, 1);
            setSpeedByNight(valueDic.washMode,valueDic.nightWash, valueDic.creaseRes, 1);

            uiMethodObj.srv_btn(obj,valueDic.creaseRes);
        }else {
            if (IsDebug){
                console.log("该功能在此模式下不可用");
            }else {
                console.log("该功能在此模式下不可用");
                navigator.PluginInterface.showToast("该功能在此模式下不可用",0);
            }
        }


    }
    this.highWater_click = function (obj) {
        console.log("高水位");

        if(valueDic.highWater > 0){
            isEditTime = Date.now();
            if (valueDic.highWater == 1){
                valueDic.highWater = 2;
            }else {
                valueDic.highWater = 1;
            }
            nwBuffer = "{\"opt\":[\"highWater\"],\"p\":[" + Number(valueDic.highWater) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            uiMethodObj.srv_btn(obj,valueDic.highWater);
        }else {
            if (IsDebug){
                console.log("该功能在此模式下不可用");
            }else {
                console.log("该功能在此模式下不可用");
                navigator.PluginInterface.showToast("该功能在此模式下不可用",0);
            }
        }


    }

    this.energySave_click = function (obj) {
        console.log("节能ECO");
        if(valueDic.energySave > 0){
            isEditTime = Date.now();
            if (valueDic.energySave == 1){
                valueDic.energySave = 2;
            }else {
                valueDic.energySave = 1;
            }
            nwBuffer = "{\"opt\":[\"energySave\"],\"p\":[" + Number(valueDic.energySave) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            uiMethodObj.srv_btn(obj,valueDic.energySave);
        }else {
            if (IsDebug){
                console.log("该功能在此模式下不可用");
            }else {
                console.log("该功能在此模式下不可用");
                navigator.PluginInterface.showToast("该功能在此模式下不可用",0);
            }
        }


    }

    this.childLock_click = function (obj) {
        console.log("童锁");
        if(valueDic.childLock > 0){
            isEditTime = Date.now();
            if (valueDic.childLock == 1){
                valueDic.childLock = 2;
            }else {
                valueDic.childLock = 1;
            }
            nwBuffer = "{\"opt\":[\"childLock\"],\"p\":[" + Number(valueDic.childLock) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            uiMethodObj.srv_btn(obj,valueDic.childLock);
        }else {
            if (IsDebug){
                console.log("该功能在此模式下不可用");
            }else {
                console.log("该功能在此模式下不可用");
                navigator.PluginInterface.showToast("该功能在此模式下不可用",0);
            }
        }


    }

    this.quiet_click = function (obj) {
        console.log("静音");
        if(valueDic.quiet > 0){
            isEditTime = Date.now();
            if (valueDic.quiet == 1){
                valueDic.quiet = 2;
            }else {
                valueDic.quiet = 1;
            }
            nwBuffer = "{\"opt\":[\"quiet\"],\"p\":[" + Number(valueDic.quiet) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            uiMethodObj.srv_btn(obj,valueDic.quiet);
        }else {
            if (IsDebug){
                console.log("该功能在此模式下不可用");
            }else {
                console.log("该功能在此模式下不可用");
                navigator.PluginInterface.showToast("该功能在此模式下不可用",0);
            }
        }


    }

    this.noDrain_click = function (obj) {
        console.log("免排水");
        if(valueDic.noDrain > 0){
            isEditTime = Date.now();
            if (valueDic.noDrain == 1){
                valueDic.noDrain = 2;
            }else {
                valueDic.noDrain = 1;
            }
            nwBuffer = "{\"opt\":[\"noDrain\"],\"p\":[" + Number(valueDic.noDrain) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            uiMethodObj.srv_btn(obj,valueDic.noDrain);
        }else {
            if (IsDebug){
                console.log("该功能在此模式下不可用");
            }else {
                console.log("该功能在此模式下不可用");
                navigator.PluginInterface.showToast("该功能在此模式下不可用",0);
            }
        }


    }

    this.nightWash_click = function (obj) {
        console.log("夜间洗");
        if(valueDic.nightWash > 0){
            isEditTime = Date.now();
            if (valueDic.nightWash == 1){
                valueDic.nightWash = 2;
            }else {
                valueDic.nightWash = 1;
            }
            nwBuffer = "{\"opt\":[\"nightWash\"],\"p\":[" + Number(valueDic.nightWash) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            setSpeedByNight(valueDic.washMode,valueDic.nightWash, valueDic.creaseRes, 1);
            uiMethodObj.srv_btn(obj,valueDic.nightWash);
        }else {
            if (IsDebug){
                console.log("该功能在此模式下不可用");
            }else {
                console.log("该功能在此模式下不可用");
                navigator.PluginInterface.showToast("该功能在此模式下不可用",0);
            }
        }


    }



    /**
     * 电源关闭页的控制
     * @param obj
     */

    this.powerOffBack_click = function (obj) {
        isEditTime = Date.now();
        uiMethodObj.srv_btn(obj,"");
    }

    this.powerOffOpen_click = function (obj) {
        isEditTime = Date.now();
        valueDic.power = 1;
        nwBuffer = "{\"opt\":[\"power\"],\"p\":[" + Number(valueDic.power) + "],\"t\":\"cmd\"}";
        if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
        uiMethodObj.srv_btn(obj,valueDic.power);
    }

    /**
     * 故障界面上直接点击返回按钮就可以返回到设备列表页
     * @param obj
     */
    this.errorBack_click = function (obj) {
        uiMethodObj.srv_btn(obj,"");
    }

    /**
     * 运行时点击返回按钮，根据当前的状态来确定下一个动作是
     * 返回设备列表
     * 还是消失当前的mask
     *
     * 当前的是运行状态的话，就直接传入1
     *
     * @param obj
     */
    this.runBack_click = function (obj) {
        if (valueDic.runState == 1){
            uiMethodObj.srv_btn(obj,"1");
        }else {
            uiMethodObj.srv_btn(obj,"0");
        }
    }
    this.runPower_click = function (obj) {
        isEditTime = Date.now();
        valueDic.power = 0;
        nwBuffer = "{\"opt\":[\"power\"],\"p\":[" + Number(valueDic.power) + "],\"t\":\"cmd\"}";
        if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
        uiMethodObj.srv_btn(obj,valueDic.power);
    }
    this.runPause_click = function (obj) {
        if (Math.abs(valueDic.childLock) == 1){
            isEditTime = Date.now();
            valueDic.runState = !(valueDic.runState);
            nwBuffer = "{\"opt\":[\"runState\"],\"p\":[" + Number(valueDic.runState) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            uiMethodObj.srv_btn(obj,valueDic.runState);
        }else {
            if (IsDebug){
                console.log("请先关闭童锁");
            }else {
                console.log("请先关闭童锁");
                navigator.PluginInterface.showToast("请先关闭童锁",0);
            }
        }
    }
    /**
     * 主界面的点击事件
     * @param obj
     */
    this.mainBack_click = function (obj) {
        uiMethodObj.srv_btn(obj,"");
    }

    this.mainPower_click = function (obj) {
        if(g_functype == FuncType.Mode_Control){
            isEditTime = Date.now();
            valueDic.power = 0;
            nwBuffer = "{\"opt\":[\"power\"],\"p\":[" + Number(valueDic.power) + "],\"t\":\"cmd\"}";
            if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
            uiMethodObj.srv_btn(obj,valueDic.power);
        }

    }

    this.mainStart_click = function (obj) {
        isEditTime = Date.now();
        valueDic.runState = 1;
        nwBuffer = "{\"opt\":[\"runState\"],\"p\":[" + Number(valueDic.runState) + "],\"t\":\"cmd\"}";
        if(g_functype == FuncType.Mode_Control){callback(nwBuffer);};
        uiMethodObj.srv_btn(obj,valueDic.runState);
    }






    /**
     * 根据改变模式修改当前的页面
     * from 为0时来自于刷新
     * @param jsondate
     * @param from
     */
    function setMode(jsondate,from) {
        console.log("onChange:" + jsondate.washMode);
        switch (jsondate.washMode){
            case 1:
                //棉麻
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'},
                    {value: 60, display: '60'},
                    {value: 95, display: '95'}];

                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'},
                    {value: 1000, display: '1000'},
                    {value: 1200, display: '1200'},
                    {value: 1400, display: '1400'}];
                timeDef = 87;//1:27，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'},
                    {value: 35, display: '35'},
                    {value: 40, display: '40'},
                    {value: 45, display: '45'},
                    {value: 50, display: '50'},
                    {value: 55, display: '55'},
                    {value: 60, display: '60'}];
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                {value: 2, display: '2'},
                {value: 3, display: '3'},
                {value: 4, display: '4'},
                {value: 5, display: '5'},
                {value: 6, display: '6'},
                {value: 7, display: '7'},
                {value: 8, display: '8'}];

                if(from != 0){

                    valueDic.washTemp = 40;
                    valueDic.speed = 1000;
                    valueDic.adjustWash = 15;
                    valueDic.potch = 2;

                    valueDic.energySave = 1;
                    valueDic.preWash = 1;
                    valueDic.creaseRes = 1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }

                break;
            case 2:
                //混合
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'}];
                tempDef = 40;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'},
                    {value: 1000, display: '1000'},
                    {value: 1200, display: '1200'},
                    {value: 1400, display: '1400'}];
                speedDef = 1000;
                timeDef = 74;//1:14，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'},
                    {value: 35, display: '35'},
                    {value: 40, display: '40'},
                    {value: 45, display: '45'},
                    {value: 50, display: '50'}];
                adjustWashDef = 15;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'},
                    {value: 7, display: '7'},
                    {value: 8, display: '8'}];
                potchDef = 2;

                //此模式下这些不可控制，灰色

                if (from != 0){

                    valueDic.washTemp = 40;
                    valueDic.speed = 1000;
                    valueDic.adjustWash = 15;
                    valueDic.potch = 2;

                    valueDic.energySave = 1;
                    valueDic.preWash = 1;
                    valueDic.creaseRes = 1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }

                break;
            case 3:
                //牛仔
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'}];
                tempDef = 30;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'},
                    {value: 1000, display: '1000'},
                    {value: 1200, display: '1200'}];
                speedDef = 800;
                timeDef = 66;//1:06，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'}];
                adjustWashDef = 15;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'},
                    {value: 7, display: '7'},
                    {value: 8, display: '8'}];
                potchDef = 2;

                //此模式下这些不可控制，灰色
                //无烘干
                if (from != 0){

                    valueDic.washTemp = 30;
                    valueDic.speed = 800;
                    valueDic.adjustWash = 15;
                    valueDic.potch = 2;

                    valueDic.energySave = 1;
                    valueDic.preWash = 1;
                    valueDic.creaseRes = 1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }

                break;
            case 4:
                //大物
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'},
                    {value: 60, display: '60'}];
                tempDef = 40;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'},
                    {value: 1000, display: '1000'}];
                speedDef = 1000;
                timeDef = 72;//1:12，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'},
                    {value: 35, display: '35'},
                    {value: 40, display: '40'},
                    {value: 45, display: '45'},
                    {value: 50, display: '50'}];
                adjustWashDef = 5;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'},
                    {value: 7, display: '7'},
                    {value: 8, display: '8'}];
                potchDef = 3;

                //此模式下这些不可控制，灰色
                //无烘干
                if (from != 0){

                    valueDic.washTemp = 40;
                    valueDic.speed = 1000;
                    valueDic.adjustWash = 5;
                    valueDic.potch = 3;

                    valueDic.energySave = 1;
                    valueDic.preWash = 1;
                    valueDic.creaseRes = 1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }

                break;
            case 5:
                //内衣
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'}];
                tempDef = 30;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'}];
                speedDef = 600;
                timeDef = 52;//0:52，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'}];
                adjustWashDef = 15;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'}];
                potchDef = 2;

                //此模式下这些不可控制，灰色
                //无预洗，无防皱，无烘干,无夜间洗
                if (from != 0){

                    valueDic.washTemp = 30;
                    valueDic.speed = 600;
                    valueDic.adjustWash = 15;
                    valueDic.potch = 2;

                    valueDic.energySave = 1;
                    valueDic.preWash = -1;
                    valueDic.creaseRes = -1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = -1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }



                break;
            case 6:
                //运动服
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'}];
                tempDef = 30;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'}];
                speedDef = 800;
                timeDef = 71;//1:11，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'}];
                adjustWashDef = 15;//打开洗涤的默认时间
                //漂洗次数
                potchData = [
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'}];
                potchDef = 3;

                //此模式下这些不可控制，灰色
                //无预洗，无防皱，无烘干
                if (from != 0){

                    valueDic.washTemp = 30;
                    valueDic.speed = 800;
                    valueDic.adjustWash = 15;
                    valueDic.potch = 3;

                    valueDic.energySave = 1;
                    valueDic.preWash = -1;
                    valueDic.creaseRes = -1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }

                break;
            case 7:
                //筒清洁
                //温度数据与默认温度
                tempData = [{value: 60, display: '60'},
                    {value: 95, display: '95'}];
                tempDef = 95;
                //脱水转数与默认转数
                speedData = [{value: 1000, display: '1000'}];
                speedDef = 1000;
                timeDef = 132;//2:12，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'}];
                adjustWashDef = 5;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 3, display: '3'}];
                potchDef = 3;

                //此模式下这些不可控制，灰色
                //无节能，无预洗，无防皱，无免排水，无烘干,无夜间洗，无高水位
                if (from != 0){

                    valueDic.washTemp = 95;
                    valueDic.speed = 1000;
                    valueDic.adjustWash = 5;
                    valueDic.potch = 3;

                    valueDic.energySave = -1;
                    valueDic.preWash = -1;
                    valueDic.creaseRes = -1;
                    valueDic.noDrain = -1;
                    valueDic.nightWash = -1;
                    valueDic.highWater = -1;
                    valueDic.order = 1;
                }

                break;
            case 8:
                //漂洗+脱水
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'}];
                tempDef = 1;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'},
                    {value: 1000, display: '1000'},
                    {value: 1200, display: '1200'},
                    {value: 1400, display: '1400'}];
                speedDef = 1000;
                timeDef = 20;//0:20，默认模式时间
                //可调洗涤的时间
                //无洗涤
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'},
                    {value: 7, display: '7'},
                    {value: 8, display: '8'}];
                potchDef = 1;

                //此模式下这些不可控制，灰色
                //无节能，无预洗，无可调洗涤

                if (from != 0){

                    valueDic.washTemp = 1;
                    valueDic.speed = 1000;
                    valueDic.adjustWash = -1;
                    valueDic.potch = 1;

                    valueDic.energySave = -1;
                    valueDic.preWash = -1;
                    valueDic.creaseRes = 1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }


                break;
            case 9:
                //单脱水
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'}];
                tempDef = 1;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'},
                    {value: 1000, display: '1000'},
                    {value: 1200, display: '1200'},
                    {value: 1400, display: '1400'}];
                speedDef = 1000;
                timeDef = 13;//0:13，默认模式时间
                //可调洗涤的时间
                //无可调洗涤
                //漂洗次数
                //无漂洗次数

                //此模式下这些不可控制，灰色
                //无节能，无预洗，，无免排水，无可调洗涤，无漂洗,，无高水位

                if (from != 0){

                    valueDic.washTemp = 1;
                    valueDic.speed = 1000;
                    valueDic.adjustWash = -1;
                    valueDic.potch = -1;

                    valueDic.energySave = -1;
                    valueDic.preWash = -1;
                    valueDic.creaseRes = 1;
                    valueDic.noDrain = -1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = -1;
                    valueDic.order = 1;
                }

                break;
            case 10:
                //化纤
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'},
                    {value: 60, display: '60'}];
                tempDef = 40;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'},
                    {value: 1000, display: '1000'},
                    {value: 1200, display: '1200'}];
                speedDef = 1000;
                timeDef = 64;//1:04，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'},
                    {value: 35, display: '35'},
                    {value: 40, display: '40'},
                    {value: 45, display: '45'},
                    {value: 50, display: '50'}];
                adjustWashDef = 5;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'},
                    {value: 7, display: '7'},
                    {value: 8, display: '8'}];
                potchDef = 2;

                //功能都可选

                if (from != 0){

                    valueDic.washTemp = 40;
                    valueDic.speed = 800;
                    valueDic.adjustWash = 5;
                    valueDic.potch = 2;

                    valueDic.energySave = 1;
                    valueDic.preWash = 1;
                    valueDic.creaseRes = 1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }


                break;
            case 11:
                //衬衫
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'},
                    {value: 60, display: '60'}];
                tempDef = 40;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'}];
                speedDef = 800;
                timeDef = 68;//1:08，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'}];
                adjustWashDef = 5;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'},
                    {value: 7, display: '7'},
                    {value: 8, display: '8'}];
                potchDef = 2;

                //此模式下这些不可控制，灰色
                //无防皱
                if (from != 0){

                    valueDic.washTemp = 40;
                    valueDic.speed = 800;
                    valueDic.adjustWash = 5;
                    valueDic.potch = 2;

                    valueDic.energySave = 1;
                    valueDic.preWash = 1;
                    valueDic.creaseRes = -1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }

                break;
            case 12:
                //快洗
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'}];
                tempDef = 30;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'},
                    {value: 1000, display: '1000'},
                    {value: 1200, display: '1200'}];
                speedDef = 1000;
                timeDef = 15;//0:15，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'},
                    {value: 7, display: '7'},
                    {value: 8, display: '8'},
                    {value: 9, display: '9'},
                    {value: 10, display: '10'}];
                adjustWashDef = 1;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'},
                    {value: 5, display: '5'},
                    {value: 6, display: '6'},
                    {value: 7, display: '7'}];
                potchDef = 1;

                //此模式下这些不可控制，灰色
                //无节能，无预洗，无防皱，无高水位
                if (from != 0){

                    valueDic.washTemp = 30;
                    valueDic.speed = 1000;
                    valueDic.adjustWash = 1;
                    valueDic.potch = 1;

                    valueDic.energySave = -1;
                    valueDic.preWash = -1;
                    valueDic.creaseRes = -1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = -1;
                    valueDic.order = 1;
                }



                break;
            case 15:
                //羊毛
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'}];
                tempDef = 30;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'}];
                speedDef = 800;
                timeDef = 48;//0:48，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'}];
                adjustWashDef = 15;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 2, display: '2'},
                    {value: 3, display: '3'},
                    {value: 4, display: '4'}];
                potchDef = 2;

                //此模式下这些不可控制，灰色

                if (from != 0){

                    valueDic.washTemp = 30;
                    valueDic.speed = 800;
                    valueDic.adjustWash = 15;
                    valueDic.potch = 2;

                    valueDic.energySave = -1;
                    valueDic.preWash = -1;
                    valueDic.creaseRes = -1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = -1;
                    valueDic.order = 1;
                }
                break;
            case 16:
                //轻柔
                //温度数据与默认温度
                tempData = [{value: 1, display: '冷'},
                    {value: 20, display: '20'},
                    {value: 30, display: '30'},
                    {value: 40, display: '40'}];
                tempDef = 30;
                //脱水转数与默认转数
                speedData = [{value: 1, display: '0'},
                    {value: 400, display: '400'},
                    {value: 600, display: '600'},
                    {value: 800, display: '800'}];
                speedDef = 600;
                timeDef = 53;//0:53，默认模式时间
                //可调洗涤的时间
                adjustWashData = [{value: 5, display: '5'},
                    {value: 10, display: '10'},
                    {value: 15, display: '15'},
                    {value: 20, display: '20'},
                    {value: 25, display: '25'},
                    {value: 30, display: '30'}];
                adjustWashDef = 15;//打开洗涤的默认时间
                //漂洗次数
                potchData = [{value: 1, display: '1'},
                    {value: 2, display: '2'},
                    {value: 3, display: '3'}];
                potchDef = 2;

                //此模式下这些不可控制，灰色

                if (from != 0){

                    valueDic.washTemp = 30;
                    valueDic.speed = 600;
                    valueDic.adjustWash = 15;
                    valueDic.potch = 2;

                    valueDic.energySave = 1;
                    valueDic.preWash = 1;
                    valueDic.creaseRes = 1;
                    valueDic.noDrain = 1;
                    valueDic.nightWash = 1;
                    valueDic.highWater = 1;
                    valueDic.order = 1;
                }
                break;

            default:
                break;


        }
        if(from != 0){
            valueDic.timeLeft = timeDef;
        }

    }

    /**
     * 传入模式和是否防皱来确定当前的转速的范围和默认值
     * @param wMode
     * @param creaseRes
     * @param from 是否来之于刷新，0 来自于刷新  1  来自于控制(控制的话就应该是默认值)
     */
    function setSpeedByCre(wMode, creaseRes, from) {
        switch (wMode){
            case 1:
                if (creaseRes == -2 || creaseRes == 2 ){
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'}];
                    speedDef = 800;
                }else if(creaseRes == -1 || creaseRes == 1) {
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'},
                        {value: 1000, display: '1000'},
                        {value: 1200, display: '1200'},
                        {value: 1400, display: '1400'}];
                    speedDef = 1000;

                }
                break;
            case 2:
                if (creaseRes == -2 || creaseRes == 2 ){
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'}];
                    speedDef = 600;
                }else if(creaseRes == -1 || creaseRes == 1) {
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'},
                        {value: 1000, display: '1000'},
                        {value: 1200, display: '1200'},
                        {value: 1400, display: '1400'}];
                    speedDef = 1000;

                }
                break;
            case 3:
                if (creaseRes == -2 || creaseRes == 2 ){
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'}];
                    speedDef = 600;
                }else if(creaseRes == -1 || creaseRes == 1) {
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'},
                        {value: 1000, display: '1000'},
                        {value: 1200, display: '1200'}];
                    speedDef = 800;
                }

                break;
            case 4:
                if (creaseRes == -2 || creaseRes == 2 ){
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'}];
                    speedDef = 600;
                }else if(creaseRes == -1 || creaseRes == 1) {
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'},
                        {value: 1000, display: '1000'}];
                    speedDef = 1000;
                }
                break;
            case 8:
                if (creaseRes == -2 || creaseRes == 2 ){
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'}];
                    speedDef = 800;
                }else if(creaseRes == -1 || creaseRes == 1) {
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'},
                        {value: 1000, display: '1000'},
                        {value: 1200, display: '1200'},
                        {value: 1400, display: '1400'}];
                    speedDef = 1000;
                }
                break;
            case 9:
                if (creaseRes == -2 || creaseRes == 2 ){
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'}];
                    speedDef = 800;
                }else if(creaseRes == -1 || creaseRes == 1) {
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'},
                        {value: 1000, display: '1000'},
                        {value: 1200, display: '1200'},
                        {value: 1400, display: '1400'}];
                    speedDef = 1000;
                }
                break;
            case 10:
                if (creaseRes == -2 || creaseRes == 2 ){
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'}];
                    speedDef = 600;
                }else if(creaseRes == -1 || creaseRes == 1) {
                    //脱水转数与默认转数
                    speedData = [{value: 1, display: '0'},
                        {value: 400, display: '400'},
                        {value: 600, display: '600'},
                        {value: 800, display: '800'},
                        {value: 1000, display: '1000'},
                        {value: 1200, display: '1200'}];
                    speedDef = 800;
                }
                break;
            default:
                break;
        }
        if (from != 0){
            //需要判断当前的夜间洗是否打开
            valueDic.speed = speedDef;
        }else {
            speedDef = Math.abs(valueDic.speed);
        }
        //重置滑动
        //转数
        instance4.option({
            wheels: [
                [{
                    label: 'Second wheel',
                    data: speedData
                }]
            ]
        });
        instance4.setVal(speedDef);
        if (!touch4){
            instance4.hide();
        }

    }

    /**
     * 传入模式和是否夜间洗来确定当前的转速的默认值
     * @param wMode
     * @param nightWash
     */
    function setSpeedByNight(wMode, nightWash, creaseRes,from) {
        switch (wMode){

            case 1:
                //棉麻都涉及到防皱和夜间洗
                if (nightWash == -2 || nightWash == 2){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 800;
                    }else {
                        speedDef = 800;
                    }

                }else if (nightWash == -1 || nightWash == 1){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 800;
                    }else {
                        speedDef = 1000;
                    }
                }
                break;
            case 2:
                //混合两者可选
                if (nightWash == -2 || nightWash == 2){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 600;
                    }else {
                        speedDef = 600;
                    }
                }else if (nightWash == -1 || nightWash == 1){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 600;
                    }else {
                        speedDef = 1000;
                    }
                }
                break;
            case 3:
                if (nightWash == -2 || nightWash == 2){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 600;
                    }else {
                        speedDef = 600;
                    }
                }else if (nightWash == -1 || nightWash == 1){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 600;
                    }else {
                        speedDef = 800;
                    }
                }
                break;
            case 4:
                if (nightWash == -2 || nightWash == 2){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 600;
                    }else {
                        speedDef = 600;
                    }
                }else if (nightWash == -1 || nightWash == 1){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 600;
                    }else {
                        speedDef = 1000;
                    }
                }
                break;
            case 6:
                if (nightWash == -2 || nightWash == 2){
                    speedDef = 600;
                }else if (nightWash == -1 || nightWash == 1){
                    speedDef = 800;
                }
                break;
            case 8:
                if (nightWash == -2 || nightWash == 2){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 800;
                    }else {
                        speedDef = 800;
                    }
                }else if (nightWash == -1 || nightWash == 1){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 800;
                    }else {
                        speedDef = 1000;
                    }
                }
                break;
            case 9:
                if (nightWash == -2 || nightWash == 2){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 800;
                    }else {
                        speedDef = 800;
                    }
                }else if (nightWash == -1 || nightWash == 1){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 800;
                    }else {
                        speedDef = 1000;
                    }
                }
                break;
            case 10:
                if (nightWash == -2 || nightWash == 2){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 600;
                    }else {
                        speedDef = 600;
                    }
                }else if (nightWash == -1 || nightWash == 1){
                    if(Math.abs(creaseRes) ==2){
                        speedDef = 600;
                    }else {
                        speedDef = 800;
                    }
                }
                break;
            case 11:
                if (nightWash == -2 || nightWash == 2){
                    speedDef = 600;
                }else if (nightWash == -1 || nightWash == 1){
                    speedDef = 800;
                }
                break;
            case 12:
                if (nightWash == -2 || nightWash == 2){
                    speedDef = 800;
                }else if (nightWash == -1 || nightWash == 1){
                    speedDef = 1000;
                }
                break;
            case 15:
                if (nightWash == -2 || nightWash == 2){
                    speedDef = 600;
                }else if (nightWash == -1 || nightWash == 1){
                    speedDef = 800;
                }
                break;
            default:
                break;
        }

        if (from != 0){
            //修改夜间洗模式时，需要判断防皱是否打开了，假如防皱打开了就不去修改当前值
            valueDic.speed = speedDef;
        }else {
            speedDef = Math.abs(valueDic.speed);
        }
        //重置滑动
        //转数
        instance4.option({
            wheels: [
                [{
                    label: 'Second wheel',
                    data: speedData
                }]
            ]
        });
        instance4.setVal(speedDef);
        if (!touch4){
            instance4.hide();
        }
    }

    /**
     *
     * @param vMode
     * @param washTemp
     */
    function setAdWashByTemp(vMode, washTemp) {
        switch (vMode){
            case 1:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 40;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 35;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 60){
                    adjustWashDef = 10;
                }else if (Math.abs(washTemp) == 95){
                    adjustWashDef = 5;
                }
                break;
            case 2:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 40;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 35;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 60){

                }else if (Math.abs(washTemp) == 95){

                }
                break;
            case 3:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 30;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 60){

                }else if (Math.abs(washTemp) == 95){

                }
                break;
            case 4:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 30;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 60){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 95){

                }
                break;
            case 5:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 30;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 60){

                }else if (Math.abs(washTemp) == 95){

                }
                break;
            case 6:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 30;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 60){

                }else if (Math.abs(washTemp) == 95){

                }
                break;
            case 10:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 30;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 60){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 95){

                }
                break;
            case 11:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 30;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 60){
                    adjustWashDef = 5;
                }else if (Math.abs(washTemp) == 95){

                }
                break;
            case 12:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 10;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 3;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 1;
                }else if (Math.abs(washTemp) == 40){
                    adjustWashDef = 1;
                }else if (Math.abs(washTemp) == 60){

                }else if (Math.abs(washTemp) == 95){

                }
                break;
            case 15:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 30;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 40) {
                    adjustWashDef = 5;
                }
                break;
            case 16:
                if (Math.abs(washTemp) == 1){
                    adjustWashDef = 30;
                }else if (Math.abs(washTemp) == 20){
                    adjustWashDef = 25;
                }else if (Math.abs(washTemp) == 30){
                    adjustWashDef = 15;
                }else if (Math.abs(washTemp) == 40) {
                    adjustWashDef = 5;
                }
                break;
            default:
                break;
        }
        //重置滑动
        //洗涤时间
        instance1.option({
            wheels: [
                [{
                    label: 'Second wheel',
                    data: adjustWashData
                }]
            ]
        });
        instance1.setVal(adjustWashDef);
        if (!touch1){
            instance1.hide();
        }
    }

    /**
     * 根据时间生成预约的时间数组
     * @param timeLeft
     * @returns {Array}
     */
    function getOrderTime(timeLeft) {
        var hour = timeLeft / 60;
        if (hour == parseInt(hour)){
            hour = Math.ceil(timeLeft / 60) + 1;
        }else {
            hour = Math.ceil(timeLeft / 60);
        }

        var orderArr = [];
        if (hour != 0){
            var dataObj0 = new Object();
            dataObj0.value = 0;
            dataObj0.display = lang.orderCancel;
            orderArr.push(dataObj0);
        }
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

    /**
     * 冒泡处理几个滑动的事件
     */
    $("body").bind("click",function (event) {

            console.log("点击了body");

            if (touch1 && event.target.id != "pop_washText1"){
                touch1 = !touch1;
                instance1.hide();
            }
            if (touch2 && event.target.id != "pop_washText2"){
                touch2 = !touch2;
                instance2.hide();
            }
            if (touch3 && event.target.id != "pop_washText3"){
                touch3 = !touch3;
                instance3.hide();
            }
            if (touch4 && event.target.id != "pop_washText4"){
                touch4 = !touch4;
                instance4.hide();
            }

    });

    /**
     * 修改模式的时候隐藏touch
     */
    function disMissTouchPop() {
        if (touch1){
            touch1 = !touch1;
            instance1.hide();
        }
        if (touch2){
            touch2 = !touch2;
            instance2.hide();
        }
        if (touch3){
            touch3 = !touch3;
            instance3.hide();
        }
        if (touch4){
            touch4 = !touch4;
            instance4.hide();
        }
    }

}