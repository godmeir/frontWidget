/*
 * author：XianJunHe
 * date：2016/8/15
 * description：主控 控制入口 初始化等操作
 */
	var g_mac="";//设备MAC地址
	var searchJson="";//查询的状态详细字段
	var g_functype=0;//集中控制还是普通控制
	var data="";//初始传值
	
	var deviceInfo;//getInfo获取回来的对象
	
	//当前选择值
	var g_CurrentMode;
	var g_CurrentMode_txt;
	var g_CurrentFan;
	var g_CurrentFan_txt;
	var g_CurrentTemp=16;
	
	
	
	var fadeOutTime=1000;//滑动后其它选择消失时间	
	var fanManager;//风速控件
	var modeManager;//模式控件
	var tempManager;//温度控件
	var btnManager;//所有按钮事件管理
	
	var FuncType={
		Mode_Control:"0",//普通控制
		Mode_Center_Control:"1"//集中控制页
	}

	//风速定义
	var FanMode={
		auto:0,
		low:1,
		medium_low:2,
		medium:3,
		medium_high:4,
		high:5,
		turbo:6,
		quiet:7
	}
	//模式定义
	var ACMode={
		cool:1,
		auto:0,
		heat:4,
		fan:3,
		dry:2,
		energy:5		
	}
	
	//定义温度单位
	var TemUn={C:0,F:1};

	var DataObject={
		"Pow":0,"Mod":0,"TemUn":0,"SetTem":0,"TemRec":0,
		"HeatCoolType":0,"WdSpd":0,"Tur":0,"Quiet":0,"SwUpDn":0,
		"SwingLfRig":0,"Air":0,"Blo":0,"Health":0,"SvSt":0,
		"Lig":0,"StHt":0,"SwhSlp":0
	}
	
	//根据QueryString参数名称获取值
	function getQueryStringByName(name){
		var href=decodeURI(location.href);//转义
		 var result = href.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
		 if(result == null || result.length < 1){
			 return "";
		 }
		 return result[1];
	}
	
	//解析url初始值
	function parseUrlData()
	{		
		g_mac=getQueryStringByName("mac");
		g_functype=getQueryStringByName("functype");
		data=getQueryStringByName("data");	
		//setTimeout(loadData,500);
		setTimeout(loadTestData,500);
		
	}

