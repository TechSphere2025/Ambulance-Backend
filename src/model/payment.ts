export interface Payment {
    id: string;
    currencyType : string;
    amount : number;
    discount : number;
    totalAmount: number;
    status: number;
}

export const paymentSchema = {
    currencyType : {type: String, required: true},
    amount : {type: Number, required: true},
    discount : {type: Number, required: true},
    totalAmount: {type: Number, required: true},
    status: {type: Number, required: true}
}