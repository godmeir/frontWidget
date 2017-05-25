/**
 * Created by zyj on 2017/5/4.
 */
/*

 * 微信公共分享js脚本*/
$(function(){

    $.ajax({
        type:"GET",
        url:'https://www.saywash.com/saywash/WashCallApi/common/wxcheckAppController/wxAccessToken.api',
        // url:"http://wx.mrhi.cn/hlwxApp/wxcheckAppController/wxAccessToken.do",
        data:{"url":window.location.href.split("#")[0],"check":'HLWXCHKACES',"ssid":getTime()},
        dataType:"jsonp",
        jsonp:'outAccess',
        async:"false",
        success:function(data){
            console.log(data);
            if(data.retCode=="00000"){
                wx.config({
                    debug:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wx54f89e939f8503c3', // 必填，公众号的唯一标识
                    timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                    signature: data.data.signature,// 必填，签名，见附录1
                    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'onMenuShareAppMessage',			//微信好友
                        'onMenuShareTimeline',				//微信朋友圈
                        'onMenuShareQZone',					//分享到qq空间
                        'onMenuShareQQ'						//分享到qq
                    ]
                });

                wx.ready(function(){
                    wx.onMenuShareAppMessage({	//微信好友
                        title:'智能洗衣超省力,爸妈再也不用担心我洗衣物啦!',							//分享标题
                        desc:'智能洗衣超省力,爸妈再也不用担心我洗衣物啦!',								//分享描述
                        link:'http://www.saywash.com/saywash/WashCallWx/page/index.html',				//分享链接
                        imgUrl:'http://www.saywash.com/saywash/WashCallWx/images/shareLogo.jpg',			//分享图片
                        success: function (res) {
                            alert('已分享');
                        },
                        cancel: function (res) {
                            alert('已取消');
                        }
                    });

                    wx.onMenuShareTimeline({ //朋友圈
                        title:'智能洗衣超省力,爸妈再也不用担心我洗衣物啦!',							//分享标题
                        desc:'智能洗衣超省力,爸妈再也不用担心我洗衣物啦!',								//分享描述
                        link:'http://www.saywash.com/saywash/WashCallWx/page/index.html',				//分享链接
                        imgUrl:'http://www.saywash.com/saywash/WashCallWx/images/shareLogo.jpg', 	// 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            alert('已分享');
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert('已取消');
                        }
                    });

                    wx.onMenuShareQZone({	//分享qq空间
                        title:'智能洗衣超省力,爸妈再也不用担心我洗衣物啦!',							//分享标题
                        desc:'智能洗衣超省力,爸妈再也不用担心我洗衣物啦!',								//分享描述
                        link:'http://www.saywash.com/saywash/WashCallWx/page/index.html',				//分享链接
                        imgUrl:'http://www.saywash.com/saywash/WashCallWx/images/shareLogo.jpg', 				// 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            alert('已分享');
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert('已取消');
                        }
                    });

                    wx.onMenuShareQQ({	//分享qq
                        title:'智能洗衣超省力,爸妈再也不用担心我洗衣物啦!',							//分享标题
                        desc:'智能洗衣超省力,爸妈再也不用担心我洗衣物啦!',								//分享描述
                        link:'http://www.saywash.com/saywash/WashCallWx/page/index.html',				//分享链接
                        imgUrl:'http://www.saywash.com/saywash/WashCallWx/images/shareLogo.jpg', 				// 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            alert('已分享');
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert('已取消');
                        }
                    });
                });
            }
        }
    });


});