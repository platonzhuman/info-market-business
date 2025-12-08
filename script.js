/**
 * БИЗНЕС-ПАНЕЛЬ - ПОЛНАЯ ОПТИМИЗИРОВАННАЯ ВЕРСИЯ
 * Архитектура: Модульная, реактивная, с чистыми функциями
 */

// ==================== КОНФИГУРАЦИЯ И КОНСТАНТЫ ====================
const CONFIG = {
    STORAGE_KEYS: {
        USER: 'user',
        BUSINESS_DATA: 'business_data',
        BACKUP: 'business_backup'
    },
    PERMISSIONS: {
        // Управление персоналом
        STAFF_VIEW: 'staff_view',
        STAFF_ADD: 'staff_add',
        STAFF_EDIT: 'staff_edit',
        STAFF_DELETE: 'staff_delete',
        
        // Управление клиентами
        CLIENTS_VIEW: 'clients_view',
        CLIENTS_ADD: 'clients_add',
        CLIENTS_EDIT: 'clients_edit',
        CLIENTS_DELETE: 'clients_delete',
        
        // Отчеты
        REPORTS_VIEW: 'reports_view',
        REPORTS_EXPORT: 'reports_export',
        
        // Идеи
        IDEAS_VIEW: 'ideas_view',
        IDEAS_ADD: 'ideas_add',
        IDEAS_EDIT: 'ideas_edit',
        IDEAS_DELETE: 'ideas_delete',
        
        // Настройки
        SETTINGS_EDIT: 'settings_edit',
        DATA_EXPORT: 'data_export',
        DATA_IMPORT: 'data_import',
        
        // Отчеты сотрудников
        EMPLOYEE_REPORTS_VIEW: 'employee_reports_view',
        EMPLOYEE_REPORTS_ADD: 'employee_reports_add',
        EMPLOYEE_REPORTS_EDIT: 'employee_reports_edit',
        EMPLOYEE_REPORTS_DELETE: 'employee_reports_delete',
        EMPLOYEE_REPORTS_MANAGE_ALL: 'employee_reports_manage_all'
    },
    STATUSES: {
        PENDING: 'pending',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    },
    DAYS_OF_WEEK: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    CURRENCIES: {
        '₽': 'Рубль',
        '$': 'Доллар',
        '€': 'Евро',
        '¥': 'Юань'
    },
    PRIORITIES: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high'
    }
};

// ==================== СЕРВИС ХРАНЕНИЯ ====================
const StorageService = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Storage error reading ${key}:`, error);
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Storage error writing ${key}:`, error);
            return false;
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

// ==================== СЕРВИС УТИЛИТ ====================
const Utils = {
    generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    },
    
    formatCurrency(amount, currency = '₽') {
        if (amount === null || amount === undefined) return `0 ${currency}`;
        return `${parseFloat(amount).toLocaleString('ru-RU')} ${currency}`;
    },
    
    formatDate(dateString, includeTime = false) {
        if (!dateString) return 'Не указано';
        try {
            const date = new Date(dateString);
            if (includeTime) {
                return date.toLocaleString('ru-RU');
            }
            return date.toLocaleDateString('ru-RU');
        } catch {
            return 'Неверная дата';
        }
    },
    
    getWeekStart(date = new Date()) {
        const day = date.getDay();
        const diff = date.getDate() - (day === 0 ? 6 : day - 1);
        const weekStart = new Date(date);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    },
    
    getInitials(name) {
        return name.split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2) || '??';
    },
    
    getAvatarColor(name) {
        const colors = ['#1a237e', '#534bae', '#00b0ff', '#00c853', '#ff9100', '#f44336', '#9c27b0'];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePhone(phone) {
        const re = /^[\+]?[78][\-\(]?\d{3}\)?[\-]?\d{3}[\-]?\d{2}[\-]?\d{2}$/;
        return re.test(phone);
    },
    
    isToday(date) {
        const today = new Date();
        return new Date(date).toDateString() === today.toDateString();
    },
    
    isThisWeek(date) {
        const weekStart = this.getWeekStart();
        const dateObj = new Date(date);
        return dateObj >= weekStart && dateObj <= new Date();
    }
};

// ==================== СЕРВИС ТЕКСТА ====================
const TextService = {
    getRoleName(role) {
        const roles = {
            'owner': 'Владелец',
            'admin': 'Администратор',
            'manager': 'Менеджер',
            'employee': 'Сотрудник'
        };
        return roles[role] || role;
    },
    
    getPermissionName(permission) {
        const names = {
            [CONFIG.PERMISSIONS.STAFF_VIEW]: 'Просмотр персонала',
            [CONFIG.PERMISSIONS.STAFF_ADD]: 'Добавление персонала',
            [CONFIG.PERMISSIONS.STAFF_EDIT]: 'Редактирование персонала',
            [CONFIG.PERMISSIONS.STAFF_DELETE]: 'Удаление персонала',
            [CONFIG.PERMISSIONS.CLIENTS_VIEW]: 'Просмотр клиентов',
            [CONFIG.PERMISSIONS.CLIENTS_ADD]: 'Добавление клиентов',
            [CONFIG.PERMISSIONS.CLIENTS_EDIT]: 'Редактирование клиентов',
            [CONFIG.PERMISSIONS.CLIENTS_DELETE]: 'Удаление клиентов',
            [CONFIG.PERMISSIONS.REPORTS_VIEW]: 'Просмотр отчетов',
            [CONFIG.PERMISSIONS.REPORTS_EXPORT]: 'Экспорт отчетов',
            [CONFIG.PERMISSIONS.IDEAS_VIEW]: 'Просмотр идей',
            [CONFIG.PERMISSIONS.IDEAS_ADD]: 'Добавление идей',
            [CONFIG.PERMISSIONS.IDEAS_EDIT]: 'Редактирование идей',
            [CONFIG.PERMISSIONS.IDEAS_DELETE]: 'Удаление идей',
            [CONFIG.PERMISSIONS.SETTINGS_EDIT]: 'Редактирование настроек',
            [CONFIG.PERMISSIONS.DATA_EXPORT]: 'Экспорт данных',
            [CONFIG.PERMISSIONS.DATA_IMPORT]: 'Импорт данных',
            [CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_VIEW]: 'Просмотр отчетов сотрудников',
            [CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_ADD]: 'Добавление отчетов',
            [CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_EDIT]: 'Редактирование отчетов',
            [CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_DELETE]: 'Удаление отчетов',
            [CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_MANAGE_ALL]: 'Управление всеми отчетами'
        };
        return names[permission] || permission;
    },
    
    getStatusName(status) {
        const names = {
            [CONFIG.STATUSES.PENDING]: 'Ожидание',
            [CONFIG.STATUSES.IN_PROGRESS]: 'В работе',
            [CONFIG.STATUSES.COMPLETED]: 'Выполнено',
            [CONFIG.STATUSES.CANCELLED]: 'Отменено',
            'new': 'Новая',
            'in_progress': 'В работе',
            'completed': 'Завершена',
            'cancelled': 'Отменена',
            'draft': 'Черновик',
            'submitted': 'Отправлен',
            'approved': 'Утвержден',
            'rejected': 'Отклонен',
            'active': 'Активен',
            'inactive': 'Неактивен',
            'blocked': 'Заблокирован'
        };
        return names[status] || status;
    },
    
    getStatusClass(status) {
        const classes = {
            [CONFIG.STATUSES.PENDING]: 'status-warning',
            [CONFIG.STATUSES.IN_PROGRESS]: 'status-info',
            [CONFIG.STATUSES.COMPLETED]: 'status-success',
            [CONFIG.STATUSES.CANCELLED]: 'status-error',
            'new': 'status-info',
            'in_progress': 'status-warning',
            'completed': 'status-success',
            'cancelled': 'status-error',
            'draft': 'status-info',
            'submitted': 'status-warning',
            'approved': 'status-success',
            'rejected': 'status-error',
            'active': 'status-success',
            'inactive': 'status-error',
            'blocked': 'status-error'
        };
        return classes[status] || 'status-info';
    },
    
    getPriorityName(priority) {
        const names = {
            [CONFIG.PRIORITIES.LOW]: 'Низкий',
            [CONFIG.PRIORITIES.MEDIUM]: 'Средний',
            [CONFIG.PRIORITIES.HIGH]: 'Высокий'
        };
        return names[priority] || priority;
    },
    
    getPriorityClass(priority) {
        const classes = {
            [CONFIG.PRIORITIES.LOW]: 'status-info',
            [CONFIG.PRIORITIES.MEDIUM]: 'status-warning',
            [CONFIG.PRIORITIES.HIGH]: 'status-error'
        };
        return classes[priority] || 'status-info';
    }
};

