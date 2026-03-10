import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log("Testing connection...");
  
  // Try to select incomes
  const { data: incomes, error: incomesError } = await supabase.from('incomes').select('*').limit(1);
  if (incomesError) {
    console.error("Error fetching incomes:", incomesError);
  } else {
    console.log("Incomes table exists. Rows:", incomes?.length);
  }

  // Try to select expenses
  const { data: expenses, error: expensesError } = await supabase.from('expenses').select('*').limit(1);
  if (expensesError) {
    console.error("Error fetching expenses:", expensesError);
  } else {
    console.log("Expenses table exists. Rows:", expenses?.length);
  }

  // Try an insert to expenses
  console.log("Attempting test insert into expenses...");
  const { error: insertError } = await supabase.from('expenses').insert([{
    product: 'Teste de Insercao',
    amount: 10,
    category: 'Desnecessário',
    payment_method: 'NuBank',
    installment: 'Única',
    date: new Date().toISOString().split("T")[0],
    notes: 'Teste',
  }]);

  if (insertError) {
    console.error("Insert error:", insertError.message, insertError.details, insertError.hint, insertError.code);
  } else {
    console.log("Insert successful!");
  }
}

testSupabase();
