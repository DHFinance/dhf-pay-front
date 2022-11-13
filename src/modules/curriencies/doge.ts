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

  validate(): void {
  }
}

export { Doge };
