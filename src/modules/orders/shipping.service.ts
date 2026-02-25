import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShippingType } from '../../entities/order.entity';

export interface ShippingOption {
  type: ShippingType;
  name: string;
  description: string;
  estimatedDays: number;
  price: number;
  enabled: boolean;
}

@Injectable()
export class ShippingService {
  constructor(private configService: ConfigService) {}

  /**
   * Obtiene todos los tipos de envío disponibles
   */
  getAvailableShippingTypes(): ShippingOption[] {
    return [
      {
        type: ShippingType.CHILEXPRESS,
        name: 'Chilexpress',
        description: 'Envío rápido y seguro a todo Chile',
        estimatedDays: 2,
        price: this.getShippingPrice(ShippingType.CHILEXPRESS),
        enabled: this.isShippingEnabled(ShippingType.CHILEXPRESS),
      },
      {
        type: ShippingType.CORREOS_CHILE,
        name: 'Correos de Chile',
        description: 'Envío económico por correo postal',
        estimatedDays: 5,
        price: this.getShippingPrice(ShippingType.CORREOS_CHILE),
        enabled: this.isShippingEnabled(ShippingType.CORREOS_CHILE),
      },
      {
        type: ShippingType.STARKEN,
        name: 'Starken',
        description: 'Envío confiable a todo el país',
        estimatedDays: 3,
        price: this.getShippingPrice(ShippingType.STARKEN),
        enabled: this.isShippingEnabled(ShippingType.STARKEN),
      },
      {
        type: ShippingType.MOTOCICLETA,
        name: 'Envío en Motocicleta',
        description: 'Entrega rápida en Santiago (solo RM)',
        estimatedDays: 1,
        price: this.getShippingPrice(ShippingType.MOTOCICLETA),
        enabled: this.isShippingEnabled(ShippingType.MOTOCICLETA),
      },
      {
        type: ShippingType.RETIRO_TIENDA,
        name: 'Retiro en Tienda',
        description: 'Retira tu pedido en nuestro local',
        estimatedDays: 0,
        price: 0,
        enabled: true, // Siempre disponible
      },
    ].filter(option => option.enabled);
  }

  /**
   * Obtiene el precio de envío según el tipo
   */
  private getShippingPrice(type: ShippingType): number {
    // Precios base (en CLP)
    const basePrices: Record<ShippingType, number> = {
      [ShippingType.CHILEXPRESS]: 5000,
      [ShippingType.CORREOS_CHILE]: 3000,
      [ShippingType.STARKEN]: 4500,
      [ShippingType.MOTOCICLETA]: 3500,
      [ShippingType.RETIRO_TIENDA]: 0,
    };

    // Verificar si hay precio personalizado en variables de entorno
    const envKey = `SHIPPING_${type.toUpperCase()}_PRICE`;
    const envPrice = this.configService.get<number>(envKey);
    
    return envPrice || basePrices[type] || 0;
  }

  /**
   * Verifica si un tipo de envío está habilitado
   */
  private isShippingEnabled(type: ShippingType): boolean {
    // Verificar variable de entorno específica
    const envKey = `SHIPPING_${type.toUpperCase()}_ENABLED`;
    const envEnabled = this.configService.get<string>(envKey);
    
    if (envEnabled !== undefined) {
      return envEnabled.toLowerCase() === 'true';
    }

    // Por defecto, todos están habilitados excepto si hay configuración específica
    return true;
  }

  /**
   * Simula la creación de un envío con el proveedor
   */
  async createShipment(
    shippingType: ShippingType,
    orderNumber: string,
    customerName: string,
    address: string,
    phone: string,
  ): Promise<{ trackingNumber: string; estimatedDelivery: Date }> {
    // Simulación de integración con proveedores de envío
    // En producción, aquí se harían llamadas reales a las APIs

    const trackingNumber = this.generateTrackingNumber(shippingType);
    const estimatedDays = this.getEstimatedDays(shippingType);
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays);

