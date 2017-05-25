/**
 * Created by zyj on 2017/4/27.
 */
document.write("<script language='javascript' src='../../public/js/des.js'></script>");
function getTime(){
    var getDate = 'saywash#'+(new Date()).valueOf();
    return strEnc(getDate,'hlF#$1x)','hlG#$2x)','hlH#$3x)');
}
//获取url的参数
function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 			//构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  				//匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; 				//返回参数值
}
//公共分享
function getshareLink(){												//微信分享链接
    return "http://www.saywash.com/saywash/WashCallWx/page/index.html";
}
function getshareImg(){													//分享图片
    return "http://www.saywash.com/saywash/WashCallWx/images/shareLogo.jpg";
}
function getshareTittle(){												//分享标题
    return "智能洗衣超省力,爸妈再也不用担心我洗衣物啦!";
}
function getshareDesc(){												//分享描述
    return "智能洗衣超省力,爸妈再也不用担心我洗衣物啦!";
}
//地址接口
function getDataUrl(){													//洗衣请求接口路径
    return 'https://www.saywash.com/saywash/WashCallApi';
    //return 'http://203.187.186.136:40000/saywashnew/WashCallApi';
}
function getWashUrl(){													//上门接口地址
    return 'https://www.saywash.com/saywash/WashCallApi';
    //return 'http://203.187.186.136:40000/saywashnew/WashCallApi';
}
function getpayUrl(){													//微信洗衣跳转路径
    return "http://www.saywash.com/saywash/WashCallWx/page/payDetails.html";
    //return "http://www.saywash.com/saywash/WashCallWxtest/page/payDetails.html";
}
function walletpayUrl(){												//钱包充值跳转路径
    return "http://www.saywash.com/saywash/WashCallWx/page/walletCharge.html";
    //return "http://www.saywash.com/saywash/WashCallWxtest/page/walletCharge.html";
}
function getFurl(){														//上门支付跳转路径
    return "http://www.saywash.com/saywash/WashCallWx/page/sv_paydetail.html";
    //return "http://www.saywash.com/saywash/WashCallWxtest/page/sv_paydetail.html";
}

function getMarketUrl(){												//暂无用
    return 'http://192.168.1.249:8088/MarketApi';
}
function getWxShareUrl(){												//微信SDK接口
    //return "http://wx.mrhi.cn/hlwxApp/wxcheckAppController/wxAccessToken.do";
    return "https://www.saywash.com/saywash/WashCallApi/common/wxcheckAppController/wxAccessToken.api";
}
