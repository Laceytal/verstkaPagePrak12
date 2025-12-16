document.addEventListener('DOMContentLoaded', () => {
  // DOM элементы
  const titleInput = document.getElementById('artifact-title');
  const categoryInput = document.getElementById('artifact-category');
  const imageInput = document.getElementById('artifact-image');
  const addBtn = document.getElementById('add-btn');
  const errorMsg = document.getElementById('error-msg');
  const gallery = document.getElementById('gallery');
  const searchInput = document.getElementById('search-input');
  const counter = document.getElementById('counter');
  const themeBtn = document.getElementById('theme-btn');
  const categoryTabsContainer = document.getElementById('category-tabs');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const closeModal = document.getElementById('close-modal');
  const tableBody = document.getElementById('table-body');

  // Глобальные переменные
  let artifacts = [];
  let artifactIdCounter = 1;
  let categories = new Set();

  // Обновление счётчика
  function updateCounter() {
    counter.textContent = `Артефактов: ${artifacts.length}`;
  }

  // Создание вкладки категории
  function createCategoryTab(category) {
    const normalizedCategory = category.trim();
    if (!categories.has(normalizedCategory.toLowerCase())) {
      categories.add(normalizedCategory.toLowerCase());
      const btn = document.createElement('button');
      btn.classList.add('tab-btn');
      btn.textContent = normalizedCategory;
      btn.dataset.category = normalizedCategory.toLowerCase();
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCards(normalizedCategory.toLowerCase());
      });
      categoryTabsContainer.appendChild(btn);
    }
  }

  // Обновление вкладок категорий (удаление пустых)
  function updateCategoryTabs() {
    // Получаем уникальные категории из текущих артефактов
    const activeCategories = new Set(artifacts.map(a => a.category.toLowerCase()));
    
    // Удаляем вкладки категорий, которых больше нет
    const tabButtons = categoryTabsContainer.querySelectorAll('.tab-btn:not([data-category="all"])');
    tabButtons.forEach(btn => {
      if (!activeCategories.has(btn.dataset.category)) {
        btn.remove();
        categories.delete(btn.dataset.category);
      }
    });
    
    // Если удалили активную вкладку, переключаемся на "Все"
    const activeTab = categoryTabsContainer.querySelector('.tab-btn.active');
    if (!activeTab || (activeTab.dataset.category !== 'all' && !activeCategories.has(activeTab.dataset.category))) {
      const allTab = categoryTabsContainer.querySelector('[data-category="all"]');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      allTab.classList.add('active');
      filterCards('all');
    }
  }

  // Фильтрация карточек
  function filterCards(filterValue) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const cardCategory = card.dataset.category.toLowerCase();
      if (filterValue === 'all' || cardCategory === filterValue) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Обновление таблицы
  function updateTable() {
    tableBody.innerHTML = '';
    
    artifacts.forEach((artifact, index) => {
      const row = document.createElement('tr');
      row.dataset.id = artifact.id;
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${artifact.title}</td>
        <td>${artifact.category}</td>
        <td>${artifact.date}</td>
        <td>${artifact.favorite ? '⭐ Избранное' : 'Обычный'}</td>
        <td>
          <button class="table-btn select-btn">Выбрать</button>
          <button class="table-btn delete">Удалить</button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Обработчики кнопок таблицы
    document.querySelectorAll('.select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
      });
    });
    
    document.querySelectorAll('.table-btn.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const id = parseInt(row.dataset.id);
        artifacts = artifacts.filter(a => a.id !== id);
        updateGallery();
        updateTable();
        updateCounter();
        updateCategoryTabs();
      });
    });
  }

  // Обновление галереи
  function updateGallery() {
    gallery.innerHTML = '';
    
    artifacts.forEach(artifact => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.category = artifact.category;
      
      card.innerHTML = `
        <img src="${artifact.image}" alt="${artifact.title}" loading="lazy">
        <div class="card-body">
          <h4>${artifact.title}</h4>
          <p>Категория: ${artifact.category}</p>
        </div>
        <div class="card-footer">
          <button class="fav-btn ${artifact.favorite ? 'active' : ''}">♡</button>
          <button class="del-btn">Удалить</button>
        </div>
      `;
      
      // Модальное окно при клике на изображение
      const img = card.querySelector('img');
      img.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modalImg.src = artifact.image;
        modalTitle.textContent = artifact.title;
        modalCategory.textContent = `Категория: ${artifact.category}`;
      });
      
      // Избранное
      const favBtn = card.querySelector('.fav-btn');
      favBtn.addEventListener('click', () => {
        artifact.favorite = !artifact.favorite;
        favBtn.classList.toggle('active');
        updateTable();
      });
      
      // Удаление
      const delBtn = card.querySelector('.del-btn');
      delBtn.addEventListener('click', () => {
        artifacts = artifacts.filter(a => a.id !== artifact.id);
        updateGallery();
        updateTable();
        updateCounter();
        updateCategoryTabs();
      });
      
      gallery.appendChild(card);
    });
  }

  // Добавление артефакта
  addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const image = imageInput.value.trim();
    
    if (!title || !category || !image) {
      errorMsg.classList.remove('hidden');
      setTimeout(() => errorMsg.classList.add('hidden'), 3000);
      return;
    }
    
    const artifact = {
      id: artifactIdCounter++,
      title,
      category,
      image,
      date: new Date().toLocaleDateString('ru-RU'),
      favorite: false
    };
    
    artifacts.push(artifact);
    createCategoryTab(category);
    updateGallery();
    updateTable();
    updateCounter();
    
    // Очистка полей
    titleInput.value = '';
    categoryInput.value = '';
    imageInput.value = '';
  });

  // Поиск
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const title = card.querySelector('h4').textContent.toLowerCase();
      card.style.display = title.includes(value) ? 'flex' : 'none';
    });
  });

  // Фильтр "Все"
  document.querySelector('[data-category="all"]').addEventListener('click', (e) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filterCards('all');
  });

  // Тёмная тема
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeBtn.textContent = document.body.classList.contains('dark-theme') 
      ? '☀️ Светлая тема' 
      : '🌙 Тёмная тема';
  });

  // Закрытие модального окна
  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Footer ссылки
  document.getElementById('about-link').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Галерея исторических артефактов\nПрактическая работа №12\nТехнологии: HTML, CSS, JavaScript');
  });

  document.getElementById('contact-link').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Контакты:\nEmail: student@example.com\nGitHub: github.com/laceytal');
  });
});
