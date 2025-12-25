export interface Application {
  id: string;
  user_id: string;
  property_id: string;
  status: 'draft' | 'submitted' | 'viewed' | 'accepted' | 'rejected' | 'withdrawn';
  generated_letter_id: string | null;
  submitted_at: string | null;
  viewed_at: string | null;
  response_received_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    title: string;
    price: number;
    location: {
      city: string;
      address: string | null;
    };
    images: string[];
  };
}

export interface GeneratedLetter {
  id: string;
  user_id: string;
  property_id: string;
  content: string;
  language: string;
  created_at: string;
}

export type ApplicationStatus = Application['status'];

