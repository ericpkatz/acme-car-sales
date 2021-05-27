const usersList = document.querySelector('#users-list');
const carsList = document.querySelector('#cars-list');
const salesList = document.querySelector('#sales-list');

carsList.addEventListener('click', async(ev)=> {
  if(ev.target.tagName === 'LI'){
    const carId = ev.target.getAttribute('data-id');
    const userId = window.location.hash.slice(1);
    await fetch(`/api/users/${userId}/sales`, {
      body: JSON.stringify({ carId }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    loadSales();
  }
});

let users;

const renderUsers = ()=> {
  const userId = window.location.hash.slice(1);
  const html = users.map( user => {
    return `
      <li class='${ userId === user.id ? 'selected': ''}'>
        <a href='#${ user.id }'>
        ${ user.name }
        </a>
      </li>
    `;
  }).join('');
  usersList.innerHTML = html;
};

const loadUsers = async()=> {
  const response = await fetch('/api/users');
  users = await response.json();
  renderUsers();
};

const loadCars = async()=> {
  const response = await fetch('/api/cars');
  const data = await response.json();
  const html = data.map( car => {
    return `
      <li data-id='${car.id}'>
        ${ car.name }
      </li>
    `;
  }).join('');
  carsList.innerHTML = html;
};

const loadSales = async()=> {
  const userId = window.location.hash.slice(1);
  const response = await fetch(`/api/users/${userId}/sales`);
  const sales = await response.json();
  const html = sales.map( sale => {
    return `
      <li>
        ${ sale.car.name }
      </li>
    `;
  }).join('');
  salesList.innerHTML = html;
};

loadUsers();
loadCars();
loadSales();

window.addEventListener('hashchange', ()=> {
  renderUsers();
  loadSales();
});
