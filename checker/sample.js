var text0, text1, text2;

function init() {
  text0 = document.getElementById('t0');
  text1 = document.getElementById('t1');
  text2 = document.getElementById('t2');
  document.write = function (s) {
    text1.value += s;
  }
  document.writeln = function (s) {
    text1.value += s + '\r\n';
  }
}

function run() {
  text1.value = '';
  var f, n, p = [],
    r = [],
    error = false;
  var a = text0.value.match(/^[ \r\n\t]*function +([A-Za-z_0-9]+) *\(([^)]+)\)/);
  if (!a) {
    text1.value += 'function not found in source\r\n';
    return;
  }
  f = a[1];
  n = a[1].split(/,/).length;
  try {
    eval(text0.value);
  } catch (s) {
    text1.value += 'program error: ' + s + '\r\n';
    return;
  }
  f = eval(f);
  a = text2.value.split(/[\r\n]+/);
  for (var i = 0; i < a.length; ++i) {
    var b = a[i].match(/^(.*)=>(.*)$/),
      p1, r1;
    if (!b) continue;
    try {
      p1 = eval('[' + b[1] + ']');
      r1 = eval(b[2]);
      p.push(p1);
      r.push(r1);
    } catch (s) {
      text1.value += 'test case syntax: ' + a[i] + '\r\n';
      error = true;
    }
  }
  if (error) return;
  for (var i = 0; i < p.length; ++i) {
    var x = null;
    try {
      x = f.apply(null, p[i]);
      if (String(x) == String(r[i])) {
        text1.value += 'OK: ' + String(p[i]) + ' => ' + String(r[i]) + '\r\n';
      } else {
        text1.value += 'NG: ' + String(p[i]) + ' => ' + String(r[i]) + ' Was:' + x + '\r\n';
      }
    } catch (s) {
      text1.value += 'runtime error for: ' + p[i] + '\r\n';
    }
  }
}