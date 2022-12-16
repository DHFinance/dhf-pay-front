import { store } from '../../store/store';
import { BaseCurrency } from './baseCurrency';
import { getCourse } from '../../store/slices/course/asyncThunks/getCourse';

class Bitcoin extends BaseCurrency {
  getCourse(): void {
    store.dispatch(
      // @ts-ignore
      getCourse('bitcoin'),
    );
  }

  validateWallet(wallet: string): boolean {
    return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(wallet);
  }
}

export { Bitcoin };