//需要等原生js加载完，触发init.js 会加载	
	function loadData(){
		console.log("loadData");
		 navigator.PluginInterface.getInfo(g_mac,loadDataFinish);
	}
	
	function loadDataFinish(jsonData){
			deviceInfo=JSON.parse(jsonData); 
			/*参数1: fullstatueJson   (config.xml对应值)
			参数2: lock   (设备是否锁定)
			参数3:lang  (系统语言)
			参数4：name(设备名称)
			*/
			if(data==""){
				//集中控制使用默认值
				data="[1.0,1.0,0.0,16.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]";
			}				
			//加载语言
			if(deviceInfo.lang=="zh_CN"){
				$.getScript('./js/lang/zh_CN.js',function(){	
					init(data);	
				});
			}
			else
			{
				$.getScript('./js/lang/en.js',function(){
					init(data);	
				});
			}
			setTimeout(function(){
				$("#loading").hide();
			},1000);
	}
	
	function loadTestData(){
			if(data==""){
				//集中控制使用默认值
				data="[1.0,1.0,0.0,16.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]";
			}				
			//加载语言		
			$.getScript('./js/lang/en.js',function(){
				init(data);	
			});
			
			setTimeout(function(){
				$("#loading").hide();
			},2000);
	}
	

	
	//解析statue data数据
	function parseStates(data)
	{
		if(data!=""){		
			try{
				var obj=JSON.parse(data);
				DataObject.Pow=parseInt(obj[0]);
				g_CurrentMode=DataObject.Mod=parseInt(obj[1]);
				DataObject.TemUn=parseInt(obj[2]);
				DataObject.SetTem=parseInt(obj[3]);
				DataObject.TemRec=parseInt(obj[4]);
				DataObject.HeatCoolType=parseInt(obj[5]);
				DataObject.WdSpd=parseInt(obj[6]);
				DataObject.Tur=parseInt(obj[7]);
				DataObject.Quiet=parseInt(obj[8]);
				DataObject.SwUpDn=parseInt(obj[9]);
				DataObject.SwingLfRig=parseInt(obj[10]);
				DataObject.Air=parseInt(obj[11]);
				DataObject.Blo=parseInt(obj[12]);
				DataObject.Health=parseInt(obj[13]);
				DataObject.SvSt=parseInt(obj[14]);
				DataObject.Lig=parseInt(obj[15]);
				DataObject.StHt=parseInt(obj[16]);
				DataObject.SwhSlp=parseInt(obj[17]);	
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
	
	//初始化赋值
	function init(data)
	{		
		if(g_functype==FuncType.Mode_Control){
			// fanManager=new fanWidget(changCallback);	
			// modeManager=new modeWidget(changCallback);
			// tempManager =new tempWidget(changCallback);
			btnManager=new buttonWidget(changCallback);
		}else{
			//集中控制不需要回调，直接修改DataObject对象 Save的时候再处理
			// fanManager=new fanWidget();	
			// modeManager=new modeWidget();
			// tempManager =new tempWidget();
			btnManager=new buttonWidget();
		}
			// fanManager.init_Fan();
			// modeManager.init_Mode();
			// tempManager.init_Temp();
			
			//解析后得到最新DataObject
			parseStates(data);	
			
			//设置风速值
			// if(DataObject.Tur==1){
			// 	fanManager.setFanMode(FanMode.turbo);
			// }else if(DataObject.Quiet==1){
			// 	fanManager.setFanMode(FanMode.quiet);
			// }
			// else{
			// 	fanManager.setFanMode(DataObject.WdSpd);	
			// }
			// //设置模式 	
			// modeManager.setMode(DataObject.Mod);
			// //温度
			// tempManager.setTemp(DataObject.TemUn,DataObject.SetTem,DataObject.TemRec);
			//状态按钮赋值
			btnManager.init_Btn(DataObject.Air,DataObject.Blo,DataObject.Health,DataObject.Lig,
			DataObject.SvSt,DataObject.SwUpDn,DataObject.SwingLfRig,DataObject.StHt,DataObject.SwhSlp,DataObject.Pow);
			
			// if(g_functype==FuncType.Mode_Control){
			// 	$("#btnSave").hide();
			// 	$("#btnClose").show();
			// 	//启动定时10秒获取一次状态
			// 	//setInterval(_timerGetStates,10000);
			// }else{
			// 	$("#btnSave").show();
			// 	$("#btnClose").hide();
			// 	$("#btnSave").text(lang.btnSave);
			// 	$("#btnSave").click(function(){
			// 		Save();
			// 	});
			// }
	}
	
	//值改变回调 发送给设备
	function changCallback(jsonData){		
		console.log("jsonData:"+jsonData);
		try{			
				navigator.PluginInterface.sendDataToDevice(g_mac,jsonData,callback);		
		}catch(e){
			console.log("e:"+e);			
		}
	}
	
	//定时获取状态
	function _timerGetStates(){
		console.log("定时");
		try{
			 navigator.PluginInterface.sendDataToDevice(g_mac,searchJson,callback);
		}catch(e){
			console.log("e:"+e);			
		}
	}
	
	function callback(result){
		console.log("result:"+result);				 
	};

	//集中控制返回结果
	function Save(){
		//var str=JSON.stringify(DataObject);
		var dat=getDat();
		
		var jsonData = "{\"opt\":[\"Pow\",\"Mod\",\"TemUn\",\"SetTem\",\"TemRec\",";
		jsonData+="\"HeatCoolType\",\"WdSpd\",\"Tur\",\"Quiet\",\"SwUpDn\",";
		jsonData+="\"SwingLfRig\",\"Air\",\"Blo\",\"Health\",\"SvSt\",";
		jsonData+="\"Lig\",\"StHt\",\"SwhSlp\"],\"p\":"+dat+",\"t\":\"cmd\"}";
		console.log(jsonData);
		
		var remarks=getRemarks();
		console.log(remarks);
		navigator.PluginInterface.getCCcmd(g_mac,jsonData,remarks);	
		
	}
	
	function getDat(){
		var arrs=[];
		arrs.push(DataObject.Pow);
		arrs.push(DataObject.Mod);
		arrs.push(DataObject.TemUn);
		arrs.push(DataObject.SetTem);
		arrs.push(DataObject.TemRec);
		arrs.push(DataObject.HeatCoolType);
		arrs.push(DataObject.WdSpd);
		arrs.push(DataObject.Tur);
		arrs.push(DataObject.Quiet);
		arrs.push(DataObject.SwUpDn);
		arrs.push(DataObject.SwingLfRig);
		arrs.push(DataObject.Air);
		arrs.push(DataObject.Blo);
		arrs.push(DataObject.Health);
		arrs.push(DataObject.SvSt);
		arrs.push(DataObject.Lig);
		arrs.push(DataObject.StHt);
		arrs.push(DataObject.SwhSlp);
		return JSON.stringify(arrs);		
		
	}
	
	function getRemarks(){
		var remarks=g_CurrentMode_txt+" ";//模式显示
		remarks+=$("#temp_"+g_CurrentTemp).text() + (DataObject.TemUn==TemUn.C?"℃":"℉")+" ";//温度显示
		remarks+=g_CurrentFan_txt+" ";//风速显示
		remarks+="..."
		return remarks;
	}

		
    window.addEventListener( 'DOMContentLoaded', parseUrlData, false);