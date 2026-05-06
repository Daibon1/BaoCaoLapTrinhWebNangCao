/* ======================
   CATEGORY BAR CHART
====================== */

const ctx1 = document
  .getElementById("categoryChart")
  ?.getContext("2d");

if (ctx1) {
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: categoryData.map(i => i.label),
      datasets: [{
        label: "Jobs",
        data: categoryData.map(i => i.total),
        borderRadius: 8
      }]
    },
    options: {
      responsive: true
    }
  });
}


/* ======================
   STATUS PIE CHART
====================== */

const ctx2 = document
  .getElementById("statusChart")
  ?.getContext("2d");

if (ctx2) {
  new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: statusData.map(i => i.label),
      datasets: [{
        data: statusData.map(i => i.total)
      }]
    }
  });
}