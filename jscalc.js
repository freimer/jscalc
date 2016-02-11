var display = document.getElementById("display");
var entry = 0;
var list = [];
var point = false;
var position = 0;
var nocomma = function(l) {
  var a = '';
  for (i of l) {
    a+=i.toString();
  }
  return a;
}
var btn_clear = function() {
  list = [];
  display.innerText = 0;
  entry = 0;
  point = false;
  position = 0;
}
var btn_num = function(n) {
  if (point) {
    entry += n / position;
    position *= 10;
  } else {
    entry = entry * 10 + n;
  }
  display.innerText = nocomma(list) + entry;
}

var btn_point = function() {
  point = true;
  position = 10; //th
  display.innerText = entry.toString() + '.';
}

var btn_opcode = function(op) {
  list.push(entry);
  point = false;
  position = 0;
  entry = 0;
  list.push(op);
  display.innerText = nocomma(list);
}

var btn_equal = function() {
    list.push(entry);
    while(list.length > 1){
      var op1 = list.shift();
      var op = list.shift();
      var op2 = list.shift();
      switch (op) {
        case '+':
          list.unshift(op1 + op2);
          break;
        case '-':
          list.unshift(op1 - op2);
          break;
        case '*':
          list.unshift(op1 * op2);
          break;
        case '/':
          list.unshift(op1 / op2);
          break;
      }
    }
    entry = list.shift();
    display.innerText += "\n" + entry;
  }
  //@14to9
