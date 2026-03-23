// Gọi axios utility giống auth service
import http from './http'

// Tập hợp các hàm gọi Backend API cho module Chi nhánh
export const branchService = {
  // Phương thức GET: Lấy danh sách toàn bộ các chi nhánh
  getAllBranches() {
    return http.get('/api/branches')
  },
  
  // Phương thức GET: Lấy thông tin duy nhất một chi nhánh thông qua biến ID
  getBranchById(id) {
    return http.get(`/api/branches/${id}`)
  }
}
