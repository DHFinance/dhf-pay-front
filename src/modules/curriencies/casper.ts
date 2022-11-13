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

  validate(): void {}
}

export { Casper };
