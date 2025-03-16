import {TypeEntity} from "./type.entity.ts";
import {CategoryEntity} from "./category.entity.ts";

export interface BalanceEntity{
    id?: number;
    name?: string;
    userId?: number;
    type: TypeEntity,
    date: Date;
    value: number;
    category: CategoryEntity;
    comment: string;
    planned?: number;
}

export interface FormData extends BalanceEntity {
    id?: number;
    type: TypeEntity;
    date: Date;
    value: number;
    category: CategoryEntity;
    comment: string; 
  }