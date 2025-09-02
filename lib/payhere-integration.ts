import * as crypto from 'crypto';

interface PayHereConfig {
  _merchantId: string;
  _secretKey: string;
  _sandboxMode: boolean;
}

interface PayHerePaymentRequest {
  _merchantid: string;
  _return_url: string;
  _cancel_url: string;
  _notify_url: string;
  _first_name: string;
  _last_name: string;
  _email: string;
  _phone: string;
  _address: string;
  _city: string;
  _country: string;
  _orderid: string;
  _items: string;
  _currency: string;
  _amount: number;
  custom_1?: string;
  custom_2?: string;
  _hash: string;
}

interface PayHereInstallmentPlan {
  _planId: string;
  _name: string;
  _installments: number;
  _interestRate: number;
  _processingFee: number;
  _minAmount: number;
  _maxAmount: number;
}

export class PayHereIntegration {
  private config: PayHereConfig;
  private _baseUrl: string;

  constructor() {
    this.config = {
      merchantId: process.env.PAYHERE_MERCHANT_ID || '',
      secretKey: process.env.PAYHERE_SECRET_KEY || '',
      sandboxMode: process.env.PAYHERE_SANDBOX_MODE === 'true',
    };

    this.baseUrl = this.config.sandboxMode
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';
  }

  // Create payment request for various payment methods
  async createPaymentRequest(paymentData: {
    _orderId: string;
    _amount: number;
    _currency: string;
    customer: {
      _firstName: string;
      _lastName: string;
      _email: string;
      _phone: string;
      _address: string;
      _city: string;
    };
    _items: string;
    _returnUrl: string;
    _cancelUrl: string;
    _notifyUrl: string;
    customFields?: Record<string, string>;
  }): Promise<PayHerePaymentRequest> {
    const paymentRequest: PayHerePaymentRequest = {
      merchantid: this.config.merchantId,
      return_url: paymentData.returnUrl,
      cancel_url: paymentData.cancelUrl,
      notify_url: paymentData.notifyUrl,
      first_name: paymentData.customer.firstName,
      last_name: paymentData.customer.lastName,
      email: paymentData.customer.email,
      phone: paymentData.customer.phone,
      address: paymentData.customer.address,
      city: paymentData.customer.city,
      country: 'Sri Lanka',
      orderid: paymentData.orderId,
      items: paymentData.items,
      currency: paymentData.currency,
      amount: paymentData.amount,
      custom_1: paymentData.customFields?.custom_1 || '',
      custom_2: paymentData.customFields?.custom_2 || '',
      hash: '',
    };

    // Generate hash for security
    paymentRequest.hash = this.generateHash(paymentRequest);

    return paymentRequest;
  }

  // Create installment payment plan
  async createInstallmentPayment(paymentData: {
    _orderId: string;
    _totalAmount: number;
    _installments: number;
    _customer: any;
    _items: string;
    _returnUrl: string;
    _cancelUrl: string;
    _notifyUrl: string;
  }): Promise<{
    _paymentUrl: string;
    installmentPlan: PayHereInstallmentPlan;
    _monthlyPayment: number;
  }> {
    const installmentPlan = this.getInstallmentPlan(
      paymentData.installments,
      paymentData.totalAmount
    );
    const monthlyPayment = this.calculateMonthlyPayment(
      paymentData.totalAmount,
      installmentPlan
    );

    const paymentRequest = await this.createPaymentRequest({
      orderId: `${paymentData.orderId}_INST_${installmentPlan.planId}`,
      amount: monthlyPayment,
      currency: 'LKR',
      customer: paymentData.customer,
      items: `${paymentData.items} (Installment ${installmentPlan.planId})`,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      notifyUrl: paymentData.notifyUrl,
      customFields: {
        custom_1: `installment_plan:${installmentPlan.planId}`,
        custom_2: `total_amount:${paymentData.totalAmount}:installments:${installmentPlan.installments}`,
      },
    });

    const paymentUrl = this.buildPaymentUrl(paymentRequest);

    return {
      paymentUrl,
      installmentPlan,
      monthlyPayment,
    };
  }

  // Create eZ Cash payment
  async createEzCashPayment(paymentData: {
    _orderId: string;
    _amount: number;
    _customer: any;
    _items: string;
    _returnUrl: string;
    _cancelUrl: string;
    _notifyUrl: string;
  }): Promise<{
    _paymentUrl: string;
    _paymentMethod: string;
  }> {
    const paymentRequest = await this.createPaymentRequest({
      orderId: `${paymentData.orderId}_EZCASH`,
      amount: paymentData.amount,
      currency: 'LKR',
      customer: paymentData.customer,
      items: `${paymentData.items} (eZ Cash)`,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      notifyUrl: paymentData.notifyUrl,
      customFields: {
        custom_1: 'payment_method:ezcash',
      },
    });

    const paymentUrl = this.buildPaymentUrl(paymentRequest);

    return {
      paymentUrl,
      paymentMethod: 'eZ Cash',
    };
  }

