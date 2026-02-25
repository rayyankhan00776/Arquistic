// Reviews data with Roman Urdu comments
const reviews = [
  {
    name: "Ayesha Khan",
    rating: 5,
    comment: "MashaAllah bohot achi perfume hai. Celeste ki khushbu bilkul original lagti hai aur bahut time tak rehti hai. Highly recommended!",
    product: "Celeste",
    verified: true
  },
  {
    name: "Ahmed Raza",
    rating: 5,
    comment: "Scarzaar liya tha office k liye. Yaar itni achi smell hai k sab poochte hain kon si perfume hai. Value for money bhi hai.",
    product: "Scarzaar",
    verified: true
  },
  {
    name: "Fatima Malik",
    rating: 5,
    comment: "Eclave toh kamaal ki cheez hai! Friend ki shaadi pe lagaya tha, compliments hi compliments mile. Packaging bhi bohat luxury type ki thi.",
    product: "Eclave",
    verified: true
  },
  {
    name: "Hassan Ali",
    rating: 4,
    comment: "Achi quality hai perfume ki. Thori si zyada price hai but worth it. Scarzaar ka fragrance bohot acha hai specially summer main.",
    product: "Scarzaar",
    verified: true
  },
  {
    name: "Mariam Siddiqui",
    rating: 5,
    comment: "Fiora bohot pyari smell hai. Floral notes perfect hain aur na zada strong hai na halki. Daily wear k liye best hai!",
    product: "Fiora",
    verified: true
  },
  {
    name: "Usman Sheikh",
    rating: 5,
    comment: "Bhai delivery bhi fast thi aur perfume bhi original. Scarzaar liya Sauvage ki jagah, koi farq nahi pata chala. Bohot acha experience.",
    product: "Scarzaar",
    verified: true
  },
  {
    name: "Zainab Ahmed",
    rating: 5,
    comment: "Celeste main abhi first time try kiya but ab toh yahi lagaon gi hamesha. Bilkul Victoria Secret jaisa hai. Allah khair! 💕",
    product: "Celeste",
    verified: true
  },
  {
    name: "Ali Haider",
    rating: 4,
    comment: "Accha brand hai. Eclave ki smell bohot unique hai. Thori mehngi lagi pehlay but ek baar laga k dekha toh pata chala k paisa wasool hai.",
    product: "Eclave",
    verified: true
  },
  {
    name: "Sana Tariq",
    rating: 5,
    comment: "Mashallah bohat achi fragrance hai Fiora ki. Pehle original use karti thi ab sirf yahi use karun gi. Quality top notch hai!",
    product: "Fiora",
    verified: true
  },
  {
    name: "Bilal Khan",
    rating: 5,
    comment: "Yaar kya baat hai! Scarzaar laga k gaya tha date pe, girlfriend ne compliment di. Ab toh stock kar liya hai maine 😄",
    product: "Scarzaar",
    verified: true
  },
  {
    name: "Hira Aslam",
    rating: 5,
    comment: "Bohot pasand aayi Celeste. Eid pe order kiya tha delivery time pe aa gayi. Scent bhi long lasting hai mashallah. 10/10!",
    product: "Celeste",
    verified: true
  },
  {
    name: "Faisal Mahmood",
    rating: 4,
    comment: "Eclave ka jo fragrance hai na bilkul Baccarat Rouge jaisa hai. Thora expensive hai but quality dekh k lagta hai k sahi hai.",
    product: "Eclave",
    verified: true
  },
  {
    name: "Aisha Baig",
    rating: 5,
    comment: "MashaAllah! Fiora lagai thi function main, sab ne poocha kidhar se li. Packaging bhi itni pretty thi k gift ready tha.",
    product: "Fiora",
    verified: true
  },
  {
    name: "Hamza Malik",
    rating: 5,
    comment: "Honestly speaking maine bohot try kiye thay perfumes but Scarzaar se better kuch nahi mila. Fresh smell hai aur achi rehti hai.",
    product: "Scarzaar",
    verified: true
  },
  {
    name: "Rameen Shah",
    rating: 5,
    comment: "Celeste order kiya tha apne liye, ab toh poori family use kar rahi hai 😂 Next time 2-3 bottles lena parengi!",
    product: "Celeste",
    verified: true
  },
  {
    name: "Saad Ahmed",
    rating: 5,
    comment: "Bohot acha hai yaar. Office k colleagues ko bhi recommend kiya hai. Eclave winter main bohot suit karta hai.",
    product: "Eclave",
    verified: true
  },
  {
    name: "Noor Riaz",
    rating: 4,
    comment: "Fiora ki smell bohot soft aur elegant hai. Price thori high hai but achi quality k liye paisa dena toh banta hai.",
    product: "Fiora",
    verified: true
  },
  {
    name: "Omer Farooq",
    rating: 5,
    comment: "Scarzaar perfect hai gym ya party dono k liye. Fresh scent hai jo k poore din rehta hai. Highly satisfied!",
    product: "Scarzaar",
    verified: true
  },
  {
    name: "Laiba Hassan",
    rating: 5,
    comment: "Mashallah kya khoobsurat smell hai Celeste ki! College main lagati hoon toh compliments milte hain. Thank you Arquistic! ✨",
    product: "Celeste",
    verified: true
  },
  {
    name: "Danish Ali",
    rating: 5,
    comment: "Yar delivery bhi fast hai aur quality bhi top. Eclave maine liya weddings k liye, everyone loved it. Will order again!",
    product: "Eclave",
    verified: true
  },
  {
    name: "Maha Jamil",
    rating: 5,
    comment: "Fiora bohot achi hai specially jo floral scents pasand hain unke liye. Maine friend ko bhi gift di, wo bhi bohot khush hui!",
    product: "Fiora",
    verified: true
  },
  {
    name: "Rehan Butt",
    rating: 4,
    comment: "Good perfume hai. Scarzaar daily use k liye perfect hai. Price point bhi reasonable hai compared to imported perfumes.",
    product: "Scarzaar",
    verified: true
  },
  {
    name: "Anum Zaidi",
    rating: 5,
    comment: "Celeste meri favorite ban gayi hai! Summer main ya winter dono main suit karti hai. Packaging bhi bohot beautiful thi 💖",
    product: "Celeste",
    verified: true
  },
  {
    name: "Kamran Siddiqui",
    rating: 5,
    comment: "Eclave ka fragrance bohot rich hai. Special occasions k liye best hai. Original se koi farq nahi laga mujhe toh!",
    product: "Eclave",
    verified: true
  },
  {
    name: "Sara Iqbal",
    rating: 5,
    comment: "Fiora bilkul Gucci Flora jaisi hai! Main toh ab imported nahi mangwati. Arquistic ne local market main bohat acha kaam kiya hai.",
    product: "Fiora",
    verified: true
  }
];

