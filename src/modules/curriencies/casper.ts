import { CLPublicKey } from 'casper-js-sdk';
import { getCourse } from '../../store/slices/course/asyncThunks/getCourse';
import { store } from '../../store/store';
import { BaseCurrency } from './baseCurrency';

class Casper extends BaseCurrency {
  getCourse(): void {
    store.dispatch(
      // @ts-ignore
      getCourse(
        'casper-network',
      ),
    );
  }

  validateWallet(wallet: string): boolean {
    try {
      CLPublicKey.fromHex(wallet);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export { Casper };
