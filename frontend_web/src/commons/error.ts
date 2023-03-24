/**
 * Transforma a exceção FormException vinda do servidor em um objecto com os erros
 * @param responseData: Axios responsa data
 * @param ignoreKindsToMessage: Lista de itens que será ignora na mensagem principal
 */
export const getFormExceptionErrosToObject = (responseData: any, ignoreKindsToMessage: string[] = []): [string, any] => {
  const messages: Array<string> = [];
  const erros: Record<string, string> = {};

  if (responseData) {
    if (responseData.errors?.length) {
      for (const { kind, error } of responseData.errors) {
        if (kind) {
          erros[kind] = error;
        }
        if (!ignoreKindsToMessage.includes(kind) && error) {
          messages.push(error);
        }
      }
    } else if (responseData.message) {
      messages.push(responseData.message);
    }
  }
  return [messages.join('; '), erros];
};
