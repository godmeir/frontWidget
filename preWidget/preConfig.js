/**
 * Created by zyj on 2017/1/4.
 */
function $(element){
    return element = document.getElementById(element);
}//欢迎来到站长特效c网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，.net打造靓站，还有许多广告代码下载。
function $D(){
    var d=$('big_wwwzzjsnet');
    var h=d.offsetHeight;
    var maxh=300;
    function dmove(){
        h+=50; //设置层展开的速度
        if(h>=maxh){
            d.style.height='400px';
            clearInterval(iIntervalId);
        }else{
            d.style.display='block';
            d.style.height=h+'px';
        }//欢迎来到站长g特效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，.net打造靓站，还有许多广告代码下载。
    }
    iIntervalId=setInterval(dmove,2);
}//欢迎来到站长特q效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，.net打造靓站，还有许多广告代码下载。
function $D2(){
    var d=$('big_wwwzzjsnet');
    var h=d.offsetHeight;
    var maxh=300;
    function dmove(){
        h-=50;//设置层收缩的速度
        if(h<=0){
            d.style.display='none';
            clearInterval(iIntervalId);
        }else{
            d.style.height=h+'px';
        }
    }//欢迎来到站长特z效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，.net打造靓站，还有许多广告代码下载。
    iIntervalId=setInterval(dmove,2);
}//欢迎来到站x长特效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，.net打造靓站，还有许多广告代码下载。
function $use(targetid,objN){
    var d=$(targetid);
    var sb=$(objN);
    if (d.style.display=="block"){
        $D2();
        d.style.display="none";
        sb.innerHTML="展开";
    } else {
        $D();
        d.style.display="block";
        sb.innerHTML='收缩';
    }
}//欢迎来到站长特效网，我们的网址