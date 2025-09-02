export interface ReviewType {
  _id: string;
  _rating: number;
  _comment: string;
  _userId: string;
  vendorId?: string;
  venueId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewCreateInput {
  _rating: number;
  _comment: string;
  _userId: string;
  vendorId?: string;
  venueId?: string;
}

export interface ReviewUpdateInput {
  rating?: number;
  comment?: string;
}
