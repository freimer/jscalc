# jscalc

A simple calculator program as I learn how to program in JavaScript.

So far we have a few buttons and can add, subtract, multiply, and divide.  We will need to modify and create a stack though, as we need to incorporate advanced capabilities such as parenthesis.

OK, so this is basically done, for now.  We have a generic way of inputting numbers and operators or generic functions onto a list structure.  The list is then calculated when = is clicked.  The calculation supports binary and unary operators, as well as parenthesis and implicit parenthesis for functions like sin(, cos(, log(, etc.  Nested parenthesis are supported.  Operations can easily be added by modifying the operation object contained with the Calculator object at the beginning of the file.  Required attributes of each object are:

* order - defines the order of operations, with lower numbers having a higher prescedence
* leftAssociative - true if the operation is left associative, otherwise false
* replaceIndex - the start of where the operation is replaced in the list when computed.  For instance, if the list is [49, '+', 42, '\*', 21], when the compute function is called for '*' the replaceIndex will be 2.
* replaceSize - the number of list elements that are to be replaced by the results.  In the above example, the size would be 3, because there are three elements [42, '*', 21] that would be replaced with the answer.
* operands - the number of operands that the operator compute function expects
* opIndex - the offset from the position in the array where the operands are located relative to the position of the operator.  In the above example this would be [-1, 1] because the first operand (42) is -1 positions from the operator '*' and the second operand is 1 positions from the operator.
* compute - the function that computes the results of the operation.

Last updated February 27, 2016
