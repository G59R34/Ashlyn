// reviews.supabase.js
// Configure Supabase by replacing the placeholders below with your project's URL and anon key.
// This file exposes two functions used by reviews.js: `apiFetchReviews()` and `apiSubmitReview(review)`.

/* Example:
  const SUPABASE_URL = 'https://xyzcompany.supabase.co';
  const SUPABASE_ANON_KEY = 'public-anon-key';
*/
const SUPABASE_URL = 'https://hyehyfbnskiybdspkbxe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZWh5ZmJuc2tpeWJkc3BrYnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MzY5MTQsImV4cCI6MjA4NDExMjkxNH0.jP92s8fpST1mbuDnNVlFG1OSAHPjIxAA7Gb6YkqN-AM';

if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  window.apiFetchReviews = async function(){
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('id,name,rating,comment,created_at,approved')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) { console.error('Supabase fetch error', error); throw error; }
    return data.map(r => ({ name: r.name, rating: r.rating, comment: r.comment, date: r.created_at }));
  };

  window.apiSubmitReview = async function(review){
    // insert as not approved by default; configure your DB policy accordingly
    const payload = { name: review.name || 'Anonymous', rating: parseInt(review.rating) || 5, comment: review.comment };
    // request the inserted row(s) back by calling .select()
    const { data, error } = await supabaseClient
      .from('reviews')
      .insert([payload])
      .select();
    if (error) {
      console.error('Supabase insert error', error);
      throw error;
    }
    if (!data || !data[0]) {
      console.warn('Supabase insert returned no data', data);
      return null;
    }
    return data[0];
  };

  window.supabaseEnabled = true;
} else {
  // Not configured — leave fallbacks to localStorage in reviews.js
  window.supabaseEnabled = false;
}
