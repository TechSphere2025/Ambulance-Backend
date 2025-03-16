export interface address {
  id?: number;
  hospitalId: number;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  lat: number;
  long: number;
  status: number;
}

export const addressSchema = {
  hospitalId: { type: "number", required: true },
  addressLine1: { type: "string", required: true },
  addressLine2: { type: "string", required: true },
  landmark: { type: "string", required: true },
  city: { type: "string", required: true },
  state: { type: "string", required: true },
  lat: { type: "number", required: true },
  long: { type: "number", required: true },
  status: { type: "number", required: true },
};
