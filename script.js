let travelData = null;

// Fetch dataset on page load
document.addEventListener('DOMContentLoaded', () => {
  fetch('travel_recommendation_api.json')
    .then((response) => response.json())
    .then((data) => {
      travelData = data;
    })
    .catch((error) => console.error('Error loading JSON data:', error));

  document.getElementById('btnSearch').addEventListener('click', handleSearch);
  document.getElementById('btnClear').addEventListener('click', handleClear);
});

// Section Switcher
function showSection(sectionId) {
  const sections = document.querySelectorAll('.page-section');
  const navBtns = document.querySelectorAll('.nav-btn');

  sections.forEach((sec) => sec.classList.remove('active'));
  navBtns.forEach((btn) => btn.classList.remove('active'));

  document.getElementById(sectionId).classList.add('active');

  // Set active style on nav button
  if (sectionId === 'home') navBtns[0].classList.add('active');
  if (sectionId === 'about') navBtns[1].classList.add('active');
  if (sectionId === 'contact') navBtns[2].classList.add('active');
}

// Search Logic
function handleSearch() {
  if (!travelData) return;

  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = '';

  // Ensure user is viewing the Home section
  showSection('home');

  if (!input) {
    resultsContainer.innerHTML = '<p style="background:rgba(0,0,0,0.7); padding:15px; border-radius:6px;">Please enter a keyword (e.g., beach, temple, or country).</p>';
    return;
  }

  let results = [];

  // Keyword check: Beach
  if (input.includes('beach')) {
    results = travelData.beaches;
  }
  // Keyword check: Temple
  else if (input.includes('temple')) {
    results = travelData.temples;
  }
  // Keyword check: Country or specific country name
  else {
    const foundCountry = travelData.countries.find(
      (c) => c.name.toLowerCase().includes(input) || input.includes('country') || input.includes('countries')
    );

    if (foundCountry) {
      results = foundCountry.cities;
    } else {
      // Search across all country cities for exact or partial matches
      travelData.countries.forEach((country) => {
        country.cities.forEach((city) => {
          if (city.name.toLowerCase().includes(input)) {
            results.push(city);
          }
        });
      });
    }
  }

  // Render cards
  if (results.length > 0) {
    results.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" />
        <div class="card-body">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <button onclick="alert('Booking feature coming soon for ${item.name}!')">Visit</button>
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  } else {
    resultsContainer.innerHTML = '<p style="background:rgba(0,0,0,0.7); padding:15px; border-radius:6px;">No matching recommendations found. Try searching for "beach", "temple", or "Japan".</p>';
  }
}

// Clear Search
function handleClear() {
  document.getElementById('searchInput').value = '';
  document.getElementById('resultsContainer').innerHTML = '';
}

// Handle Contact Form Submission
function handleContactSubmit(event) {
  event.preventDefault();
  alert('Thank you for contacting TravelBloom! We have received your message.');
  document.getElementById('contactForm').reset();
}
