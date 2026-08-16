// AquaEquity Authentication Service (JavaScript)
import { apiClient, USE_MOCK_API } from './apiClient';
import { DEMO_USERS } from '../mocks/mockData';

class AuthService {
  async sendOtp(phone) {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      return {
        success: true,
        message: 'OTP sent successfully to ' + phone,
        demoOtp: '123456',
      };
    }
    const res = await apiClient.post('/auth/send-otp', { phone });
    return res.data;
  }

  async verifyOtp(phone, otp, selectedRole = 'CITIZEN') {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));

      let user = DEMO_USERS.citizen;
      if (selectedRole === 'ADMIN' || (phone && phone.includes('00001'))) {
        user = DEMO_USERS.admin;
      } else if (selectedRole === 'AUTHORITY' || (phone && phone.includes('00002'))) {
        user = DEMO_USERS.authority;
      } else {
        user = {
          ...DEMO_USERS.citizen,
          phone,
        };
      }

      const token = `mock-token-${user.id}-${Date.now()}`;
      localStorage.setItem('aquaequity_token', token);
      localStorage.setItem('aquaequity_user', JSON.stringify(user));
      return { user, token };
    }

    const res = await apiClient.post('/auth/verify-otp', { phone, otp, role: selectedRole });
    localStorage.setItem('aquaequity_token', res.data.token);
    localStorage.setItem('aquaequity_user', JSON.stringify(res.data.user));
    return res.data;
  }

  getCurrentUser() {
    const saved = localStorage.getItem('aquaequity_user');
    if (!saved) return DEMO_USERS.citizen;
    try {
      return JSON.parse(saved);
    } catch {
      return DEMO_USERS.citizen;
    }
  }

  logout() {
    localStorage.removeItem('aquaequity_token');
    localStorage.removeItem('aquaequity_user');
  }
}

export const authService = new AuthService();
