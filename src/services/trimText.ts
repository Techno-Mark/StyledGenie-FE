const trimText = (
  text: string | null | undefined,
  maxLength: number = 50
): string => {
  if (!text) {
    return "";
  }
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export default trimText;
