import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VUE_APP_URL;
const supabaseKey = process.env.VUE_APP_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
