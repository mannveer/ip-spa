interface Purchase {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    receipt: string;
    offer_id: string;
    attempts: number;
    notes: Array<any>;
    created_at: number;
  }
  
  export interface UserFile extends Document {
    name: string;
    email: string;
    role: 'user' | 'admin' | 'provider';
    purchases: Purchase[];
    createdAt: Date;
    updatedAt: Date;
  }