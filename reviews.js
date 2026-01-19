// reviews.js — store reviews in localStorage and render list
// reviews.js — store reviews (local fallback) and render list. If Supabase is configured
// `reviews.supabase.js` exposes apiFetchReviews and apiSubmitReview which this file will use.
(function(){
  const STORAGE_KEY = 'ashlyns_reviews_v1';
  const PENDING_KEY = 'ashlyns_reviews_pending_v1';

  function $(sel){ return document.querySelector(sel); }

  function loadLocal(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch(e){ return []; }
  }

  function saveLocal(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

  function escapeHtml(s){ return (s||'').toString().replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

  async function render(){
    let list = [];
    const container = $('#reviews-list');
    if (!container) return;
    container.innerHTML = '';

    if (window.apiFetchReviews && typeof window.apiFetchReviews === 'function'){
      try{ list = await window.apiFetchReviews(); }
      catch(err){ console.error('Error fetching remote reviews, falling back to local', err); list = loadLocal(); }
    } else {
      list = loadLocal();
    }

    // If there are pending local submissions (sent to Supabase but awaiting approval), show them too
    try{
      const pendingRaw = localStorage.getItem(PENDING_KEY);
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw || '[]');
        // map pending rows into same shape as remote list and mark them pending
        const pendingMapped = pending.map(p => ({ name: p.name, rating: p.rating, comment: p.comment, date: p.date || p.created_at || new Date().toISOString(), pending: true }));
        // show pending items before confirmed ones
        list = (pendingMapped.concat(list || []));
      }
    } catch(e){ console.warn('Failed to load pending reviews', e); }

    if (!list || !list.length){ container.innerHTML = '<p class="muted">No reviews yet.</p>'; return; }
    list.slice().reverse().forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card';
      const pendingBadge = r.pending ? ' <em class="muted">(Pending moderation)</em>' : '';
      card.innerHTML = `<div class="review-meta"><strong>${escapeHtml(r.name||'Anonymous')}</strong> — <span class="review-rating">${r.rating}/5</span> • <small>${new Date(r.date).toLocaleString()}</small>${pendingBadge}</div><p>${escapeHtml(r.comment)}</p>`;
      container.appendChild(card);
    });
  }

  async function submitReview(review){
    if (window.apiSubmitReview && typeof window.apiSubmitReview === 'function'){
      try{
        const created = await window.apiSubmitReview(review);
        // If server returned the created row, store it in a pending queue so user sees it immediately
        try{
          const pendingRaw = localStorage.getItem(PENDING_KEY) || '[]';
          const pending = JSON.parse(pendingRaw);
          const entry = {
            id: created && created.id ? created.id : null,
            name: created && created.name ? created.name : review.name || 'Anonymous',
            rating: created && (created.rating!=null) ? created.rating : review.rating,
            comment: created && created.comment ? created.comment : review.comment,
            created_at: created && created.created_at ? created.created_at : new Date().toISOString(),
            approved: created && (created.approved!=null) ? created.approved : false,
            date: (created && created.created_at) || new Date().toISOString()
          };
          pending.push(entry);
          localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
        } catch(e){ console.warn('Could not save pending review locally', e); }

        return true;
      } catch(err){ console.error('Supabase submit failed', err); return false; }
    }

    // fallback to local
    const list = loadLocal();
    list.push({ name: review.name || 'Anonymous', rating: review.rating, comment: review.comment, date: new Date().toISOString() });
    saveLocal(list);
    return true;
  }

  async function init(){
    const submit = $('#submit-review');
    const clearBtn = $('#clear-reviews');
    if (!submit) return render();

    submit.addEventListener('click', async (e)=>{
      const name = $('#reviewer').value.trim();
      const rating = $('#rating').value;
      const comment = $('#comment').value.trim();
      if (!comment){ alert('Please write a short review.'); return; }

      submit.disabled = true;
      const ok = await submitReview({ name: name || 'Anonymous', rating, comment });
      submit.disabled = false;
      if (!ok){ alert('Failed to submit review. Try again later.'); return; }

      $('#comment').value = '';
      $('#reviewer').value = '';
      await render();
    });

    clearBtn.addEventListener('click', ()=>{
      if (!confirm('Clear all local reviews? (This does not affect server-side reviews)')) return;
      localStorage.removeItem(STORAGE_KEY);
      render();
    });

    await render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
