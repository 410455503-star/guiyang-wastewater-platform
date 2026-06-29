import { useState } from 'react'
import {
  Users,
  Shield,
  Settings,
  Bell,
  Database,
  Key,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  RefreshCw,
  Server,
  Wifi,
  HardDrive,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Search,
} from 'lucide-react'

const mockUsers = [
  { id: 1, username: 'admin', name: '系统管理员', role: '系统管理员', email: 'admin@example.com', status: 'active' },
  { id: 2, username: 'operator1', name: '王调度', role: '调度操作员', email: 'operator1@example.com', status: 'active' },
  { id: 3, username: 'inspector1', name: '张巡检', role: '巡检人员', email: 'inspector1@example.com', status: 'active' },
  { id: 4, username: 'manager1', name: '李经理', role: '管理人员', email: 'manager1@example.com', status: 'inactive' },
]

const mockRoles = [
  { id: 1, name: '系统管理员', permissions: ['用户管理', '系统配置', '数据查看', '报警管理', '设备控制', '数据导出'] },
  { id: 2, name: '调度操作员', permissions: ['数据查看', '报警管理', '设备控制'] },
  { id: 3, name: '巡检人员', permissions: ['巡检任务', '数据查看', '报警确认'] },
  { id: 4, name: '管理人员', permissions: ['数据查看', '报表分析', '数据导出'] },
]

const allPermissions = [
  { name: '用户管理', category: '系统管理' },
  { name: '系统配置', category: '系统管理' },
  { name: '数据查看', category: '数据权限' },
  { name: '报警管理', category: '业务权限' },
  { name: '设备控制', category: '业务权限' },
  { name: '数据导出', category: '数据权限' },
  { name: '巡检任务', category: '业务权限' },
  { name: '报警确认', category: '业务权限' },
  { name: '报表分析', category: '数据权限' },
]

interface SystemService {
  name: string
  status: string
  cpu?: number
  memory?: number
  uptime?: string
  connection?: string
  keys?: string
  latency?: string
  bandwidth?: string
}

const mockSystemStatus: Record<string, SystemService> = {
  server: { name: '应用服务器', status: 'online', cpu: 45, memory: 68, uptime: '99.9%' },
  database: { name: '数据库服务', status: 'online', cpu: 23, memory: 45, connection: '128' },
  redis: { name: '缓存服务', status: 'online', cpu: 5, memory: 22, keys: '15680' },
  network: { name: '网络连接', status: 'online', latency: '12ms', bandwidth: '1.2Gbps' },
}

const tabs = [
  { id: 'users', label: '用户管理', icon: Users },
  { id: 'roles', label: '角色权限', icon: Shield },
  { id: 'system', label: '系统配置', icon: Settings },
  { id: 'status', label: '系统状态', icon: Server },
]

interface FormData {
  username: string
  name: string
  email: string
  role: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  username?: string
  name?: string
  email?: string
  role?: string
  password?: string
  confirmPassword?: string
}

