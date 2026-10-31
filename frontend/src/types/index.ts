export type UserRole = 'customer' | 'admin' | 'staff';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  gender?: string | null;
  date_of_birth?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration_months: number;
  duration_days: number;
  price: number;
  description?: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

export interface Membership {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  remaining_days: number;
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  membership_id: string;
  user_id: string;
  user_name?: string;
  amount: number;
  payment_date: string;
  payment_method: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'OTHER';
  transaction_reference?: string;
  receipt_number: string;
  remarks?: string;
  created_at: string;
}

export interface ReceiptDetail {
  gym_name: string;
  gym_address: string;
  gym_phone: string;
  receipt_number: string;
  payment_date: string;
  customer_name: string;
  customer_phone: string;
  membership_plan: string;
  amount_paid: number;
  total_membership_fee: number;
  remaining_balance: number;
  payment_method: string;
  transaction_reference?: string;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  user_name?: string;
  user_phone?: string;
  attendance_date: string;
  check_in_time: string;
  method: string;
  marked_by?: string;
  notes?: string;
}

export interface AttendanceCalendarDay {
  date_str: string;
  day_of_month: number;
  is_present: boolean;
  check_in_time?: string;
}

export interface CustomerAttendanceOverview {
  current_month: string;
  total_days_in_month: number;
  present_days_count: number;
  attendance_percentage: number;
  streak_days: number;
  calendar_matrix: AttendanceCalendarDay[];
  recent_logs: AttendanceRecord[];
}

export interface CustomerMembershipOverview {
  has_membership: boolean;
  membership?: Membership;
}

export interface QRTokenResponse {
  user_id: string;
  token_payload: string;
  qr_data: Record<string, string | number>;
  generated_at: number;
  expires_in_seconds: number;
}

export interface PendingFeeItem {
  user_id: string;
  user_name: string;
  user_phone: string;
  membership_id: string;
  plan_name: string;
  final_amount: number;
  paid_amount: number;
  pending_amount: number;
  end_date: string;
}

export interface CustomerFeeOverview {
  membership_plan_name?: string;
  total_fee: number;
  amount_paid: number;
  outstanding_amount: number;
  payment_status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'NO_MEMBERSHIP';
  payment_due_date?: string;
  history: Payment[];
}

export interface WorkoutExercise {
  id: string;
  plan_id?: string;
  day_name: string;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  instructions?: string;
  display_order: number;
}

export interface WorkoutPlan {
  id: string;
  category_id: string;
  category_name?: string;
  title: string;
  description?: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_weeks: number;
  is_active: boolean;
  exercises: WorkoutExercise[];
  created_at?: string;
}

export interface WorkoutCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  plans_count: number;
}

export interface CustomerAssignedWorkout {
  has_assignment: boolean;
  plan?: WorkoutPlan;
  assigned_at?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'PAYMENT_REMINDER' | 'EXPIRY_REMINDER' | 'PAYMENT_RECEIVED' | 'WORKOUT_ASSIGNED' | 'ANNOUNCEMENT';
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface DashboardKPIs {
  total_customers: number;
  active_members: number;
  expired_members: number;
  today_attendance: number;
  month_attendance: number;
  today_collections: number;
  total_pending_fees: number;
  expiring_soon_count: number;
}

export interface AdminDashboardSummary {
  kpis: DashboardKPIs;
  recent_check_ins: {
    user_id: string;
    user_name: string;
    check_in_time: string;
    method: string;
  }[];
  recent_payments: {
    payment_id: string;
    user_name: string;
    amount: number;
    payment_method: string;
    payment_date: string;
    receipt_number: string;
  }[];
  expiring_members: {
    user_id: string;
    user_name: string;
    phone: string;
    plan_name: string;
    end_date: string;
    days_left: number;
  }[];
}

export interface GymBusinessInfo {
  name: string;
  phone: string;
  address: string;
  rating: number;
  review_count: number;
  description: string;
}
