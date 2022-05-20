export const singleKindOfElementCheck = <T>(array: T[], key: string) => {
  const keyArray = array.map((item) => {
    return item[key];
  })

  return new Set(keyArray).size <= 1;
}