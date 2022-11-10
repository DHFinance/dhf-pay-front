export const CSPRtoUSD = (balance: number, course: number) => {
  const usdBalance = ((balance / 1000000000) * course).toFixed(2);
  return usdBalance || null;
};

export const CSPRtoUsd = (balance: number, course: number) => {
  const usdBalance = (balance * course).toFixed(2);
  return usdBalance || null;
};
