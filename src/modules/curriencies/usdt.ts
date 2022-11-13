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

  validate(): void {}
}

export { USDT };
