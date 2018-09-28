window.onload = function () {

	var aimedColorLength = 2;
	// 获取redapple.jpg的信息
	var originalImage = document.getElementById('originalImage');
	var canvas = document.getElementById('originalImageCanvas');
	var canvas2DContext = canvas.getContext("2d");
	canvas.width = originalImage.width;
	canvas.height = originalImage.height;

	canvas2DContext.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
	//console.log('onload1');
	var imageData = canvas2DContext.getImageData(0, 0, canvas.width, canvas.height);

	var canvasModified = document.getElementById('modifiedImageCanvas');
	var canvas2DContextModifed = canvasModified.getContext('2d');
	
	canvasModified.width = originalImage.width;
	canvasModified.height = originalImage.height;
	//console.log('onload2');
	
	//runMedianCut(imageData,aimedColorLength,canvas2DContextModifed,originalImage.width,originalImage.height);

	var input = document.getElementById('ColorSize');
	input.onblur  = function() {
		var colorLength = input.value;
		console.log('run');
		var medianCut = new MedianCut(imageData);
		var data = medianCut.run(colorLength);
		canvas2DContextModifed.putImageData(data, 0, 0, 0, 0, originalImage.width, originalImage.height);
	}
}
