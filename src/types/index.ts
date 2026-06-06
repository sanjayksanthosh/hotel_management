export interface RoomType {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  status: string;
  images: RoomImageType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomImageType {
  id: string;
  roomId: string;
  imageUrl: string;
}

export interface BookingType {
  id: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  room?: RoomType;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentType {
  id: string;
  bookingId: string;
  amount: number;
  gateway: string;
  transactionReference?: string;
  status: string;
  paidAt?: Date;
  createdAt: Date;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  activeBookings: number;
  pendingPayments: number;
  upcomingCheckIns: number;
}
