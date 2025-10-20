async function loadProducts() {
  const res = await fetch('/products');
  const data = await res.json();
  const tbody = document.querySelector('#productTable tbody');
  tbody.innerHTML = '';
  data.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick="editProduct(${p.id})">Edit</button>
          <button onclick="deleteProduct(${p.id})">Hapus</button>
        </td>
      </tr>
    `;
  });
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  await fetch('/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  e.target.reset();
  loadProducts();
});

async function deleteProduct(id) {
  await fetch(`/products/${id}`, { method: 'DELETE' });
  loadProducts();
}

window.onload = loadProducts;
