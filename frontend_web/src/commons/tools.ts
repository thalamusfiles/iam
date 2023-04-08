const ACCENT_STRINGS = 'ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËẼÌÍÎÏĨÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëẽìíîïĩðñòóôõöøùúûüýÿ';
const NO_ACCENT_STRINGS = 'SOZsozYYuAAAAAAACEEEEEIIIIIDNOOOOOOUUUUYsaaaaaaaceeeeeiiiiionoooooouuuuyy';
const FROM = decodeURIComponent(ACCENT_STRINGS).split('');

export const toIlikeRegex = (text: string, toregexp: boolean = true): string | RegExp => {
  text = text || '';
  let regex: any = {};
  //Criar um array de letras similares. Ex a: aáã
  NO_ACCENT_STRINGS.split('').forEach((value: any, idx: number) => {
    if (regex[value]) regex[value] += FROM[idx];
    else regex[value] = value;
  });
  //Busca no texto estas letras e substitui por todas as possibilidades
  Object.entries(regex).forEach(([key, value]) => {
    text = text.replace(new RegExp(`[${value}]`), `_${key}_`);
  });
  Object.entries(regex).forEach(([key, value]) => {
    text = text.replace(new RegExp(`_${key}_`), `[${value}]`);
  });

  return toregexp ? new RegExp(`.*${text}.*`, 'i') : `/.*${text}.*/i`;
};

/**
 * Coleta as informações do objeto conforme o caminho informato
 * @param objectArray
 * @param path
 * @returns
 */
export const flatFromPath = (objectArray: any | any[], path: string[]): any => {
  const nextPath = path.shift()!;
  const data = objectArray[nextPath];
  if (Array.isArray(data)) {
    return data.map((rowData) => flatFromPath(rowData, path)).flat();
  } else {
    if (path.length) {
      return flatFromPath(data, path);
    } else {
      return data;
    }
  }
};
