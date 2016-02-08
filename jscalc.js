var display = document.getElementById("display");
var entry = 0;
var operand1 = 0;
var operand2 = 0;
var operands = []
var i = 0
var operation = '';
var point = false;
var position = 0;
var btn_num = function(n) {
  if (point) {
    entry += n / position;
    position *= 10;
  } else {
    entry = entry * 10 + n;
  }
  display.innerText = entry;
}

var btn_point = function() {
  point = true;
  position = 10; //th
  display.innerText = entry.toString() + '.';
}

var btn_opcode = function(op) {
  operand1 = entry;
  operands[i] = entry;
  i++
  point = false;
  position = 0;
  entry = 0;
  operation = op;
}

var btn_equal = function() {
    switch (operation) {
      case '+':
      operands[i] = entry
      i++
        entry = operands.reduce(function(a,b){return a+b});
        break;
      case '-':
      operands[i] = entry
      i++
        entry = operands.reduce(function(a,b){return a-b});
        break;
      case '*':
      operands[i] = entry
      i++
        entry = operands.reduce(function(a,b){return a*b});
        break;
      case '/':
      operands[i] = entry
      i++
        entry = operands.reduce(function(a,b){return a/b});
        break;
    }
    display.innerText = entry;
  }
  //@14to9