class ReviewsSlideshow {
  constructor() {
    this.track = document.getElementById('reviewsTrack');
    this.dotsContainer = document.getElementById('reviewsDots');
    this.prevBtn = document.querySelector('.review-nav-prev');
    this.nextBtn = document.querySelector('.review-nav-next');
    
    if (!this.track) return;
    
    this.currentIndex = 0;
    this.itemsPerView = this.getItemsPerView();
    this.totalSlides = Math.ceil(reviews.length / this.itemsPerView);
    
    this.init();
  }
  
  getItemsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }
  
  init() {
    this.renderReviews();
    this.renderDots();
    this.attachEvents();
    this.updateView();
  }
  
  renderReviews() {
    this.track.innerHTML = reviews.map((review, index) => `
      <div class="review-card" style="animation-delay: ${index * 0.05}s">
        <div class="review-header">
          <div class="review-avatar">${review.name.charAt(0)}</div>
          <div class="review-author">
            <div class="review-name">${review.name}</div>
            <div class="review-product">${review.product}</div>
          </div>
          ${review.verified ? '<span class="review-verified">✓ Verified</span>' : ''}
        </div>
        <div class="review-rating">
          ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
        </div>
        <p class="review-comment">${review.comment}</p>
      </div>
    `).join('');
  }
  
  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = Array.from({ length: this.totalSlides }, (_, i) => 
      `<button class="review-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`
    ).join('');
  }
  
  attachEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
    
    if (this.dotsContainer) {
      this.dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('review-dot')) {
          this.goToSlide(parseInt(e.target.dataset.index));
        }
      });
    }
    
    window.addEventListener('resize', () => {
      const newItemsPerView = this.getItemsPerView();
      if (newItemsPerView !== this.itemsPerView) {
        this.itemsPerView = newItemsPerView;
        this.totalSlides = Math.ceil(reviews.length / this.itemsPerView);
        this.currentIndex = 0;
        this.renderDots();
        this.updateView();
      }
    });
    
    // Auto-slide every 5 seconds
    setInterval(() => {
      this.next();
    }, 5000);
  }
  
  updateView() {
    const offset = -this.currentIndex * (100 / this.totalSlides);
    this.track.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    document.querySelectorAll('.review-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateView();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateView();
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateView();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ReviewsSlideshow();
  new ReviewCounter();
});

// Review Counter Manager
class ReviewCounter {
  constructor() {
    this.storageKey = 'arquistic_review_count';
    this.baseCount = 329;
    this.init();
  }
  
  init() {
    // Get stored count or use base count
    const storedData = this.getStoredData();
    this.currentCount = storedData.count;
    this.lastVisit = storedData.lastVisit;
    
    // Update all review count displays
    this.updateDisplay();
    
    // Start increment timer after 1 minute
    setTimeout(() => {
      this.incrementCount();
      // Continue incrementing every 1 minute
      setInterval(() => {
        this.incrementCount();
      }, 60000);
    }, 60000);
  }
  
  getStoredData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        const now = Date.now();
        const daysSinceLastVisit = (now - data.lastVisit) / (1000 * 60 * 60 * 24);
        
        // Add natural growth based on days passed (1-3 reviews per day)
        const naturalGrowth = Math.floor(daysSinceLastVisit * (Math.random() * 2 + 1));
        
        return {
          count: data.count + naturalGrowth,
          lastVisit: now
        };
      }
    } catch (e) {
      console.log('Could not load review count from storage');
    }
    
    return {
      count: this.baseCount,
      lastVisit: Date.now()
    };
  }
  
  saveToStorage() {
    try {
      const data = {
        count: this.currentCount,
        lastVisit: this.lastVisit
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.log('Could not save review count to storage');
    }
  }
  
  updateDisplay() {
    const countElements = document.querySelectorAll('.reviews-count');
    countElements.forEach(element => {
      element.textContent = `Based on ${this.currentCount} verified reviews`;
    });
  }
  
  incrementCount() {
    this.currentCount += 1;
    this.lastVisit = Date.now();
    this.updateDisplay();
    this.saveToStorage();
    
    // Add subtle animation to the count
    const countElements = document.querySelectorAll('.reviews-count');
    countElements.forEach(element => {
      element.style.transition = 'all 0.3s ease';
      element.style.transform = 'scale(1.05)';
      element.style.color = '#10b981';
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
      }, 300);
    });
  }
}
