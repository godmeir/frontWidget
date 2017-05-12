/**
 * Created by zyj on 2017/2/23.
 */
modeImgCache = (function () {

    var Count =16;
    var Imgs = new Array(Count);
    var ImgLoaded =0;

    //加载单个图片
    this.downloadImage = function (i)
    {
        var imageIndex = i; //图片以1开始
        Imgs[i].src = "img/mode_bg_"+imageIndex+".png";
        Imgs[i].onLoad=validateImages(i);
    }

    //验证是否成功加载完成，如不成功则重新加载
    function validateImages(i){
        if (!Imgs[i].complete)
        {
            setTimeout('downloadImage('+i+')',200);
        }
        else if (typeof Imgs[i].naturalWidth != "undefined" && Imgs[i].naturalWidth == 0)
        {
            setTimeout('downloadImage('+i+')',200);
        }
        else
        {
            ImgLoaded++
        }
    }
    //预加载图片
    function preLoadImgs()
    {
        for(var i=1;i<=16;i++){
            Imgs[i]=new Image();
            try {
                downloadImage(i);
            }catch (e){
                console.log(e);
            }

        }
    };
        preLoadImgs();
        return Imgs;
})()