# Hệ thống Logout - Implementation Guide

## Tổng quan

Hệ thống logout đã được cập nhật để xóa hoàn toàn tất cả dữ liệu authentication khi người dùng đăng xuất, bao gồm:

- Access Token
- Refresh Token  
- User ID
- User Role
- Session data
- Local Storage
- Session Storage
- Các cookies khác liên quan đến authentication

## Các file đã được cập nhật

### 1. `src/lib/token-utils.ts`
- Thêm hàm `clearAllAuthData()` để xóa toàn bộ dữ liệu authentication
- Xóa cookies với nhiều path khác nhau (`/`, `/dashboard`, `/auth`)
- Xóa localStorage và sessionStorage

### 2. `src/lib/api/auth.ts`
- Cập nhật mutation `logout` để sử dụng `clearAllAuthData()`
- Xử lý cả trường hợp API call thành công và thất bại
- Đảm bảo cookies luôn được xóa ngay cả khi server không phản hồi

### 3. `src/components/layout/user-nav.tsx`
- Cập nhật `handleLogout` để sử dụng `clearAllAuthData()`
- Thêm thông báo toast cho user
- Xử lý lỗi và đảm bảo redirect về trang login

### 4. `src/middleware.ts`
- Cập nhật để xóa nhiều loại cookies hơn khi token không hợp lệ
- Đảm bảo tất cả cookies authentication được xóa khi redirect

### 5. `src/lib/auth-interceptor.ts`
- Cập nhật để sử dụng `clearAllAuthData()` khi refresh token thất bại

## Cách hoạt động

### Khi user click logout:

1. **Gọi API logout** - Thông báo cho server về việc logout
2. **Xóa tất cả cookies** - Sử dụng `clearAllAuthData()`
3. **Xóa localStorage/sessionStorage** - Xóa dữ liệu lưu trữ local
4. **Hiển thị thông báo** - Toast message cho user
5. **Redirect** - Chuyển về trang `/auth/login`

### Các cookies được xóa:

```javascript
const cookiesToRemove = [
    'accessToken',
    'refreshToken', 
    'userId',
    'userRole',
    'session',
    'auth',
    'token',
    'jwt',
    'user',
    'login',
    'remember',
    'persist'
];
```

### Xử lý lỗi:

- Ngay cả khi API call thất bại, tất cả dữ liệu authentication vẫn được xóa
- User được redirect về trang login
- Hiển thị thông báo phù hợp

## Bảo mật

- Tất cả cookies được xóa với `expires=Thu, 01 Jan 1970 00:00:00 UTC`
- Xóa cookies với nhiều path khác nhau để đảm bảo không còn sót
- Xóa cả localStorage và sessionStorage
- Middleware cũng xóa cookies khi phát hiện token không hợp lệ

## Testing

Để test hệ thống logout:

1. Đăng nhập vào hệ thống
2. Mở Developer Tools > Application > Cookies
3. Click logout
4. Kiểm tra tất cả cookies authentication đã được xóa
5. Kiểm tra localStorage và sessionStorage đã được xóa
6. Kiểm tra đã được redirect về trang login 