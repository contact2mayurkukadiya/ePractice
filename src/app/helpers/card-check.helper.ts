export const cardCheck = (cardNumber: string): boolean => {
  if (!cardNumber.length) {
    return;
  }

  // Remove all whitespaces from card number.
  cardNumber = cardNumber.replace(/\s/g, '');

  // 1. Remove last digit;
  const lastDigit = Number(cardNumber[cardNumber.length - 1]);

  // 2. Reverse card number
  const reverseCardNumber = cardNumber
    .slice(0, cardNumber.length - 1)
    .split('')
    .reverse()
    .map((x) => Number(x));
  let sum = 0;

  // 3. + 4. Multiply by 2 every digit on odd position. Subtract 9 if digit > 9
  for (let i = 0; i <= reverseCardNumber.length - 1; i += 2) {
    reverseCardNumber[i] = reverseCardNumber[i] * 2;
    if (reverseCardNumber[i] > 9) {
      reverseCardNumber[i] = reverseCardNumber[i] - 9;
    }
  }

  // 5. Make the sum of obtained values from step 4.
  sum = reverseCardNumber.reduce((acc, currValue) => acc + currValue, 0);

  // 6. Calculate modulo 10 of the sum from step 5. and the last digit. If it's 0, you have a valid card number :)
  return (sum + lastDigit) % 10 === 0;
};

export const medicareCardCheck = (medicare: string): boolean => {
  let isValid = false;

  if (medicare && medicare.length === 10) {
    const matches = medicare.match(/^(\d{8})(\d)/);

    if (!matches) {
      return true;
    }

    const base = matches[1];
    const checkDigit = matches[2];
    const weights = [1, 3, 7, 9, 1, 3, 7, 9];

    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(base[i], 10) * weights[i];
    }

    isValid = sum % 10 === parseInt(checkDigit, 10);
  }

  return isValid;
};

export const dvaCardCheck = (dva: string): boolean => {
  if (dva.length < 8 || dva.length > 9) {
    return false;
  }

  if (dva === '000000000' || dva === '00000000') {
    return false;
  }
  let value = dva.charAt(0);
  if (isNumber(value)) {
    return false;
  }
  value = dva.charAt(8);
  if (dva.length === 9 && isNumber(value)) {
    return false;
  }
  return true;
};

function isNumber(value: string | number): boolean {
  return value != null && value !== '' && !isNaN(Number(value.toString()));
}
