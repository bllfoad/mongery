import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
      en: {
        translation: {
          table: {
            customer: 'Customer',
            orderNumber: 'Order Number',
            orderDate: 'Date',
            totalQuantity: 'Total Quantity',
            revenue: 'Revenue',
            cost: 'Cost',
            profit: 'Profit',
            netProfit: 'Net Profit',
            productName: 'Product Name',
            quantity: 'Quantity',
            invoiceNumber: 'Invoice Number'
          }
        }
      }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
