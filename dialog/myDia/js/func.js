/*
 * author：XianJunHe
 * date：2016/8/15
 * description：页面按钮 包括高级状态栏处理 标题的按钮
 */
function buttonWidget(callback){
		
	//开关
	var pow=0;
	
	/**高级状态*/
	var advance_air=0;
	var advance_dry=0;
	var advance_health=0;
	var advance_light=0;
	var advance_se=0;
	var advance_updown=0;
	var advance_leftright=0;
	var advance_8heat=0;
	var advance_sleep=0;
	
	//按钮枚举
	var FuncEnum={
		Air:0,
		Dry:1,
		Health:2,
		Light:3,
		SE:4,
		UD:5,
		LR:6,
		_8Heat:7,
		Sleep:8,
		PowOn:9,
		PowOff:10
	}
	
	this.init_Btn=function(air,dry,health,light,se,updown,leftright,_8heat,sleep,_pow){
		pow=_pow;
		
		advance_air=air;
		advance_dry=dry;
		advance_health=health;
		advance_light=light;
		advance_se=se;
		advance_updown=updown;
		advance_leftright=leftright;
		advance_8heat=_8heat;
		advance_sleep=sleep;
		
		
		$("#txtAir").text(lang.advance_air);
		$("#txtDry").text(lang.advance_dry);
		$("#txtHealth").text(lang.advance_health);
		$("#txtLight").text(lang.advance_light);
		$("#txtSE").text(lang.advance_se);
		$("#txtUR").text(lang.advance_updown);
		$("#txtLD").text(lang.advance_leftright);
		$("#txtTimer").text(lang.advance_timer);
		$("#txt8heat").text(lang.advance_8heat);
		$("#txtSleep").text(lang.advance_sleep);
		
		$("#txtFunc").text(lang.btnFunc);
		$("#txtVoice").text(lang.btnVoice);
		
		//编辑按钮
		var txtEdit=$("#txtEdit");
		console.log(deviceInfo);
		if(deviceInfo==undefined){
			txtEdit.text("Dingner Room");	
		}else{
			txtEdit.text(deviceInfo.name);	
		}
	
		txtEdit.click(function()
		{
			 navigator.PluginInterface.editDevice(g_mac);
		});
		//返回按钮
		var btnBack=$("#btnBack");
		btnBack.click(function()
		{
				 navigator.PluginInterface.closePage();
		});
		//预约按钮
		var btnTimer=$("#imgTimer");
		btnTimer.click(function()
		{
				 navigator.PluginInterface.timerListDevice(g_mac);
		});
		
		//换气
		var btnAir=$("#imgAir");
		if(0==advance_air){
			btnAir[0].src="img/3.png";
			$("#modeAir").hide();
		}else{
			btnAir[0].src="img/13.png";
			$("#modeAir").show();
		}	
		btnAir.click(function(){
			if(0==advance_air){
				advance_air=1;
				btnAir[0].src="img/13.png";
				$("#modeAir").show();
			}else{
				advance_air=0;
				btnAir[0].src="img/3.png";
				$("#modeAir").hide();
			}
			//关闭遮罩
			//$("#mask").trigger("click");	
			SendToDevice(FuncEnum.Air);
		});
		
		//干燥
		var btnDry=$("#imgDry");
		if(0==advance_dry){
			btnDry[0].src="img/2.png";
			$("#modeDry").hide();
		}else{
			btnDry[0].src="img/12.png";
			$("#modeDry").show();
		}
		btnDry.click(function(){
			if(0==advance_dry){
				advance_dry=1;
				btnDry[0].src="img/12.png";
				$("#modeDry").show();
			}else{
				advance_dry=0;
				btnDry[0].src="img/2.png";
				$("#modeDry").hide();
			}
			//关闭遮罩
			//$("#mask").trigger("click");	
			SendToDevice(FuncEnum.Dry);
		});
		
		//健康
		var btnHealth=$("#imgHealth");
		if(0==advance_health){
			btnHealth[0].src="img/4.png";
			$("#modeHealth").hide();
		}else{
			btnHealth[0].src="img/14.png";
			$("#modeHealth").show();
		}
		btnHealth.click(function(){
			if(0==advance_health){
				advance_health=1;
				btnHealth[0].src="img/14.png";
				$("#modeHealth").show();
			}else{
				advance_health=0;
				btnHealth[0].src="img/4.png";
				$("#modeHealth").hide();
			}
			//关闭遮罩
			//$("#mask").trigger("click");
			SendToDevice(FuncEnum.Health);			
		});
		
		//灯光
		var btnLight=$("#imgLight");
		if(0==advance_light){
			btnLight[0].src="img/1.png";
			$("#modelight").hide();
		}else{
			btnLight[0].src="img/11.png";
			$("#modelight").show();
		}
		btnLight.click(function(){
			if(0==advance_light){
				advance_light=1;
				btnLight[0].src="img/11.png";
				$("#modelight").show();
			}else{
				advance_light=0;
				btnLight[0].src="img/1.png";
				$("#modelight").hide();
			}
			//关闭遮罩
			//$("#mask").trigger("click");	
			SendToDevice(FuncEnum.Light);	
		});
		
		// //节能
		// var btnSE=$("#imgSE");
		// if(0==advance_se){
		// 	btnSE[0].src="img/5.png";
		// 	$("#modeSE").hide();
		// }else{
		// 	btnSE[0].src="img/15.png";
		// 	$("#modeSE").show();
		// }
		// btnSE.click(function(){
		// 	if(0==advance_se){
		// 		advance_se=1;
		// 		btnSE[0].src="img/15.png";
		// 		$("#modeSE").show();
		// 	}else{
		// 		advance_se=0;
		// 		btnSE[0].src="img/5.png";
		// 		$("#modeSE").hide();
		// 	}
		// 	//关闭遮罩
		// 	//$("#mask").trigger("click");
		// 	SendToDevice(FuncEnum.SE);	
		// });
		
		// //上下扫风
		// var btnUD=$("#imgUR");
		// if(0==advance_updown){
		// 	btnUD[0].src="img/6.png";
		// 	$("#modeupdown").hide();
		// }else{
		// 	btnUD[0].src="img/16.png";
		// 	$("#modeupdown").show();
		// }
		// btnUD.click(function(){
		// 	if(0==advance_updown){
		// 		advance_updown=1;
		// 		btnUD[0].src="img/16.png";
		// 		$("#modeupdown").show();
		// 	}else{
		// 		advance_updown=0;
		// 		btnUD[0].src="img/6.png";
		// 		$("#modeupdown").hide();
		// 	}
		// 	//关闭遮罩
		// 	//$("#mask").trigger("click");
		// 	SendToDevice(FuncEnum.UD);	
		// });
		// //左右扫风
		// var btnLD=$("#imgLD");
		// if(0==advance_leftright){
		// 	btnLD[0].src="img/8.png";
		// 	$("#modelr").hide();
		// }else{
		// 	btnLD[0].src="img/18.png";
		// 	$("#modelr").show();
		// }
		// btnLD.click(function(){
		// 	if(0==advance_leftright){
		// 		advance_leftright=1;
		// 		btnLD[0].src="img/18.png";
		// 		$("#modelr").show();
		// 	}else{
		// 		advance_leftright=0;
		// 		btnLD[0].src="img/8.png";
		// 		$("#modelr").hide();
		// 	}
		// 	//关闭遮罩
		// 	//$("#mask").trigger("click");	
		// 	SendToDevice(FuncEnum.LR);	
		// });
		
		// //8制热
		// var img8heat=$("#img8heat");
		// if(0==advance_8heat){
		// 	img8heat[0].src="img/advance_n_8heat.png";
		// 	$("#mode8heat").hide();
		// }else{
		// 	img8heat[0].src="img/advance_s_8heat.png";
		// 	$("#mode8heat").show();
		// }
		// img8heat.click(function(){
		// 	if(0==advance_8heat){
		// 		advance_8heat=1;
		// 		img8heat[0].src="img/advance_s_8heat.png";
		// 		$("#mode8heat").show();
		// 	}else{
		// 		advance_8heat=0;
		// 		img8heat[0].src="img/advance_n_8heat.png";
		// 		$("#mode8heat").hide();
		// 	}
		// 	//关闭遮罩
		// 	//$("#mask").trigger("click");	
		// 	SendToDevice(FuncEnum._8Heat);	
		// });
		
		// //8睡眠
		// var imgSleep=$("#imgSleep");
		// if(0==advance_sleep){
		// 	imgSleep[0].src="img/advance_n_sleep.png";
		// 	$("#modeSleep").hide();
		// }else{
		// 	imgSleep[0].src="img/advance_s_sleep.png";
		// 	$("#modeSleep").show();
		// }
		// imgSleep.click(function(){
		// 	if(0==advance_sleep){
		// 		advance_sleep=1;
		// 		imgSleep[0].src="img/advance_s_sleep.png";
		// 		$("#modeSleep").show();
		// 	}else{
		// 		advance_sleep=0;
		// 		imgSleep[0].src="img/advance_n_sleep.png";
		// 		$("#modeSleep").hide();
		// 	}
		// 	//关闭遮罩
		// 	//$("#mask").trigger("click");	
		// 	SendToDevice(FuncEnum.Sleep);	
		// });
		
		
		if(pow==0){
			$("#maskpoweroff").show();
			$("#btnmaskpoweroff").show();	
			$("#bodyAll").addClass("frosted-glass");
		}else{
			$("#maskpoweroff").hide();
			$("#btnmaskpoweroff").hide();	
			$("#bodyAll").removeClass("frosted-glass");
		}
	
		//关机
		var	btnClose=$("#btnClose");
		btnClose.click(function(){
			pow=0;
			$("#maskpoweroff").show();
			$("#btnmaskpoweroff").show();	
			$("#bodyAll").addClass("frosted-glass");
			SendToDevice(FuncEnum.PowOff);	
		});
		
		//开机
		var	btnOpen=$("#btnmaskpoweroff");
		btnOpen.click(function(){
			pow=1;
			$("#maskpoweroff").hide();
			$("#btnmaskpoweroff").hide();	
			$("#bodyAll").removeClass("frosted-glass");
			SendToDevice(FuncEnum.PowOn);	
		});
	}

	function SendToDevice(ft){
		var jsonData;
		switch(ft){
			case FuncEnum.Air:
				jsonData = "{\"opt\":[\"Air\"],\"p\":[" + advance_air + "],\"t\":\"cmd\"}";
				DataObject.Air=advance_air;
			break;
			case FuncEnum.Dry:
				jsonData = "{\"opt\":[\"Blo\"],\"p\":[" + advance_dry + "],\"t\":\"cmd\"}";
				DataObject.Dry=advance_dry;
			break;
			case FuncEnum.Health:
				jsonData = "{\"opt\":[\"Health\"],\"p\":[" + advance_health + "],\"t\":\"cmd\"}";
				DataObject.Health=advance_health;
			break;
			case FuncEnum.Light:
				jsonData = "{\"opt\":[\"Lig\"],\"p\":[" + advance_light + "],\"t\":\"cmd\"}";
				DataObject.Lig=advance_light;
			break;
			case FuncEnum.SE:
				jsonData = "{\"opt\":[\"SvSt\"],\"p\":[" + advance_se + "],\"t\":\"cmd\"}";
				DataObject.SvSt=advance_se;
			break;
			case FuncEnum.UD:
				jsonData = "{\"opt\":[\"SwUpDn\"],\"p\":[" + advance_updown + "],\"t\":\"cmd\"}";
				DataObject.SwUpDn=advance_updown;
			break;
			case FuncEnum.LR:
				jsonData = "{\"opt\":[\"SwingLfRig\"],\"p\":[" + advance_leftright + "],\"t\":\"cmd\"}";
				DataObject.SwingLfRig=advance_leftright;
			break;
			case FuncEnum._8Heat:
				jsonData = "{\"opt\":[\"StHt\"],\"p\":[" + advance_8heat + "],\"t\":\"cmd\"}";
				DataObject.StHt=advance_8heat;
			break;
			/**
			"SwhSlp和SlpMod必须组合使用
			无睡眠时SwhSlp和SlpMod必须都为0，
			
			SwhSlp	睡眠	number	1：开；0：关；	1、0				
			一种睡眠机型：whSlp和SlpMod都为1
			多种睡眠曲线：
			睡眠1：SwhSlp为1和SlpMod为1
			睡眠2：SwhSlp为1和SlpMod为2
			睡眠3：SwhSlp为1和SlpMod为3
			睡眠4：SwhSlp为1和SlpMod为4"
			SlpMod	睡眠模式	number	"0：睡眠关；
			1：睡眠模式1；
			2：睡眠模式2；
			3：睡眠模式3；
			4：睡眠模式4"	0、1、2、3、4	

			*/
			case FuncEnum.Sleep:
				jsonData = "{\"opt\":[\"SwhSlp\",\"SlpMod\"],\"p\":[" + advance_sleep + "," + advance_sleep + "],\"t\":\"cmd\"}";
				DataObject.SwhSlp=advance_sleep;
				DataObject.SlpMod=advance_sleep;
			break;
			case FuncEnum.PowOn:
				jsonData = "{\"opt\":[\"Pow\"],\"p\":[" + pow + "],\"t\":\"cmd\"}"
				DataObject.Pow=pow;
			break;
			case FuncEnum.PowOff:
				jsonData = "{\"opt\":[\"Pow\"],\"p\":[" + pow + "],\"t\":\"cmd\"}"
				DataObject.Pow=pow;
			break;
		}
		//集中控制不回调，直接修改全局DataObject
		if(g_functype==FuncType.Mode_Control){
			callback(jsonData);
		}
	}
}
/*************************************************************************************************/

(function() {
	var triggerBttn = document.getElementById( 'trigger-overlay' ),
		overlay = document.querySelector( 'div.overlay' ),
		closeBttn = overlay.querySelector( 'div.overlay-close' );
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions };

	function toggleOverlay() {
		if( classie.has( overlay, 'open' ) ) {
			classie.remove( overlay, 'open' );
			classie.add( overlay, 'close' );
			var onEndTransitionFn = function( ev ) {
				if( support.transitions ) {
					if( ev.propertyName !== 'visibility' ) return;
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}
				classie.remove( overlay, 'close' );
			};
			if( support.transitions ) {
				overlay.addEventListener( transEndEventName, onEndTransitionFn );
			}
			else {
				onEndTransitionFn();
			}
			$("#mask").hide();
		}
		else if( !classie.has( overlay, 'close' ) ) {
			classie.add( overlay, 'open' );
			$("#mask").show();
		}
	}

	triggerBttn.addEventListener( 'click', toggleOverlay );
	closeBttn.addEventListener( 'click', toggleOverlay );
	
	var mask=document.getElementById( 'mask' );
		mask.addEventListener( 'click', toggleOverlay );
})();


/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );
