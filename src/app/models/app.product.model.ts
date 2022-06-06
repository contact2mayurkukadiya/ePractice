export class ProductModel {
  id: string;
  parentBusinessId: string;
  productLogo: string;
  productCode: string;
  medicareCode: string;
  dvaCode: string;
  productName: string;
  description: string;
  supplierId: string;
  serialNumber: string;
  costPrice: number;
  salePrice: number;
  priceWithTaxOption: string;
  unitOfMeasurement: number;
  taxTypeId: string;
  taxOptionId: number;
  productLocation: ProductLocationModel[];
  minimumStock: number;
  currentStock: number;
  status: string;
  locationName: any;
}

export class ProductLocationModel {
  productId?: string;
  locationId: string;
  isStatus?: boolean;
}
