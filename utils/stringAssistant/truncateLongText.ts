export function truncateLongText(textLine: string, digit: number) {
    return textLine?.length > digit
      ? `${textLine.substring(0, digit)}...`
      : textLine;
  }