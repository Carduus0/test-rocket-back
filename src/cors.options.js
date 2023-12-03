module.exports = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONT_URL,
    'http://https://scarduus.amocrm.ru/leads',
    'http://www.scarduus.amocrm.ru',
  ],
  //   methods: 'POST',
  credentials: false,
  optionsSuccessStatus: 204,
};
