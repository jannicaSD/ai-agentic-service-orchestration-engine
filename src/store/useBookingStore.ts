import { create } from 'zustand';
import { Booking } from '../types';
import { mockBookings } from '../services/mockData';

interface BookingState {
  bookings: Booking[];
  activeBookingId: string | null;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  setActiveBooking: (id: string | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: mockBookings,
  activeBookingId: 'b-101', // Default to the in_progress mock booking
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBookingStatus: (id, status) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
  })),
  setActiveBooking: (id) => set({ activeBookingId: id }),
}));
