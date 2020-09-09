import { Street } from './Street';

export interface UserAuth
{
    uid: string,
    addresses: Street[],
    email: string,
    names: string,
    surnames: string,
    phone: number    
}