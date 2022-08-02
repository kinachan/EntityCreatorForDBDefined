const db =  document.getElementById('DB');
const result = document.getElementById('result');
const clipboard = new ClipboardJS('#btnCopy');


const converter = {
  toCamelCase(str) {
    str = str.charAt(0).toLowerCase() + str.slice(1);
    return str.replace(/[-_](.)/g, (match, group1) => {
        return group1.toUpperCase();
    });
  },
    
  toSnakeCase(str) {
    const camel = converter.toCamelCase(str);
    return camel.replace(/[A-Z]/g, (s) => {
      return "_" + s.charAt(0).toLowerCase();
    });
  },
  
  toPascalCase(str) {
    const camel = converter.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },

  toConstant(str) {
    const snake = converter.toSnakeCase(str);
    return snake.toUpperCase();
  }
}


const changeType = (_type, notNull) => {
  if (_type == null) return '';

  const type = _type.toLowerCase().trim();
  if (type === 'uuid') return 'Guid' + notNull;
  if (type.includes('varchar') || type === 'text'
    || type.includes('char')) return 'string';
  if (type === 'boolean') return 'bool'+ notNull;
  if (type === 'tinyint' ) return 'byte' + notNull;
  if (type === 'smallint') return 'short' + notNull;
  if (type === 'datetime' || type === 'timestamp') return 'DateTime' + notNull;
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
    const notNullSection = items[4] != null ? items[4].trim() : '';
    const nullMark = notNullSection === 'NOT NULL' ? '' : '?';
    return `
    /// <summary>
    /// ${logicalName}
    /// </summary>
    public ${changeType(type, nullMark)} ${converter.toPascalCase(physicalName)} { get; set; }`
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