const db =  document.getElementById('DB');
const result = document.getElementById('result');
const clipboard = new ClipboardJS('#btnCopy');


db.addEventListener('change', (ev) => {
  result.innerText = '';
  const allLineText = ev.target.value;
  const texts = allLineText.split(/\n/);
  const generatedText = texts.map(text => {
    const items = text.split(/\t/);
    if (items.length < 1) return '';

    const physicalName =  items[1];
    const logicalName = items[0];

    return `
    /// <summary>
    /// ${logicalName}
    /// </summary>
    public string ${physicalName} { get; set; }`
  }).join('\n');
  result.value = generatedText;
});

clipboard.on('success', function (e) {
  e.clearSelection();
  const information = document.getElementById("information");
  information.classList.remove('hide');
  setTimeout(() => {
    information.classList.add('hide');
  }, 3000);
});