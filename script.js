document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const amazonResultsEl = document.getElementById('amazonResults');
    const flipkartResultsEl = document.getElementById('flipkartResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    
    
    const API_URL = 'https://backend-scrape.onrender.com/api/search';
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
 
    function performSearch() {
        const query = searchInput.value.trim();
        
        if (!query) {
            showError('Please enter a search term');
            return;
        }
        
        clearResults();
        
        loadingIndicator.classList.remove('d-none');
        errorMessage.classList.add('d-none');
        
        fetch(`${API_URL}?q=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                loadingIndicator.classList.add('d-none');
                displayResults(data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                loadingIndicator.classList.add('d-none');
                showError('Failed to fetch results. Please try again later.');
            });
    }

    function displayResults(data) {
        if (data.amazon && data.amazon.length > 0) {
            data.amazon.forEach(product => {
                amazonResultsEl.appendChild(createProductCard(product));
            });
        } else {
            amazonResultsEl.innerHTML = '<div class="no-results">No products found on Amazon</div>';
        }
        
        if (data.flipkart && data.flipkart.length > 0) {
            data.flipkart.forEach(product => {
                flipkartResultsEl.appendChild(createProductCard(product));
            });
        } else {
            flipkartResultsEl.innerHTML = '<div class="no-results">No products found on Flipkart</div>';
        }
    }

    function createProductCard(product) {
        const card = document.createElement('a');
        card.className = 'product-card';
        card.href = product.productUrl;
        card.target = '_blank';
        
        const imageUrl = product.imageUrl || 'placeholder.png';
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price}</div>
            </div>
        `;
        
        return card;
    }

    function clearResults() {
        amazonResultsEl.innerHTML = '';
        flipkartResultsEl.innerHTML = '';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
    }
});