// ==================== СЕРВИС УВЕДОМЛЕНИЙ ====================
const NotificationService = {
    show(message, type = 'info') {
        // Удаляем старые уведомления
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 3000;
            animation: slideIn 0.3s;
            max-width: 400px;
            color: white;
            font-weight: 500;
            font-size: 14px;
        `;
        
        const colors = {
            success: 'var(--success)',
            error: 'var(--error)',
            warning: 'var(--warning)',
            info: 'var(--accent)'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => this.hide(notification), 3000);
        
        return notification;
    },
    
    hide(notification) {
        if (notification && notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
};

// ==================== СЕРВИС МОДАЛЬНЫХ ОКОН ====================
const ModalService = {
    currentModal: null,
    
    show(html) {
        this.close();
        
        document.body.insertAdjacentHTML('beforeend', html);
        this.currentModal = document.querySelector('.modal:last-child');
        
        const closeBtn = this.currentModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        this.currentModal.addEventListener('click', (e) => {
            if (e.target === this.currentModal) {
                this.close();
            }
        });
        
        const escapeHandler = (e) => {
            if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', escapeHandler);
        this.currentModal._escapeHandler = escapeHandler;
        
        setTimeout(() => {
            if (this.currentModal) {
                this.currentModal.style.display = 'flex';
            }
        }, 10);
    },
    
    close() {
        if (this.currentModal) {
            if (this.currentModal._escapeHandler) {
                document.removeEventListener('keydown', this.currentModal._escapeHandler);
            }
            this.currentModal.remove();
            this.currentModal = null;
        }
    }
};

// ==================== СЕРВИС АВТОРИЗАЦИИ ====================
const AuthService = {
    currentUser: null,
    
    check() {
        const userData = StorageService.get(CONFIG.STORAGE_KEYS.USER);
        if (!userData) {
            window.location.href = 'index.html';
            return false;
        }
        
        this.currentUser = userData;
        this.updateUI();
        return true;
    },
    
    updateUI() {
        if (!this.currentUser) return;
        
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName) userName.textContent = this.currentUser.name;
        if (userRole) userRole.textContent = TextService.getRoleName(this.currentUser.role);
        if (userAvatar) {
            userAvatar.textContent = Utils.getInitials(this.currentUser.name);
            userAvatar.style.background = Utils.getAvatarColor(this.currentUser.name);
        }
    },
    
    logout() {
        StorageService.remove(CONFIG.STORAGE_KEYS.USER);
        window.location.href = 'index.html';
    },
    
    hasPermission(permission) {
        return this.currentUser?.role === 'owner' || 
               this.currentUser?.permissions?.includes(permission);
    },
    
    canEditStaff(staffId) {
        return this.currentUser?.role === 'owner' || 
               (this.hasPermission(CONFIG.PERMISSIONS.STAFF_EDIT) && staffId !== this.currentUser?.id);
    },
    
    canDeleteStaff(staffId) {
        return this.currentUser?.role === 'owner' && staffId !== this.currentUser?.id;
    },
    
    canManageAllReports() {
        return this.currentUser?.role === 'owner' || 
               this.hasPermission(CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_MANAGE_ALL);
    }
};

// ==================== СЕРВИС ДАННЫХ БИЗНЕСА ====================
const BusinessDataService = {
    data: {
        staff: [],
        clients: [],
        ideas: [],
        reports: [],
        employeeReports: {},
        finances: {
            income: 0,
            expenses: 0,
            transactions: []
        },
        settings: {
            companyName: 'Моя компания',
            currency: '₽',
            taxRate: 13
        }
    },
    
    init() {
        const savedData = StorageService.get(CONFIG.STORAGE_KEYS.BUSINESS_DATA);
        if (savedData) {
            this.data = this.mergeWithDefaults(savedData);
        } else {
            this.loadDemoData();
            this.save();
        }
        
        if (!this.data.employeeReports) {
            this.data.employeeReports = {};
        }
        
        return this.data;
    },
    
    mergeWithDefaults(savedData) {
        const result = JSON.parse(JSON.stringify(this.data));
        
        for (const key in savedData) {
            if (savedData.hasOwnProperty(key)) {
                if (typeof savedData[key] === 'object' && !Array.isArray(savedData[key])) {
                    result[key] = { ...result[key], ...savedData[key] };
                } else {
                    result[key] = savedData[key];
                }
            }
        }
        
        return result;
    },
    
    loadDemoData() {
        this.data = {
            staff: [
                {
                    id: 1,
                    username: 'platon',
                    password: '505',
                    name: 'Платон (Владелец)',
                    role: 'owner',
                    permissions: Object.values(CONFIG.PERMISSIONS),
                    active: true,
                    createdAt: '2024-01-01',
                    salary: 0,
                    department: 'Управление'
                },
                {
                    id: 2,
                    username: 'manager',
                    password: 'manager123',
                    name: 'Иван Петров',
                    role: 'manager',
                    permissions: [
                        CONFIG.PERMISSIONS.STAFF_VIEW,
                        CONFIG.PERMISSIONS.CLIENTS_VIEW,
                        CONFIG.PERMISSIONS.CLIENTS_ADD,
                        CONFIG.PERMISSIONS.CLIENTS_EDIT,
                        CONFIG.PERMISSIONS.REPORTS_VIEW,
                        CONFIG.PERMISSIONS.IDEAS_VIEW,
                        CONFIG.PERMISSIONS.IDEAS_ADD,
                        CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_VIEW,
                        CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_ADD,
                        CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_EDIT,
                        CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_MANAGE_ALL
                    ],
                    active: true,
                    createdAt: '2024-01-15',
                    salary: 80000,
                    department: 'Продажи'
                }
            ],
            clients: [
                {
                    id: 1,
                    name: 'ООО "Технологии"',
                    contact: '+7 (999) 123-45-67',
                    email: 'info@tech.ru',
                    address: 'Москва, ул. Ленина, 1',
                    status: 'active',
                    createdAt: '2024-01-20',
                    orders: [
                        {
                            id: 1,
                            description: 'Разработка корпоративного сайта',
                            amount: 50000,
                            status: CONFIG.STATUSES.COMPLETED,
                            date: '2024-03-10',
                            assignedTo: 1
                        }
                    ],
                    totalSpent: 50000
                }
            ],
            ideas: [
                {
                    id: 1,
                    title: 'Внедрение CRM системы',
                    description: 'Автоматизация работы с клиентами и ведения сделок',
                    category: 'Автоматизация',
                    priority: CONFIG.PRIORITIES.HIGH,
                    status: 'in_progress',
                    createdAt: '2024-03-01',
                    createdBy: 1,
                    budget: 200000,
                    deadline: '2024-06-01'
                }
            ],
            reports: [],
            employeeReports: {},
            finances: {
                income: 50000,
                expenses: 35000,
                transactions: [
                    {
                        id: 1,
                        type: 'income',
                        amount: 50000,
                        description: 'Оплата от ООО "Технологии"',
                        date: '2024-03-10',
                        category: 'разработка'
                    }
                ]
            },
            settings: {
                companyName: 'ТехноСофт',
                currency: '₽',
                taxRate: 13
            }
        };
        
        this.addDemoReports();
    },
    
    addDemoReports() {
        const today = new Date();
        const weekStart = Utils.getWeekStart(today);
        
        this.data.staff.forEach(staff => {
            if (!this.data.employeeReports[staff.id]) {
                this.data.employeeReports[staff.id] = [];
                
                for (let i = 0; i < 3; i++) {
                    const reportDate = new Date(weekStart);
                    reportDate.setDate(weekStart.getDate() + i);
                    
                    this.data.employeeReports[staff.id].push({
                        id: Utils.generateId(),
                        staffId: staff.id,
                        date: reportDate.toISOString().split('T')[0],
                        dayOfWeek: CONFIG.DAYS_OF_WEEK[reportDate.getDay() === 0 ? 6 : reportDate.getDay() - 1],
                        tasks: `Работа над проектом ${i + 1}, встречи, код-ревью`,
                        hours: 8 + (i * 0.5),
                        status: i === 2 ? 'submitted' : 'approved',
                        notes: staff.role === 'owner' ? 'Все по плану' : 'Небольшие задержки',
                        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
                        createdBy: staff.id,
                        updatedAt: new Date().toISOString()
                    });
                }
            }
        });
    },
    
    save() {
        return StorageService.set(CONFIG.STORAGE_KEYS.BUSINESS_DATA, this.data);
    },
    
    // Staff methods
    getStaffById(id) {
        return this.data.staff.find(s => s.id === id);
    },
    
    addStaff(staff) {
        staff.id = Utils.generateId();
        staff.createdAt = new Date().toISOString().split('T')[0];
        this.data.staff.push(staff);
        this.save();
        return staff;
    },
    
    updateStaff(id, updates) {
        const index = this.data.staff.findIndex(s => s.id === id);
        if (index !== -1) {
            this.data.staff[index] = { ...this.data.staff[index], ...updates };
            this.save();
            return true;
        }
        return false;
    },
    
    deleteStaff(id) {
        const initialLength = this.data.staff.length;
        this.data.staff = this.data.staff.filter(s => s.id !== id);
        const changed = initialLength !== this.data.staff.length;
        if (changed) this.save();
        return changed;
    },
    
    // Client methods
    getClientById(id) {
        return this.data.clients.find(c => c.id === id);
    },
    
    addClient(client) {
        client.id = Utils.generateId();
        client.createdAt = new Date().toISOString().split('T')[0];
        this.data.clients.push(client);
        this.save();
        return client;
    },
    
    updateClient(id, updates) {
        const index = this.data.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data.clients[index] = { ...this.data.clients[index], ...updates };
            this.save();
            return true;
        }
        return false;
    },
    
    deleteClient(id) {
        const initialLength = this.data.clients.length;
        this.data.clients = this.data.clients.filter(c => c.id !== id);
        const changed = initialLength !== this.data.clients.length;
        if (changed) this.save();
        return changed;
    },
    
    // Idea methods
    getIdeaById(id) {
        return this.data.ideas.find(i => i.id === id);
    },
    
    addIdea(idea) {
        idea.id = Utils.generateId();
        idea.createdAt = new Date().toISOString().split('T')[0];
        this.data.ideas.push(idea);
        this.save();
        return idea;
    },
    
    updateIdea(id, updates) {
        const index = this.data.ideas.findIndex(i => i.id === id);
        if (index !== -1) {
            this.data.ideas[index] = { ...this.data.ideas[index], ...updates };
            this.save();
            return true;
        }
        return false;
    },
    
    deleteIdea(id) {
        const initialLength = this.data.ideas.length;
        this.data.ideas = this.data.ideas.filter(i => i.id !== id);
        const changed = initialLength !== this.data.ideas.length;
        if (changed) this.save();
        return changed;
    },
    
    // Employee Reports methods
    addEmployeeReport(staffId, report) {
        if (!this.data.employeeReports[staffId]) {
            this.data.employeeReports[staffId] = [];
        }
        
        report.id = Utils.generateId();
        report.createdAt = new Date().toISOString();
        report.updatedAt = new Date().toISOString();
        this.data.employeeReports[staffId].push(report);
        this.save();
        return report;
    },
    
    updateEmployeeReport(staffId, reportId, updates) {
        if (!this.data.employeeReports[staffId]) return false;
        
        const index = this.data.employeeReports[staffId].findIndex(r => r.id === reportId);
        if (index !== -1) {
            this.data.employeeReports[staffId][index] = { 
                ...this.data.employeeReports[staffId][index], 
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.save();
            return true;
        }
        return false;
    },
    
    deleteEmployeeReport(staffId, reportId) {
        if (!this.data.employeeReports[staffId]) return false;
        
        const initialLength = this.data.employeeReports[staffId].length;
        this.data.employeeReports[staffId] = this.data.employeeReports[staffId]
            .filter(r => r.id !== reportId);
        
        const changed = initialLength !== this.data.employeeReports[staffId].length;
        if (changed) this.save();
        return changed;
    },
    
    // Finance methods
    addTransaction(transaction) {
        if (!this.data.finances.transactions) {
            this.data.finances.transactions = [];
        }
        
        transaction.id = Utils.generateId();
        this.data.finances.transactions.push(transaction);
        
        if (transaction.type === 'income') {
            this.data.finances.income += transaction.amount;
        } else if (transaction.type === 'expense') {
            this.data.finances.expenses += transaction.amount;
        }
        
        this.save();
        return transaction;
    }
};

// ==================== СЕРВИС ИНТЕРФЕЙСА ====================
const UIService = {
    init() {
        this.setupMobileMenu();
        this.setupMenuNavigation();
        this.setupLogout();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000);
        this.addReportsMenuItem();
    },
    
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const sidebar = document.querySelector('.sidebar');
        
        if (!hamburger || !sidebar) return;
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
        });
        
        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 1024) {
                const isClickInside = sidebar.contains(event.target) || 
                                     hamburger.contains(event.target);
                
                if (!isClickInside && sidebar.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    sidebar.classList.remove('active');
                }
            }
        });
    },
    
    setupMenuNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                SectionLoader.load(section);
                
                if (window.innerWidth <= 1024) {
                    const hamburger = document.querySelector('.hamburger');
                    const sidebar = document.querySelector('.sidebar');
                    if (hamburger) hamburger.classList.remove('active');
                    if (sidebar) sidebar.classList.remove('active');
                }
            });
        });
    },
    
    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => AuthService.logout());
        }
    },
    
    updateDateTime() {
        const dateElement = document.getElementById('currentDateTime');
        if (!dateElement) return;
        
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const dateStr = now.toLocaleDateString('ru-RU', options);
        dateElement.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    },
    
    addReportsMenuItem() {
        const menuSection = document.querySelector('.menu-section:nth-child(2)');
        if (!menuSection || document.querySelector('[data-section="employee-reports"]')) return;
        
        const reportButton = document.createElement('button');
        reportButton.className = 'menu-item';
        reportButton.setAttribute('data-section', 'employee-reports');
        reportButton.innerHTML = `
            <i class="fas fa-clipboard-check"></i>
            <span>Отчеты сотрудников</span>
        `;
        
        reportButton.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            document.querySelectorAll('.menu-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            
            SectionLoader.load(section);
            
            if (window.innerWidth <= 1024) {
                const hamburger = document.querySelector('.hamburger');
                const sidebar = document.querySelector('.sidebar');
                if (hamburger) hamburger.classList.remove('active');
                if (sidebar) sidebar.classList.remove('active');
            }
        });
        
        menuSection.appendChild(reportButton);
    },
    
    createCard(header, content, className = '') {
        return `
            <div class="card ${className}">
                ${header}
                <div class="card-body">
                    ${content}
                </div>
            </div>
        `;
    },
    
    createTable(headers, rows, emptyMessage = 'Нет данных') {
        if (!rows || rows.length === 0) {
            return `<div class="empty-state">${emptyMessage}</div>`;
        }
        
        return `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    createInfoList(items) {
        return `
            <div class="info-list">
                ${items.map(item => `
                    <div class="info-item">
                        <span class="info-label">${item.label}</span>
                        <span class="info-value ${item.valueClass || ''}">${item.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

// ==================== ЗАГРУЗЧИК РАЗДЕЛОВ ====================
const SectionLoader = {
    currentSection: 'main',
    
    load(section) {
        this.currentSection = section;
        
        if (!this.checkPermission(section)) {
            NotificationService.show('У вас нет доступа к этому разделу', 'error');
            return;
        }
        
        const content = document.getElementById('content');
        if (!content) return;
        
        switch(section) {
            case 'main':
                this.loadMain();
                break;
            case 'staff':
                this.loadStaff();
                break;
            case 'clients':
                this.loadClients();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'ideas':
                this.loadIdeas();
                break;
            case 'functionality':
                this.loadFunctionality();
                break;
            case 'employee-reports':
                this.loadEmployeeReports();
                break;
            default:
                this.loadMain();
        }
    },
    
    checkPermission(section) {
        const sectionPermissions = {
            'staff': CONFIG.PERMISSIONS.STAFF_VIEW,
            'clients': CONFIG.PERMISSIONS.CLIENTS_VIEW,
            'reports': CONFIG.PERMISSIONS.REPORTS_VIEW,
            'ideas': CONFIG.PERMISSIONS.IDEAS_VIEW,
            'functionality': CONFIG.PERMISSIONS.SETTINGS_EDIT,
            'employee-reports': CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_VIEW
        };
        
        const required = sectionPermissions[section];
        if (!required) return true;
        
        return AuthService.hasPermission(required);
    },
    
    loadMain() {
        const data = BusinessDataService.data;
        const staffCount = data.staff.length;
        const clientCount = data.clients.length;
        const activeOrders = data.clients.reduce((acc, client) => 
            acc + (client.orders?.filter(o => o.status === CONFIG.STATUSES.IN_PROGRESS).length || 0), 0);
        const activeIdeas = data.ideas.filter(i => i.status === 'in_progress').length;
        
        const content = `
            <div class="content-header">
                <h1>Основная информация</h1>
                ${AuthService.currentUser?.role === 'owner' ? `
                    <button class="btn btn-outline" onclick="App.showCompanySettingsModal()">
                        <i class="fas fa-cog"></i> Настройки компании
                    </button>
                ` : ''}
            </div>
            
            <div class="grid">
                ${UIService.createCard(
                    '<div class="card-header"><h2><i class="fas fa-building"></i> Компания</h2></div>',
                    UIService.createInfoList([
                        { label: 'Название:', value: data.settings.companyName },
                        { label: 'Валюта:', value: data.settings.currency },
                        { label: 'Налоговая ставка:', value: `${data.settings.taxRate}%` }
                    ])
                )}
                
                ${UIService.createCard(
                    '<div class="card-header"><h2><i class="fas fa-chart-line"></i> Финансы</h2></div>',
                    UIService.createInfoList([
                        { 
                            label: 'Доходы:', 
                            value: Utils.formatCurrency(data.finances.income, data.settings.currency),
                            valueClass: 'success'
                        },
                        { 
                            label: 'Расходы:', 
                            value: Utils.formatCurrency(data.finances.expenses, data.settings.currency),
                            valueClass: 'error'
                        },
                        { 
                            label: 'Прибыль:', 
                            value: Utils.formatCurrency(data.finances.income - data.finances.expenses, data.settings.currency),
                            valueClass: data.finances.income - data.finances.expenses >= 0 ? 'success' : 'error'
                        }
                    ])
                )}
                
                ${UIService.createCard(
                    '<div class="card-header"><h2><i class="fas fa-chart-bar"></i> Статистика</h2></div>',
                    UIService.createInfoList([
                        { label: 'Сотрудники:', value: staffCount },
                        { label: 'Клиенты:', value: clientCount },
                        { label: 'Активные заказы:', value: activeOrders },
                        { label: 'Активные идеи:', value: activeIdeas }
                    ])
                )}
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    },
    
    loadStaff() {
        const canAdd = AuthService.currentUser?.role === 'owner' || 
                      AuthService.hasPermission(CONFIG.PERMISSIONS.STAFF_ADD);
        
        const content = `
            <div class="content-header">
                <h1>Управление персоналом</h1>
                <div>
                    <button class="btn btn-outline" onclick="App.exportStaffList()" title="Экспорт списка">
                        <i class="fas fa-download"></i> Экспорт
                    </button>
                    ${canAdd ? `
                        <button class="btn btn-primary" onclick="App.showStaffModal()">
                            <i class="fas fa-user-plus"></i> Добавить сотрудника
                        </button>
                    ` : ''}
                </div>
            </div>
            
            ${UIService.createCard(
                '<div class="card-header"><h2>Список сотрудников</h2></div>',
                this.renderStaffTable()
            )}
        `;
        
        document.getElementById('content').innerHTML = content;
    },
    
    renderStaffTable() {
        const rows = BusinessDataService.data.staff.map(staff => {
            const canEdit = AuthService.canEditStaff(staff.id);
            const canDelete = AuthService.canDeleteStaff(staff.id);
            const canToggleActive = AuthService.currentUser?.role === 'owner' && 
                                   staff.role !== 'owner' && 
                                   staff.id !== AuthService.currentUser.id;
            
            return `
                <tr class="${staff.role === 'owner' ? 'owner-row' : ''}">
                    <td>
                        <span class="badge">#${staff.id}</span>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="staff-avatar" style="background: ${Utils.getAvatarColor(staff.name)}">
                                ${Utils.getInitials(staff.name)}
                            </div>
                            <div>
                                <strong>${staff.name}</strong><br>
                                <small style="color: var(--text-light);">${staff.username}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="role-badge role-${staff.role}">
                            ${TextService.getRoleName(staff.role)}
                        </span>
                    </td>
                    <td>${staff.department || '—'}</td>
                    <td>${Utils.formatCurrency(staff.salary || 0, BusinessDataService.data.settings.currency)}</td>
                    <td>
                        <span class="permission-count">
                            ${staff.permissions?.length || 0}
                            ${staff.permissions?.includes('all') ? ' (все)' : ''}
                        </span>
                    </td>
                    <td>
                        <span class="status ${staff.active ? 'status-success' : 'status-error'}">
                            <i class="fas fa-circle" style="font-size: 8px; margin-right: 4px;"></i>
                            ${staff.active ? 'Активен' : 'Неактивен'}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            ${canEdit ? `
                                <button class="btn btn-outline btn-sm" onclick="App.showStaffModal(${staff.id})" title="Редактировать">
                                    <i class="fas fa-edit"></i>
                                </button>
                            ` : ''}
                            
                            ${canToggleActive ? `
                                <button class="btn btn-outline btn-sm" onclick="App.toggleStaffActive(${staff.id})" 
                                        title="${staff.active ? 'Деактивировать' : 'Активировать'}">
                                    <i class="fas fa-${staff.active ? 'user-slash' : 'user-check'}"></i>
                                </button>
                            ` : ''}
                            
                            ${canDelete ? `
                                <button class="btn btn-outline btn-sm" onclick="App.deleteStaff(${staff.id})" title="Удалить">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        });
        
        return UIService.createTable(
            ['ID', 'ФИО', 'Должность', 'Отдел', 'Оклад', 'Разрешений', 'Статус', 'Действия'],
            rows,
            'Нет сотрудников'
        );
    },
    
    loadClients() {
        const canAdd = AuthService.currentUser?.role === 'owner' || 
                      AuthService.hasPermission(CONFIG.PERMISSIONS.CLIENTS_ADD);
        
        const content = `
            <div class="content-header">
                <h1>Управление клиентами</h1>
                ${canAdd ? `
                    <button class="btn btn-primary" onclick="App.showClientModal()">
                        <i class="fas fa-plus"></i> Добавить клиента
                    </button>
                ` : ''}
            </div>
            
            ${UIService.createCard(
                '<div class="card-header"><h2>Список клиентов</h2></div>',
                this.renderClientsTable()
            )}
        `;
        
        document.getElementById('content').innerHTML = content;
    },
    
    renderClientsTable() {
        const rows = BusinessDataService.data.clients.map(client => {
            const totalOrders = client.orders?.length || 0;
            const completedOrders = client.orders?.filter(o => o.status === CONFIG.STATUSES.COMPLETED).length || 0;
            
            return `
                <tr>
                    <td>${client.id}</td>
                    <td>
                        <strong>${client.name}</strong><br>
                        <small style="color: var(--text-light);">${client.email || 'Нет email'}</small>
                    </td>
                    <td>
                        <div>${client.contact}</div>
                        <small style="color: var(--text-light);">${client.address || 'Нет адреса'}</small>
                    </td>
                    <td>${totalOrders} (${completedOrders} заверш.)</td>
                    <td>${Utils.formatCurrency(client.totalSpent || 0, BusinessDataService.data.settings.currency)}</td>
                    <td>
                        <span class="status ${client.status === 'active' ? 'status-success' : 'status-error'}">
                            ${TextService.getStatusName(client.status)}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-outline btn-sm" onclick="App.showClientModal(${client.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline btn-sm" onclick="App.showClientOrders(${client.id})">
                                <i class="fas fa-list"></i>
                            </button>
                            <button class="btn btn-outline btn-sm" onclick="App.deleteClient(${client.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        return UIService.createTable(
            ['ID', 'Клиент', 'Контакты', 'Заказов', 'Потрачено', 'Статус', 'Действия'],
            rows,
            'Нет клиентов'
        );
    },
    
    loadReports() {
        const content = `
            <div class="content-header">
                <h1>Отчеты и аналитика</h1>
                <div>
                    <button class="btn btn-primary" onclick="App.generateFinancialReport()">
                        <i class="fas fa-chart-bar"></i> Финансовый отчет
                    </button>
                    <button class="btn btn-outline" onclick="App.exportReports()">
                        <i class="fas fa-download"></i> Экспорт
                    </button>
                </div>
            </div>
            
            <div class="grid">
                ${UIService.createCard(
                    '<div class="card-header"><h2><i class="fas fa-users"></i> Отчеты по сотрудникам</h2></div>',
                    this.renderStaffReportsSummary()
                )}
                
                ${UIService.createCard(
                    '<div class="card-header"><h2><i class="fas fa-money-bill-wave"></i> Финансовая сводка</h2></div>',
                    this.renderFinancialSummary()
                )}
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    },
    
    renderStaffReportsSummary() {
        const summary = BusinessDataService.data.staff.map(staff => {
            const assignedOrders = BusinessDataService.data.clients.reduce((acc, client) => {
                const orders = client.orders?.filter(o => o.assignedTo === staff.id) || [];
                return acc + orders.length;
            }, 0);
            
            return `
                <div style="margin-bottom: 12px; padding: 12px; background: var(--bg); border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>${staff.name}</strong>
                        <span style="color: var(--text-light);">${TextService.getRoleName(staff.role)}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 13px;">
                        <div>
                            <div style="color: var(--text-light);">Заказов</div>
                            <div>${assignedOrders}</div>
                        </div>
                        <div>
                            <div style="color: var(--text-light);">Выполнено</div>
                            <div>${assignedOrders}</div>
                        </div>
                        <div>
                            <div style="color: var(--text-light);">Оклад</div>
                            <div>${Utils.formatCurrency(staff.salary || 0, BusinessDataService.data.settings.currency)}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        return summary || '<div class="empty-state">Нет данных</div>';
    },
    
    renderFinancialSummary() {
        const data = BusinessDataService.data;
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        
        const monthlyIncome = data.finances.transactions
            .filter(t => t.type === 'income' && 
                    new Date(t.date).getMonth() === thisMonth &&
                    new Date(t.date).getFullYear() === thisYear)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpenses = data.finances.transactions
            .filter(t => t.type === 'expense' && 
                    new Date(t.date).getMonth() === thisMonth &&
                    new Date(t.date).getFullYear() === thisYear)
            .reduce((sum, t) => sum + t.amount, 0);
        
        return `
            <div style="text-align: center;">
                <div style="font-size: 32px; font-weight: 300; color: var(--primary); margin-bottom: 8px;">
                    ${Utils.formatCurrency(monthlyIncome, data.settings.currency)}
                </div>
                <div style="color: var(--text-light); margin-bottom: 24px;">Доходы за текущий месяц</div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                    <div style="padding: 12px; background: rgba(0, 200, 83, 0.1); border-radius: 8px;">
                        <div style="font-size: 12px; color: var(--success);">Прибыль</div>
                        <div style="font-size: 18px; font-weight: 500;">
                            ${Utils.formatCurrency(monthlyIncome - monthlyExpenses, data.settings.currency)}
                        </div>
                    </div>
                    <div style="padding: 12px; background: rgba(244, 67, 54, 0.1); border-radius: 8px;">
                        <div style="font-size: 12px; color: var(--error);">Расходы</div>
                        <div style="font-size: 18px; font-weight: 500;">
                            ${Utils.formatCurrency(monthlyExpenses, data.settings.currency)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    loadIdeas() {
        const canAdd = AuthService.currentUser?.role === 'owner' || 
                      AuthService.hasPermission(CONFIG.PERMISSIONS.IDEAS_ADD);
        
        const content = `
            <div class="content-header">
                <h1>Управление идеями</h1>
                ${canAdd ? `
                    <button class="btn btn-primary" onclick="App.showIdeaModal()">
                        <i class="fas fa-lightbulb"></i> Добавить идею
                    </button>
                ` : ''}
            </div>
            
            <div class="grid">
                ${this.renderIdeasGrid()}
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    },
    
    renderIdeasGrid() {
        return BusinessDataService.data.ideas.map(idea => {
            const canEdit = AuthService.currentUser?.role === 'owner' || 
                           AuthService.hasPermission(CONFIG.PERMISSIONS.IDEAS_EDIT);
            const canDelete = AuthService.currentUser?.role === 'owner' || 
                             AuthService.hasPermission(CONFIG.PERMISSIONS.IDEAS_DELETE);
            
            return UIService.createCard(
                `
                    <div class="card-header">
                        <h2>${idea.title}</h2>
                        <span class="status ${TextService.getPriorityClass(idea.priority)}">
                            ${TextService.getPriorityName(idea.priority)}
                        </span>
                    </div>
                `,
                `
                    <p style="margin-bottom: 16px; line-height: 1.5;">${idea.description}</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
                        <div>
                            <div style="color: var(--text-light);">Категория</div>
                            <div style="font-weight: 500;">${idea.category || 'Общая'}</div>
                        </div>
                        <div>
                            <div style="color: var(--text-light);">Бюджет</div>
                            <div style="font-weight: 500;">${idea.budget ? Utils.formatCurrency(idea.budget, BusinessDataService.data.settings.currency) : 'Не указан'}</div>
                        </div>
                        <div>
                            <div style="color: var(--text-light);">Статус</div>
                            <div style="font-weight: 500;">${TextService.getStatusName(idea.status)}</div>
                        </div>
                        <div>
                            <div style="color: var(--text-light);">Дедлайн</div>
                            <div style="font-weight: 500;">${idea.deadline ? Utils.formatDate(idea.deadline) : 'Не установлен'}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="color: var(--text-light); font-size: 13px;">
                            Создано: ${Utils.formatDate(idea.createdAt)}
                        </div>
                        <div class="action-buttons">
                            ${canEdit ? `
                                <button class="btn btn-outline btn-sm" onclick="App.showIdeaModal(${idea.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                            ` : ''}
                            ${canDelete ? `
                                <button class="btn btn-outline btn-sm" onclick="App.deleteIdea(${idea.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `
            );
        }).join('') || '<div class="empty-state">Нет идей</div>';
    },
    
    loadFunctionality() {
        if (AuthService.currentUser?.role !== 'owner') {
            document.getElementById('content').innerHTML = `
                <div class="content-header">
                    <h1>Функционал системы</h1>
                </div>
                <div class="card">
                    <div style="text-align: center; padding: 60px;">
                        <div style="font-size: 48px; color: var(--text-light); margin-bottom: 20px;">🔒</div>
                        <h3 style="color: var(--text-light); margin-bottom: 10px;">Доступ запрещен</h3>
                        <p style="color: var(--text-light);">
                            Этот раздел доступен только владельцу системы
                        </p>
                    </div>
                </div>
            `;
            return;
        }
        
        const content = `
            <div class="content-header">
                <h1>Функционал системы</h1>
            </div>
            
            <div class="grid">
                ${UIService.createCard(
                    '<div class="card-header"><h2><i class="fas fa-save"></i> Резервное копирование</h2></div>',
                    `
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button class="btn btn-primary" onclick="App.exportAllData()">
                                <i class="fas fa-download"></i> Экспорт всех данных
                            </button>
                            <button class="btn btn-outline" onclick="App.showImportModal()">
                                <i class="fas fa-upload"></i> Импорт данных
                            </button>
                            <button class="btn btn-outline" onclick="App.createBackup()">
                                <i class="fas fa-save"></i> Создать резервную копию
                            </button>
                        </div>
                    `
                )}
                
                ${UIService.createCard(
                    '<div class="card-header"><h2><i class="fas fa-cogs"></i> Настройки системы</h2></div>',
                    `
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button class="btn btn-outline" onclick="App.showCompanySettingsModal()">
                                <i class="fas fa-building"></i> Настройки компании
                            </button>
                            <button class="btn btn-outline" onclick="App.clearAllData()">
                                <i class="fas fa-trash"></i> Очистить все данные
                            </button>
                            <button class="btn btn-outline" onclick="App.resetDemoData()">
                                <i class="fas fa-redo"></i> Сбросить на демо-данные
                            </button>
                        </div>
                    `
                )}
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    },
    
    loadEmployeeReports() {
        const isOwner = AuthService.currentUser?.role === 'owner';
        const canManageAll = AuthService.canManageAllReports();
        const canAddReports = isOwner || AuthService.hasPermission(CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_ADD);
        
        const targetStaffIds = canManageAll ? 
            BusinessDataService.data.staff.map(s => s.id) : 
            [AuthService.currentUser.id];
        
        const staffData = targetStaffIds.map(staffId => {
            const staff = BusinessDataService.getStaffById(staffId);
            if (!staff) return null;
            
            const reports = BusinessDataService.data.employeeReports?.[staffId] || [];
            const weekStart = Utils.getWeekStart();
            
            const weeklyReports = reports.filter(r => 
                new Date(r.date) >= weekStart && new Date(r.date) <= new Date()
            );
            
            return {
                id: staffId,
                name: staff.name,
                role: staff.role,
                reports: weeklyReports,
                totalHours: weeklyReports.reduce((sum, r) => sum + (parseFloat(r.hours) || 0), 0),
                isCurrentUser: staffId === AuthService.currentUser.id
            };
        }).filter(Boolean);
        
        const content = `
            <div class="content-header">
                <h1><i class="fas fa-clipboard-check"></i> Еженедельные отчеты</h1>
                <div>
                    <button class="btn btn-outline" onclick="App.showWeekPicker()">
                        <i class="fas fa-calendar-alt"></i> ${Utils.formatDate(Utils.getWeekStart())} - ${Utils.formatDate(new Date())}
                    </button>
                    ${canAddReports ? `
                        <button class="btn btn-primary" onclick="App.showEmployeeReportModal()">
                            <i class="fas fa-plus"></i> Добавить отчет
                        </button>
                    ` : ''}
                </div>
            </div>
            
            <div class="grid">
                ${staffData.map(staff => this.renderStaffReportsCard(staff)).join('')}
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    },
    
    renderStaffReportsCard(staff) {
        const canEdit = staff.isCurrentUser || 
                       AuthService.currentUser?.role === 'owner' ||
                       AuthService.hasPermission(CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_EDIT);
        
        const canDelete = staff.isCurrentUser ||
                         AuthService.currentUser?.role === 'owner' ||
                         AuthService.hasPermission(CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_DELETE);
        
        return UIService.createCard(
            `
                <div class="card-header">
                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="staff-avatar" style="background: ${Utils.getAvatarColor(staff.name)}">
                                ${Utils.getInitials(staff.name)}
                            </div>
                            <div>
                                <h2 style="margin: 0; font-size: 16px;">${staff.name}</h2>
                                <small style="color: var(--text-light);">${TextService.getRoleName(staff.role)}</small>
                            </div>
                        </div>
                        <span class="status ${staff.totalHours >= 40 ? 'status-success' : staff.totalHours > 0 ? 'status-warning' : 'status-error'}">
                            ${staff.totalHours.toFixed(1)} ч
                        </span>
                    </div>
                </div>
            `,
            `
                <div class="info-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 16px;">
                    ${staff.reports.length > 0 ? staff.reports.map(report => `
                        <div class="info-item" style="position: relative; border-left: 3px solid var(--${TextService.getStatusClass(report.status).replace('status-', '')});">
                            <div style="flex: 1; min-width: 0;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                                    <div style="font-weight: 500; color: var(--primary);">
                                        ${report.dayOfWeek}
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-light);">
                                        ${Utils.formatDate(report.date)}
                                    </div>
                                </div>
                                <div style="font-size: 13px; color: var(--text); margin-bottom: 6px; line-height: 1.4;">
                                    ${report.tasks || 'Нет описания'}
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 12px; color: var(--text-light);">
                                        <i class="fas fa-clock" style="margin-right: 4px;"></i>
                                        ${report.hours} ч
                                    </span>
                                    <span class="status ${TextService.getStatusClass(report.status)}" style="font-size: 11px;">
                                        ${TextService.getStatusName(report.status)}
                                    </span>
                                </div>
                            </div>
                            ${canEdit || canDelete ? `
                                <div class="action-buttons" style="margin-left: 8px;">
                                    ${canEdit ? `
                                        <button class="btn btn-outline btn-sm" 
                                                onclick="App.showEmployeeReportModal(${staff.id}, ${report.id})"
                                                title="Редактировать">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    ` : ''}
                                    ${canDelete ? `
                                        <button class="btn btn-outline btn-sm" 
                                                onclick="App.deleteEmployeeReport(${staff.id}, ${report.id})"
                                                title="Удалить"
                                                style="color: var(--error);">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `).join('') : `
                        <div class="empty-state" style="padding: 20px; text-align: center;">
                            <i class="fas fa-clipboard" style="font-size: 32px; color: var(--text-light); margin-bottom: 12px;"></i>
                            <p style="color: var(--text-light); margin: 0;">Нет отчетов за эту неделю</p>
                        </div>
                    `}
                </div>
                
                ${canEdit ? `
                    <div style="border-top: 1px solid var(--border); padding-top: 16px;">
                        <button class="btn btn-outline" 
                                onclick="App.showEmployeeReportModal(${staff.id})"
                                style="width: 100%; ${staff.isCurrentUser ? '' : 'background: rgba(26, 35, 126, 0.05);'}">
                            <i class="fas fa-plus"></i>
                            ${staff.isCurrentUser ? 'Добавить мой отчет' : `Добавить отчет для ${staff.name}`}
                        </button>
                    </div>
                ` : ''}
            `
        );
    }
};

// ==================== ГЛОБАЛЬНЫЙ ОБЪЕКТ APP ====================
window.App = {
    init() {
        if (!AuthService.check()) return;
        
        BusinessDataService.init();
        UIService.init();
        
        const activeItem = document.querySelector('.menu-item.active');
        const section = activeItem ? activeItem.getAttribute('data-section') : 'main';
        SectionLoader.load(section);
    },
    
    // ==================== СТАФФ ====================
    showStaffModal(staffId = null) {
        if (staffId && !AuthService.canEditStaff(staffId)) {
            NotificationService.show('Недостаточно прав для редактирования', 'error');
            return;
        }
        
        const staff = staffId ? BusinessDataService.getStaffById(staffId) : null;
        const isOwner = AuthService.currentUser?.role === 'owner';
        
        let roleOptions = '';
        if (isOwner) {
            roleOptions = `
                <option value="owner" ${staff?.role === 'owner' ? 'selected' : ''} ${staffId ? '' : 'disabled'}>Владелец</option>
                <option value="admin" ${staff?.role === 'admin' ? 'selected' : ''}>Администратор</option>
                <option value="manager" ${staff?.role === 'manager' ? 'selected' : ''}>Менеджер</option>
                <option value="employee" ${!staff?.role || staff?.role === 'employee' ? 'selected' : ''}>Сотрудник</option>
            `;
        } else if (AuthService.currentUser?.role === 'admin') {
            roleOptions = `
                <option value="manager" ${staff?.role === 'manager' ? 'selected' : ''}>Менеджер</option>
                <option value="employee" ${!staff?.role || staff?.role === 'employee' ? 'selected' : ''}>Сотрудник</option>
            `;
        } else {
            roleOptions = `
                <option value="employee" ${!staff?.role || staff?.role === 'employee' ? 'selected' : ''}>Сотрудник</option>
            `;
        }
        
        const permissionGroups = {
            'Управление персоналом': [
                CONFIG.PERMISSIONS.STAFF_VIEW,
                CONFIG.PERMISSIONS.STAFF_ADD,
                CONFIG.PERMISSIONS.STAFF_EDIT,
                CONFIG.PERMISSIONS.STAFF_DELETE
            ],
            'Управление клиентами': [
                CONFIG.PERMISSIONS.CLIENTS_VIEW,
                CONFIG.PERMISSIONS.CLIENTS_ADD,
                CONFIG.PERMISSIONS.CLIENTS_EDIT,
                CONFIG.PERMISSIONS.CLIENTS_DELETE
            ],
            'Отчеты и аналитика': [
                CONFIG.PERMISSIONS.REPORTS_VIEW,
                CONFIG.PERMISSIONS.REPORTS_EXPORT
            ],
            'Управление идеями': [
                CONFIG.PERMISSIONS.IDEAS_VIEW,
                CONFIG.PERMISSIONS.IDEAS_ADD,
                CONFIG.PERMISSIONS.IDEAS_EDIT,
                CONFIG.PERMISSIONS.IDEAS_DELETE
            ],
            'Системные настройки': [
                CONFIG.PERMISSIONS.SETTINGS_EDIT,
                CONFIG.PERMISSIONS.DATA_EXPORT,
                CONFIG.PERMISSIONS.DATA_IMPORT
            ],
            'Отчеты сотрудников': [
                CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_VIEW,
                CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_ADD,
                CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_EDIT,
                CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_DELETE,
                CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_MANAGE_ALL
            ]
        };
        
        let permissionsHTML = '';
        for (const [groupName, permissions] of Object.entries(permissionGroups)) {
            permissionsHTML += `
                <div style="margin-bottom: 15px;">
                    <h3 style="font-size: 14px; margin-bottom: 8px; color: var(--primary);">${groupName}</h3>
                    <div class="checkbox-group" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; margin-bottom: 10px;">
                        ${permissions.map(perm => {
                            const isChecked = staff?.permissions?.includes(perm) || false;
                            const isDisabled = staff?.role === 'owner' || 
                                              (!isOwner && perm === CONFIG.PERMISSIONS.EMPLOYEE_REPORTS_MANAGE_ALL);
                            
                            return `
                                <label class="checkbox-label" style="${isDisabled ? 'opacity: 0.6;' : ''}">
                                    <input type="checkbox" name="permissions" value="${perm}" 
                                           ${isChecked ? 'checked' : ''}
                                           ${isDisabled ? 'disabled' : ''}>
                                    ${TextService.getPermissionName(perm)}
                                    ${staff?.role === 'owner' ? '<i class="fas fa-crown" style="margin-left: 4px; font-size: 10px;"></i>' : ''}
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        const modalHTML = `
            <div class="modal">
                <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h2>${staffId ? 'Редактирование сотрудника' : 'Добавление сотрудника'}</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="staffForm">
                            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 24px;">
                                <div>
                                    <div class="form-group">
                                        <label class="form-label" for="staffName">ФИО *</label>
                                        <input type="text" id="staffName" class="form-control" 
                                               value="${staff ? staff.name : ''}" required
                                               placeholder="Иванов Иван Иванович">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label" for="staffUsername">Логин *</label>
                                        <input type="text" id="staffUsername" class="form-control" 
                                               value="${staff ? staff.username : ''}" required
                                               placeholder="username">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label" for="staffPassword">
                                            Пароль ${staffId ? '(оставьте пустым, если не меняете)' : '*'}
                                        </label>
                                        <input type="password" id="staffPassword" class="form-control" 
                                               ${staffId ? '' : 'required'}
                                               placeholder="${staffId ? 'Новый пароль' : 'Пароль'}">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label" for="staffRole">Роль</label>
                                        <select id="staffRole" class="select-control" 
                                                ${!isOwner && staff?.role === 'owner' ? 'disabled' : ''}>
                                            ${roleOptions}
                                        </select>
                                        <small style="color: var(--text-light); margin-top: 4px; display: block;">
                                            ${isOwner ? 'Вы можете назначать любые роли' : 
                                              AuthService.currentUser?.role === 'admin' ? 'Вы можете назначать только менеджеров и сотрудников' : 
                                              'Вы можете назначать только сотрудников'}
                                        </small>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label" for="staffDepartment">Отдел</label>
                                        <input type="text" id="staffDepartment" class="form-control" 
                                               value="${staff?.department || ''}"
                                               placeholder="Отдел продаж">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label" for="staffSalary">Оклад (${BusinessDataService.data.settings.currency})</label>
                                        <div style="position: relative;">
                                            <input type="number" id="staffSalary" class="form-control" 
                                                   value="${staff?.salary || ''}" min="0" step="1000"
                                                   placeholder="50000">
                                            <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-light);">
                                                ${BusinessDataService.data.settings.currency}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="checkbox-label">
                                            <input type="checkbox" id="staffActive" 
                                                   ${staff?.active !== false ? 'checked' : ''}
                                                   ${staff?.role === 'owner' ? 'disabled' : ''}>
                                            Активный сотрудник
                                            ${staff?.role === 'owner' ? '<i class="fas fa-crown" style="margin-left: 4px;"></i>' : ''}
                                        </label>
                                    </div>
                                </div>
                                
                                <div>
                                    <div class="form-group">
                                        <label class="form-label">Разрешения</label>
                                        <div style="max-height: 400px; overflow-y: auto; padding: 15px; background: var(--bg); border-radius: 8px; border: 1px solid var(--border);">
                                            ${permissionsHTML}
                                        </div>
                                        <small style="color: var(--text-light); margin-top: 8px; display: block;">
                                            <i class="fas fa-info-circle"></i> Владельцы автоматически получают все разрешения
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="App.saveStaff(${staffId})">
                            ${staffId ? 'Обновить' : 'Добавить'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    saveStaff(staffId = null) {
        const name = document.getElementById('staffName').value.trim();
        const username = document.getElementById('staffUsername').value.trim();
        const password = document.getElementById('staffPassword').value;
        const role = document.getElementById('staffRole').value;
        const department = document.getElementById('staffDepartment').value.trim();
        const salary = parseInt(document.getElementById('staffSalary').value) || 0;
        const active = document.getElementById('staffActive').checked;
        
        const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked'))
                                .map(cb => cb.value);
        
        if (!name || !username) {
            NotificationService.show('Заполните обязательные поля', 'error');
            return;
        }
        
        if (!staffId && !password) {
            NotificationService.show('Введите пароль для нового сотрудника', 'error');
            return;
        }
        
        const existingStaff = BusinessDataService.data.staff.find(s => 
            s.username.toLowerCase() === username.toLowerCase() && s.id !== staffId
        );
        if (existingStaff) {
            NotificationService.show('Логин уже занят', 'error');
            return;
        }
        
        if (role === 'owner' && AuthService.currentUser.role !== 'owner') {
            NotificationService.show('Только владелец может назначать роль владельца', 'error');
            return;
        }
        
        const staffData = {
            name,
            username,
            role,
            department,
            salary,
            active: role === 'owner' ? true : active,
            permissions: role === 'owner' ? Object.values(CONFIG.PERMISSIONS) : permissions
        };
        
        if (password) {
            staffData.password = password;
            staffData.passwordChanged = new Date().toISOString();
        }
        
        if (staffId) {
            const staff = BusinessDataService.getStaffById(staffId);
            if (!staff) {
                NotificationService.show('Сотрудник не найден', 'error');
                return;
            }
            
            if (staff.role === 'owner' && role !== 'owner') {
                const ownerCount = BusinessDataService.data.staff.filter(s => s.role === 'owner').length;
                if (ownerCount <= 1) {
                    NotificationService.show('Нельзя изменить роль последнего владельца', 'error');
                    return;
                }
            }
            
            if (BusinessDataService.updateStaff(staffId, staffData)) {
                NotificationService.show('Сотрудник обновлен', 'success');
                SectionLoader.load('staff');
            }
        } else {
            staffData.createdAt = new Date().toISOString().split('T')[0];
            staffData.createdBy = AuthService.currentUser.id;
            
            BusinessDataService.addStaff(staffData);
            NotificationService.show('Сотрудник добавлен', 'success');
            SectionLoader.load('staff');
        }
        
        ModalService.close();
    },
    
    deleteStaff(staffId) {
        const staff = BusinessDataService.getStaffById(staffId);
        if (!staff) return;
        
        if (staff.role === 'owner') {
            NotificationService.show('Владельца нельзя удалить', 'error');
            return;
        }
        
        if (!confirm(`Вы уверены, что хотите удалить сотрудника ${staff.name}?`)) return;
        
        if (staffId === AuthService.currentUser.id) {
            NotificationService.show('Нельзя удалить самого себя', 'error');
            return;
        }
        
        const hasRelatedData = BusinessDataService.data.clients.some(c => 
            c.orders?.some(o => o.assignedTo === staffId)
        );
        
        if (hasRelatedData) {
            if (!confirm('У этого сотрудника есть связанные заказы. Удалить его?')) {
                return;
            }
        }
        
        if (BusinessDataService.deleteStaff(staffId)) {
            NotificationService.show('Сотрудник удален', 'success');
            SectionLoader.load('staff');
        }
    },
    
    toggleStaffActive(staffId) {
        const staff = BusinessDataService.getStaffById(staffId);
        if (!staff) return;
        
        if (staff.role === 'owner') {
            NotificationService.show('Владельца нельзя деактивировать', 'error');
            return;
        }
        
        if (staffId === AuthService.currentUser.id) {
            NotificationService.show('Нельзя деактивировать самого себя', 'error');
            return;
        }
        
        const updated = BusinessDataService.updateStaff(staffId, {
            active: !staff.active
        });
        
        if (updated) {
            NotificationService.show(`Сотрудник ${!staff.active ? 'активирован' : 'деактивирован'}`, 'success');
            SectionLoader.load('staff');
        }
    },
    
    exportStaffList() {
        const staffData = BusinessDataService.data.staff.map(staff => ({
            'ID': staff.id,
            'ФИО': staff.name,
            'Логин': staff.username,
            'Должность': TextService.getRoleName(staff.role),
            'Отдел': staff.department || '—',
            'Оклад': `${staff.salary || 0} ${BusinessDataService.data.settings.currency}`,
            'Статус': staff.active ? 'Активен' : 'Неактивен',
            'Дата создания': staff.createdAt,
            'Количество разрешений': staff.permissions?.length || 0
        }));
        
        const headers = Object.keys(staffData[0] || {});
        const csvRows = [
            headers.join(','),
            ...staffData.map(row => 
                headers.map(header => `"${row[header]}"`).join(',')
            )
        ];
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, `сотрудники_${new Date().toISOString().split('T')[0]}.csv`);
        } else {
            link.href = URL.createObjectURL(blob);
            link.download = `сотрудники_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        }
        
        NotificationService.show('Список сотрудников экспортирован', 'success');
    },
    
    // ==================== ОТЧЕТЫ СОТРУДНИКОВ ====================
    showEmployeeReportModal(staffId = null, reportId = null) {
        const isOwner = AuthService.currentUser?.role === 'owner';
        
        let targetStaffId = staffId || AuthService.currentUser.id;
        if (staffId === 'owner') targetStaffId = AuthService.currentUser.id;
        
        if (!isOwner && targetStaffId !== AuthService.currentUser.id) {
            NotificationService.show('Вы можете редактировать только свои отчеты', 'error');
            return;
        }
        
        let report = null;
        if (reportId && BusinessDataService.data.employeeReports?.[targetStaffId]) {
            report = BusinessDataService.data.employeeReports[targetStaffId].find(r => r.id === reportId);
        }
        
        let staffSelectHTML = '';
        if (isOwner && !reportId) {
            staffSelectHTML = `
                <div class="form-group">
                    <label class="form-label" for="reportStaff">Сотрудник *</label>
                    <select id="reportStaff" class="select-control">
                        ${BusinessDataService.data.staff.map(s => `
                            <option value="${s.id}" ${targetStaffId === s.id ? 'selected' : ''}>
                                ${s.name} (${TextService.getRoleName(s.role)})
                            </option>
                        `).join('')}
                    </select>
                </div>
            `;
        } else {
            staffSelectHTML = `<input type="hidden" id="reportStaff" value="${targetStaffId}">`;
        }
        
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${reportId ? 'Редактирование отчета' : 'Добавление отчета'}</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="employeeReportForm">
                            ${staffSelectHTML}
                            
                            <div class="form-group">
                                <label class="form-label" for="reportDate">Дата *</label>
                                <input type="date" id="reportDate" class="form-control" 
                                       value="${report?.date || new Date().toISOString().split('T')[0]}" 
                                       required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="reportDay">День недели *</label>
                                <select id="reportDay" class="select-control" required>
                                    <option value="">Выберите день</option>
                                    ${CONFIG.DAYS_OF_WEEK.map(day => `
                                        <option value="${day}" ${report?.dayOfWeek === day ? 'selected' : ''}>
                                            ${day}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="reportTasks">Что сделал *</label>
                                <textarea id="reportTasks" class="form-control" rows="4" 
                                          placeholder="Опишите выполненные задачи, проекты, встречи..." 
                                          required>${report?.tasks || ''}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="reportHours">Часы работы *</label>
                                <input type="number" id="reportHours" class="form-control" 
                                       value="${report?.hours || '8'}" min="0.5" max="24" step="0.5" 
                                       required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="reportStatus">Статус</label>
                                <select id="reportStatus" class="select-control">
                                    <option value="draft" ${report?.status === 'draft' ? 'selected' : ''}>
                                        Черновик
                                    </option>
                                    <option value="submitted" ${!report?.status || report?.status === 'submitted' ? 'selected' : ''}>
                                        Отправлен
                                    </option>
                                    <option value="approved" ${report?.status === 'approved' ? 'selected' : ''}>
                                        Утвержден
                                    </option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="reportNotes">Примечания</label>
                                <textarea id="reportNotes" class="form-control" rows="2"
                                          placeholder="Дополнительная информация...">${report?.notes || ''}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="App.saveEmployeeReport(${reportId})">
                            ${reportId ? 'Обновить' : 'Сохранить'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
        
        const dateInput = document.getElementById('reportDate');
        const daySelect = document.getElementById('reportDay');
        
        if (dateInput && daySelect) {
            dateInput.addEventListener('change', function() {
                const date = new Date(this.value);
                const dayIndex = date.getDay();
                const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                if (daySelect.value === '') {
                    daySelect.value = CONFIG.DAYS_OF_WEEK[adjustedIndex];
                }
            });
        }
    },
    
    saveEmployeeReport(reportId = null) {
        const staffId = parseInt(document.getElementById('reportStaff').value);
        const date = document.getElementById('reportDate').value;
        const dayOfWeek = document.getElementById('reportDay').value;
        const tasks = document.getElementById('reportTasks').value.trim();
        const hours = parseFloat(document.getElementById('reportHours').value);
        const status = document.getElementById('reportStatus').value;
        const notes = document.getElementById('reportNotes').value.trim();
        
        if (!staffId || !date || !dayOfWeek || !tasks || isNaN(hours)) {
            NotificationService.show('Заполните обязательные поля', 'error');
            return;
        }
        
        if (hours < 0.5 || hours > 24) {
            NotificationService.show('Часы работы должны быть от 0.5 до 24', 'error');
            return;
        }
        
        if (AuthService.currentUser.role !== 'owner' && staffId !== AuthService.currentUser.id) {
            NotificationService.show('Вы можете редактировать только свои отчеты', 'error');
            return;
        }
        
        const reportData = {
            staffId,
            date,
            dayOfWeek,
            tasks,
            hours,
            status,
            notes
        };
        
        if (reportId) {
            if (BusinessDataService.updateEmployeeReport(staffId, reportId, reportData)) {
                NotificationService.show('Отчет обновлен', 'success');
            }
        } else {
            BusinessDataService.addEmployeeReport(staffId, reportData);
            NotificationService.show('Отчет добавлен', 'success');
        }
        
        ModalService.close();
        SectionLoader.load('employee-reports');
    },
    
    deleteEmployeeReport(staffId, reportId) {
        if (!confirm('Вы уверены, что хотите удалить этот отчет?')) return;
        
        if (AuthService.currentUser.role !== 'owner' && staffId !== AuthService.currentUser.id) {
            NotificationService.show('Вы можете удалять только свои отчеты', 'error');
            return;
        }
        
        if (BusinessDataService.deleteEmployeeReport(staffId, reportId)) {
            NotificationService.show('Отчет удален', 'success');
            SectionLoader.load('employee-reports');
        }
    },
    
    // ==================== КЛИЕНТЫ ====================
    showClientModal(clientId = null) {
        const client = clientId ? BusinessDataService.getClientById(clientId) : null;
        
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${clientId ? 'Редактирование' : 'Добавление'} клиента</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="clientForm">
                            <div class="form-group">
                                <label class="form-label" for="clientName">Название/ФИО *</label>
                                <input type="text" id="clientName" class="form-control" 
                                       value="${client ? client.name : ''}" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="clientContact">Контактный телефон *</label>
                                <input type="tel" id="clientContact" class="form-control" 
                                       value="${client ? client.contact : ''}" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="clientEmail">Email</label>
                                <input type="email" id="clientEmail" class="form-control" 
                                       value="${client ? client.email : ''}">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="clientAddress">Адрес</label>
                                <input type="text" id="clientAddress" class="form-control" 
                                       value="${client ? client.address : ''}">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="clientStatus">Статус</label>
                                <select id="clientStatus" class="select-control">
                                    <option value="active" ${client?.status === 'active' ? 'selected' : ''}>Активен</option>
                                    <option value="inactive" ${client?.status === 'inactive' ? 'selected' : ''}>Неактивен</option>
                                    <option value="blocked" ${client?.status === 'blocked' ? 'selected' : ''}>Заблокирован</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="App.saveClient(${clientId})">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    saveClient(clientId = null) {
        const name = document.getElementById('clientName').value.trim();
        const contact = document.getElementById('clientContact').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const address = document.getElementById('clientAddress').value.trim();
        const status = document.getElementById('clientStatus').value;
        
        if (!name || !contact) {
            NotificationService.show('Заполните обязательные поля', 'error');
            return;
        }
        
        const clientData = {
            name,
            contact,
            email,
            address,
            status
        };
        
        if (clientId) {
            if (BusinessDataService.updateClient(clientId, clientData)) {
                NotificationService.show('Клиент обновлен', 'success');
                SectionLoader.load('clients');
            }
        } else {
            BusinessDataService.addClient(clientData);
            NotificationService.show('Клиент добавлен', 'success');
            SectionLoader.load('clients');
        }
        
        ModalService.close();
    },
    
    deleteClient(clientId) {
        if (!confirm('Вы уверены, что хотите удалить клиента?')) return;
        
        if (BusinessDataService.deleteClient(clientId)) {
            NotificationService.show('Клиент удален', 'success');
            SectionLoader.load('clients');
        }
    },
    
    showClientOrders(clientId) {
        const client = BusinessDataService.getClientById(clientId);
        if (!client) return;
        
        const modalHTML = `
            <div class="modal">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h2>Заказы клиента: ${client.name}</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 20px;">
                            <button class="btn btn-primary" onclick="App.showOrderModal(${clientId})">
                                <i class="fas fa-plus"></i> Добавить заказ
                            </button>
                        </div>
                        
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Описание</th>
                                        <th>Сумма</th>
                                        <th>Статус</th>
                                        <th>Дата</th>
                                        <th>Исполнитель</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${client.orders?.map(order => `
                                        <tr>
                                            <td>${order.id}</td>
                                            <td>${order.description}</td>
                                            <td>${Utils.formatCurrency(order.amount, BusinessDataService.data.settings.currency)}</td>
                                            <td>
                                                <span class="status ${TextService.getStatusClass(order.status)}">
                                                    ${TextService.getStatusName(order.status)}
                                                </span>
                                            </td>
                                            <td>${Utils.formatDate(order.date)}</td>
                                            <td>${BusinessDataService.getStaffById(order.assignedTo)?.name || 'Не назначен'}</td>
                                            <td>
                                                <div class="action-buttons">
                                                    <button class="btn btn-outline btn-sm" onclick="App.showOrderModal(${clientId}, ${order.id})">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button class="btn btn-outline btn-sm" onclick="App.deleteOrder(${clientId}, ${order.id})">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('') || '<tr><td colspan="7" style="text-align: center;">Нет заказов</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Закрыть</button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    showOrderModal(clientId, orderId = null) {
        const client = BusinessDataService.getClientById(clientId);
        const order = orderId ? client?.orders?.find(o => o.id === orderId) : null;
        
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${orderId ? 'Редактирование' : 'Добавление'} заказа</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="orderForm">
                            <input type="hidden" id="orderClientId" value="${clientId}">
                            
                            <div class="form-group">
                                <label class="form-label" for="orderDescription">Описание *</label>
                                <textarea id="orderDescription" class="form-control" rows="3" required>${order?.description || ''}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="orderAmount">Сумма (${BusinessDataService.data.settings.currency}) *</label>
                                <input type="number" id="orderAmount" class="form-control" 
                                       value="${order?.amount || ''}" min="0" step="0.01" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="orderStatus">Статус</label>
                                <select id="orderStatus" class="select-control">
                                    ${Object.entries(CONFIG.STATUSES).map(([key, value]) => `
                                        <option value="${value}" ${order?.status === value ? 'selected' : ''}>
                                            ${TextService.getStatusName(value)}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="orderDate">Дата</label>
                                <input type="date" id="orderDate" class="form-control" 
                                       value="${order?.date || new Date().toISOString().split('T')[0]}">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="orderAssignedTo">Исполнитель</label>
                                <select id="orderAssignedTo" class="select-control">
                                    <option value="">Не назначен</option>
                                    ${BusinessDataService.data.staff.map(staff => `
                                        <option value="${staff.id}" ${order?.assignedTo === staff.id ? 'selected' : ''}>
                                            ${staff.name} (${TextService.getRoleName(staff.role)})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="App.saveOrder(${orderId})">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    // ==================== ИДЕИ ====================
    showIdeaModal(ideaId = null) {
        const idea = ideaId ? BusinessDataService.getIdeaById(ideaId) : null;
        
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${ideaId ? 'Редактирование' : 'Добавление'} идеи</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="ideaForm">
                            <div class="form-group">
                                <label class="form-label" for="ideaTitle">Название *</label>
                                <input type="text" id="ideaTitle" class="form-control" 
                                       value="${idea?.title || ''}" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="ideaDescription">Описание *</label>
                                <textarea id="ideaDescription" class="form-control" rows="4" required>${idea?.description || ''}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="ideaCategory">Категория</label>
                                <select id="ideaCategory" class="select-control">
                                    <option value="">Общая</option>
                                    <option value="Автоматизация" ${idea?.category === 'Автоматизация' ? 'selected' : ''}>Автоматизация</option>
                                    <option value="Разработка" ${idea?.category === 'Разработка' ? 'selected' : ''}>Разработка</option>
                                    <option value="Маркетинг" ${idea?.category === 'Маркетинг' ? 'selected' : ''}>Маркетинг</option>
                                    <option value="Продажи" ${idea?.category === 'Продажи' ? 'selected' : ''}>Продажи</option>
                                    <option value="Управление" ${idea?.category === 'Управление' ? 'selected' : ''}>Управление</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="ideaPriority">Приоритет</label>
                                <select id="ideaPriority" class="select-control">
                                    <option value="${CONFIG.PRIORITIES.LOW}" ${idea?.priority === CONFIG.PRIORITIES.LOW ? 'selected' : ''}>Низкий</option>
                                    <option value="${CONFIG.PRIORITIES.MEDIUM}" ${idea?.priority === CONFIG.PRIORITIES.MEDIUM ? 'selected' : ''}>Средний</option>
                                    <option value="${CONFIG.PRIORITIES.HIGH}" ${idea?.priority === CONFIG.PRIORITIES.HIGH ? 'selected' : ''}>Высокий</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="ideaStatus">Статус</label>
                                <select id="ideaStatus" class="select-control">
                                    <option value="new" ${idea?.status === 'new' ? 'selected' : ''}>Новая</option>
                                    <option value="in_progress" ${idea?.status === 'in_progress' ? 'selected' : ''}>В работе</option>
                                    <option value="completed" ${idea?.status === 'completed' ? 'selected' : ''}>Завершена</option>
                                    <option value="cancelled" ${idea?.status === 'cancelled' ? 'selected' : ''}>Отменена</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="ideaBudget">Бюджет (${BusinessDataService.data.settings.currency})</label>
                                <input type="number" id="ideaBudget" class="form-control" 
                                       value="${idea?.budget || ''}" min="0">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="ideaDeadline">Дедлайн</label>
                                <input type="date" id="ideaDeadline" class="form-control" 
                                       value="${idea?.deadline || ''}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="App.saveIdea(${ideaId})">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    saveIdea(ideaId = null) {
        const title = document.getElementById('ideaTitle').value.trim();
        const description = document.getElementById('ideaDescription').value.trim();
        const category = document.getElementById('ideaCategory').value;
        const priority = document.getElementById('ideaPriority').value;
        const status = document.getElementById('ideaStatus').value;
        const budget = document.getElementById('ideaBudget').value ? 
                      parseInt(document.getElementById('ideaBudget').value) : null;
        const deadline = document.getElementById('ideaDeadline').value;
        
        if (!title || !description) {
            NotificationService.show('Заполните обязательные поля', 'error');
            return;
        }
        
        const ideaData = {
            title,
            description,
            category,
            priority,
            status,
            budget,
            deadline,
            createdBy: AuthService.currentUser.id
        };
        
        if (ideaId) {
            if (BusinessDataService.updateIdea(ideaId, ideaData)) {
                NotificationService.show('Идея обновлена', 'success');
                SectionLoader.load('ideas');
            }
        } else {
            BusinessDataService.addIdea(ideaData);
            NotificationService.show('Идея добавлена', 'success');
            SectionLoader.load('ideas');
        }
        
        ModalService.close();
    },
    
    deleteIdea(ideaId) {
        if (!confirm('Вы уверены, что хотите удалить идею?')) return;
        
        if (BusinessDataService.deleteIdea(ideaId)) {
            NotificationService.show('Идея удалена', 'success');
            SectionLoader.load('ideas');
        }
    },
    
    // ==================== СИСТЕМНЫЕ ФУНКЦИИ ====================
    showCompanySettingsModal() {
        const data = BusinessDataService.data.settings;
        
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Настройки компании</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="settingsForm">
                            <div class="form-group">
                                <label class="form-label" for="companyName">Название компании *</label>
                                <input type="text" id="companyName" class="form-control" 
                                       value="${data.companyName}" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="companyCurrency">Валюта</label>
                                <select id="companyCurrency" class="select-control">
                                    ${Object.entries(CONFIG.CURRENCIES).map(([symbol, name]) => `
                                        <option value="${symbol}" ${data.currency === symbol ? 'selected' : ''}>
                                            ${name} (${symbol})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="taxRate">Налоговая ставка (%)</label>
                                <input type="number" id="taxRate" class="form-control" 
                                       value="${data.taxRate}" min="0" max="100" step="0.1">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="App.saveCompanySettings()">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    saveCompanySettings() {
        const companyName = document.getElementById('companyName').value.trim();
        const currency = document.getElementById('companyCurrency').value;
        const taxRate = parseFloat(document.getElementById('taxRate').value);
        
        if (!companyName) {
            NotificationService.show('Введите название компании', 'error');
            return;
        }
        
        BusinessDataService.data.settings.companyName = companyName;
        BusinessDataService.data.settings.currency = currency;
        BusinessDataService.data.settings.taxRate = taxRate || 0;
        
        BusinessDataService.save();
        NotificationService.show('Настройки сохранены', 'success');
        ModalService.close();
        SectionLoader.load('main');
    },
    
    exportAllData() {
        const data = {
            businessData: BusinessDataService.data,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', `business-backup-${new Date().toISOString().split('T')[0]}.json`);
        link.click();
        
        NotificationService.show('Все данные экспортированы', 'success');
    },
    
    showImportModal() {
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Импорт данных</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 20px;">
                            <p>Выберите файл с данными для импорта. Все текущие данные будут заменены.</p>
                            <p style="color: var(--warning); font-size: 14px;">
                                ⚠️ Внимание: это действие нельзя отменить!
                            </p>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="importFile">Файл данных (.json)</label>
                            <input type="file" id="importFile" class="form-control" accept=".json">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="App.importData()">Импортировать</button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    importData() {
        const fileInput = document.getElementById('importFile');
        if (!fileInput.files.length) {
            NotificationService.show('Выберите файл для импорта', 'error');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (!importedData.businessData) {
                    throw new Error('Неверный формат файла');
                }
                
                if (confirm('Все текущие данные будут заменены. Продолжить?')) {
                    BusinessDataService.data = importedData.businessData;
                    BusinessDataService.save();
                    NotificationService.show('Данные успешно импортированы', 'success');
                    SectionLoader.load(SectionLoader.currentSection);
                    ModalService.close();
                }
            } catch (error) {
                NotificationService.show('Ошибка при импорте данных: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    },
    
    createBackup() {
        StorageService.set(CONFIG.STORAGE_KEYS.BACKUP, BusinessDataService.data);
        NotificationService.show('Резервная копия создана', 'success');
    },
    
    clearAllData() {
        if (!confirm('ВНИМАНИЕ! Все данные будут удалены без возможности восстановления. Продолжить?')) {
            return;
        }
        
        if (!confirm('Вы уверены? Это действие нельзя отменить!')) {
            return;
        }
        
        StorageService.clear();
        NotificationService.show('Все данные очищены', 'success');
        setTimeout(() => window.location.reload(), 1000);
    },
    
    resetDemoData() {
        if (!confirm('Сбросить все данные на демо-версию?')) return;
        
        BusinessDataService.loadDemoData();
        BusinessDataService.save();
        NotificationService.show('Демо-данные загружены', 'success');
        setTimeout(() => window.location.reload(), 1000);
    },
    
    generateFinancialReport() {
        const report = {
            date: new Date().toISOString(),
            company: BusinessDataService.data.settings.companyName,
            finances: BusinessDataService.data.finances,
            staffCount: BusinessDataService.data.staff.length,
            clientCount: BusinessDataService.data.clients.length,
            activeOrders: BusinessDataService.data.clients.reduce((acc, client) => 
                acc + (client.orders?.filter(o => o.status === CONFIG.STATUSES.IN_PROGRESS).length || 0), 0)
        };
        
        if (!BusinessDataService.data.reports) {
            BusinessDataService.data.reports = [];
        }
        
        BusinessDataService.data.reports.push({
            id: Utils.generateId(),
            type: 'financial',
            data: report,
            generatedAt: new Date().toISOString(),
            generatedBy: AuthService.currentUser.id
        });
        
        BusinessDataService.save();
        NotificationService.show('Финансовый отчет сгенерирован', 'success');
    },
    
    exportReports() {
        if (!BusinessDataService.data.reports || BusinessDataService.data.reports.length === 0) {
            NotificationService.show('Нет отчетов для экспорта', 'warning');
            return;
        }
        
        const dataStr = JSON.stringify(BusinessDataService.data.reports, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', `отчеты-${new Date().toISOString().split('T')[0]}.json`);
        link.click();
        
        NotificationService.show('Отчеты экспортированы', 'success');
    },
    
    showWeekPicker() {
        NotificationService.show('Выбор недели в разработке', 'info');
    }
};

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const appLoading = document.getElementById('appLoading');
        const appContainer = document.getElementById('appContainer');
        
        if (appLoading) appLoading.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';
        
        App.init();
    }, 500);
});

// ==================== ДОБАВЛЯЕМ СТИЛИ ====================
const additionalStyles = `
/* Стили для раздела персонала */
.owner-row {
    background: linear-gradient(90deg, rgba(26, 35, 126, 0.05) 0%, transparent 100%);
    border-left: 3px solid var(--primary);
}

.staff-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    font-size: 14px;
    flex-shrink: 0;
}

.role-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.role-owner {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: white;
}

.role-admin {
    background: rgba(0, 176, 255, 0.1);
    color: var(--accent);
}

.role-manager {
    background: rgba(255, 145, 0, 0.1);
    color: var(--warning);
}

.role-employee {
    background: rgba(76, 175, 80, 0.1);
    color: var(--success);
}

.badge {
    display: inline-block;
    padding: 4px 8px;
    background: var(--bg);
    border-radius: 6px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
}

.permission-count {
    display: inline-block;
    padding: 4px 8px;
    background: var(--bg);
    border-radius: 6px;
    font-size: 12px;
    min-width: 40px;
    text-align: center;
}

/* Адаптивность */
@media (max-width: 768px) {
    .staff-avatar {
        width: 32px;
        height: 32px;
        font-size: 12px;
    }
    
    .role-badge {
        font-size: 10px;
        padding: 3px 8px;
    }
    
    .action-buttons {
        flex-direction: column;
        gap: 4px;
    }
    
    .action-buttons .btn-sm {
        width: 28px;
        height: 28px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .grid {
        grid-template-columns: 1fr !important;
    }
}

@media (max-width: 480px) {
    .modal-content {
        margin: 8px;
        width: calc(100% - 16px) !important;
    }
    
    .checkbox-group {
        grid-template-columns: 1fr !important;
    }
}
`;

const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);

// ==================== GITHUB БАЗА ДАННЫХ - ИСПРАВЛЕННАЯ ВЕРСИЯ ====================
const GitHubSyncDB = {
    // Настройки
    config: {
        owner: 'platonzhuman',
        repo: 'info-market-business',
        file: 'business-data.json',
        branch: 'main'
    },
    
    // Состояние
    state: {
        token: localStorage.getItem('github_token') || '',
        username: localStorage.getItem('github_user') || '',
        isConnected: false,
        lastSync: null
    },
    
    // Инициализация
    init() {
        console.log('📊 GitHub Sync DB initialized');
        
        // Проверяем токен
        if (this.state.token) {
            this.testConnection();
        }
        
        // Добавляем интерфейс
        this.addInterface();
        
        return this;
    },
    
    // Тест соединения
    async testConnection() {
        if (!this.state.token) return false;
        
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: this.getHeaders()
            });
            
            if (response.ok) {
                const userData = await response.json();
                this.state.username = userData.login || 'platonzhuman';
                this.state.isConnected = true;
                localStorage.setItem('github_user', this.state.username);
                console.log('✅ GitHub connection successful');
                return true;
            } else {
                this.state.isConnected = false;
                console.warn('GitHub connection failed');
                return false;
            }
        } catch (error) {
            console.error('Connection test error:', error);
            this.state.isConnected = false;
            return false;
        }
    },
    
    // Получение заголовков
    getHeaders() {
        return {
            'Authorization': `token ${this.state.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    },
    
    // Настройка токена
    showSetup() {
        const modalHTML = `
            <div class="modal">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2><i class="fab fa-github"></i> Настройка GitHub Sync</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Вставьте ваш GitHub Personal Access Token:</strong></p>
                        
                        <div class="form-group">
                            <label class="form-label">GitHub Token</label>
                            <input type="password" id="githubToken" class="form-control" 
                                   placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                   value="${this.state.token || ''}">
                        </div>
                        
                        <div style="background: rgba(26, 35, 126, 0.1); padding: 12px; border-radius: 8px; margin-top: 16px;">
                            <strong>📝 Как создать рабочий токен:</strong>
                            <ol style="margin: 8px 0 0 20px; font-size: 13px;">
                                <li>Перейдите: <a href="https://github.com/settings/tokens" target="_blank">github.com/settings/tokens</a></li>
                                <li>Нажмите <strong>"Generate new token (classic)"</strong> ← ВАЖНО!</li>
                                <li>Название: <code>Business Panel Sync</code></li>
                                <li>Срок: <strong>No expiration</strong> ✅</li>
                                <li>Права: <strong>ТОЛЬКО "repo"</strong> ✅</li>
                                <li>Нажмите <strong>"Generate token"</strong></li>
                                <li>Скопируйте токен (начинается с ghp_)</li>
                                <li>Вставьте в поле выше</li>
                            </ol>
                            
                            <div style="margin-top: 12px; padding: 8px; background: rgba(244, 67, 54, 0.1); border-radius: 4px; font-size: 12px;">
                                <strong>⚠️ Если не работает:</strong>
                                <ul style="margin: 4px 0 0 15px;">
                                    <li>Токен должен быть <strong>classic</strong> (не fine-grained)</li>
                                    <li>Должна быть галочка <strong>"repo"</strong></li>
                                    <li>Срок должен быть <strong>"No expiration"</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="GitHubSyncDB.saveToken()">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    // Сохранение токена
    async saveToken() {
        const token = document.getElementById('githubToken').value.trim();
        
        if (!token.startsWith('ghp_')) {
            NotificationService.show('Токен должен начинаться с ghp_', 'error');
            return;
        }
        
        // Сохраняем временно для теста
        const tempToken = this.state.token;
        this.state.token = token;
        
        // Тестируем соединение
        const connected = await this.testConnection();
        
        if (connected) {
            // Сохраняем в localStorage
            localStorage.setItem('github_token', token);
            localStorage.setItem('github_user', this.state.username);
            
            NotificationService.show('✅ GitHub подключен!', 'success');
            
            // Загружаем данные
            setTimeout(() => {
                this.loadData();
                this.updateUI();
            }, 1000);
            
            ModalService.close();
        } else {
            // Восстанавливаем старый токен
            this.state.token = tempToken;
            NotificationService.show('❌ Токен недействителен. Проверьте права.', 'error');
        }
    },
    
    // Загрузка данных
    async loadData() {
        if (!this.state.isConnected) {
            console.log('Not connected to GitHub');
            return false;
        }
        
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.file}`,
                { headers: this.getHeaders() }
            );
            
            if (response.status === 404) {
                console.log('Файл не найден, создадим при первом сохранении');
                return false;
            }
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const fileData = await response.json();
            const content = atob(fileData.content);
            const data = JSON.parse(content);
            
            // Спрашиваем подтверждение
            if (confirm('Найдены данные в облаке. Загрузить их?\n(Текущие данные будут заменены)')) {
                this.mergeData(data);
                this.state.lastSync = new Date().toISOString();
                NotificationService.show('✅ Данные загружены из облака', 'success');
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('Load data error:', error);
            NotificationService.show('Ошибка загрузки данных', 'warning');
            return false;
        }
    },
    
    // Слияние данных
    mergeData(cloudData) {
        // Сохраняем текущего пользователя
        const currentUser = AuthService.currentUser;
        const currentSettings = BusinessDataService.data.settings;
        
        // Объединяем данные
        BusinessDataService.data = {
            ...cloudData,
            settings: { ...cloudData.settings, ...currentSettings }
        };
        
        // Восстанавливаем пользователя
        if (currentUser && BusinessDataService.data.staff) {
            const user = BusinessDataService.data.staff.find(s => 
                s.id === currentUser.id || s.username === currentUser.username
            );
            if (user) {
                AuthService.currentUser = user;
                StorageService.set(CONFIG.STORAGE_KEYS.USER, user);
            }
        }
        
        BusinessDataService.save();
        
        // Обновляем интерфейс
        if (SectionLoader.currentSection) {
            SectionLoader.load(SectionLoader.currentSection);
        }
    },
    
    // Сохранение данных
    async saveData() {
        if (!this.state.isConnected) {
            NotificationService.show('Сначала настройте GitHub', 'warning');
            return false;
        }
        
        try {
            // Получаем SHA существующего файла
            let sha = null;
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.file}`,
                    { headers: this.getHeaders() }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    sha = data.sha;
                }
            } catch (e) {
                // Файла нет, создаём новый
            }
            
            // Подготавливаем данные
            const dataToSave = {
                ...BusinessDataService.data,
                _meta: {
                    savedAt: new Date().toISOString(),
                    savedBy: this.state.username,
                    version: '2.0'
                }
            };
            
            const content = JSON.stringify(dataToSave, null, 2);
            const encoded = btoa(unescape(encodeURIComponent(content)));
            
            const body = {
                message: `Autosave: ${new Date().toLocaleString('ru-RU')}`,
                content: encoded,
                branch: this.config.branch
            };
            
            if (sha) {
                body.sha = sha;
            }
            
            // Отправляем
            const response = await fetch(
                `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.file}`,
                {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify(body)
                }
            );
            
            if (!response.ok) {
                throw new Error(`Save failed: ${response.status}`);
            }
            
            this.state.lastSync = new Date().toISOString();
            console.log('💾 Data saved to GitHub');
            
            return true;
            
        } catch (error) {
            console.error('Save error:', error);
            NotificationService.show('Ошибка сохранения в GitHub', 'error');
            return false;
        }
    },
    
    // Автосохранение
    enableAutoSave() {
        if (!this.state.isConnected) return;
        
        let timeout = null;
        
        // Перехватываем сохранения
        const originalSave = BusinessDataService.save;
        BusinessDataService.save = function() {
            const result = originalSave.call(this);
            
            // Автосохранение в GitHub
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (GitHubSyncDB.state.isConnected) {
                    GitHubSyncDB.saveData().then(success => {
                        if (success) {
                            // Показываем уведомление в углу
                            const notif = document.createElement('div');
                            notif.style.cssText = `
                                position: fixed;
                                bottom: 20px;
                                right: 20px;
                                background: var(--success);
                                color: white;
                                padding: 8px 12px;
                                border-radius: 6px;
                                font-size: 12px;
                                z-index: 9999;
                                animation: fadeIn 0.3s;
                                display: flex;
                                align-items: center;
                                gap: 6px;
                            `;
                            notif.innerHTML = `
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Синхронизировано</span>
                            `;
                            document.body.appendChild(notif);
                            
                            setTimeout(() => {
                                notif.style.animation = 'fadeOut 0.3s';
                                setTimeout(() => notif.remove(), 300);
                            }, 2000);
                        }
                    });
                }
            }, 3000);
            
            return result;
        };
        
        console.log('🔁 GitHub auto-save enabled');
    },
    
    // Добавление интерфейса
    addInterface() {
        // Добавляем кнопку в верхнюю панель
        setTimeout(() => {
            const topBar = document.querySelector('.top-bar .actions');
            if (topBar && !document.getElementById('syncBtn')) {
                const btn = document.createElement('button');
                btn.id = 'syncBtn';
                btn.className = 'btn btn-outline btn-sm';
                btn.innerHTML = `
                    <i class="fas fa-sync-alt"></i>
                    <span class="hide-on-mobile">${this.state.isConnected ? 'Синхр.' : 'Настроить'}</span>
                `;
                btn.title = this.state.isConnected ? 'Синхронизировать с облаком' : 'Настроить синхронизацию';
                btn.onclick = () => this.state.isConnected ? this.saveData() : this.showSetup();
                
                // Индикатор статуса
                if (this.state.isConnected) {
                    const indicator = document.createElement('span');
                    indicator.style.cssText = `
                        width: 6px;
                        height: 6px;
                        background: var(--success);
                        border-radius: 50%;
                        display: inline-block;
                        margin-left: 4px;
                        vertical-align: middle;
                    `;
                    btn.appendChild(indicator);
                }
                
                topBar.appendChild(btn);
            }
        }, 1000);
        
        // Добавляем пункт меню "sync-db"
        this.addMenuItem();
    },
    
    // Добавление пункта меню
    addMenuItem() {
        setTimeout(() => {
            const menuSection = document.querySelector('.menu-section:nth-child(2)');
            if (menuSection && !document.querySelector('[data-section="sync-db"]')) {
                const menuItem = document.createElement('button');
                menuItem.className = 'menu-item';
                menuItem.setAttribute('data-section', 'sync-db');
                menuItem.innerHTML = `
                    <i class="fas fa-database"></i>
                    <span>База данных</span>
                `;
                
                menuItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                    menuItem.classList.add('active');
                    
                    // Загружаем раздел синхронизации
                    this.loadSyncSection();
                    
                    if (window.innerWidth <= 1024) {
                        const hamburger = document.querySelector('.hamburger');
                        const sidebar = document.querySelector('.sidebar');
                        if (hamburger) hamburger.classList.remove('active');
                        if (sidebar) sidebar.classList.remove('active');
                    }
                });
                
                menuSection.appendChild(menuItem);
            }
        }, 1500);
    },
    
    // Обновление UI
    updateUI() {
        const btn = document.getElementById('syncBtn');
        if (btn) {
            btn.innerHTML = `
                <i class="fas fa-sync-alt"></i>
                <span class="hide-on-mobile">${this.state.isConnected ? 'Синхр.' : 'Настроить'}</span>
            `;
            btn.title = this.state.isConnected ? 'Синхронизировать с облаком' : 'Настроить синхронизацию';
            btn.onclick = () => this.state.isConnected ? this.saveData() : this.showSetup();
            
            // Обновляем индикатор
            if (this.state.isConnected) {
                if (!btn.querySelector('.status-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'status-indicator';
                    indicator.style.cssText = `
                        width: 6px;
                        height: 6px;
                        background: var(--success);
                        border-radius: 50%;
                        display: inline-block;
                        margin-left: 4px;
                        vertical-align: middle;
                    `;
                    btn.appendChild(indicator);
                }
            } else {
                const indicator = btn.querySelector('.status-indicator');
                if (indicator) indicator.remove();
            }
        }
    },
    
    // Загрузка раздела синхронизации
    loadSyncSection() {
        const lastSync = this.state.lastSync ? 
            Utils.formatDate(this.state.lastSync, true) : 'никогда';
        
        const content = `
            <div class="content-header">
                <h1><i class="fas fa-database"></i> Синхронизация базы данных</h1>
                <div>
                    ${this.state.isConnected ? `
                        <button class="btn btn-outline" onclick="GitHubSyncDB.saveData()">
                            <i class="fas fa-cloud-upload-alt"></i> Сохранить сейчас
                        </button>
                        <button class="btn btn-outline" onclick="GitHubSyncDB.loadData()">
                            <i class="fas fa-cloud-download-alt"></i> Загрузить
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="GitHubSyncDB.showSetup()">
                            <i class="fab fa-github"></i> Настроить GitHub
                        </button>
                    `}
                </div>
            </div>
            
            <div class="grid">
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-info-circle"></i> Статус синхронизации</h2>
                    </div>
                    <div class="card-body">
                        <div class="info-list">
                            <div class="info-item">
                                <span class="info-label">Статус:</span>
                                <span class="info-value ${this.state.isConnected ? 'status-success' : 'status-error'}">
                                    ${this.state.isConnected ? '✅ Подключено к GitHub' : '❌ Не подключено'}
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Последняя синхронизация:</span>
                                <span class="info-value">${lastSync}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Репозиторий:</span>
                                <span class="info-value">${this.config.owner}/${this.config.repo}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Файл данных:</span>
                                <span class="info-value">${this.config.file}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Автосохранение:</span>
                                <span class="info-value ${this.state.isConnected ? 'status-success' : 'status-error'}">
                                    ${this.state.isConnected ? 'Включено' : 'Выключено'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-sync-alt"></i> Управление синхронизацией</h2>
                    </div>
                    <div class="card-body">
                        ${this.state.isConnected ? `
                            <div style="margin-bottom: 20px;">
                                <p>Все изменения автоматически синхронизируются с облаком.</p>
                            </div>
                            
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <button class="btn btn-primary" onclick="GitHubSyncDB.saveData()">
                                    <i class="fas fa-save"></i> Сохранить сейчас в облако
                                </button>
                                <button class="btn btn-outline" onclick="GitHubSyncDB.loadData()">
                                    <i class="fas fa-download"></i> Загрузить из облака
                                </button>
                                <button class="btn btn-outline" onclick="window.open('https://github.com/${this.config.owner}/${this.config.repo}/blob/main/${this.config.file}', '_blank')">
                                    <i class="fab fa-github"></i> Просмотреть данные на GitHub
                                </button>
                                <button class="btn btn-outline" onclick="GitHubSyncDB.showSetup()">
                                    <i class="fas fa-cog"></i> Изменить настройки
                                </button>
                            </div>
                        ` : `
                            <div style="text-align: center; padding: 20px;">
                                <div style="font-size: 48px; color: var(--text-light); margin-bottom: 16px;">
                                    <i class="fas fa-cloud"></i>
                                </div>
                                <h3 style="color: var(--text-light); margin-bottom: 8px;">Синхронизация не настроена</h3>
                                <p style="color: var(--text-light); margin-bottom: 20px;">
                                    Настройте GitHub для автоматической синхронизации данных между всеми устройствами
                                </p>
                                <button class="btn btn-primary" onclick="GitHubSyncDB.showSetup()">
                                    <i class="fab fa-github"></i> Настроить GitHub Sync
                                </button>
                            </div>
                        `}
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-question-circle"></i> Как это работает</h2>
                    </div>
                    <div class="card-body">
                        <ol style="margin-left: 20px; margin-bottom: 20px;">
                            <li><strong>Настройте GitHub токен</strong> с правами "repo"</li>
                            <li><strong>Все изменения</strong> автоматически сохраняются в облако</li>
                            <li><strong>На другом устройстве</strong> настройте тот же токен</li>
                            <li><strong>Данные синхронизируются</strong> автоматически</li>
                            <li><strong>Полная история</strong> изменений хранится на GitHub</li>
                        </ol>
                        
                        <div style="background: rgba(26, 35, 126, 0.1); padding: 12px; border-radius: 8px;">
                            <strong>🎯 Преимущества:</strong>
                            <ul style="margin: 8px 0 0 20px;">
                                <li>Автоматическая синхронизация между устройствами</li>
                                <li>Резервные копии в облаке</li>
                                <li>Полная история изменений</li>
                                <li>Работает в реальном времени</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    },
    
    // Удаление токена
    clearToken() {
        this.state.token = '';
        this.state.username = '';
        this.state.isConnected = false;
        
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_user');
        
        this.updateUI();
        NotificationService.show('Токен удалён', 'info');
    }
};

// Инициализируем
GitHubSyncDB.init();

// Добавляем автосохранение
setTimeout(() => {
    GitHubSyncDB.enableAutoSave();
}, 2000);

// Добавляем в глобальную область видимости
window.GitHubSyncDB = GitHubSyncDB;

// Добавляем стили
const syncStyles = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
}

.hide-on-mobile {
    display: inline;
}

@media (max-width: 768px) {
    .hide-on-mobile {
        display: none;
    }
}

.sync-status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-left: 6px;
}

.sync-status-connected {
    background: var(--success);
}

.sync-status-disconnected {
    background: var(--error);
}
`;

const styleEl = document.createElement('style');
styleEl.textContent = syncStyles;
document.head.appendChild(styleEl);

console.log('✅ GitHub Sync DB system loaded');


// ==================== ИСПРАВЛЕННАЯ GITHUB СИНХРОНИЗАЦИЯ ====================
const GitHubSyncFixed = {
    // Настройки
    token: localStorage.getItem('github_token') || '',
    username: 'platonzhuman',
    isConnected: false,
    
    // Инициализация
    init() {
        console.log('🚀 GitHub Sync Fixed initialized');
        
        this.isConnected = !!this.token;
        
        // Добавляем кнопку
        setTimeout(() => this.addSyncButton(), 1000);
        
        return this;
    },
    
    // Показываем настройку
    showSetup() {
        const modalHTML = `
            <div class="modal">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2><i class="fab fa-github"></i> Настройка синхронизации</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Вставьте ваш GitHub токен:</strong></p>
                        
                        <div class="form-group">
                            <label class="form-label">GitHub Token</label>
                            <input type="password" id="githubTokenFixed" class="form-control" 
                                   placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                   value="${this.token || ''}">
                        </div>
                        
                        <div style="background: rgba(26, 35, 126, 0.1); padding: 12px; border-radius: 8px; margin-top: 16px;">
                            <strong>⚠️ Важно: токен должен иметь права "repo"</strong>
                            <ol style="margin: 8px 0 0 20px; font-size: 13px;">
                                <li>Откройте: <a href="https://github.com/settings/tokens/new" target="_blank">Создать токен</a></li>
                                <li>Выберите <strong>"Generate new token (classic)"</strong></li>
                                <li>Название: <code>Business Panel</code></li>
                                <li>Срок: <strong>No expiration</strong></li>
                                <li>Права: <strong>ТОЛЬКО "repo"</strong></li>
                                <li>Нажмите "Generate token"</li>
                                <li>Скопируйте токен (начинается с ghp_)</li>
                                <li>Вставьте в поле выше</li>
                            </ol>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="ModalService.close()">Отмена</button>
                        <button class="btn btn-primary" onclick="GitHubSyncFixed.saveToken()">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        ModalService.show(modalHTML);
    },
    
    // Сохраняем токен
    saveToken() {
        const token = document.getElementById('githubTokenFixed').value.trim();
        
        if (!token) {
            NotificationService.show('Введите токен', 'error');
            return;
        }
        
        if (!token.startsWith('ghp_')) {
            NotificationService.show('Токен должен начинаться с ghp_', 'error');
            return;
        }
        
        this.token = token;
        localStorage.setItem('github_token', token);
        this.isConnected = true;
        
        NotificationService.show('✅ Токен сохранен!', 'success');
        ModalService.close();
        
        // Обновляем кнопку
        this.updateSyncButton();
        
        // Тестируем соединение
        this.testConnection();
    },
    
    // Тест соединения
    async testConnection() {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                console.log('✅ GitHub connection OK');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Connection test error:', error);
            return false;
        }
    },
    
    // Добавляем кнопку синхронизации
    addSyncButton() {
        // Находим верхнюю панель
        const topBar = document.querySelector('.top-bar');
        if (!topBar) return;
        
        // Создаем или находим контейнер действий
        let actions = topBar.querySelector('.actions');
        if (!actions) {
            actions = document.createElement('div');
            actions.className = 'actions';
            actions.style.cssText = `
                display: flex;
                gap: 8px;
                align-items: center;
                margin-left: auto;
            `;
            topBar.appendChild(actions);
        }
        
        // Создаем кнопку
        const button = document.createElement('button');
        button.id = 'syncBtnFixed';
        button.className = 'btn btn-outline btn-sm';
        button.innerHTML = this.getButtonHTML();
        button.title = this.isConnected ? 'Сохранить в облако' : 'Настроить синхронизацию';
        button.onclick = () => this.isConnected ? this.saveToGitHub() : this.showSetup();
        
        actions.appendChild(button);
    },
    
    // Обновляем кнопку
    updateSyncButton() {
        const button = document.getElementById('syncBtnFixed');
        if (button) {
            button.innerHTML = this.getButtonHTML();
            button.title = this.isConnected ? 'Сохранить в облако' : 'Настроить синхронизацию';
            button.onclick = () => this.isConnected ? this.saveToGitHub() : this.showSetup();
        }
    },
    
    // HTML для кнопки
    getButtonHTML() {
        if (this.isConnected) {
            return `
                <i class="fas fa-cloud"></i>
                <span>Синхр</span>
                <span style="
                    width: 6px;
                    height: 6px;
                    background: var(--success);
                    border-radius: 50%;
                    display: inline-block;
                    margin-left: 4px;
                    vertical-align: middle;
                "></span>
            `;
        } else {
            return `
                <i class="fas fa-cloud"></i>
                <span>Настроить</span>
                <span style="
                    width: 6px;
                    height: 6px;
                    background: var(--error);
                    border-radius: 50%;
                    display: inline-block;
                    margin-left: 4px;
                    vertical-align: middle;
                "></span>
            `;
        }
    },
    
    // Сохранение в GitHub (ИСПРАВЛЕННАЯ ВЕРСИЯ)
    async saveToGitHub() {
        if (!this.isConnected || !this.token) {
            this.showSetup();
            return;
        }
        
        NotificationService.show('Сохранение...', 'info');
        
        try {
            // Подготавливаем данные
            const data = {
                businessData: BusinessDataService.data,
                savedAt: new Date().toISOString(),
                version: '2.0',
                savedBy: this.username
            };
            
            const content = JSON.stringify(data, null, 2);
            const encoded = btoa(unescape(encodeURIComponent(content)));
            
            // Шаг 1: Пробуем получить текущий файл
            let sha = null;
            try {
                const getResponse = await fetch(
                    'https://api.github.com/repos/platonzhuman/info-market-business/contents/business-data.json',
                    {
                        headers: {
                            'Authorization': `token ${this.token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );
                
                if (getResponse.ok) {
                    const fileData = await getResponse.json();
                    sha = fileData.sha;
                } else if (getResponse.status === 404) {
                    sha = null; // Файла нет, создадим новый
                } else {
                    throw new Error(`Failed to get file: ${getResponse.status}`);
                }
            } catch (error) {
                console.log('File not found or error:', error.message);
                sha = null;
            }
            
            // Шаг 2: Сохраняем файл
            const body = {
                message: `Autosave: ${new Date().toLocaleString('ru-RU')}`,
                content: encoded
            };
            
            // Добавляем SHA только если он есть
            if (sha) {
                body.sha = sha;
            }
            
            const response = await fetch(
                'https://api.github.com/repos/platonzhuman/info-market-business/contents/business-data.json',
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
            
            // Шаг 3: Обработка ответа
            if (response.status === 409) {
                // Конфликт - файл был изменен, пробуем получить актуальный SHA и повторить
                NotificationService.show('Конфликт, повторяем...', 'warning');
                
                // Получаем актуальный SHA
                const retryResponse = await fetch(
                    'https://api.github.com/repos/platonzhuman/info-market-business/contents/business-data.json',
                    {
                        headers: {
                            'Authorization': `token ${this.token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );
                
                if (retryResponse.ok) {
                    const fileData = await retryResponse.json();
                    body.sha = fileData.sha;
                    
                    // Пробуем снова с новым SHA
                    const retrySave = await fetch(
                        'https://api.github.com/repos/platonzhuman/info-market-business/contents/business-data.json',
                        {
                            method: 'PUT',
                            headers: {
                                'Authorization': `token ${this.token}`,
                                'Accept': 'application/vnd.github.v3+json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        }
                    );
                    
                    if (retrySave.ok) {
                        NotificationService.show('✅ Данные сохранены на GitHub', 'success');
                        console.log('💾 Saved to GitHub after retry');
                        return true;
                    }
                }
                
                throw new Error('Failed to save after conflict');
            }
            
            if (response.ok) {
                NotificationService.show('✅ Данные сохранены на GitHub', 'success');
                console.log('💾 Saved to GitHub');
                return true;
            } else {
                const errorText = await response.text();
                console.error('Save error response:', errorText);
                throw new Error(`Save failed: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Save error:', error);
            NotificationService.show('❌ Ошибка сохранения: ' + error.message, 'error');
            return false;
        }
    },
    
    // Просмотр файла на GitHub
    viewOnGitHub() {
        window.open('https://github.com/platonzhuman/info-market-business/blob/main/business-data.json', '_blank');
    },
    
    // Загрузка данных из GitHub
    async loadFromGitHub() {
        if (!this.isConnected) {
            NotificationService.show('Сначала настройте GitHub', 'warning');
            return;
        }
        
        try {
            const response = await fetch(
                'https://api.github.com/repos/platonzhuman/info-market-business/contents/business-data.json',
                {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            
            if (response.ok) {
                const fileData = await response.json();
                const content = atob(fileData.content);
                const data = JSON.parse(content);
                
                if (confirm('Загрузить данные из облака?\nТекущие данные будут заменены.')) {
                    // Сохраняем текущего пользователя
                    const currentUser = AuthService.currentUser;
                    
                    BusinessDataService.data = data.businessData;
                    BusinessDataService.save();
                    
                    // Восстанавливаем пользователя
                    if (currentUser && BusinessDataService.data.staff) {
                        const user = BusinessDataService.data.staff.find(s => 
                            s.id === currentUser.id || s.username === currentUser.username
                        );
                        if (user) {
                            AuthService.currentUser = user;
                            StorageService.set('user', user);
                        }
                    }
                    
                    NotificationService.show('✅ Данные загружены из облака', 'success');
                    window.location.reload();
                }
            } else if (response.status === 404) {
                NotificationService.show('Файл не найден в облаке', 'warning');
            } else {
                throw new Error(`Load failed: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Load error:', error);
            NotificationService.show('Ошибка загрузки: ' + error.message, 'error');
        }
    },
    
    // Добавляем секцию в меню
    addSyncSection() {
        setTimeout(() => {
            // Добавляем пункт меню
            const menuSection = document.querySelector('.menu-section:nth-child(2)');
            if (!menuSection) return;
            
            const menuItem = document.createElement('button');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = '<i class="fas fa-sync-alt"></i><span>Синхронизация</span>';
            
            menuItem.addEventListener('click', () => {
                // Убираем активность у других пунктов
                document.querySelectorAll('.menu-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Добавляем активность текущему
                menuItem.classList.add('active');
                
                // Показываем секцию синхронизации
                this.showSyncSection();
            });
            
            menuSection.appendChild(menuItem);
        }, 1000);
    },
    
    // Показываем секцию синхронизации
    showSyncSection() {
        const content = `
            <div class="content-header">
                <h1><i class="fas fa-sync-alt"></i> Синхронизация данных</h1>
                <div>
                    ${this.isConnected ? `
                        <button class="btn btn-primary" onclick="GitHubSyncFixed.saveToGitHub()">
                            <i class="fas fa-cloud-upload-alt"></i> Сохранить сейчас
                        </button>
                        <button class="btn btn-outline" onclick="GitHubSyncFixed.loadFromGitHub()">
                            <i class="fas fa-cloud-download-alt"></i> Загрузить из облака
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="GitHubSyncFixed.showSetup()">
                            <i class="fab fa-github"></i> Настроить синхронизацию
                        </button>
                    `}
                </div>
            </div>
            
            <div class="grid">
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-info-circle"></i> Статус</h2>
                    </div>
                    <div class="card-body">
                        <div class="info-list">
                            <div class="info-item">
                                <span class="info-label">Синхронизация:</span>
                                <span class="info-value ${this.isConnected ? 'status-success' : 'status-error'}">
                                    ${this.isConnected ? '✅ Настроена' : '❌ Не настроена'}
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Репозиторий:</span>
                                <span class="info-value">platonzhuman/info-market-business</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Файл данных:</span>
                                <span class="info-value">business-data.json</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Ваш ID:</span>
                                <span class="info-value">${this.username}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-cogs"></i> Управление</h2>
                    </div>
                    <div class="card-body">
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${this.isConnected ? `
                                <button class="btn btn-primary" onclick="GitHubSyncFixed.saveToGitHub()">
                                    <i class="fas fa-save"></i> Сохранить в облако сейчас
                                </button>
                                <button class="btn btn-outline" onclick="GitHubSyncFixed.loadFromGitHub()">
                                    <i class="fas fa-download"></i> Загрузить из облака
                                </button>
                                <button class="btn btn-outline" onclick="GitHubSyncFixed.viewOnGitHub()">
                                    <i class="fab fa-github"></i> Посмотреть данные на GitHub
                                </button>
                                <button class="btn btn-outline" onclick="GitHubSyncFixed.showSetup()">
                                    <i class="fas fa-edit"></i> Изменить настройки
                                </button>
                            ` : `
                                <div style="text-align: center; padding: 20px;">
                                    <div style="font-size: 48px; color: var(--text-light); margin-bottom: 16px;">
                                        <i class="fas fa-cloud"></i>
                                    </div>
                                    <h3 style="color: var(--text-light);">Синхронизация не настроена</h3>
                                    <p style="color: var(--text-light);">
                                        Настройте GitHub для автоматического сохранения данных между устройствами
                                    </p>
                                    <button class="btn btn-primary" onclick="GitHubSyncFixed.showSetup()">
                                        <i class="fab fa-github"></i> Настроить GitHub
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    }
};

// Инициализируем
GitHubSyncFixed.init();

// Добавляем секцию в меню
setTimeout(() => {
    GitHubSyncFixed.addSyncSection();
}, 1500);

// Включаем автосохранение
setTimeout(() => {
    if (GitHubSyncFixed.isConnected) {
        // Патчим сохранение для автосинхронизации
        const originalSave = BusinessDataService.save;
        BusinessDataService.save = function() {
            const result = originalSave.call(this);
            
            // Автосохранение в GitHub с задержкой 5 секунд
            setTimeout(() => {
                GitHubSyncFixed.saveToGitHub();
            }, 5000);
            
            return result;
        };
        
        console.log('🔁 Автосохранение включено');
    }
}, 2000);

// Добавляем в глобальную область
window.GitHubSyncFixed = GitHubSyncFixed;

console.log('✅ GitHub Sync Fixed loaded');