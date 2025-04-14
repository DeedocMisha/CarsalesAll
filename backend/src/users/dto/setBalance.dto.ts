export class postBalanceDto {
  UserId: number;
  balance: number;
  paymentMethod?: 'card' | 'bankTransfer'; // Добавляем метод оплаты
  cardDetails?: {  // Опциональные данные карты
    number?: string;
    expiry?: string;
    cvc?: string;
  };
}