import { getCourse } from '../../store/slices/course/asyncThunks/getCourse';
import { store } from '../../store/store';
import { BaseCurrency } from './baseCurrency';

class USDT extends BaseCurrency {
  getCourse(): void {
    store.dispatch(
      // @ts-ignore
      getCourse(
        'tether',
      ),
    );
  }

  validateWallet(wallet: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(wallet);
  }
}

export { USDT };
