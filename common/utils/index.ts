export const helper = {
  formatReceipt: (phoneNumber: string) => {
    try {
      if (phoneNumber.endsWith('@g.us')) {
        return phoneNumber;
      }
      let formattedNumber = phoneNumber.replace(/\D/g, '');
      if (formattedNumber.startsWith('0')) {
        formattedNumber = '62' + formattedNumber.substring(1);
      }
      if (!formattedNumber.endsWith('@c.us')) {
        formattedNumber += '@c.us';
      }
      return formattedNumber;
    } catch (error) {
      console.error('Error formatting receipt:', error);
      return phoneNumber;
    }
  },
};
