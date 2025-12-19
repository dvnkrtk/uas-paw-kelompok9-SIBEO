const BASE_URL_ENV = process.env.NEXT_PUBLIC_API_URL || "https://uas-paw-kelompok9-sibeo.onrender.com/api"

// FIX: Pastikan Base URL tidak memiliki trailing slash agar konsisten saat penggabungan string
const API_BASE_URL = BASE_URL_ENV.endsWith("/") ? BASE_URL_ENV.slice(0, -1) : BASE_URL_ENV

async function apiCall(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  }

  // FIX: Pastikan endpoint diawali dengan slash
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${safeEndpoint}`

  try {
    console.log("[v0] API Call:", url)
    console.log("[v0] Request body:", options.body)

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // For session cookies
      mode: "cors", // Explicitly set CORS mode
    })

    console.log("[v0] Response status:", response.status)
    // Hati-hati log headers, bisa kosong di beberapa browser karena keamanan
    // console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

    // Handle different response formats
    let data
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
      console.log("[v0] API Response:", data)
    } else {
      const text = await response.text()
      console.log("[v0] API Response (text):", text)
      // Jangan throw error dulu, mungkin endpoint memang return text (jarang di API JSON)
      // Tapi untuk konsistensi API JSON, kita anggap ini warning
      if (!response.ok) throw new Error(`Unexpected response format: ${text}`)
    }

    // Check if response is successful
    if (!response.ok) {
      // Handle backend error format
      const errorMessage = data?.message || data?.error || `HTTP Error: ${response.status}`
      throw new Error(errorMessage)
    }

    // Return data based on response structure
    // Backend returns {success: true, message: "...", data: {...}}
    // Logic ini menjaga kompatibilitas dengan komponen UI yang ada
    return data?.data ? data : { data: data }
  } catch (error) {
    console.error("[v0] API Error:", error)

    if (error.message === "Failed to fetch") {
      throw new Error(
        "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan dan CORS sudah dikonfigurasi dengan benar.",
      )
    }

    throw error
  }
}

// Auth Service
// Sesuai dengan routes: /api/register, /api/login, /api/logout
export const authService = {
  async register(name, email, password, role) {
    console.log("[v0] Register payload:", { name, email, password: "***", role })
    const response = await apiCall("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    })
    return response
  },

  async login(email, password) {
    console.log("[v0] Login payload:", { email, password: "***" })
    const response = await apiCall("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return response
  },

  async logout() {
    const response = await apiCall("/logout", { method: "POST" })
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    return response
  },
}

// User Service (NEW)
// Menambahkan endpoint user yang sebelumnya hilang
// Sesuai dengan routes: /api/users, /api/users/{id}
export const userService = {
  async getAllUsers() {
    return apiCall("/users", { method: "GET" })
  },

  async getUserById(id) {
    return apiCall(`/users/${id}`, { method: "GET" })
  },
  
  // Note: Create user ditangani oleh authService.register (public) 
  // atau bisa via POST /users (admin), tapi kita pakai register dulu.
}

// Course Service
// Sesuai dengan routes: /api/courses, /api/courses/{id}, /api/courses/{id}/modules
export const courseService = {
  async getAllCourses() {
    return apiCall("/courses", { method: "GET" })
  },

  async getCourseById(id) {
    return apiCall(`/courses/${id}`, { method: "GET" })
  },

  async createCourse(data) {
    return apiCall("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateCourse(id, data) {
    return apiCall(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteCourse(id) {
    return apiCall(`/courses/${id}`, { method: "DELETE" })
  },

  async getModules(courseId) {
    return apiCall(`/courses/${courseId}/modules`, { method: "GET" })
  },

  // NEW: Endpoint untuk melihat siswa yang terdaftar di kursus ini
  // Route: /api/courses/{id}/students
  async getEnrolledStudents(courseId) {
    return apiCall(`/courses/${courseId}/students`, { method: "GET" })
  },
}

// Enrollment Service
// Sesuai dengan routes: /api/enrollments, /api/enrollments/me, /api/enrollments/{id}
export const enrollmentService = {
  async enroll(courseId) {
    return apiCall("/enrollments", {
      method: "POST",
      body: JSON.stringify({ course_id: courseId }),
    })
  },

  async getMyCourses() {
    return apiCall("/enrollments/me", { method: "GET" })
  },

  async unenroll(enrollmentId) {
    // Pastikan parameter adalah Enrollment ID, bukan Course ID
    return apiCall(`/enrollments/${enrollmentId}`, { method: "DELETE" })
  },
}

// Module Service
// Sesuai dengan routes: /api/courses/{id}/modules (create), /api/modules/{id} (update/delete)
export const moduleService = {
  async createModule(courseId, data) {
    return apiCall(`/courses/${courseId}/modules`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateModule(moduleId, data) {
    return apiCall(`/modules/${moduleId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteModule(moduleId) {
    return apiCall(`/modules/${moduleId}`, { method: "DELETE" })
  },
}

// Dashboard Service
// Sesuai dengan routes: /api/instructor/dashboard, /api/student/progress
export const dashboardService = {
  async getInstructorDashboard() {
    return apiCall("/instructor/dashboard", { method: "GET" })
  },

  async getStudentProgress() {
    return apiCall("/student/progress", { method: "GET" })
  },
}