export interface BalanceEntity{
    id?: string;
    user_email?: string;
    type_name: string | null;
    id_type: string,
    date: Date;
    value: number;
    category_name: string | null;
    id_category: string;
    comment: string;
    planned?: number;
}

export interface FormData extends BalanceEntity {
    id?: string;
    id_type: string;
    date: Date;
    value: number;
    id_category: string;
    comment: string; 
  };