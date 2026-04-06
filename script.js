document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("priority");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");

  const totalTasks = document.getElementById("totalTasks");
  const completedTasks = document.getElementById("completedTasks");
  const pendingTasks = document.getElementById("pendingTasks");

  const searchInput = document.getElementById("searchInput");
  const filterAll = document.getElementById("filterAll");
  const filterCompleted = document.getElementById("filterCompleted");
  const filterPending = document.getElementById("filterPending");

  const themeToggle = document.getElementById("themeToggle");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
  }

  function toggleEmptyState(visibleTasksCount) {
    if (visibleTasksCount === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }
  }

  function createTaskElement(task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    if (task.completed) {
      taskItem.classList.add("completed");
    }

    taskItem.setAttribute("data-id", task.id);

    taskItem.innerHTML = `
      <div class="task-left">
        <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""}>
        <div class="task-info">
          <h4 class="task-title">${task.text}</h4>
          <div class="task-meta">
            Priority: <span class="priority ${task.priority}">${capitalize(task.priority)}</span>
            | Status: <span class="status-text">${task.completed ? "Completed" : "Pending"}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="delete-btn">Delete</button>
      </div>
    `;

    const checkbox = taskItem.querySelector(".complete-checkbox");
    const deleteBtn = taskItem.querySelector(".delete-btn");

    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    deleteBtn.addEventListener("click", function () {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    return taskItem;
  }

  function renderTasks() {
    const searchText = searchInput.value.toLowerCase().trim();

    taskList.innerHTML = "";
    taskList.appendChild(emptyState);

    let filteredTasks = tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(searchText);

      if (currentFilter === "completed") {
        return matchesSearch && task.completed;
      }

      if (currentFilter === "pending") {
        return matchesSearch && !task.completed;
      }

      return matchesSearch;
    });

    filteredTasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });

    toggleEmptyState(filteredTasks.length);
    updateStats();
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    const priorityValue = prioritySelect.value;

    if (taskText === "") {
      alert("Please enter a task.");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      priority: priorityValue,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    prioritySelect.value = "low";
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  searchInput.addEventListener("input", renderTasks);

  filterAll.addEventListener("click", function () {
    currentFilter = "all";
    renderTasks();
  });

  filterCompleted.addEventListener("click", function () {
    currentFilter = "completed";
    renderTasks();
  });

  filterPending.addEventListener("click", function () {
    currentFilter = "pending";
    renderTasks();
  });

  if (themeToggle) {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      themeToggle.textContent = "☀️ Light";
    }

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark");

      if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️ Light";
        localStorage.setItem("theme", "dark");
      } else {
        themeToggle.textContent = "🌙 Dark";
        localStorage.setItem("theme", "light");
      }
    });
  }

  renderTasks();
});
