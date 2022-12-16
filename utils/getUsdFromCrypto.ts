function getUsdFromCrypto(amount: number, course: number) {
  return ((+amount / 1000000000) * course).toFixed(2);
}

export { getUsdFromCrypto };
