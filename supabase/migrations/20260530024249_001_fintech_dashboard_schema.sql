/*
  # Fintech Dashboard Schema

  1. New Tables
    - `portfolio_holdings`: User's stock portfolio with holdings data
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `symbol` (text, stock symbol)
      - `company_name` (text)
      - `quantity` (integer)
      - `avg_buy_price` (decimal)
      - `current_price` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `watchlist`: User's watchlist for tracking stocks
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `symbol` (text, stock symbol)
      - `company_name` (text)
      - `created_at` (timestamp)
    - `market_indices`: Market indices data (NIFTY, SENSEX, etc.)
      - `id` (uuid, primary key)
      - `name` (text)
      - `symbol` (text)
      - `current_value` (decimal)
      - `change_percent` (decimal)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `portfolio_holdings`, `watchlist`
    - Create policies for authenticated users to manage their own data
    - `market_indices` is readable by all authenticated users

  3. Notes
    - Portfolio tracks holdings with P&L calculations
    - Watchlist allows quick monitoring of interested stocks
    - Market indices provides overview of market health
*/

-- Portfolio Holdings Table
CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol text NOT NULL,
  company_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  avg_buy_price decimal(12,2) NOT NULL DEFAULT 0,
  current_price decimal(12,2) NOT NULL DEFAULT 0,
  sector text DEFAULT 'Others',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Watchlist Table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol text NOT NULL,
  company_name text NOT NULL,
  current_price decimal(12,2) DEFAULT 0,
  change_percent decimal(6,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Market Indices Table
CREATE TABLE IF NOT EXISTS market_indices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  symbol text NOT NULL UNIQUE,
  current_value decimal(12,2) NOT NULL DEFAULT 0,
  change_value decimal(12,2) DEFAULT 0,
  change_percent decimal(6,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_indices ENABLE ROW LEVEL SECURITY;

-- Policies for portfolio_holdings
CREATE POLICY "Users can view own holdings"
  ON portfolio_holdings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own holdings"
  ON portfolio_holdings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own holdings"
  ON portfolio_holdings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own holdings"
  ON portfolio_holdings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for watchlist
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for market_indices (read-only for authenticated users)
CREATE POLICY "Authenticated users can view indices"
  ON market_indices FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial market indices data
INSERT INTO market_indices (name, symbol, current_value, change_value, change_percent)
VALUES 
  ('NIFTY 50', 'NIFTY', 22456.50, 125.30, 0.56),
  ('SENSEX', 'SENSEX', 73876.82, 412.45, 0.56),
  ('BANK NIFTY', 'BANKNIFTY', 48234.15, -89.20, -0.18),
  ('NIFTY IT', 'NIFTYIT', 35678.90, 234.56, 0.66),
  ('NIFTY MIDCAP', 'NIFTYMIDCAP', 45890.23, 156.78, 0.34)
ON CONFLICT (name) DO NOTHING;