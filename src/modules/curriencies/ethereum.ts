import { getCourse } from '../../store/slices/course/asyncThunks/getCourse';
import { store } from '../../store/store';
import { BaseCurrency } from './baseCurrency';

class Ethereum extends BaseCurrency {
  getCourse(): void {
    store.dispatch(
      // @ts-ignore
      getCourse(
        'ethereum',
      ),
    );
  }

  validate(): void {}
}

export { Ethereum };
