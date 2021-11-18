import { HookErrorCallback, HookSyncCallback } from 'mongoose';

export namespace IUser {
  export interface UserInformation {
    _id: string;
    username: string;
    email: string;
    name: string;
    surname: string;
    balance: number;
  }
  export interface UserProperties extends UserInformation {
    password: string;
    /**
     * Defines a pre hook for the document.
     */
    pre<T extends Document = Document>(
      method: 'init' | 'validate' | 'save' | 'remove',
      fn: HookSyncCallback<T>,
      errorCb?: HookErrorCallback
    ): this;
  }
}

export namespace IItem {
  export interface ItemInformation extends IAsResultItem {
    creator: string;
  }

  export interface IAsResultItem {
    _id: string;
    amount: number;
    timestamp: number;
    description: string;
    type: string;
  }
}
export interface IBalance {
  expenses: IItem.IAsResultItem[];
  incomes: IItem.IAsResultItem[];
  total: number;
}
