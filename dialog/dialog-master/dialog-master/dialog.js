/*! dialog  v1.0.3
* author:tianxiangbing email:55342775@qq.com
* demo:http://www.lovewebgames.com/jsmodule/dialog.html 
* git:https://github.com/tianxiangbing/dialog  2017-02-04 */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],b):"object"==typeof exports?module.exports=b():a.Dialog=b(jQuery)}(this,function(a){a.fn.Dialog=function(c){var d=[];return a(this).each(function(){var e=new b,f=a.extend({trigger:a(this)},c);e.init(f),d.push(e)}),d},a.Dialog=function(c){if("alert"===c.type){var d=new b,e='<div class="ui-alert-title">'+c.content+"</div>",f="",g="ui-alert";c.button?("boolean"==typeof c.button&&(c.button="确定"),f='<p class="ui-dialog-action"><button class="ui-alert-submit  js-dialog-close">'+c.button+"</button></p>"):c.timer||(g+=" ui-alert-tip"),e+=f;var h=a.extend({target:e,animate:!0,show:!0,mask:!0,className:g,afterHide:function(a){this.dispose(),c.callback&&c.callback()}},c);d.init(h),c.timer&&setTimeout(function(){d.dispose(),c.callback&&c.callback()},c.timer),d.touch(d.mask,function(){d.hide(),c.callback&&c.callback()})}if("confirm"===c.type){var i=new b,e='<div class="ui-confirm-title">'+c.content+"</div>",f="";c.buttons||(c.buttons=[{yes:"确定"},{no:"取消"}]);for(var j="",k=0,l=c.buttons.length;k<l;k++){var m=c.buttons[k];m.yes&&(j+='<td><button class="ui-confirm-submit " data-type="yes">'+m.yes+"</button></td>"),m.no&&(j+='<td><button class="ui-confirm-no" data-type="no">'+m.no+"</button></td>"),m.close&&(j+='<td><button class="ui-confirm-close js-dialog-close" data-type="close">'+m.close+"</button></td>")}f='<table class="ui-dialog-action"><tr>'+j+"</tr></table>","bottom"==c.position?e=f+e:e+=f;var n=a.extend({target:e,animate:!0,show:!0,fixed:!0,mask:!0,className:"ui-alert",afterHide:function(a){this.dispose()},beforeShow:function(b){i.touch(a(".ui-confirm-submit",b),function(){c.callback&&c.callback.call(i,"yes",b)}),i.touch(a(".ui-confirm-no",b),function(){c.callback&&c.callback.call(i,"no",b)}),i.touch(a(".ui-confirm-close",b),function(){c.callback&&c.callback.call(i,"close",b)})}},c);i.init(n)}},a.alert=function(b,c,d,e,f){var g={},h={zIndex:100,type:"alert"};g="object"==typeof b?a.extend(h,b):a.extend(h,{content:b,button:c,timer:e,callback:d,width:283,height:"auto"}),a.Dialog(a.extend(g,f))},a.confirm=function(b,c,d,e){var f={},g={zIndex:100,type:"confirm"};f="object"==typeof b?a.extend(g,b):a.extend(g,{content:b,buttons:c,width:283,callback:d}),a.Dialog(a.extend(f,e))};var b=function(){var b=Math.random().toString().replace(".","");this.id="dialog_"+b,this.settings={},this.settings.closeTpl=a('<span class="ui-dialog-close js-dialog-close">x</span>'),this.settings.titleTpl=a('<div class="ui-dialog-title"></div>'),this.timer=null,this.showed=!1,this.mask=a()};return b.prototype={init:function(b){this.settings=a.extend({fixed:!1},this.settings,b),this.settings.mask&&(this.mask=a('<div class="ui-dialog-mask"/>'),a("body").append(this.mask)),a("body").append('<div class="ui-dialog" id="'+this.id+'"></div>'),this.dialogContainer=a("#"+this.id);var c=this.settings.zIndex||10;this.dialogContainer.css({zIndex:c}),this.settings.className&&this.dialogContainer.addClass(this.settings.className),this.mask.css({zIndex:c-1}),this.settings.closeTpl&&this.dialogContainer.append(this.settings.closeTpl),this.settings.title&&(this.dialogContainer.append(this.settings.titleTpl),this.settings.titleTpl.html(this.settings.title)),this.bindEvent(),this.settings.show&&this.show()},touch:function(b,c){function d(a){return c.call(this,a)}var e;a(b).on("click",d),a(b).on("touchmove",function(a){e=!0}).on("touchend",function(a){if(a.preventDefault(),!e){var b=c.call(this,a,"touch");b||(a.preventDefault(),a.stopPropagation())}e=!1})},bindEvent:function(){var b=this;this.settings.trigger&&(a(this.settings.trigger).click(function(){b.show()}),b.touch(a(this.settings.trigger),function(){b.show()})),a(this.dialogContainer).on("click",".js-dialog-close",function(){return b.hide(),!1}),a(document).keydown(function(a){27===a.keyCode&&b.showed&&b.hide()}),a(this.dialogContainer).on("hide",function(){b.hide()})},dispose:function(){this.dialogContainer.remove(),this.mask.remove(),this.timer&&clearInterval(this.timer)},hide:function(){var b=this;b.settings.beforeHide&&b.settings.beforeHide.call(b,b.dialogContainer),this.showed=!1,this.mask.hide(),this.timer&&clearInterval(this.timer),this.settings.animate?(this.dialogContainer.removeClass("zoomIn").addClass("zoomOut"),setTimeout(function(){b.dialogContainer.hide(),"object"==typeof b.settings.target&&a("body").append(b.dialogContainer.hide()),b.settings.afterHide&&b.settings.afterHide.call(b,b.dialogContainer)},500)):(this.dialogContainer.hide(),"object"==typeof this.settings.target&&a("body").append(this.dialogContainer),this.settings.afterHide&&this.settings.afterHide.call(this,this.dialogContainer))},show:function(){"string"==typeof this.settings.target?/^(\.|\#\w+)/gi.test(this.settings.target)?this.dailogContent=a(this.settings.target):this.dailogContent=a("<div>"+this.settings.target+"</div>"):this.dailogContent=this.settings.target,this.mask.show(),this.dailogContent.show(),this.height=this.settings.height||"auto",this.width=this.settings.width||"auto",this.dialogContainer.append(this.dailogContent).show().css({height:this.height,width:this.width}),this.settings.beforeShow&&this.settings.beforeShow.call(this,this.dialogContainer),this.showed=!0,a(this.settings.trigger).blur(),this.setPosition();var b=this;this.timer&&clearInterval(this.timer),this.settings.fixed&&(this.timer=setInterval(function(){b.setPosition()},1e3)),this.settings.animate&&this.dialogContainer.addClass("zoomIn").removeClass("zoomOut").addClass("animated")},setPosition:function(){if(this.showed){var b=this;this.dialogContainer.show(),this.height=this.settings.height,this.width=this.settings.width,isNaN(this.height)&&(this.height=this.dialogContainer.outerHeight&&this.dialogContainer.outerHeight()||this.dialogContainer.height()),isNaN(this.width)&&(this.width=this.dialogContainer.outerWidth&&this.dialogContainer.outerWidth()||this.dialogContainer.width());var c=a(window).height(),d=a(window).width(),e=this.width/2,f=this.height/2,g=d/2-e,h=c/2-f;g=Math.floor(Math.max(0,g)),h=Math.floor(Math.max(0,h)),console.log("ch:"+c,"cw:"+d,"left:"+g,"top:"+h,"w:"+this.width,"h:"+this.height);var i="absolute";b.settings.fixed?i="fixed":h+=a(window).scrollTop();var j="auto";"bottom"==b.settings.position&&(h="auto",j=0),b.dialogContainer.css({position:i,top:h,left:g,bottom:j})}}},b});