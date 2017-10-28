transToPanoCoor = (drawXY) => {
    let pArray = [];

    for(let i = 0; i < drawXY.length; i++) {
        //transform canvas coordinate to pano coordinate

        pArray.push([...drawXY[i]]);
        console.log(drawXY[i]);//drawXY正常
        pArray[i].x = 11;
        pArray[i].y = 22;
        console.log(pArray[i]);
        console.log(drawXY[i]);//drawXY变成和pArray一样了
    }
    return pArray;
}

let old = [{x:1,y:2},{x:1,y:2},{x:1,y:2}]

transToPanoCoor(old);


