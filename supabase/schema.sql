-- income table
CREATE TABLE public.incomes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('Pago', 'Pendente')),
  date date NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- expense table
CREATE TABLE public.expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product text NOT NULL,
  amount numeric(10,2) NOT NULL,
  category text NOT NULL,
  payment_method text NOT NULL,
  installment text DEFAULT 'Única',
  date date NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- set up updated_at triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incomes_modtime
BEFORE UPDATE ON public.incomes
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_expenses_modtime
BEFORE UPDATE ON public.expenses
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Optional: enable RLS and add basic policies allowing anonymous access for this MVP
-- (Usually we'd have a user_id and auth logic, but since this is local/personal without auth in prompt specs)
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read on incomes" ON public.incomes FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on incomes" ON public.incomes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on incomes" ON public.incomes FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete on incomes" ON public.incomes FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read on expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on expenses" ON public.expenses FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete on expenses" ON public.expenses FOR DELETE USING (true);
