class MedianCut {
  constructor (imageData) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    this.imageData = ctx.createImageData(imageData.width, imageData.height);
    this.imageData.data.set(imageData.data);
    //console.error(`Cube could not be split.`);
    // 统计颜色信息
    this.data = this.imageData.data;
    this.colors = this.getColorsInfo(imageData);
    
    this.cubes = []; // 存放被分隔的立方体数组
  }

  getColorsInfo () {
    var colorsCount = {}; // 将颜色信息 - 颜色出现次数作为key - value形式存储
    var index = 0; // 所在imageData一维数组中的下标
    for (var index = 0; index < this.data.length; ) {
     // for (var j = 0; j < this.imageData.height; j++) {
        var key = `${ this.data[index] },${ this.data[index+1] },${ this.data[index+2] }`;
        if(colorsCount[key]) {
          colorsCount[key]++;
        } else {
          colorsCount[key] = 1;
        }
        index += 4;
     // }
    }

    var colorsAsArray = [];
    var tempRGB;
    for (key in colorsCount) {
      tempRGB = key.split(','); //
      colorsAsArray[colorsAsArray.length] = {
        'r' : parseInt(tempRGB[0], 10),
        'g' : parseInt(tempRGB[1], 10),
        'b' : parseInt(tempRGB[2], 10),
        'amount' : colorsCount[key]
      }
    }
    return colorsAsArray;
  }

  medianCut (cubes, aimedColorLength) {
    // 选取cubes队列中total最大的一个cube
    var index; // 记录当前选中cube的下标
    var maxTotal = 0;
    for(var i = 0; i < cubes.length; i++) {
      if(cubes[i].total > maxTotal && cubes[i].colors.length!=1) {
          maxTotal = cubes[i].total;
          index = i;
      }
    }

    var type = cubes[index].type;
    cubes[index].colors.sort((a, b) => {
      if (a[type] < b[type])
        return -1;
      else if (a[type] > b[type])
        return 1;
      else
        return 0;
    });
    // 获取中位数下标
    var medianIndex = Math.round(cubes[index].colors.length/2);
    
    var cube1 = [];
    var cube2 = [];

    for(var i = 0; i < cubes[index].colors.length; i++) {
      if(i < medianIndex) {
        cube1[cube1.length] = cubes[index].colors[i];
      } else {
        cube2[cube2.length] = cubes[index].colors[i];
      }
    }
    
    cube1 = this.transInfoToCube(cube1);
    cube2 = this.transInfoToCube(cube2);

    var ans = [];
    for(var i = 0; i < cubes.length; i++) {
      if(i !== index) {
        ans[ans.length] = cubes[i];
      }
    }
    
    ans[ans.length] = cube1;
    ans[ans.length] = cube2;

    if(ans.length < aimedColorLength) {
      return this.medianCut(ans,aimedColorLength);
    } else {
      return ans;
    }

  }
  /**
   * 存储每个cube的信息，包含颜色数组{r,g,b.amount}
   * total - 该cube出现颜色的总数（包含重复）
   */
  transInfoToCube (colors) {
    var total = 0;
    var detailedCube = [];
    var type = 'r';
    var minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    /*if(colors.length == 0) {
      console.log('colors.length == 0');
    }*/
    for(var i = 0; i < colors.length; i++) {
      total += colors[i].amount;
      minR = Math.min(minR, colors[i].r);
      minG = Math.min(minG, colors[i].g);
      minB = Math.min(minB, colors[i].b);
      maxR = Math.max(maxR, colors[i].r);
      maxG = Math.max(maxG, colors[i].g);
      maxB = Math.max(maxB, colors[i].b);
    }

    var rDomain = maxR - minR;
    var gDomain = maxG - minG;
    var bDomain = maxB - minB;

    if(rDomain > gDomain && rDomain > bDomain) {
      type = 'r';
    } else if (gDomain > rDomain && gDomain > bDomain) {
      type = 'g';
    } else if (bDomain > rDomain && bDomain > gDomain) {
      type = 'b';
    }


    if(total == 0) {
      console.log('NaN total');
    }
    return {
      colors, total, type 
    }

  }

  calculateAve() {
    var aveColors = [];
    var aveColor = {r:0, g:0, b: 0};
    for(var i = 0; i < this.cubes.length; i++) {
      aveColor = {r:0, g:0, b: 0};
      for(var j = 0; j < this.cubes[i].colors.length; j++) {
        aveColor.r += this.cubes[i].colors[j].r*this.cubes[i].colors[j].amount;
        aveColor.g += this.cubes[i].colors[j].g*this.cubes[i].colors[j].amount;
        aveColor.b += this.cubes[i].colors[j].b*this.cubes[i].colors[j].amount;
      }
      aveColors[i] = {
        'r': Math.round(aveColor.r / this.cubes[i].total),
        'g': Math.round(aveColor.g / this.cubes[i].total),
        'b': Math.round(aveColor.b / this.cubes[i].total)
      }
    }
    return aveColors;
  }
  run (aimedColorLength) {
    var priCube = [this.transInfoToCube(this.colors)];
    this.cubes = this.medianCut(priCube, aimedColorLength);
    //console.log('this.cubes.length '+ this.cubes.length);
    var aveColors = this.calculateAve();
    var tempRGB;
    var pixelColors = {};
    for(var i = 0; i < this.cubes.length; i++) {
      for(var j = 0; j < this.cubes[i].colors.length; j++) {
        var key = `${this.cubes[i].colors[j].r}, ${this.cubes[i].colors[j].g}, ${this.cubes[i].colors[j].b}`;
        pixelColors[key] = {
          'r': aveColors[i].r,
          'g': aveColors[i].g,
          'b': aveColors[i].b
        }
      }
    }
    var index = 0;
    for (var index = 0; index < this.data.length; ) {
      var key = `${ this.data[index] }, ${ this.data[index+1] }, ${ this.data[index+2] }`;
      this.data[index] = pixelColors[key].r;
      this.data[index+1] = pixelColors[key].g;
      this.data[index+2] = pixelColors[key].b;
      index += 4;
    }
    this.statistic();
    return this.imageData;
  }

  statistic () {
    var rCount = 0, gCount = 0, bCount =0;
    for(var i = 0; i < this.cubes.length; i++) {
      if(this.cubes[i].type == 'r') {
        rCount++;
      } else if(this.cubes[i].type == 'g') {
        gCount++;
      } else {
        bCount++;
      }
    }
    console.log("r Count = " + rCount);
    console.log("g Count = " + gCount);
    console.log("b Count = " + bCount);
  }
}
