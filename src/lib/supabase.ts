import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      portfolio_holdings: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          company_name: string;
          quantity: number;
          avg_buy_price: number;
          current_price: number;
          sector: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          company_name: string;
          quantity: number;
          avg_buy_price: number;
          current_price?: number;
          sector?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          company_name?: string;
          quantity?: number;
          avg_buy_price?: number;
          current_price?: number;
          sector?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          company_name: string;
          current_price: number;
          change_percent: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          company_name: string;
          current_price?: number;
          change_percent?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          company_name?: string;
          current_price?: number;
          change_percent?: number;
          created_at?: string;
        };
      };
      market_indices: {
        Row: {
          id: string;
          name: string;
          symbol: string;
          current_value: number;
          change_value: number;
          change_percent: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          symbol: string;
          current_value: number;
          change_value?: number;
          change_percent?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          symbol?: string;
          current_value?: number;
          change_value?: number;
          change_percent?: number;
          updated_at?: string;
        };
      };
    };
  };
};
