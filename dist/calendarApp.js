"use strict";
document.addEventListener("DOMContentLoaded", () => {
    //* Zona de Variables
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    const calendar = document.getElementById("calendar-display");
    const currentDay = document.querySelector(".month-display");
    const backForArrows = document.querySelectorAll(".BF-arrow");
    const dueDate = document.getElementById("due-date");
    const addTask = document.getElementById("addBtn");
    const taskTitle = document.getElementById("taskTitle");
    const taskDescription = document.getElementById("taskDescription");
    const popup = document.getElementById("popup");
    const deleteTask = document.getElementById("delete-btn");
    const editTask = document.getElementById("edit-btn");
    const priorityElement = document.getElementById("priority");
    //* Variables del popup
    const popupTaskTitle = document.getElementById("task-title");
    const popupTaskDate = document.getElementById("task-date");
    const popupTaskDescription = document.getElementById("task.desc");
    const popupTaskPriority = document.getElementById("task-priority");
    const tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
    if (!priorityElement) {
        console.error("El elemento priority no se encontró en el DOM");
        return;
    }
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    //getDay() => DA el numero del dia de la semana --> [lunes:1, martes:2, miércoles:3, jueves:4, viernes:5, sábado:6, domingo:0]
    //* Zona de Funciones
    //? Función para renderizar el calendario
    function renderCalendar() {
        let dayOne = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();
        let lastDay = new Date(year, month, lastDate).getDay();
        let lastDatePrevMonth = new Date(year, month, 0).getDate();
        let calendarDisplay = "";
        //Dias de la semana del mes pasado
        for (let i = dayOne - 1; i > 0; i--) {
            let prevMonth = month - 1 < 0 ? 11 : month - 1;
            let prevYear = month - 1 < 0 ? year - 1 : year;
            let addZero = prevMonth + 1 < 10 ? "0" : "";
            calendarDisplay += `<div class="calendar-dates prev-date" id="${prevYear}-${addZero}${prevMonth + 1}-${lastDatePrevMonth - i + 1}">${lastDatePrevMonth - i + 1}</div>`;
        }
        for (let i = 1; i <= lastDate; i++) {
            let isToday = i === date.getDate() && year === date.getFullYear() && month === date.getMonth() ? "today" : "";
            let addZero = month + 1 < 10 ? "0" : "";
            calendarDisplay += `<div class="calendar-dates ${isToday}" id="${year}-${addZero}${month + 1}-${i}">${i}</div>`;
        }
        for (let i = lastDay; i <= 6; i++) {
            let nextMonth = month - 1 < 0 ? 11 : month + 1;
            let nextYear = month - 1 < 0 ? year + 1 : year;
            let addZero = nextMonth + 1 < 10 ? "0" : "";
            calendarDisplay += `<div class="calendar-dates next-date" id="${nextYear}-${addZero}${nextMonth + 1}-${i - lastDay + 1}">${i - lastDay + 1}</div>`;
        }
        if (currentDay) {
            currentDay.innerHTML = `${months[month]} ${year}`;
        }
        if (calendar) {
            calendar.innerHTML = calendarDisplay;
        }
        const days = document.querySelectorAll(".calendar-dates");
        renderTasks(tasks, days);
    }
    renderCalendar();
    //? Función para renderizar las tareas
    function renderTasks(tasks, days) {
        tasks.forEach((task) => {
            days.forEach(day => {
                console.log(day.id);
                console.log(task.date);
                console.log(day.id === task.date);
                if (day.id === task.date) {
                    day.innerHTML += `<div class="task ${task.priority}" id="${task.date}">${task.title}</div>`;
                }
            });
        });
    }
    //? Función para agregar tarea
    addTask.addEventListener("click", () => {
        const selectedPriority = priorityElement.value;
        if (taskTitle.value != "" && dueDate.value != "" && priorityElement.value != "") {
            tasks.push({
                date: dueDate.value,
                title: taskTitle.value,
                description: taskDescription.value,
                priority: selectedPriority
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderCalendar();
            taskTitle.value = "";
            taskDescription.value = "";
            dueDate.value = "";
        }
        else {
            alert("Introduce el título, la fecha y la prioridad");
        }
    });
    //? Función para mostrar las tareas
    document.addEventListener("mouseover", (event) => {
        const target = event.target;
        if (target.classList.contains("task")) {
            const rect = target.getBoundingClientRect();
            popup.style.display = "block";
            popup.style.top = `${rect.top - popup.offsetHeight + window.scrollY}px`;
            popup.style.left = `${rect.left}px`;
            tasks.map((task, index) => {
                if (task.date === target.id) {
                    popupTaskTitle.textContent = task.title || '';
                    if (task.description) {
                        popupTaskDescription.textContent = task.description || '';
                    }
                    popupTaskDate.textContent = task.date || '';
                    popupTaskPriority.style.color = task.priority === "High-Priority" ? "rgb(255, 59, 48)" : task.priority === "Medium-Priority" ? "rgb(255, 165, 9)" : "rgb(76, 217, 100)";
                    popupTaskPriority.textContent = task.priority || '';
                    editTask.setAttribute("name", `${index}`);
                    deleteTask.setAttribute("name", `${index}`);
                }
            });
        }
    });
    //? Función para ocultar las tareas
    document.addEventListener("mouseout", (event) => {
        const target = event.target;
        if (target.classList.contains("task")) {
            popup.style.display = "none";
        }
    });
    //? Función para mantener las tareas abiertas
    popup.addEventListener("mouseover", (event) => {
        popup.style.display = "block";
    });
    popup.addEventListener("mouseleave", () => {
        popup.style.display = "none";
    });
    //? Función para cambiar de mes
    backForArrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            month = arrow.id === "month-backward" ? month - 1 : month + 1;
            if (month < 0 || month > 11) {
                date = new Date(year, month, new Date().getDate());
                year = date.getFullYear();
                month = date.getMonth();
            }
            else {
                date = new Date();
            }
            renderCalendar();
        });
    });
    //? Función para editar tareas
    editTask.addEventListener("click", () => {
        const taskIndex = Number(editTask.name);
        const taskToEdit = tasks[taskIndex];
        taskTitle.value = taskToEdit.title;
        taskDescription.value = taskToEdit.description || "";
        dueDate.value = taskToEdit.date;
        priorityElement.value = taskToEdit.priority;
        tasks.splice(taskIndex, 1);
        popup.style.display = "none";
        renderCalendar();
    });
    //? Función para borrar tareas
    deleteTask.addEventListener("click", () => {
        const taskIndex = Number(deleteTask.name);
        tasks.splice(taskIndex, 1);
        popup.style.display = "none";
        renderCalendar();
    });
});
//! Zona de Código retirado y util
/*function GFG_Fun() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.log("First day = " + firstDay)
    console.log("Last day = " + lastDay);
}
GFG_Fun()*/
/*for (let i = 1; i < 7 - lastDay; i++) {
  if (lastDay = 0) {
    break
  } else {
    calendarDisplay.push(i)
  }
}*/
/*console.log(year)
console.log(months[month + 2])
console.log("First day = " + dayOne)
console.log(lastDate)
console.log(lastDay)
console.log(lastDatePrevMonth)
console.log(calendarDisplay)
let abrilLastDay = new Date(2025, 3, 30).getDay()
console.log(abrilLastDay)*/
/*console.log("Año: " + year)
console.log("Mes: " + months[month])
console.log("Primer día del mes: " + dayOne)
console.log("Último día del mes: " + lastDate)
console.log("Último día de la semana del mes: " + lastDay)
console.log("Último día del mes anterior: " + lastDatePrevMonth)
console.log("Calendario: " + calendarDisplay.join(", "))*/ 
//# sourceMappingURL=calendarApp.js.map