

const inputs = document.querySelectorAll('input');
const selects = document.querySelectorAll('select');
const textareas = document.querySelectorAll('textarea');
const result = document.getElementById('result');
const clipboard = new ClipboardJS('#btnCopy');



const addEventCallback = (elem) => {
  elem.addEventListener('change', ev => {
    createText();
  })
}

inputs.forEach(addEventCallback);
selects.forEach(addEventCallback);
textareas.forEach(addEventCallback);

const createParam = (value) => {
  // physical logical
  const rows = value.trim().split(/\n/);
  if (rows.length === 0 || rows[0] === '') return '';
  const texts = rows.map((current) => {
    const items = current.split(/\s/);
    const logicalName = items[0] || '';
    const physicalName =  items[1] || '';

    const param = 
`/// <param name="${physicalName}">${logicalName}</param>`;
    return param;
  }, '\n');
  return '\n' + texts.join('\n');
}

const createText = () => {
  const obj = {};
  const callback = elem => {
    const id = elem.id;
    if (id === 'params') {
      obj[id] = createParam(elem.value);
      return;
    }
    if (elem.type !== 'date') {
      obj[id] = elem.value.trim().replace('\n', '\n/// ');
      return;
    }
    obj[id] = elem.value.replace(/-/g, '/');
  }

  Array.from(inputs).forEach(callback);
  Array.from(selects).forEach(callback);
  Array.from(textareas).forEach(callback);

  const text =  `
/// ******************************************************************************
/// ${obj['type']}名：${obj['name']}
/// <summary>
/// ${obj['summary']}
/// </summary>
/// <remarks>
/// ${obj['remarks']}
/// </remarks>${obj['params']}
/// ******************************************************************************
///   更新履歴
///   項番    更新日付    会社名    担当者    更新内容
///   ${obj['serial']}    ${obj['updateDate']}  ${obj['corp']}     ${obj['developer']}      ${obj['content']}
/// ******************************************************************************
`

  result.value = text;
}

const init = () => {
  const date = document.getElementById('updateDate');
  date.value = moment().format('YYYY-MM-DD');
}


clipboard.on('success', function (e) {
  e.clearSelection();
  const information = document.getElementById("information");
  information.classList.remove('hide');
  setTimeout(() => {
    information.classList.add('hide');
  }, 3000);
});

document.addEventListener("DOMContentLoaded", function(event) { 
  init();
});
