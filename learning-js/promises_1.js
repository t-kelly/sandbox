const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});

const timeout = setTimeout(() => {
  console.log('Hello!')
}, 5000);

function listOfThings () {
  console.log('First Thing');
  setTimeout(() => {
    console.log('Second Thing!')
    setTimeout(() => {
      console.log('Third Thing!')
      setTimeout(() => {
        console.log('Forth Thing!')
      }, 1000);
    }, 1000);
  }, 1000);
}

function promiseSetTimeout(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time);
  });
}

async function asyncListOfThings () {
  console.log('First Thing');
  await promiseSetTimeout(2000);
  console.log('Second Thing!')
  await promiseSetTimeout(2000);
  console.log('Third Thing!')
}

function promiseListOfThings() {
  console.log('First Thing');
  promiseSetTimeout(2000)
    .then(() => {
      console.log('Second Thing!')
      return promiseSetTimeout(2000);
    })
    .then(() => {
      console.log('Third Thing!')
    })
}

promiseListOfThings();