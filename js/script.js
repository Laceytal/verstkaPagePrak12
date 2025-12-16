// Глобальный массив артефактов
let artifacts = [];
let artifactIdCounter = 1;

// Обновление таблицы
function updateTable() {
  const tableBody = document.getElementById('table-body');
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
        <button class="table-btn delete delete-table-btn">Удалить</button>
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
  
  document.querySelectorAll('.delete-table-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      const id = parseInt(row.dataset.id);
      artifacts = artifacts.filter(a => a.id !== id);
      updateGallery();
      updateTable();
      updateCounter();
    });
  });
}

// Обновление галереи
function updateGallery() {
  const gallery = document.getElementById('gallery');
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
    
    gallery.appendChild(card);
  });
}

// Добавление артефакта
document.getElementById('add-btn').addEventListener('click', () => {
  const title = document.getElementById('artifact-title').value.trim();
  const category = document.getElementById('artifact-category').value.trim();
  const image = document.getElementById('artifact-image').value.trim();
  
  if (!title || !category || !image) {
    document.getElementById('error-msg').classList.remove('hidden');
    setTimeout(() => document.getElementById('error-msg').classList.add('hidden'), 3000);
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
  document.getElementById('artifact-title').value = '';
  document.getElementById('artifact-category').value = '';
  document.getElementById('artifact-image').value = '';
});

function updateCounter() {
  document.getElementById('counter').textContent = `Артефактов: ${artifacts.length}`;
}