export default function System() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<typeof mockRoles[0] | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  })
  
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const [systemSettings, setSystemSettings] = useState({
    voiceAlarm: true,
    smsNotification: true,
    dataRefreshInterval: 5,
    dataRetention: 2,
    sessionTimeout: 30,
    passwordStrength: 'high',
    twoFactorAuth: false,
    loginAttemptLimit: 5,
    dataCompression: true,
    autoBackup: true,
  })

  const filteredUsers = users.filter((u) => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    if (!formData.username.trim()) {
      errors.username = '请输入用户名'
    } else if (formData.username.length < 3) {
      errors.username = '用户名至少3个字符'
    }
    
    if (!formData.name.trim()) {
      errors.name = '请输入姓名'
    }
    
    if (!formData.email.trim()) {
      errors.email = '请输入邮箱'
    } else if (!validateEmail(formData.email)) {
      errors.email = '邮箱格式不正确'
    }
    
    if (!formData.role) {
      errors.role = '请选择角色'
    }
    
    if (!isEditing) {
      if (!formData.password) {
        errors.password = '请输入密码'
      } else if (formData.password.length < 6) {
        errors.password = '密码至少6个字符'
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = '请确认密码'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (isEditing && editingUser) {
      setUsers(users.map((u) =>
        u.id === editingUser.id
          ? { ...u, ...formData, username: formData.username.trim(), name: formData.name.trim(), email: formData.email.trim(), role: formData.role }
          : u
      ))
    } else {
      const newUser = {
        id: users.length + 1,
        username: formData.username.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: 'active' as const,
      }
      setUsers([...users, newUser])
    }
    
    resetForm()
    setShowModal(false)
  }

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    })
    setFormErrors({})
    setIsEditing(false)
    setEditingUser(null)
  }

  const handleOpenModal = (user?: typeof mockUsers[0]) => {
    if (user) {
      setIsEditing(true)
      setEditingUser(user)
      setFormData({
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        confirmPassword: '',
      })
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  const toggleUserStatus = (id: number) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' as const : 'active' as const } : u
    ))
  }

  const deleteUser = (id: number) => {
    if (window.confirm('确定要删除该用户吗？')) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const toggleSetting = (key: keyof typeof systemSettings) => {
    if (typeof systemSettings[key] === 'boolean') {
      setSystemSettings({ ...systemSettings, [key]: !systemSettings[key] })
    }
  }

  const updateSetting = (key: keyof typeof systemSettings, value: number | string) => {
    setSystemSettings({ ...systemSettings, [key]: value })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-emerald-400 bg-emerald-500/20'
      case 'offline': return 'text-red-400 bg-red-500/20'
      case 'warning': return 'text-amber-400 bg-amber-500/20'
      case 'active': return 'text-emerald-400 bg-emerald-500/20'
      case 'inactive': return 'text-slate-400 bg-slate-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return '在线'
      case 'offline': return '离线'
      case 'warning': return '警告'
      case 'active': return '启用'
      case 'inactive': return '禁用'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            系统设置
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            管理系统用户、角色权限和系统配置
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all">
          <RefreshCw size={16} />
          刷新配置
        </button>
      </div>

      {/* 标签页 */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-white'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 用户管理 */}
      {activeTab === 'users' && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20">
                <Users size={22} className="text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">用户列表</h3>
              <span className="px-2 py-0.5 bg-slate-600/50 text-slate-400 rounded-full text-xs font-medium">
                {users.length}人
              </span>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all"
            >
              <Plus size={16} />
              新增用户
            </button>
          </div>

          {/* 搜索 */}
          <div className="relative mb-5">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="搜索用户名、姓名或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">用户名</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">姓名</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">角色</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">邮箱</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">状态</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-white">{user.username}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-[var(--text-secondary)]">{user.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${getStatusColor(user.status)}`}
                      >
                        {user.status === 'active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        {getStatusLabel(user.status)}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-teal-400 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Users size={48} className="opacity-50" />
              </div>
              <p className="empty-state-title">暂无用户</p>
              <p className="empty-state-desc">点击右上角按钮添加用户</p>
            </div>
          )}
        </div>
      )}

      {/* 角色权限 */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 角色列表 */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/20">
                  <Shield size={22} className="text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">角色列表</h3>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors text-sm">
                <Plus size={16} />
                新增角色
              </button>
            </div>
            <div className="space-y-3">
              {mockRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRole?.id === role.id
                      ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border-teal-500/50 shadow-lg shadow-teal-500/10'
                      : 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-500/10">
                        <Shield size={18} className="text-teal-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{role.name}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{role.permissions.length}项权限</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${selectedRole?.id === role.id ? 'rotate-90 text-teal-400' : 'text-[var(--text-muted)]'}`} />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {role.permissions.slice(0, 4).map((perm) => (
                      <span key={perm} className="px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded text-xs">
                        {perm}
                      </span>
                    ))}
                    {role.permissions.length > 4 && (
                      <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs">
                        +{role.permissions.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 权限详情 */}
          <div className="glass-card p-6">
            {selectedRole ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedRole.name}</h3>
                    <p className="text-sm text-[var(--text-muted)]">配置角色权限</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors text-sm">
                    <Save size={14} />
                    保存
                  </button>
                </div>
                <div className="space-y-4">
                  {Object.entries(allPermissions.reduce((acc, perm) => {
                    if (!acc[perm.category]) acc[perm.category] = []
                    acc[perm.category].push(perm)
                    return acc
                  }, {} as Record<string, typeof allPermissions>)).map(([category, permissions]) => (
                    <div key={category}>
                      <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">{category}</p>
                      <div className="flex flex-wrap gap-2">
                        {permissions.map((perm) => {
                          const hasPermission = selectedRole.permissions.includes(perm.name)
                          return (
                            <button
                              key={perm.name}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                hasPermission
                                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                                  : 'bg-[var(--bg-secondary)]/50 text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
                              }`}
                            >
                              {hasPermission && <CheckCircle size={14} className="inline mr-1" />}
                              {perm.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
                <div className="p-6 rounded-full bg-[var(--bg-secondary)]/50 mb-4">
                  <Shield size={48} className="opacity-50" />
                </div>
                <p className="text-sm">选择一个角色查看权限</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 系统配置 */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* 报警配置 */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Bell size={22} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">报警配置</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-white">语音报警</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">启用语音播报报警信息</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.voiceAlarm}
                      onChange={() => toggleSetting('voiceAlarm')}
                      className="toggle-switch-input"
                    />
                    <span className="toggle-switch-slider" />
                  </label>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-white">短信通知</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">发送报警短信给责任人</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.smsNotification}
                      onChange={() => toggleSetting('smsNotification')}
                      className="toggle-switch-input"
                    />
                    <span className="toggle-switch-slider" />
                  </label>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-sm text-[var(--text-muted)] mb-2">报警延迟</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={systemSettings.dataRefreshInterval}
                    onChange={(e) => updateSetting('dataRefreshInterval', parseInt(e.target.value) || 5)}
                    className="flex-1 input-field text-sm"
                  />
                  <span className="text-sm text-white">秒</span>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-sm text-[var(--text-muted)] mb-2">报警确认超时</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 30)}
                    className="flex-1 input-field text-sm"
                  />
                  <span className="text-sm text-white">分钟</span>
                </div>
              </div>
            </div>
          </div>

          {/* 数据配置 */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Database size={22} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">数据配置</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-sm text-[var(--text-muted)] mb-2">数据刷新间隔</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={systemSettings.dataRefreshInterval}
                    onChange={(e) => updateSetting('dataRefreshInterval', parseInt(e.target.value) || 5)}
                    className="flex-1 input-field text-sm"
                  />
                  <span className="text-sm text-white">秒</span>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-sm text-[var(--text-muted)] mb-2">历史数据保留</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={systemSettings.dataRetention}
                    onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value) || 2)}
                    className="flex-1 input-field text-sm"
                  />
                  <span className="text-sm text-white">年</span>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-white">数据压缩</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">压缩存储历史数据</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.dataCompression}
                      onChange={() => toggleSetting('dataCompression')}
                      className="toggle-switch-input"
                    />
                    <span className="toggle-switch-slider" />
                  </label>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-white">自动备份</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">定时自动备份数据</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.autoBackup}
                      onChange={() => toggleSetting('autoBackup')}
                      className="toggle-switch-input"
                    />
                    <span className="toggle-switch-slider" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 安全配置 */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Key size={22} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">安全配置</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-sm text-[var(--text-muted)] mb-2">会话超时</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 30)}
                    className="flex-1 input-field text-sm"
                  />
                  <span className="text-sm text-white">分钟</span>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-sm text-[var(--text-muted)] mb-2">密码强度</p>
                <select
                  value={systemSettings.passwordStrength}
                  onChange={(e) => updateSetting('passwordStrength', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-white">双因素认证</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">登录时需要验证码</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={systemSettings.twoFactorAuth}
                      onChange={() => toggleSetting('twoFactorAuth')}
                      className="toggle-switch-input"
                    />
                    <span className="toggle-switch-slider" />
                  </label>
                </div>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-sm text-[var(--text-muted)] mb-2">登录尝试限制</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={systemSettings.loginAttemptLimit}
                    onChange={(e) => updateSetting('loginAttemptLimit', parseInt(e.target.value) || 5)}
                    className="flex-1 input-field text-sm"
                  />
                  <span className="text-sm text-white">次</span>
                </div>
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all">
              <Save size={18} />
              保存配置
            </button>
          </div>
        </div>
      )}

      {/* 系统状态 */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {/* 系统概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(mockSystemStatus).map(([key, service]) => (
              <div key={key} className={`stat-card p-5 ${service.status !== 'online' ? 'warning' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">{service.status === 'online' ? '运行中' : '异常'}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{service.name}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${service.status === 'online' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {key === 'server' && <Server size={24} className={service.status === 'online' ? 'text-emerald-400' : 'text-red-400'} />}
                    {key === 'database' && <HardDrive size={24} className={service.status === 'online' ? 'text-emerald-400' : 'text-red-400'} />}
                    {key === 'redis' && <Database size={24} className={service.status === 'online' ? 'text-emerald-400' : 'text-red-400'} />}
                    {key === 'network' && <Wifi size={24} className={service.status === 'online' ? 'text-emerald-400' : 'text-red-400'} />}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {service.cpu !== undefined && (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--text-muted)]">CPU</span>
                        <span className="text-white">{service.cpu}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${service.cpu}%` }} />
                      </div>
                    </div>
                  )}
                  {service.memory !== undefined && (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--text-muted)]">内存</span>
                        <span className="text-white">{service.memory}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${service.memory}%` }} />
                      </div>
                    </div>
                  )}
                  {service.connection !== undefined && (
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">连接数</span>
                      <p className="text-sm font-medium text-white">{service.connection}</p>
                    </div>
                  )}
                  {service.keys !== undefined && (
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">缓存键数</span>
                      <p className="text-sm font-medium text-white">{service.keys}</p>
                    </div>
                  )}
                  {service.latency !== undefined && (
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">延迟</span>
                      <p className="text-sm font-medium text-white">{service.latency}</p>
                    </div>
                  )}
                  {service.bandwidth !== undefined && (
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">带宽</span>
                      <p className="text-sm font-medium text-white">{service.bandwidth}</p>
                    </div>
                  )}
                  {service.uptime !== undefined && (
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">可用率</span>
                      <p className="text-sm font-medium text-emerald-400">{service.uptime}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 运行信息 */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-teal-500/20">
                <Clock size={22} className="text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">系统运行信息</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-xs text-[var(--text-muted)] mb-1">系统版本</p>
                <p className="text-sm font-medium text-white">v1.0.0</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-xs text-[var(--text-muted)] mb-1">运行时间</p>
                <p className="text-sm font-medium text-white">365天 12小时</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-xs text-[var(--text-muted)] mb-1">最后更新</p>
                <p className="text-sm font-medium text-white">2024-01-15 10:30:00</p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <p className="text-xs text-[var(--text-muted)] mb-1">当前用户</p>
                <p className="text-sm font-medium text-white">管理员</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 用户表单弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-card-dark p-6 w-full max-w-md mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{isEditing ? '编辑用户' : '新增用户'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">用户名</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`form-input ${formErrors.username ? 'error' : ''}`}
                  placeholder="请输入用户名"
                />
                {formErrors.username && <p className="form-error">{formErrors.username}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`form-input ${formErrors.name ? 'error' : ''}`}
                  placeholder="请输入姓名"
                />
                {formErrors.name && <p className="form-error">{formErrors.name}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="请输入邮箱"
                />
                {formErrors.email && <p className="form-error">{formErrors.email}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">角色</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`form-input ${formErrors.role ? 'error' : ''}`}
                >
                  <option value="">请选择角色</option>
                  {mockRoles.map((role) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
                {formErrors.role && <p className="form-error">{formErrors.role}</p>}
              </div>
              
              {!isEditing && (
                <>
                  <div className="form-group">
                    <label className="form-label">密码</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`form-input ${formErrors.password ? 'error' : ''}`}
                        placeholder="请输入密码"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formErrors.password && <p className="form-error">{formErrors.password}</p>}
                    <p className="form-hint">密码至少6个字符</p>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">确认密码</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                      placeholder="请确认密码"
                    />
                    {formErrors.confirmPassword && <p className="form-error">{formErrors.confirmPassword}</p>}
                  </div>
                </>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-2.5 bg-[var(--bg-card)] text-white rounded-xl font-medium hover:bg-[var(--bg-secondary)] transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all"
                >
                  {isEditing ? '保存修改' : '创建用户'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
