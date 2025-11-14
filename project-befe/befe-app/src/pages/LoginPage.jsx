import { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/outline';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate credentials
    if (username === 'boardgameadmin' && password === 'mysecure123pass') {
    // Store authentication token/flag
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/store-manager/boardgamelist');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-400 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-4xl">🔐</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">เข้าสู่ระบบ <p>BoardgameAdmin</p></h2>
          <p className="mt-2 text-sm text-red-100">สำหรับผู้ดูแลระบบเท่านั้น</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300
                    rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-viridian-500 focus:border-viridian-500"
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300
                    rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-viridian-500 focus:border-viridian-500"
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md
                  hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                  transition-colors duration-200"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <a href="/" className="text-sm text-white hover:text-red-100 transition-colors">
            ← กลับสู่หน้าแรก
          </a>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
