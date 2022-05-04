var editor = ace.edit("editor");
var RubyMode = ace.require("ace/mode/ruby").Mode;
editor.getSession().setMode(new RubyMode());
let isReady = false;

// editor.setValue("def add(a, b)\n  a + b\nend");

const main = async () => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/ruby-head-wasm-wasi@0.2.0-2022-04-05-a/dist/ruby.wasm"
  );
  const buffer = await response.arrayBuffer();
  const module = await WebAssembly.compile(buffer);
  const WASI = window["WASI"].WASI;
  const WasmFs = window["WasmFs"].WasmFs;
  const RubyVM = window["ruby-wasm-wasi"].RubyVM;
  const wasmFs = new WasmFs();
  const originalWriteSync = wasmFs.fs.writeSync.bind(wasmFs.fs);
  const textDecoder = new TextDecoder("utf-8");
  wasmFs.fs.writeSync = (fd, buffer, offset, length, position) => {
    const text = textDecoder.decode(buffer);
    if (fd == 1 || fd == 2) {
      console.log(text);
    }
    return originalWriteSync(fd, buffer, offset, length, position);
  }
  const vm = new RubyVM();
  const wasi = new WASI({
    bindings: {
      ...WASI.defaultBindings,
      fs: wasmFs.fs
    },
  });
  const imports = {
    wasi_snapshot_preview1: wasi.wasiImport
  };
  vm.addToImports(imports);
  const wasmInstance = await WebAssembly.instantiate(module, imports);
  await vm.setInstance(wasmInstance);
  wasi.setMemory(wasmInstance.exports.memory);
  vm.initialize();
  window.vm = vm;
  isReady = true;
  document.getElementById('check-btn').disabled = false;
};

const getTestCases = async (question) => {
  const response = await fetch(
    `./testcases/${question}`
  );
  const text = await response.text();;
  const firstRowEndPos = text.indexOf('\n', 0);
  let judgeMode = text.substring(0, firstRowEndPos);
  let outputString = text;
  if (judgeMode === "Number" || judgeMode === "MultiNumber" || judgeMode === "String") {
    // JudgeModeが定義されている場合はいる場合は適応する
    outputString = text.substring(firstRowEndPos + 1);
  } else {
    judgeMode = null;
  }
  const testCases = [];
  outputString.split('\n').forEach((line) => {
    if (line.trim() === '') {
      return;
    }
    const [text, output] = line.split('=>');
    testCases.push({
      text: text.trim(),
      output: output.trim(),
    });
  });
  return {
    mode: judgeMode,
    cases: testCases
  };
};

function roundDecimal(value, n) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

const isCorrect = async (text, output, func, source, question, judgeMode) => {
  let result;
  /* コードに含まれる余計な部分を削除する */
  const FuncEndPos = source.indexOf('end', 0);
  const FuncSource = source.substring(0, FuncEndPos + 3);
  try {
    result = window.vm.eval(FuncSource + "\n" + `${func}(${text})`).toString();
  } catch (e) {
    return {
      isSuccess: false,
      status: "RE",
      output: "Error",
    }
  }
  /* Judge Modeに応じて切り替え */
  if (judgeMode === 'Number') {
    if (roundDecimal(parseFloat(result), 2) === parseFloat(output)) {
      return {
        isSuccess: true,
        status: "AC",
        output: result,
      }
    } else {
      return {
        isSuccess: true,
        status: "WA",
        output: result,
      }
    }
  } else if (judgeMode === 'MultiNumber') {
    const floatResultArray = JSON.parse(result);
    const floatOutputArray = JSON.parse(output);
    let allCorrect = true;
    for (let i = 0; i < floatResultArray.length; i++) {
      if (roundDecimal(floatResultArray[i], 2) != roundDecimal(floatOutputArray[i], 2)) {
        allCorrect = false;
        break;
      }
    }
    if (allCorrect) {
      return {
        isSuccess: true,
        status: "AC",
        output: result,
      }
    } else {
      return {
        isSuccess: true,
        status: "WA",
        output: result,
      }
    }
  } else {
    if (result === output) {
      return {
        isSuccess: true,
        status: "AC",
        output: result,
      }
    } else {
      return {
        isSuccess: true,
        status: "WA",
        output: result,
      }
    }
  }
};

const judge = async () => {
  if (!isReady) {
    alert("WASMがロードされていません");
    return;
  }
  const source = editor.getValue();
  const question = document.getElementById('question').value;
  if (question === '選択してください') {
    alert('問題を選択してください');
    return;
  }
  const testCaseInput = await getTestCases(question);
  const testCases = testCaseInput.cases;
  const judgeMode = testCaseInput.mode;
  const
    temp = source.match(/^[ \r\n\t]*def +([A-Za-z_0-9]+) *\(([^)]+)\)/);
  if (!temp) {
    alert("関数が存在しません")
    return;
  }
  const func = temp[1];
  const outputField = document.getElementById('judge-output');
  outputField.innerHTML = "";
  let acceptedAll = true;
  let acceptedCount = 0;
  for (const testCase of testCases) {
    const result = await isCorrect(testCase.text, testCase.output, func, source, question, judgeMode);
    if (result.status === "AC") {
      acceptedCount++;
      outputField.innerHTML = outputField.innerHTML + `<span class="badge bg-success">AC</span> ${testCase.text} => ${result.output}<br>`;
    } else {
      acceptedAll = false;
      if (result.status === "WA") {
        outputField.innerHTML = outputField.innerHTML + `<span class="badge bg-warning">WA</span> ${testCase.text} => ${result.output}<br> Expected: ${testCase.output}<br>`;
      } else {
        outputField.innerHTML = outputField.innerHTML + `<span class="badge bg-warning">RE</span> ${testCase.text} => ${result.output}<br>`;
      }
    }
  }
  if (acceptedAll && acceptedCount != 0) {
    outputField.innerHTML = outputField.innerHTML + `Result: <span class="badge bg-success">AC</span> ${acceptedCount}/${testCases.length}<br>`;
  } else {
    outputField.innerHTML = outputField.innerHTML + `Result: <span class="badge bg-warning">WA</span> ${acceptedCount}/${testCases.length}<br>`;
  }
}

const run = async () => {
  if (!isReady) {
    alert("WASMがロードされていません");
    return;
  }
  const source = editor.getValue();
  let result = "";
  try {
    result = window.vm.eval(source).toString();
  } catch (e) {
    result = e;
  }
  const outputField = document.getElementById('output');
  outputField.value = result;
};

main();