const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9]{9,15}$/

export const validateRegisterForm = (form) => {
  if (String(form.username || '').trim().length < 3) {
    return 'Tên đăng nhập phải có ít nhất 3 ký tự'
  }

  if (String(form.fullName || '').trim().length < 2) {
    return 'Họ và tên phải có ít nhất 2 ký tự'
  }

  if (!EMAIL_PATTERN.test(String(form.email || '').trim())) {
    return 'Email không hợp lệ'
  }

  const phone = String(form.phone || '').trim()
  if (phone && !PHONE_PATTERN.test(phone)) {
    return 'Số điện thoại không hợp lệ'
  }

  if (String(form.password || '').length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự'
  }

  if (String(form.password || '') !== String(form.confirmPassword || '')) {
    return 'Mật khẩu xác nhận không khớp'
  }

  return ''
}
