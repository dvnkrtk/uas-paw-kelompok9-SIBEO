const API_BASE = "https://uas-paw-kelompok9-sibeo.onrender.com"

const fetchOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
}

export interface User {
  id: number
  name: string
  email: string
  role: "student" | "instructor"
}

export interface Course {
  id: number
  title: string
  description: string
  category: string
  instructor_id: number
  instructor_name?: string
  modules_count?: number
  enrollments_count?: number
  created_at?: string
}

export interface Module {
  id: number
  course_id: number
  title: string
  content: string
  order: number
}

export interface Enrollment {
  id: number
  enrollment_id?: number
  enrolled_date: string
  course_id: number
  course?: Course
}

async function handleResponse<T>(res: Response): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await res.json()

    if (data.status === "success" || res.ok) {
      return { success: true, data: data.data || data }
    }

    return { success: false, error: data.message || data.error || "Terjadi kesalahan" }
  } catch {
    if (res.ok) {
      return { success: true }
    }
    return { success: false, error: "Gagal memproses respons dari server" }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      ...fetchOptions,
      method: "GET",
    })
    const data = await res.json()

    // If user is logged in, the session will return user data
    if (data.status === "success" && data.data) {
      return data.data
    }
    return null
  } catch {
    return null
  }
}

export async function getAllCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_BASE}/api/courses`, {
      credentials: "include",
    })
    const data = await res.json()

    if (!res.ok || data.status === "error" || data.code || (data.message && !Array.isArray(data.data))) {
      console.error("API Error:", data)
      return []
    }

    const courses = data.data || data

    if (Array.isArray(courses)) {
      return courses.filter((c) => c && typeof c === "object" && !c.code && c.id && c.title)
    }

    return []
  } catch (err) {
    console.error("Error fetching courses:", err)
    return []
  }
}

export async function getCourseDetail(id: number): Promise<Course | null> {
  try {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, {
      credentials: "include",
    })
    const data = await res.json()

    if (!res.ok || data.status === "error" || data.code || (data.message && !data.title)) {
      console.error("API Error:", data)
      return null
    }

    // Get the course data
    const courseData = data.data || data

    if (courseData && typeof courseData === "object" && !courseData.code && courseData.id && courseData.title) {
      return courseData
    }

    return null
  } catch (err) {
    console.error("Error fetching course detail:", err)
    return null
  }
}

export async function getCourseModules(id: number): Promise<Module[]> {
  try {
    const res = await fetch(`${API_BASE}/api/courses/${id}/modules`, {
      credentials: "include",
    })
    const data = await res.json()

    if (!res.ok || data.status === "error" || data.code || (data.message && !Array.isArray(data.data))) {
      console.error("API Error:", data)
      return []
    }

    const modules = data.data || data

    if (Array.isArray(modules)) {
      // Filter out any error objects that might be in the array
      return modules.filter((m) => m && typeof m === "object" && !m.code && m.id)
    }

    return []
  } catch (err) {
    console.error("Error fetching modules:", err)
    return []
  }
}

export async function getMyEnrollments(): Promise<Enrollment[]> {
  try {
    const res = await fetch(`${API_BASE}/api/enrollments/me`, {
      credentials: "include",
    })
    const data = await res.json()

    if (!res.ok || data.status === "error" || data.code || (data.message && !Array.isArray(data.data))) {
      console.error("API Error:", data)
      return []
    }

    const enrollments = data.data || data

    if (Array.isArray(enrollments)) {
      return enrollments.filter((e) => e && typeof e === "object" && !e.code && (e.id || e.enrollment_id))
    }

    return []
  } catch (err) {
    console.error("Error fetching enrollments:", err)
    return []
  }
}

export async function enrollCourse(courseId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId }),
      credentials: "include",
    })
    return handleResponse(res)
  } catch (err) {
    console.error("Error enrolling:", err)
    return { success: false, error: "Gagal terhubung ke server" }
  }
}

export async function unenrollCourse(enrollmentId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/enrollments/${enrollmentId}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (res.status === 204 || res.ok) {
      return { success: true }
    }
    return handleResponse(res)
  } catch (err) {
    console.error("Error unenrolling:", err)
    return { success: false, error: "Gagal terhubung ke server" }
  }
}

export async function createCourse(
  title: string,
  description: string,
  category: string,
): Promise<{ success: boolean; data?: Course; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category }),
      credentials: "include",
    })
    return handleResponse<Course>(res)
  } catch (err) {
    console.error("Error creating course:", err)
    return { success: false, error: "Gagal terhubung ke server" }
  }
}

export async function updateCourse(
  id: number,
  title: string,
  description: string,
  category: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category }),
      credentials: "include",
    })
    return handleResponse(res)
  } catch (err) {
    console.error("Error updating course:", err)
    return { success: false, error: "Gagal terhubung ke server" }
  }
}

export async function deleteCourse(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (res.status === 204 || res.ok) {
      return { success: true }
    }
    return handleResponse(res)
  } catch (err) {
    console.error("Error deleting course:", err)
    return { success: false, error: "Gagal terhubung ke server" }
  }
}

export async function createModule(
  courseId: number,
  title: string,
  content: string,
): Promise<{ success: boolean; data?: Module; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
      credentials: "include",
    })
    return handleResponse<Module>(res)
  } catch (err) {
    console.error("Error creating module:", err)
    return { success: false, error: "Gagal terhubung ke server" }
  }
}

export async function updateModule(
  moduleId: number,
  title: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/modules/${moduleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
      credentials: "include",
    })
    return handleResponse(res)
  } catch (err) {
    console.error("Error updating module:", err)
    return { success: false, error: "Gagal terhubung ke server" }
  }
}

export async function deleteModule(moduleId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/modules/${moduleId}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (res.status === 204 || res.ok) {
      return { success: true }
    }
    return handleResponse(res)
  } catch (err) {
    console.error("Error deleting module:", err)
    return { success: false, error: "Gagal terhubung ke server" }
  }
}

export async function getInstructorDashboard(): Promise<{
  courses: Course[]
  stats: { total_courses: number; total_enrollments: number; total_modules: number }
}> {
  try {
    const res = await fetch(`${API_BASE}/api/instructor/dashboard`, {
      credentials: "include",
    })
    const data = await res.json()
    if (data.code || data.message || data.status === "error") {
      console.error("API Error:", data)
      return {
        courses: [],
        stats: { total_courses: 0, total_enrollments: 0, total_modules: 0 },
      }
    }
    return {
      courses: Array.isArray(data.data?.courses) ? data.data.courses : Array.isArray(data.courses) ? data.courses : [],
      stats: data.data?.stats || data.stats || { total_courses: 0, total_enrollments: 0, total_modules: 0 },
    }
  } catch (err) {
    console.error("Error fetching instructor dashboard:", err)
    return {
      courses: [],
      stats: { total_courses: 0, total_enrollments: 0, total_modules: 0 },
    }
  }
}

export async function getStudentProgress(): Promise<{
  enrollments: Enrollment[]
  stats: { total_courses: number; completed_modules: number }
}> {
  try {
    const res = await fetch(`${API_BASE}/api/student/progress`, {
      credentials: "include",
    })
    const data = await res.json()
    if (data.code || data.message || data.status === "error") {
      console.error("API Error:", data)
      return {
        enrollments: [],
        stats: { total_courses: 0, completed_modules: 0 },
      }
    }
    return {
      enrollments: Array.isArray(data.data?.enrollments)
        ? data.data.enrollments
        : Array.isArray(data.enrollments)
          ? data.enrollments
          : [],
      stats: data.data?.stats || data.stats || { total_courses: 0, completed_modules: 0 },
    }
  } catch (err) {
    console.error("Error fetching student progress:", err)
    return {
      enrollments: [],
      stats: { total_courses: 0, completed_modules: 0 },
    }
  }
}

export async function getCourseStudents(courseId: number): Promise<User[]> {
  try {
    const res = await fetch(`${API_BASE}/api/courses/${courseId}/students`, {
      credentials: "include",
    })
    const data = await res.json()
    if (data.code || data.message || data.status === "error") {
      console.error("API Error:", data)
      return []
    }
    return Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
  } catch (err) {
    console.error("Error fetching course students:", err)
    return []
  }
}
