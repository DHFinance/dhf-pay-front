## Установка

```bash
$ npm install
```

## Создание .env
Создайте .env файл (для образца дан env.sample)

```bash
#Адрес casper-back
NEXT_PUBLIC_API_HOST=http://localhost:3010
#Режим работы фронта. При значении 0 работает с signer и создает настоящие транзации, зарегистрированные в casper (пока доступно только на localhost). При 1 - фейковый режим для прочих доменов, транзакции захардкожены и создаются без участия signer
NEXT_PUBLIC_FAKE_TRANSACTION=1
```

## Запуск

После запуска casper-back и casper-processor нужно запустить casper-front

```bash
$ npm run build
$ npm run start
```

## Документация

https://docs.google.com/document/d/16gjZYStFkGj4mOCMaZ0eakzmvK5DQaYW00nn2JZnmoY/edit
