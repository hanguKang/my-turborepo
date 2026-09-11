export const isValidBusinessNo = (value: string): boolean => {
  const clean = value.replace(/-/g, '');
  if (clean.length !== 10) return false;
  // 사업자등록번호 체크섬 검증 로직...
  return true;
};

export const isValidPhone = (value: string): boolean => {
  return /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/.test(value);
};

export const isValidLoanAmount = (value:number, collateral:number):boolean => {
  return collateral > value; 
}