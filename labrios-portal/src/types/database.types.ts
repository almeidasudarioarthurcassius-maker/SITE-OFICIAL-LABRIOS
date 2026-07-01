export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      equipments: {
        Row: { id: string; name: string; brand: string; model: string; purpose: string; image_url: string | null; quantity: number; created_at: string };
        Insert: { id?: string; name: string; brand: string; model: string; purpose: string; image_url?: string | null; quantity: number; created_at?: string };
        Update: { id?: string; name?: string; brand?: string; model?: string; purpose?: string; image_url?: string | null; quantity?: number; created_at?: string };
      };
      team: {
        Row: { id: string; name: string; role: string; lattes_url: string; image_url: string | null; category: 'team' | 'management' | 'users'; created_at: string };
        Insert: { id?: string; name: string; role: string; lattes_url: string; image_url?: string | null; category: 'team' | 'management' | 'users'; created_at?: string };
        Update: { id?: string; name?: string; role?: string; lattes_url?: string; image_url?: string | null; category?: 'team' | 'management' | 'users'; created_at?: string };
      };
      rules: {
        Row: { id: string; content: string; created_at: string };
        Insert: { id?: string; content: string; created_at?: string };
        Update: { id?: string; content?: string; created_at?: string };
      };
      reservations: {
        Row: { id: string; equipment_id: string; requester_name: string; institution: string; role: string; lattes_url: string; date: string; start_time: string; end_time: string; status: 'pending' | 'approved'; created_at: string };
        Insert: { id?: string; equipment_id: string; requester_name: string; institution: string; role: string; lattes_url: string; date: string; start_time: string; end_time: string; status?: 'pending' | 'approved'; created_at?: string };
        Update: { id?: string; equipment_id?: string; requester_name?: string; institution?: string; role?: string; lattes_url?: string; date?: string; start_time?: string; end_time?: string; status?: 'pending' | 'approved'; created_at?: string };
      };
      configs: {
        Row: { key: string; value: string; updated_at: string };
        Insert: { key: string; value: string; updated_at?: string };
        Update: { key?: string; value?: string; updated_at?: string };
      };
    };
  };
}