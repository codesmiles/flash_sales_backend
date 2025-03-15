import { Document, Schema } from 'mongoose';

export interface ISale extends Document{
    product: Schema.Types.ObjectId;
    initialStock: number;
    currentStock: number;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    limitPerUser: number;
}