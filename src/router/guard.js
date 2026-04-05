/**
 * =============================================================
 * FILE: frontend/src/router/guard.js
 * MÔ TẢ: Tiện ích tạo route guard cho Vue Router
 * 
 * ROUTE GUARD LÀ GÌ?
 * - Là cơ chế chặn/chuyển hướng người dùng dựa trên điều kiện
 * - Ví dụ: chưa login → chặn vào /profile
 * - Ví dụ: đã login → chặn vào /login (redirect về home)
 * 
 * CÁCH HOẠT ĐỘNG:
 * 1. Gắn meta data vào route config (requiresAuth, guestOnly)
 * 2. Router beforeEach kiểm tra meta + token
 * 3. Nếu không thỏa điều kiện → chuyển hướng
 * =============================================================
 */

/**
 * Tạo route config có gắn meta guard
 * 
 * @param {object} routeConfig - Cấu hình route thông thường
 * @param {string} guardType - Loại guard: 'requiresAuth' | 'guestOnly' | null
 * @returns {object} Route config có meta
 * 
 * guardType:
 * - 'requiresAuth': Chỉ user đã login mới vào được
 *   Ví dụ: /profile, /booking, /change-password
 * 
 * - 'guestOnly': Chỉ user CHƯA login mới vào được
 *   Ví dụ: /login, /register, /forgot-password
 *   (đã login rồi thì không cần vào trang login nữa)
 * 
 * - null: Không guard, ai cũng vào được
 *   Ví dụ: /, /branches, /rooms
 * 
 * Ví dụ usage:
 *   createGuardedRoute({ path: '/profile', component: ProfileView }, 'requiresAuth')
 *   → { path: '/profile', component: ProfileView, meta: { requiresAuth: true } }
 */
export const createGuardedRoute = (routeConfig, guardType = null) => {
  // Nếu không có guard → trả về route config gốc
  if (!guardType) {
    return routeConfig;
  }

  // Tạo meta object từ route config gốc (giữ lại meta cũ nếu có)
  const meta = { ...(routeConfig.meta || {}) };

  // Gắn flag requiresAuth
  if (guardType === 'requiresAuth') {
    meta.requiresAuth = true;
  }

  // Gắn flag guestOnly
  if (guardType === 'guestOnly') {
    meta.guestOnly = true;
  }

  // Trả về route config với meta đã bổ sung
  return {
    ...routeConfig,
    meta
  };
};

/**
 * Kiểm tra và trả đường dẫn chuyển hướng (nếu cần)
 * 
 * @param {object} to - Route destination (điểm đến)
 * @param {string|null} token - Access token hiện tại
 * @returns {string|null} Đường dẫn chuyển hướng, hoặc null nếu không cần redirect
 * 
 * LOGIC:
 * 1. Route cần login (requiresAuth) + không có token → redirect /login
 * 2. Route chỉ dành cho khách (guestOnly) + có token → redirect /
 * 3. Không trường hợp nào → null (cho phép đi tiếp)
 * 
 * Ví dụ:
 * - User chưa login, truy cập /profile → redirect /login
 * - User đã login, truy cập /login → redirect /
 * - User đã login, truy cập /profile → null (cho phép)
 */
export const resolveAuthRedirect = (to, token) => {
  // Trường hợp 1: Route cần login nhưng user chưa login
  if (to.meta.requiresAuth && !token) {
    return '/login';
  }

  // Trường hợp 2: Route chỉ dành cho khách nhưng user đã login
  if (to.meta.guestOnly && token) {
    return '/';
  }

  // Không cần redirect
  return null;
};
