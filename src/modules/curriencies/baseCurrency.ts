abstract class BaseCurrency {
  abstract getCourse(): void;

  abstract validateWallet(wallet: string): boolean;
}

export { BaseCurrency };
