!function(){function t(t,e){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}window.H5lock=function(t){this.height=t.height,this.width=t.width,this.chooseType=Number(window.localStorage.getItem("chooseType"))||t.chooseType},H5lock.prototype.pickPoints=function(e,s){for(var i=t(e,s),o=s.index>e.index?1:-1,n=this.restPoint.length,a=1===o?0:n-1,h=1===o?n:-1;a!==h;){var r=this.restPoint[a];t(r,e)+t(r,s)===i&&(this.drawPoint(r.x,r.y),this.lastPoint.push(r),this.restPoint.splice(a,1),h>0&&(a--,h--)),a+=o}},H5lock.prototype.drawCle=function(t,e){this.ctx.strokeStyle="#CFE6FF",this.ctx.lineWidth=2,this.ctx.beginPath(),this.ctx.arc(t,e,this.r,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.stroke()},H5lock.prototype.drawPoint=function(){for(var t=0;t<this.lastPoint.length;t++)this.ctx.fillStyle="#CFE6FF",this.ctx.beginPath(),this.ctx.arc(this.lastPoint[t].x,this.lastPoint[t].y,this.r/2,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.fill()},H5lock.prototype.drawStatusPoint=function(t){for(var e=0;e<this.lastPoint.length;e++)this.ctx.strokeStyle=t,this.ctx.beginPath(),this.ctx.arc(this.lastPoint[e].x,this.lastPoint[e].y,this.r,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.stroke()},H5lock.prototype.drawLine=function(t,e){this.ctx.beginPath(),this.ctx.lineWidth=3,this.ctx.moveTo(this.lastPoint[0].x,this.lastPoint[0].y),console.log(this.lastPoint.length);for(var s=1;s<this.lastPoint.length;s++)this.ctx.lineTo(this.lastPoint[s].x,this.lastPoint[s].y);this.ctx.lineTo(t.x,t.y),this.ctx.stroke(),this.ctx.closePath()},H5lock.prototype.createCircle=function(){var t=this.chooseType,e=0;this.r=this.ctx.canvas.width/(2+4*t),this.lastPoint=[],this.arr=[],this.restPoint=[];for(var s=this.r,i=0;i<t;i++)for(var o=0;o<t;o++){e++;var n={x:4*o*s+3*s,y:4*i*s+3*s,index:e};this.arr.push(n),this.restPoint.push(n)}this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);for(var i=0;i<this.arr.length;i++)this.drawCle(this.arr[i].x,this.arr[i].y)},H5lock.prototype.getPosition=function(t){var e=t.currentTarget.getBoundingClientRect();return{x:t.touches[0].clientX-e.left,y:t.touches[0].clientY-e.top}},H5lock.prototype.update=function(t){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);for(var e=0;e<this.arr.length;e++)this.drawCle(this.arr[e].x,this.arr[e].y);this.drawPoint(this.lastPoint),this.drawLine(t,this.lastPoint);for(var e=0;e<this.restPoint.length;e++){var s=this.restPoint[e];if(Math.abs(t.x-s.x)<this.r&&Math.abs(t.y-s.y)<this.r){this.drawPoint(s.x,s.y),this.pickPoints(this.lastPoint[this.lastPoint.length-1],s);break}}},H5lock.prototype.checkPass=function(t,e){for(var s="",i="",o=0;o<t.length;o++)s+=t[o].index+t[o].index;for(var o=0;o<e.length;o++)i+=e[o].index+e[o].index;return s===i},H5lock.prototype.storePass=function(t){1==this.pswObj.step?this.checkPass(this.pswObj.fpassword,t)?(this.pswObj.step=2,this.pswObj.spassword=t,document.getElementById("title").innerHTML="密码保存成功",this.drawStatusPoint("#2CFF26"),window.localStorage.setItem("passwordxx",JSON.stringify(this.pswObj.spassword)),window.localStorage.setItem("chooseType",this.chooseType)):(document.getElementById("title").innerHTML="两次不一致，重新输入",this.drawStatusPoint("red"),delete this.pswObj.step):2==this.pswObj.step?this.checkPass(this.pswObj.spassword,t)?(document.getElementById("title").innerHTML="解锁成功",this.drawStatusPoint("#2CFF26")):(this.drawStatusPoint("red"),document.getElementById("title").innerHTML="解锁失败"):(this.pswObj.step=1,this.pswObj.fpassword=t,document.getElementById("title").innerHTML="再次输入")},H5lock.prototype.makeState=function(){2==this.pswObj.step?(document.getElementById("updatePassword").style.display="block",document.getElementById("title").innerHTML="请解锁"):(this.pswObj.step,document.getElementById("updatePassword").style.display="none")},H5lock.prototype.setChooseType=function(t){chooseType=t,init()},H5lock.prototype.updatePassword=function(){window.localStorage.removeItem("passwordxx"),window.localStorage.removeItem("chooseType"),this.pswObj={},document.getElementById("title").innerHTML="绘制解锁图案",this.reset()},H5lock.prototype.initDom=function(){var t=document.createElement("div");t.setAttribute("style","position: absolute;top:30%;height:70%;left:0;right:0;bottom:0;"),t.innerHTML='<h4 id="title" class="title">绘制解锁图案</h4><a id="updatePassword" style="position: absolute;right: 5px;top: 5px;color:#fff;font-size: 10px;display:none;">重置密码</a><canvas id="canvas" width="300" height="300" style="display: inline-block;"></canvas>',document.body.appendChild(t)},H5lock.prototype.init=function(){this.initDom(),this.pswObj=window.localStorage.getItem("passwordxx")?{step:2,spassword:JSON.parse(window.localStorage.getItem("passwordxx"))}:{},this.lastPoint=[],this.makeState(),this.touchFlag=!1,this.canvas=document.getElementById("canvas"),this.ctx=this.canvas.getContext("2d"),this.createCircle(),this.bindEvent()},H5lock.prototype.reset=function(){this.makeState(),this.createCircle()},H5lock.prototype.bindEvent=function(){var t=this;this.canvas.addEventListener("touchstart",function(e){e.preventDefault();var s=t.getPosition(e);console.log(s);for(var i=0;i<t.arr.length;i++)if(Math.abs(s.x-t.arr[i].x)<t.r&&Math.abs(s.y-t.arr[i].y)<t.r){t.touchFlag=!0,t.drawPoint(t.arr[i].x,t.arr[i].y),t.lastPoint.push(t.arr[i]),t.restPoint.splice(i,1);break}},!1),this.canvas.addEventListener("touchmove",function(e){t.touchFlag&&t.update(t.getPosition(e))},!1),this.canvas.addEventListener("touchend",function(e){t.touchFlag&&(t.touchFlag=!1,t.storePass(t.lastPoint),setTimeout(function(){t.reset()},300))},!1),document.addEventListener("touchmove",function(t){t.preventDefault()},!1),document.getElementById("updatePassword").addEventListener("click",function(){t.updatePassword()})}}();