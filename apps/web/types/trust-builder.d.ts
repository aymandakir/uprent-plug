export interface BookingEvent {
  user: string;
  city: string;
  timestamp: string;
  type: "viewing_booked" | "home_found" | "application_sent";
}

export interface TrustMetric {
  label: string;
  value: number;
  trend?: "up" | "down" | "steady";
  icon: string;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: number[];
}

