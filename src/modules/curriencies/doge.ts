import { store } from '../../store/store';
import { BaseCurrency } from './baseCurrency';
import { getCourse } from '../../store/slices/course/asyncThunks/getCourse';

class Doge extends BaseCurrency {
  getCourse(): void {
    store.dispatch(
      // @ts-ignore
      getCourse('binance-peg-dogecoin'),
    );
  }

  validateWallet(wallet: string): boolean {
    return /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(wallet);
  }
}

export { Doge };
