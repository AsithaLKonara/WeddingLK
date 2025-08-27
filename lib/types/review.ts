export interface ReviewType {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  vendorId?: string;
  venueId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewCreateInput {
  rating: number;
  comment: string;
  userId: string;
  vendorId?: string;
  venueId?: string;
}

export interface ReviewUpdateInput {
  rating?: number;
  comment?: string;
}