  // Create mCash payment
  async createMCashPayment(paymentData: {
    _orderId: string;
    _amount: number;
    _customer: any;
    _items: string;
    _returnUrl: string;
    _cancelUrl: string;
    _notifyUrl: string;
  }): Promise<{
    _paymentUrl: string;
    _paymentMethod: string;
  }> {
    const paymentRequest = await this.createPaymentRequest({
      orderId: `${paymentData.orderId}_MCASH`,
      amount: paymentData.amount,
      currency: 'LKR',
      customer: paymentData.customer,
      items: `${paymentData.items} (mCash)`,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      notifyUrl: paymentData.notifyUrl,
      customFields: {
        custom_1: 'payment_method:mcash',
      },
    });

    const paymentUrl = this.buildPaymentUrl(paymentRequest);

    return {
      paymentUrl,
      paymentMethod: 'mCash',
    };
  }

  // Create bank transfer payment
  async createBankTransferPayment(paymentData: {
    _orderId: string;
    _amount: number;
    _customer: any;
    _items: string;
    _returnUrl: string;
    _cancelUrl: string;
    _notifyUrl: string;
  }): Promise<{
    _paymentUrl: string;
    _paymentMethod: string;
    _bankDetails: any;
  }> {
    const paymentRequest = await this.createPaymentRequest({
      orderId: `${paymentData.orderId}_BANK`,
      amount: paymentData.amount,
      currency: 'LKR',
      customer: paymentData.customer,
      items: `${paymentData.items} (Bank Transfer)`,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      notifyUrl: paymentData.notifyUrl,
      customFields: {
        custom_1: 'payment_method:bank_transfer',
      },
    });

    const paymentUrl = this.buildPaymentUrl(paymentRequest);

    const bankDetails = {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '1234567890',
      accountName: 'WeddingLK (Pvt) Ltd',
      branch: 'Colombo 03',
      swiftCode: 'CCEYLKLX',
      reference: paymentData.orderId,
    };

    return {
      paymentUrl,
      paymentMethod: 'Bank Transfer',
      bankDetails,
    };
  }

  // Verify payment notification
  verifyPaymentNotification(_notificationData: any): {
    _isValid: boolean;
    _paymentStatus: string;
    _orderId: string;
    _amount: number;
    _transactionId: string;
  } {
    try {
      const receivedHash = notificationData.hash;
      const calculatedHash = this.generateHash(notificationData);

      const isValid = receivedHash === calculatedHash;

      return {
        isValid,
        paymentStatus: notificationData.payment_status || 'unknown',
        orderId: notificationData.order_id || '',
        amount: parseFloat(notificationData.payhere_amount || '0'),
        transactionId: notificationData.payment_id || '',
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        isValid: false,
        paymentStatus: 'verification_failed',
        orderId: '',
        amount: 0,
        transactionId: '',
      };
    }
  }

  // Get available installment plans
  getAvailableInstallmentPlans(): PayHereInstallmentPlan[] {
    return [
      {
        planId: '3_MONTHS',
        name: '3 Months Installment',
        installments: 3,
        interestRate: 0,
        processingFee: 500,
        minAmount: 50000,
        maxAmount: 500000,
      },
      {
        planId: '6_MONTHS',
        name: '6 Months Installment',
        installments: 6,
        interestRate: 2.5,
        processingFee: 750,
        minAmount: 100000,
        maxAmount: 1000000,
      },
      {
        planId: '12_MONTHS',
        name: '12 Months Installment',
        installments: 12,
        interestRate: 5.0,
        processingFee: 1000,
        minAmount: 200000,
        maxAmount: 2000000,
      },
    ];
  }

  // Helper methods
  private generateHash(data: any): string {
    const hashString =
      Object.keys(data)
        .filter(key => key !== 'hash')
        .sort()
        .map(key => `${key}=${data[key]}`)
        .join('&') + this.config.secretKey;

    return crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();
  }

  public buildPaymentUrl(paymentRequest: PayHerePaymentRequest): string {
    const params = new URLSearchParams();

    Object.entries(paymentRequest).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    return `${this.baseUrl}?${params.toString()}`;
  }

  private getInstallmentPlan(
    _installments: number,
    _amount: number
  ): PayHereInstallmentPlan {
    const plans = this.getAvailableInstallmentPlans();
    const plan = plans.find(
      p =>
        p.installments === installments &&
        amount >= p.minAmount &&
        amount <= p.maxAmount
    );

    if (!plan) {
      throw new Error(
        `No suitable installment plan found for ${installments} installments and amount ${amount}`
      );
    }

    return plan;
  }

  private calculateMonthlyPayment(
    _totalAmount: number,
    plan: PayHereInstallmentPlan
  ): number {
    const interestAmount = (totalAmount * plan.interestRate) / 100;
    const totalWithInterest = totalAmount + interestAmount + plan.processingFee;
    return Math.ceil(totalWithInterest / plan.installments);
  }

  // Get payment status
  async getPaymentStatus(_orderId: string): Promise<{
    _status: string;
    _amount: number;
    _transactionId: string;
    _paymentMethod: string;
    paidAt?: Date;
  }> {
    // This would typically make an API call to PayHere
    // For now, return mock data
    return {
      status: 'completed',
      amount: 0,
      transactionId: `txn_${Date.now()}`,
      paymentMethod: 'credit_card',
      paidAt: new Date(),
    };
  }

  // Process refund
  async processRefund(
    _transactionId: string,
    _amount: number,
    _reason: string
  ): Promise<{
    success: boolean;
    _refundId: string;
    _message: string;
  }> {
    // This would make an API call to PayHere for refund
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      message: 'Refund processed successfully',
    };
  }
}

export const payHereIntegration = new PayHereIntegration();
