const searchForm = document.getElementById('searchForm');
const cardContainer = document.getElementById('cardContainer');
const imageMarquee = document.getElementById('imageMarquee');
const coinTransition = document.getElementById('coinTransition');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentPage = 1;
const cardsPerPage = 4;

prevBtn.style.display = 'none';
nextBtn.style.display = 'none';

let stockData = [];
let totalPages = 0;

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const stock = e.target.querySelector('input[type="search"]').value;

  stockData = [];
  cardContainer.innerHTML = '';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';

  const url = `https://real-time-finance-data.p.rapidapi.com/search?query=${stock}&language=en`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '41fac22fb2msh8cdb62af4cf27fap1cf2e6jsna505088b2a24',
        'X-RapidAPI-Host': 'real-time-finance-data.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data = await response.json();
    if (data.data && data.data.stock && data.data.stock.length > 0) {
      stockData = data.data.stock;
      totalPages = Math.ceil(stockData.length / cardsPerPage);
      currentPage = 1;
      displayStockData();
      stopAnimations();
    } else {
      cardContainer.innerHTML = '<p>No stock data available.</p>';
    }
  } catch (error) {
    console.error(error);
  }
});

function displayStockData() {
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentStocks = stockData.slice(startIndex, endIndex);

  cardContainer.innerHTML = '';
  currentStocks.forEach((stock) => {
    const card = createCard(stock);
    cardContainer.appendChild(card);
  });

  prevBtn.style.display = currentPage === 1 ? 'none' : 'inline-block';
  nextBtn.style.display = currentPage === totalPages ? 'none' : 'inline-block';
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayStockData();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayStockData();
  }
});

function createCard(stock) {
  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <h5><u>${stock.symbol}</u></h5>
    <p>${stock.name}</p>
    <p>Price: ${stock.price}</p>
    <p>Change: ${stock.change}</p>
    <p>Change %: ${stock.change_percent}</p>
  `;
  return card;
}

function stopAnimations() {
  coinTransition.style.display = 'none';
  imageMarquee.style.display = 'none';
}
