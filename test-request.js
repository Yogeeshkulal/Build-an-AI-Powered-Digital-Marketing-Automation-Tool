const data = {
  businessType: 'restaurant',
  product: 'veg biriyani',
  tone: 'friendly',
  audience: 'college students'
};

fetch('http://localhost:4000/api/social-posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(r => r.json())
  .then(j => console.log(JSON.stringify(j, null, 2)))
  .catch(e => console.error('ERR:', e.message));
