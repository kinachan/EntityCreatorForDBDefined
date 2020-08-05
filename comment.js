

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



const createText = () => {
  const obj = {};
  const callback = elem => {
    const id = elem.id;
    if (elem.type !== 'date') {
      obj[id] = elem.value;
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
/// </remarks>
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

init();
