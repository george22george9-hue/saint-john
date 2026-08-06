export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  description: string;
  createdAt?: string;
}

export interface Inquiry {
  id: number;
  name: string | null;
  hymnRequest: string | null;
  message: string;
  createdAt?: string;
}

export interface Settings {
  friday_time?: string;
  sunday_schedule?: string;
  [key: string]: string | undefined;
}
