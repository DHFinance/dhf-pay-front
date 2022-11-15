import { CurrencyType } from '../../enums/currency.enum';
import { BaseCurrency } from './baseCurrency';
import { Bitcoin } from './bitcoin';
import { Casper } from './casper';
import { Doge } from './doge';
import { Ethereum } from './ethereum';
import { USDT } from './usdt';

class CurrencyFabric {
  static create(currency: CurrencyType): BaseCurrency {
    switch (currency) {
      case CurrencyType.Bitcoin: {
        return new Bitcoin();
      }
      case CurrencyType.Doge: {
        return new Doge();
      }
      case CurrencyType.USDT: {
        return new USDT();
      }
      case CurrencyType.Casper: {
        return new Casper();
      }
      case CurrencyType.Ethereum: {
        return new Ethereum();
      }
    }
  }
}

export { CurrencyFabric };
