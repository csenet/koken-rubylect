var editor = ace.edit("editor");
var RubyMode = ace.require("ace/mode/ruby").Mode;
editor.getSession().setMode(new RubyMode());
const {
  DefaultRubyVM
} = window["ruby-wasm-wasi"];

editor.setValue("def add(a, b)\n  a + b\nend");

const main = async () => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/ruby-head-wasm-wasi@0.2.0-2022-04-05-a/dist/ruby.wasm"
  );
  const buffer = await response.arrayBuffer();
  const module = await WebAssembly.compile(buffer);
  const {
    vm
  } = await DefaultRubyVM(module);
  window.vm = vm;
  vm.printVersion();
};

const getTestCases = async (question) => {
  const response = await fetch(
    `./testcases/${question}`
  );
  const text = await response.text();
  const testCases = [];
  text.split('\n').forEach((line) => {
    if (line.trim() === '') {
      return;
    }
    const [input, output] = line.split('=>');
    testCases.push({
      input: input.trim(),
      output: output.trim(),
    });
  });
  return testCases;
};

const isCorrect = async (input, output, func, source) => {
  const result = window.vm.eval(source + "\n" + `${func}(${input})`).toString();
  if (result === output) {
    return true;
  } else {
    return result;
  }
};

const run = async () => {
  const source = editor.getValue();
  const question = document.getElementById('question').value;
  if (question === '選択してください') {
    alert('問題を選択してください');
    return;
  }
  const testCases = await getTestCases(question);
  const
    temp = source.match(/^[ \r\n\t]*def +([A-Za-z_0-9]+) *\(([^)]+)\)/);
  if (!temp) {
    alert("関数が存在しません")
    return;
  }
  const func = temp[1];
  const outputField = document.getElementById('output');
  outputField.value = "";
  let acceptedAll = true;
  let acceptedCount = 0;
  await testCases.forEach(async (testCase) => {
    const result = await isCorrect(testCase.input, testCase.output, func, source);
    if (result === true) {
      acceptedCount++;
      outputField.value += `OK:${testCase.input} => ${testCase.output}\n`;
    } else {
      acceptedAll = false;
      outputField.value += `NC:${testCase.input} => ${result}\n`;
    }
  })
  if (acceptedAll) {
    outputField.value += `AC!! : ${acceptedCount}/${testCases.length}`;
  } else {
    outputField.value += `NC Try Again! : ${acceptedCount}/${testCases.length}`;
  }
}

main();