/**
 * =============================================================
 * FILE: frontend/src/utils/api-error.js
 * MÔ TẢ: Tiện ích parse lỗi từ API response
 * 
 * MỤC ĐÍCH:
 * - Khi API trả lỗi, backend gửi object: { success: false, message, errors[] }
 * - Hàm này trích xuất thông báo lỗi phù hợp nhất để hiển thị
 * 
 * THỨ TỰ ƯU TIÊN:
 * 1. errors[0]: chi tiết lỗi đầu tiên (từ validator)
 * 2. message: thông báo lỗi chung
 * 3. fallback: thông báo mặc định
 * =============================================================
 */

/**
 * Parse lỗi từ Axios error object
 * 
 * @param {Error} error - Axios error object
 * @param {string} fallback - Thông báo mặc định nếu không lấy được gì
 * @returns {string} Thông báo lỗi để hiển thị cho user
 * 
 * Cấu trúc Axios error:
 * error.response.data = {
 *   success: false,
 *   message: 'Dữ liệu không hợp lệ',
 *   errors: ['username tối thiểu 3 ký tự', 'email không hợp lệ']
 * }
 * 
 * Ví dụ usage:
 *   catch (error) {
 *     errorMessage.value = parseApiError(error, 'Có lỗi xảy ra');
 *   }
 */
export const parseApiError = (error, fallback = 'Có lỗi xảy ra') => {
  // Lấy message chung từ response
  const messageText = error?.response?.data?.message;
  // Lấy mảng chi tiết lỗi
  const errors = error?.response?.data?.errors;

  // Ưu tiên: lấy lỗi chi tiết đầu tiên (từ validator)
  if (Array.isArray(errors) && errors.length > 0) {
    return errors[0];
  }

  // Nếu không có errors → lấy message chung
  return messageText || fallback;
};
