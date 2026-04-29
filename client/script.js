const API_BASE = "https://student-record-management-virid.vercel.app/api/students";

// DOM Elements
const form = document.getElementById("student-form");
const nameInput = document.getElementById("name");
const studentIdInput = document.getElementById("studentId");
const phoneInput = document.getElementById("phone");
const editIdInput = document.getElementById("edit-id");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");
const formTitle = document.getElementById("form-title");
const tableBody = document.getElementById("students-tbody");
const loadingState = document.getElementById("loading-state");
const emptyState = document.getElementById("empty-state");
const tableResponsive = document.querySelector(".table-responsive");
const notification = document.getElementById("notification");

let studentsData = [];

// Initialize
document.addEventListener("DOMContentLoaded", fetchStudents);
form.addEventListener("submit", handleFormSubmit);
resetBtn.addEventListener("click", resetForm);

// Helper to escape HTML to prevent XSS
function escapeHTML(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.innerText = str;
    return div.innerHTML;
}

// Show/Hide Loading
function showLoading(isLoading) {
    if (isLoading) {
        loadingState.classList.remove("hidden");
        tableResponsive.classList.add("hidden");
        emptyState.classList.add("hidden");
    } else {
        loadingState.classList.add("hidden");
    }
}

// Notification System
function showNotification(message, type = "success") {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 3000);
}

// Fetch all students
async function fetchStudents() {
    showLoading(true);
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error("Failed to fetch students.");
        
        const data = await response.json();
        // Handle standard array or nested response { data: [...] }
        studentsData = Array.isArray(data) ? data : (data.data || data.students || []);
        
        renderTable();
    } catch (error) {
        showNotification("Error loading students: " + error.message, "error");
        renderTable(); // Renders empty state if array is empty
    } finally {
        showLoading(false);
    }
}

// Render Table
function renderTable() {
    tableBody.innerHTML = "";
    
    if (studentsData.length === 0) {
        emptyState.classList.remove("hidden");
        tableResponsive.classList.add("hidden");
        return;
    }
    
    emptyState.classList.add("hidden");
    tableResponsive.classList.remove("hidden");
    
    studentsData.forEach(student => {
        const tr = document.createElement("tr");
        // Support standard DB identifiers (_id for MongoDB)
        const id = student._id || student.id;
        
        tr.innerHTML = `
            <td>${escapeHTML(student.student_name)}</td>
            <td>${escapeHTML(student.student_id)}</td>
            <td>${escapeHTML(student.phone)}</td>
            <td class="action-buttons">
                <button class="btn edit-btn" onclick="editStudent('${id}')">Edit</button>
                <button class="btn delete-btn" onclick="deleteStudent('${id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Form Validation
function validateForm() {
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("error"));

    if (!nameInput.value.trim()) {
        document.getElementById("name-error").textContent = "Name is required";
        nameInput.classList.add("error");
        isValid = false;
    }

    if (!studentIdInput.value.trim()) {
        document.getElementById("studentId-error").textContent = "Student ID is required";
        studentIdInput.classList.add("error");
        isValid = false;
    }

    if (!phoneInput.value.trim()) {
        document.getElementById("phone-error").textContent = "Phone is required";
        phoneInput.classList.add("error");
        isValid = false;
    }

    return isValid;
}

// Set loading state on button
function setButtonLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.textContent = editIdInput.value ? "Updating..." : "Adding...";
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = editIdInput.value ? "Update Student" : "Add Student";
    }
}

// Add or Update Student
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    const studentData = {
        student_name: nameInput.value.trim(),
        student_id: studentIdInput.value.trim(),
        phone: phoneInput.value.trim()
    };

    const editId = editIdInput.value;
    const isEdit = !!editId;
    const url = isEdit ? `${API_BASE}/${editId}` : API_BASE;
    const method = isEdit ? "PUT" : "POST";

    setButtonLoading(true);

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Operation failed.");
        }

        showNotification(isEdit ? "Student updated successfully!" : "Student added successfully!");
        resetForm();
        fetchStudents();
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        setButtonLoading(false);
    }
}

// Prepare Edit State
window.editStudent = function(id) {
    const student = studentsData.find(s => (s._id === id || s.id === id));
    if (!student) return;

    nameInput.value = student.student_name || "";
    studentIdInput.value = student.student_id || "";
    phoneInput.value = student.phone || "";
    editIdInput.value = id;

    formTitle.textContent = "Edit Student";
    submitBtn.textContent = "Update Student";
    
    // Clear validation errors
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("error"));
    
    // Scroll to form
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
};

// Delete Student
window.deleteStudent = async function(id) {
    if (!confirm("Are you sure you want to delete this student record?")) return;

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to delete student.");
        }

        showNotification("Student deleted successfully!");
        fetchStudents();
    } catch (error) {
        showNotification(error.message, "error");
    }
};

// Reset Form
function resetForm() {
    form.reset();
    editIdInput.value = "";
    formTitle.textContent = "Add Student";
    submitBtn.textContent = "Add Student";
    
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("error"));
}
