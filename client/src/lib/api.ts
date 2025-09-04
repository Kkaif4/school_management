import { CreateSchoolFormData } from '@/components/admin/CreateSchoolModal';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
};

export const schoolAPI = {
  getSchools: () => api.get('/school'),

  createSchool: (schoolData: CreateSchoolFormData) =>
    api.post('/school', schoolData),

  updateSchool: (id: string, schoolData: any) =>
    api.patch(`/school/${id}`, schoolData),

  deleteSchool: (id: string) => api.delete(`/school/${id}`),

  getSchoolById: (id: string) => api.get(`/school/${id}`),
};
export const studentAPI = {
  createStudent: (studentData: any) => api.post('/student', studentData),
  uploadCSV: (formData: any) =>
    api.post('/student/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getStudent: (schoolId: string) => api.get(`/student/${schoolId}`),
  getStudentById: (id: string) => api.get(`/student/${id}`),
  updateStudent: (id: string, studentData: any) =>
    api.patch(`/student/${id}`, studentData),
  deleteStudent: (id: string) => api.delete(`/student/${id}`),
};

export const teacherAPI = {
  createTeacher: (teacherData: any) => api.post('/user', teacherData),

  getTeachers: (schoolId: string) => api.get(`/user/teachers/${schoolId}`),

  updateTeacher: (id: string, teacherData: any) =>
    api.patch(`/user/${id}`, teacherData),

  deleteTeacher: (id: string) => api.delete(`/user/${id}`),
};

interface certificateData {
  schoolId: string;
  templateCode: string;
  name: string;
}
export const certificateAPI = {
  createCertificate: (data: certificateData) => api.post(`/certificate/`, data),

  getCertificates: (schoolId: string) => api.get(`/certificate/${schoolId}`),

  generateCertificate: (studentId: string, certificateId: string) =>
    api.get(`/certificate/${studentId}/${certificateId}`),

  getCertificateById: (id: string) => api.get(`/certificate/${id}`),
};

export const logsAPI = {
  getLogs: (studentId: string) => api.get(`/logs/${studentId}`),
};

export default api;
