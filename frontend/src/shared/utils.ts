export const addClass = (classString: string, className: string): string => {
  if (classString.includes(className)) {
    return classString;
  } else {
    return `${classString} ${className}`;
  }
};

export const substractClass = (
  classString: string,
  className: string
): string => {
  const classNameWithSeperator = ` ${className}`;
  if (classString.includes(classNameWithSeperator)) {
    return classString.replace(classNameWithSeperator, '');
  } else {
    return classString;
  }
};

export const increaseNumber = (currentNumber: number, maxNumber: number) =>
  currentNumber + 1 > maxNumber ? maxNumber : currentNumber + 1;

export const decreaseNumber = (currentNumber: number, minNumber: number = 0) =>
  currentNumber - 1 < minNumber ? minNumber : currentNumber - 1;
