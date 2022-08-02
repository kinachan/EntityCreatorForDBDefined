const db =  document.getElementById('DB');
const result = document.getElementById('result');
const clipboard = new ClipboardJS('#btnCopy');

const changeType = (_type, notNull) => {
  if (_type == null) return '';

  const type = _type.toLowerCase();
  if (type === 'uuid') return 'Guid';
  if (type.includes('varchar')) return 'string';
  if (type.includes('char')) return 'string';
  if (type === 'tinyint' ) return 'byte' + notNull;
  if (type === 'smallint') return 'short' + notNull;
  if (type === 'datetime') return 'DateTime' + notNull;
  return type + notNull;
}

db.addEventListener('change', (ev) => {
  result.innerText = '';
  const allLineText = ev.target.value.trim();
  const texts = allLineText.split(/\n/);
  const generatedText = texts.map(text => {
    const items = text.split(/\t/);
    if (items.length < 1) return '';

    const physicalName =  items[1];
    const logicalName = items[0];
    const type = items[2];
    const notNullSection = typeof(items[12]) !== 'undefined' ? items[12] : '○';
    const notNullMark = notNullSection == '○' ? '' : '?';
    return `
    /// <summary>
    /// ${logicalName}
    /// </summary>
    public ${changeType(type, notNullMark)} ${physicalName} { get; set; }`
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