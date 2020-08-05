const db =  document.getElementById('DB');
const result = document.getElementById('result');
const clipboard = new ClipboardJS('#btnCopy');

const changeType = (_type) => {
  if (_type == null) return '';

  const type = _type.toLowerCase();
  if (type == 'char' || type === 'varchar')  return 'string';
  if (type === 'tinyint' ) return 'byte';
  if (type === 'smallint') return 'short';
  if (type === 'datetime') return 'DateTime';
  return type;
}

db.addEventListener('change', (ev) => {
  result.innerText = '';
  const allLineText = ev.target.value;
  const texts = allLineText.split(/\n/);
  const generatedText = texts.map(text => {
    const items = text.split(/\t/);
    if (items.length < 1) return '';

    const physicalName =  items[1];
    const logicalName = items[0];
    const type = items[2];

    return `
    /// <summary>
    /// ${logicalName}
    /// </summary>
    public ${changeType(type)} ${physicalName} { get; set; }`
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