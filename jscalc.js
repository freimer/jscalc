var Calculator = {
  debugging: true,
  display: document.getElementById("display"),
  list: [],
  entrytext: 'NaN',
  operation: {
    'sin(': {
      order: 100,
      leftAssociative: true,
      replaceIndex: 0,
      replaceSize: 3,
      operands: 1,
      opIndex: [1],
      compute: function (operands) {
        return Math.sin(operands[0]);
      }
    },
    'cos(': {
      order: 100,
      leftAssociative: true,
      replaceIndex: 0,
      replaceSize: 3,
      operands: 1,
      opIndex: [1],
      compute: function (operands) {
        return Math.cos(operands[0]);
      }
    },
    'tan(': {
      order: 100,
      leftAssociative: true,
      replaceIndex: 0,
      replaceSize: 3,
      operands: 1,
      opIndex: [1],
      compute: function (operands) {
        return Math.tan(operands[0]);
      }
    },
    'log(': {
      order: 100,
      leftAssociative: true,
      replaceIndex: 0,
      replaceSize: 3,
      operands: 1,
      opIndex: [1],
      compute: function (operands) {
        return Math.log10(operands[0]);
      }
    },
    'ln(': {
      order: 100,
      leftAssociative: true,
      replaceIndex: 0,
      replaceSize: 3,
      operands: 1,
      opIndex: [1],
      compute: function (operands) {
        return Math.log(operands[0]);
      }
    },
    '^': {
      order: 3000,
      leftAssociative: false,
      replaceIndex: -1,
      replaceSize: 3,
      operands: 2,
      opIndex: [-1, 1],
      compute: function (operands) {
        return Math.pow(operands[0], operands[1]);
      }
    },
    '^2': {
      order: 3000,
      leftAssociative: false,
      replaceIndex: -1,
      replaceSize: 2,
      operands: 1,
      opIndex: [-1],
      compute: function (operands) {
        return Math.pow(operands[0], 2);
      }
    },
    '^-1': {
      order: 3001,
      leftAssociative: false,
      replaceIndex: -1,
      replaceSize: 2,
      operands: 1,
      opIndex: [-1],
      compute: function (operands) {
        return Math.pow(operands[0], -1);
      }
    },
    '*': {
      order: 4000,
      leftAssociative: true,
      replaceIndex: -1,
      replaceSize: 3,
      operands: 2,
      opIndex: [-1, 1],
      compute: function (operands) {
        return operands[0] * operands[1];
      }
    },
    '/': {
      order: 4010,
      leftAssociative: true,
      replaceIndex: -1,
      replaceSize: 3,
      operands: 2,
      opIndex: [-1, 1],
      compute: function (operands) {
        return operands[0] / operands[1];
      }
    },
    '+': {
      order: 5000,
      leftAssociative: true,
      replaceIndex: -1,
      replaceSize: 3,
      operands: 2,
      opIndex: [-1, 1],
      compute: function (operands) {
        return operands[0] + operands[1];
      }
    },
    '-': {
      order: 5010,
      leftAssociative: true,
      replaceIndex: -1,
      replaceSize: 3,
      operands: 2,
      opIndex: [-1, 1],
      compute: function (operands) {
        return operands[0] - operands[1];
      }
    }
  },
  updatedisplay: function () {
    var suffix = ''; // don't add anything by default
    if (this.entrytext.substr(-1) == '.') { // but if the number string ends in a .
      suffix = '.'; // add a .
    }
    if (this.entrytext != 'NaN') {
      this.display.innerText = this.list.join('') + parseFloat(this.entrytext) + suffix;
    } else {
      this.display.innerText = this.list.join('') + suffix;
    }
  },
  btn_clear: function () {
    this.list = [];
    this.entrytext = 'NaN';
    this.updatedisplay();
  },
  btn_num: function (n) {
    if (this.entrytext == 'NaN') {
      this.entrytext = '';
    }
    this.entrytext += n.toString();
    this.updatedisplay();
  },
  btn_point: function () {
    this.entrytext += '.';
    this.updatedisplay();
  },
  isBinaryOp: function (op) {
    if (op == '+' || op == '-' || op == '*' || op == '/') {
      return true;
    } else {
      return false;
    }
  },
  isUnaryOp: function (op) {
    if (op.endsWith('(') || op == ')') {
      return true;
    } else {
      return false;
    }
  },
  btn_backspace: function () {
    if (this.entrytext == 'NaN') {
      // No number, check to see if we have anything on the this.list
      if (this.list.length > 1) {
        // Should have at least an operator and a number at the end, in reverse order
        var op = this.list.pop(); // get rid of the operator
        if (this.isBinaryOp(op)) {
          this.entrytext = this.list.pop().toString();
        } else if (this.isUnaryOp(op)) {
          this.entrytext = 'NaN';
        } else {
          if (this.debugging) {
            console.log("Error, I don't know how to handle operator " + op + " with backspace!");
          }
        }
      }
    } else {
      // we have a number in this.entrytext
      if (this.entrytext.length == 1) {
        this.entrytext = 'NaN';
      } else {
        this.entrytext = this.entrytext.substr(0, this.entrytext.length - 1);
      }
    }
    this.updatedisplay();
  },
  btn_opcode: function (op) {
    if (this.entrytext != 'NaN') {
      this.list.push(parseFloat(this.entrytext));
      this.entrytext = 'NaN';
      if (op == '(') {
        this.list.push('*');
      }
    }
    this.list.push(op);
    this.updatedisplay();
  },
  handle_parenthesis: function (l, startIndex, endIndex) {
    /* Handle all parenthesis first, as highest prescedence.  This is both
     * a function that calls compute, which is what calls this funciton, so
     * in a round about way is recursive.  It scans l from startIndex to
     * endIndex for matching parenthesis, and calls compute to compute the
     * value inside the parenthesis, then computes the result, which will
     * be the result from the compute with the parenthesis stripped, or, if
     * the parenthesis started with an implicit parenthesis function, like
     * sin(, then replace it with the proper result.
     */
    // Check for parenthesis or operations with an implicit parenthesis
    for (var startParenIndex = startIndex; startParenIndex <= endIndex; startParenIndex++) {
      if (typeof (l[startParenIndex]) == 'string' && l[startParenIndex].endsWith('(')) {
        break;
      }
    }
    if (startParenIndex > endIndex) {
      return 0; // didn't find anything
    }
    if (this.debugging) {
      console.log('Found ' + l[startParenIndex] + ' at position ' + startParenIndex);
    }
    var count = 1; // how many close parenthesis we need to find
    /* Loop through rest of list, starting at the next position
     * incrementing each loop, and continuing to loop until either
     * we find the close parenthesis, or we reach the endIndex of the list
     */
    for (var endParenIndex = startParenIndex + 1; count > 0 && endParenIndex <= endIndex; endParenIndex++) {
      if (this.debugging) {
        console.log('Searching position ' + endParenIndex + ' for ' + count + ' )');
      }
      if (typeof (l[endParenIndex]) == 'string' && l[endParenIndex].endsWith('(')) {
        count++;
      } else if (l[endParenIndex] == ')') {
        count--;
      }
    }
    if (count == 0) {
      endParenIndex--; // we actually found the last ) at the previous index
      if (this.debugging) {
        console.log('Computing ' + l.slice(startParenIndex + 1, endParenIndex));
      }
      // compute what is (inside) the parethesis
      this.compute(l, startParenIndex + 1, endParenIndex - 1);
      /* the above should replace everything in the list from startParenIndex + 1
       * to endParenIndex - 1 with a single value, resulting in the items
       * '(' (or the starting implicit open parenthesis operation), results, ')'
       */
      if (this.debugging) {
        console.log('list: ' + l);
      }
      if (l[startParenIndex] in this.operation) {
        if (this.debugging) {
          console.log('Performing operation ' + l.slice(startParenIndex, startParenIndex + 3));
        }
        this.perform_operation(l, startParenIndex);
      } else {
        // replace the parenthesis and what's inside with the results
        if (this.debugging) {
          console.log('Replacing ' + l.slice(startParenIndex, startParenIndex + 3));
        }
        l.splice(startParenIndex, 3, l[startParenIndex + 1]);
      }
      if (this.debugging) {
        console.log('list: ' + l);
      }
      return endParenIndex - startParenIndex + 1;
    } else {
      if (this.debugging) {
        console.log("Unmatched parenthesis!");
      }
      this.list = ['NaN'];
      return -1;
    }
  },
  compute: function (l, start, end) {
    /* Compute the contents of list from start to end down to a single value,
     * replacing everything from start to end with that value and returning
     * the number of items the list shrunk by
     */
    // Scan list from start to end and recompute
    var e = end;
    var p;
    while (e > start) {
      if (this.debugging) {
        console.log('Scanning from ' + start + ' to ' + e);
      }
      // handle parenthesis, and implicit parenthesis operations first
      var size = this.handle_parenthesis(l, start, e);
      if (size > 0) {
        e -= size;
        continue;
      } else if (size < 0) {
        this.list = ['NaN'];
        return end - start + 1;
      }
      // loop through all of the operations, setting op to the key sorted
      // in the correct order per the order attribute
      for (var op of Object.keys(this.operation).sort(function (a, b) {
          return Calculator.operation[a].order - Calculator.operation[b].order;
        })) {
        // Check to see if we find the operation anywhere
        if (this.operation[op].leftAssociative) {
          // scan from start of list
          p = l.indexOf(op, start);
        } else {
          // scan from end of list
          p = l.lastIndexOf(op, e);
        }
        var min = p + Math.min.apply(null, this.operation[op].opIndex);
        var max = p + Math.max.apply(null, this.operation[op].opIndex);
        // if we found one before the end of the list
        if (p != -1) {
          if (min >= start && p + max <= e) {
            // replace it and update the end index
            e -= this.perform_operation(l, p);
          } else {
            this.list = ['NaN'];
            return end - start + 1;
          }
        }
      }
    }
    /* return size l was reduced by, since we should always compute whatever
     * start to end is down to one element, this should always be the following
     */
    return end - start + 1;
  },
  perform_operation: function (l, position) {
    /* Perform whatever operation is at position withing l, returning the
     * number of entries that the list was reduced by as a result.
     */
    // found an operator, gather the operands
    var operands = [];
    var op = l[position];
    // loop through as many operands as the operation says it grabs
    for (var opIndex = 0; opIndex < this.operation[op].operands; opIndex++) {
      // use the index offset as specified for the operation
      operands.push(l[position + this.operation[op].opIndex[opIndex]])
    }
    // replace with the computed answer
    l.splice(position + this.operation[op].replaceIndex,
      this.operation[op].replaceSize,
      this.operation[op].compute(operands));
    // return how much we just shrunk the array
    return this.operation[op].replaceSize - 1
  },
  btn_negate: function () {
    if (this.entrytext != 'NaN') {
      if (this.entrytext.startsWith('-')) {
        this.entrytext = this.entrytext.slice(1);
      } else {
        this.entrytext = '-' + this.entrytext;
      }
      this.updatedisplay();
    }
  },
  btn_equal: function () {
    if (this.entrytext != 'NaN') {
      this.list.push(parseFloat(this.entrytext));
    }
    this.compute(this.list, 0, this.list.length - 1);
    this.entrytext = this.list.shift();
    if (this.entrytext == undefined) {
      this.entrytext = 'NaN';
    } else {
      this.entrytext = this.entrytext.toString();
    }
    this.updatedisplay();
  }
}
