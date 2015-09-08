var canvas = document.getElementById("robot"),
    ctx = canvas.getContext("2d"),
    socket = io(),
    moveEE = false;

socket.on('init', function (joints) {
  $('#ee-val').text(" ( " + joints[2].x.toFixed(2) + " , " + joints[2].y.toFixed(2) + " )")
})

socket.on('draw', function (joints) {
  $('#ee-val').text(" ( " + joints[2].x.toFixed(2) + " , " + joints[2].y.toFixed(2) + " )")
});

socket.on('setSlide', function (angles) {
  //- console.log('angles: ', angles)
  var th1 = angles[0] * 180 / Math.PI,
      th2 = angles[1] * 180 / Math.PI;
  //- console.log(th1, th2);
  document.getElementById('slider1').value = th1;
  $('.slider1-val').text(th1.toFixed(2));
  document.getElementById('slider2').value = th2;
  $('.slider2-val').text(th2.toFixed(2));
});

$.domReady(function () {
  $('#slider1').on('input', function () {
    var value = $(this).val();
    socket.emit('slider1', value);
    $('.slider1-val').html(value);
  });
  $('#slider2').on('input', function () {
    var value = $(this).val();
    socket.emit('slider2', value);
    $('.slider2-val').html(value);
  });
});

function drawLink (from, to) {
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function drawPoint (pt, color) {
  ctx.fillStyle = color || 'orange';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 10, 0, Math.PI*2, 0);
  ctx.fill();
  ctx.stroke();
}

function drawManipulator (joints) {
  ctx.clearRect(0,0,500,300);

  for (var j = 0; j < joints.length-1; ++j) {
    drawPoint(joints[j], 'orange')
    drawLink(joints[j], joints[j+1]);
  }

  // end effector
  drawPoint(joints[j], 'yellow');
}

socket.on('init', function (joints) { return drawManipulator(joints); });
socket.on('draw', function (joints) { return drawManipulator(joints); });

getMouseClick = function (ev) {
  if (moveEE) {
    var offset = $('canvas').offset();
    var pt = {
      x : ev.clientX - offset.left,
      y : ev.clientY - offset.top
    };
    socket.emit('click', pt);
  }
};

canvas.addEventListener('mousemove', getMouseClick, false);
canvas.addEventListener('mousedown', function () {
  moveEE = !moveEE;
});
