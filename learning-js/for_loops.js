const choices = ['a','b','c','d']

function originalButtonLoop() {
  for(var i=0; i<choices.length; i = i + 1) {
  
    var button = document.createElement('button')
    
    document.body.appendChild(button)
    
    var textnode = document.createTextNode(choices[i])
    
    button.appendChild(textnode)
    
    button.onclick = function() {
    	alert(choices[i])
    }
  }
}

function whatDoesIEqual1() {
  // For Loop Operations Order
  // 1. Iniatilize var i = 0
  // 2. Perform check of i < choices.length
  // 3. Execute contents of loop
  // 4. Interate value of i (i++)
  for(var i=0; i<choices.length; i++) {
    console.log('Choice: ' + choices[i])
  }

  console.log(i);
}

function whatDoesIEqual2() {
  var callbacks = [];
  for(var i=0; i<choices.length; i++) {
    console.log('Choice: ' + choices[i])
    callbacks[i] = function() {
      return choices[i];
    }
    console.log('DURING LOOP CB', callbacks[i]())
  }

  console.log('AFTER LOOP CB', callbacks[0]())
  console.log('AFTER LOOP CB', callbacks[1]())
  console.log('AFTER LOOP CB', callbacks[2]())
  console.log(i);
}

function whatDoesIEqual3() {
  var callbacks = [];
  for(var i=0; i<choices.length; i++) {
    let ii = i;
    console.log('Choice: ' + choices[i])
    callbacks[i] = function() {
      return choices[ii];
    }
    console.log('DURING LOOP CB', callbacks[i]())
  }

  console.log('AFTER LOOP CB', callbacks[0]()) // Want value to be 'a'
  console.log('AFTER LOOP CB', callbacks[1]()) // Want value to be 'b'
  console.log('AFTER LOOP CB', callbacks[2]()) // Want value to be 'c'
  console.log(i);
}

function whatIEqual4(transform) {
  const callbacks = [];

  for(var i=0; i<choices.length; i++) {
    const transform = (value, index) => {
      console.log('Choice: ' + value)
      return function() {
        return choices[index];
      }
    }
    callbacks.push(transform(choices[i], i));
  }

  console.log('AFTER LOOP CB', callbacks[0]()) // Want value to be 'a'
  console.log('AFTER LOOP CB', callbacks[1]()) // Want value to be 'b'
  console.log('AFTER LOOP CB', callbacks[2]()) // Want value to be 'c'
}

function whatIEqual5() {
  const callbacks = choices.map((value, i) => {
    console.log('Choice: ' + value)
    return function() {
      return choices[i];
    }
  });

  console.log('AFTER LOOP CB', callbacks[0]()) // Want value to be 'a'
  console.log('AFTER LOOP CB', callbacks[1]()) // Want value to be 'b'
  console.log('AFTER LOOP CB', callbacks[2]()) // Want value to be 'c'
}

whatIEqual4();

for (var key in {derp:1, yo: 2}) {
  console.log(key);
}