    // Simular llamadas a APIs según el tipo
    switch (shippingType) {
      case ShippingType.CHILEXPRESS:
        return this.simulateChilexpress(orderNumber, customerName, address, phone, trackingNumber, estimatedDelivery);
      
      case ShippingType.CORREOS_CHILE:
        return this.simulateCorreosChile(orderNumber, customerName, address, phone, trackingNumber, estimatedDelivery);
      
      case ShippingType.STARKEN:
        return this.simulateStarken(orderNumber, customerName, address, phone, trackingNumber, estimatedDelivery);
      
      case ShippingType.MOTOCICLETA:
        return this.simulateMotocicleta(orderNumber, customerName, address, phone, trackingNumber, estimatedDelivery);
      
      case ShippingType.RETIRO_TIENDA:
        return {
          trackingNumber: `RETIRO-${orderNumber}`,
          estimatedDelivery: new Date(),
        };
      
      default:
        throw new Error(`Tipo de envío no soportado: ${shippingType}`);
    }
  }

  /**
   * Simula integración con Chilexpress
   */
  private async simulateChilexpress(
    orderNumber: string,
    customerName: string,
    address: string,
    phone: string,
    trackingNumber: string,
    estimatedDelivery: Date,
  ): Promise<{ trackingNumber: string; estimatedDelivery: Date }> {
    // Simular llamada a API de Chilexpress
    const apiKey = this.configService.get<string>('CHILEXPRESS_API_KEY') || 'simulated_key';
    const apiUrl = this.configService.get<string>('CHILEXPRESS_API_URL') || 'https://api.chilexpress.cl';
    
    console.log(`[SIMULACIÓN] Creando envío Chilexpress para orden ${orderNumber}`);
    console.log(`[SIMULACIÓN] API URL: ${apiUrl}`);
    console.log(`[SIMULACIÓN] API Key: ${apiKey.substring(0, 10)}...`);
    
    // En producción, aquí se haría:
    // const response = await fetch(`${apiUrl}/shipments`, {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${apiKey}` },
    //   body: JSON.stringify({ orderNumber, customerName, address, phone })
    // });
    
    return { trackingNumber, estimatedDelivery };
  }

  /**
   * Simula integración con Correos de Chile
   */
  private async simulateCorreosChile(
    orderNumber: string,
    customerName: string,
    address: string,
    phone: string,
    trackingNumber: string,
    estimatedDelivery: Date,
  ): Promise<{ trackingNumber: string; estimatedDelivery: Date }> {
    const apiKey = this.configService.get<string>('CORREOS_CHILE_API_KEY') || 'simulated_key';
    const apiUrl = this.configService.get<string>('CORREOS_CHILE_API_URL') || 'https://api.correos.cl';
    
    console.log(`[SIMULACIÓN] Creando envío Correos de Chile para orden ${orderNumber}`);
    console.log(`[SIMULACIÓN] API URL: ${apiUrl}`);
    
    return { trackingNumber, estimatedDelivery };
  }

  /**
   * Simula integración con Starken
   */
  private async simulateStarken(
    orderNumber: string,
    customerName: string,
    address: string,
    phone: string,
    trackingNumber: string,
    estimatedDelivery: Date,
  ): Promise<{ trackingNumber: string; estimatedDelivery: Date }> {
    const apiKey = this.configService.get<string>('STARKEN_API_KEY') || 'simulated_key';
    const apiUrl = this.configService.get<string>('STARKEN_API_URL') || 'https://api.starken.cl';
    
    console.log(`[SIMULACIÓN] Creando envío Starken para orden ${orderNumber}`);
    console.log(`[SIMULACIÓN] API URL: ${apiUrl}`);
    
    return { trackingNumber, estimatedDelivery };
  }

  /**
   * Simula envío en motocicleta (local)
   */
  private async simulateMotocicleta(
    orderNumber: string,
    customerName: string,
    address: string,
    phone: string,
    trackingNumber: string,
    estimatedDelivery: Date,
  ): Promise<{ trackingNumber: string; estimatedDelivery: Date }> {
    const apiKey = this.configService.get<string>('MOTOCICLETA_API_KEY') || 'simulated_key';
    
    console.log(`[SIMULACIÓN] Programando envío en motocicleta para orden ${orderNumber}`);
    console.log(`[SIMULACIÓN] Dirección: ${address}`);
    
    return { trackingNumber, estimatedDelivery };
  }

  /**
   * Genera un número de seguimiento según el tipo
   */
  private generateTrackingNumber(type: ShippingType): string {
    const prefix: Record<ShippingType, string> = {
      [ShippingType.CHILEXPRESS]: 'CLX',
      [ShippingType.CORREOS_CHILE]: 'CCL',
      [ShippingType.STARKEN]: 'STK',
      [ShippingType.MOTOCICLETA]: 'MOT',
      [ShippingType.RETIRO_TIENDA]: 'RET',
    };

    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix[type]}-${Date.now().toString(36).toUpperCase()}-${random}`;
  }

  /**
   * Obtiene días estimados de entrega
   */
  private getEstimatedDays(type: ShippingType): number {
    const days: Record<ShippingType, number> = {
      [ShippingType.CHILEXPRESS]: 2,
      [ShippingType.CORREOS_CHILE]: 5,
      [ShippingType.STARKEN]: 3,
      [ShippingType.MOTOCICLETA]: 1,
      [ShippingType.RETIRO_TIENDA]: 0,
    };

    return days[type] || 3;
  }
}
