// Массив данных о грузах
const cargoList = [
    {
        id: "CARGO001",
        name: "Строительные материалы",
        status: "В пути",
        origin: "Москва",
        destination: "Казань",
        departureDate: "2024-11-24",
    },
    {
        id: "CARGO002",
        name: "Хрупкий груз",
        status: "Ожидает отправки",
        origin: "Санкт-Петербург",
        destination: "Екатеринбург",
        departureDate: "2024-11-26",
    },
];

// Функция для отображения таблицы
function renderTable() {
    const tableBody = $("#cargoTable");
    tableBody.empty();

    cargoList.forEach((cargo, index) => {
        const statusClass = {
            "Ожидает отправки": "status-awaiting",
            "В пути": "status-in-transit",
            "Доставлен": "status-delivered",
        };

        const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${cargo.name}</td>
        <td class="${statusClass[cargo.status]}">${cargo.status}</td>
        <td>${cargo.origin}</td>
        <td>${cargo.destination}</td>
        <td>${cargo.departureDate}</td>
        <td>
          <select class="form-select update-status" data-id="${cargo.id}">
            <option ${cargo.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
            <option ${cargo.status === "В пути" ? "selected" : ""}>В пути</option>
            <option ${cargo.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
          </select>
        </td>
      </tr>
    `;

        tableBody.append(row);
    });
}

// Функция для добавления нового груза
$("#addCargoForm").submit(function (e) {
    e.preventDefault();

    const name = $("#cargoName").val();
    const origin = $("#departureCity").val();
    const destination = $("#destinationCity").val();
    const date = $("#departureDate").val();

    if (!name || !origin || !destination || !date) {
        alert("Все поля должны быть заполнены!");
        return;
    }

    const newCargo = {
        id: `CARGO${cargoList.length + 1}`.padStart(7, "0"),
        name,
        status: "Ожидает отправки",
        origin,
        destination,
        departureDate: date,
    };

    cargoList.push(newCargo);
    renderTable();
    this.reset();
});

// Обновление статуса
$(document).on("change", ".update-status", function () {
    const cargoId = $(this).data("id");
    const newStatus = $(this).val();

    const cargo = cargoList.find((cargo) => cargo.id === cargoId);

    if (newStatus === "Доставлен" && new Date(cargo.departureDate) > new Date()) {
        alert("Нельзя установить статус 'Доставлен', если дата отправления в будущем!");
        renderTable();
        return;
    }

    cargo.status = newStatus;
    renderTable();
});

// Фильтр по статусу
$("#statusFilter").change(function () {
    const filter = $(this).val();

    if (!filter) {
        renderTable();
        return;
    }

    const filteredList = cargoList.filter((cargo) => cargo.status === filter);

    const tableBody = $("#cargoTable");
    tableBody.empty();

    filteredList.forEach((cargo, index) => {
        const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${cargo.name}</td>
        <td>${cargo.status}</td>
        <td>${cargo.origin}</td>
        <td>${cargo.destination}</td>
        <td>${cargo.departureDate}</td>
        <td>
          <select class="form-select update-status" data-id="${cargo.id}">
            <option ${cargo.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
            <option ${cargo.status === "В пути" ? "selected" : ""}>В пути</option>
            <option ${cargo.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
          </select>
        </td>
      </tr>
    `;

        tableBody.append(row);
    });
});

// Первоначальный рендер
renderTable();
