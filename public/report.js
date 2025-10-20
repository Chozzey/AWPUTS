async function loadReport() {
  const search = document.getElementById('searchInput').value;
  const res = await fetch(`/report/data?search=${encodeURIComponent(search)}`);
  const data = await res.json();

  const tbody = document.querySelector('#reportTable tbody');
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">Tidak ada data ditemukan</td></tr>`;
    return;
  }

  data.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>Rp${p.price.toLocaleString()}</td>
        <td>${p.stock}</td>
      </tr>
    `;
  });
}

function printReport() {
  window.print();
}

window.onload = loadReport;
