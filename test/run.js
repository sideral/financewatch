const fs = require('fs');
const { join } = require('path');

//Auto-invoking function that runs all found tests.
(function(dir) {
  const specs = findSpecFiles(dir, []);
  const tests = specs.map(spec => require(spec));
  tests.forEach(async test => {
    const results = await runTest(test);
    displayResults(results);
  });
})(__dirname);

/**
 * Recursively find all .spec files.
 */
function findSpecFiles(dir, specs) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const path = join(dir, file);
    const isDirectory = fs.statSync(path).isDirectory();
    if (isDirectory) {
      specs.concat(findSpecFiles(path, specs));
    }
    else if (/\.spec\./.test(file)) {
      specs.push(path);
    }
  });
  return specs;
}

async function runTest(test) {
  const calls = Object.keys(test).map(async(testName) => {
    try {
      await test[testName]();
      return { passed: testName };
    } catch (e) {
      return { failed: testName };
    }
  });
  return await Promise.all(calls);
}

async function displayResults(results) {
  results.forEach(result => {
    if (result.passed) {
      console.log('✅', result.passed);
    }
    else {
      console.log('❎', result.failed);
    }
  });
}
