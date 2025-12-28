import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistance, formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Formatação de datas
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr, { locale: ptBR })
}

export function formatDateTime(date: Date | string): string {
    return formatDate(date, "dd/MM/yyyy 'às' HH:mm")
}

export function formatTimeAgo(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: ptBR })
}

export function formatRelativeDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatRelative(dateObj, new Date(), { locale: ptBR })
}

// Formatação de moeda
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

// Formatação de telefone
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')

    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }

    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    return phone
}

// Formatação de CPF
export function formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '')
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Validações
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function isValidCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '')

    if (cleaned.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleaned)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cleaned.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cleaned.charAt(10))) return false

    return true
}

export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10 || cleaned.length === 11
}

// Helpers de string
export function truncate(str: string, length: number): string {
    if (str.length <= length) return str
    return str.substring(0, length) + '...'
}

export function slugify(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeWords(str: string): string {
    return str.split(' ').map(capitalize).join(' ')
}

// Helpers de array
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const group = String(item[key])
        if (!result[group]) {
            result[group] = []
        }
        result[group].push(item)
        return result
    }, {} as Record<string, T[]>)
}

export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array))
}

// Helpers de número
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

// Helpers de objeto
export function pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key]
        }
    })
    return result
}

export function omit<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const result = { ...obj }
    keys.forEach(key => {
        delete result[key]
    })
    return result
}

// Helpers de imagem
export function getImageUrl(path: string | null | undefined): string {
    if (!path) return '/images/placeholder.png'
    if (path.startsWith('http')) return path
    return `/uploads/${path}`
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
}

// Helpers de status
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        ACTIVE: 'green',
        INACTIVE: 'gray',
        PENDING: 'yellow',
        CONFIRMED: 'blue',
        CANCELLED: 'red',
        PAID: 'green',
        OVERDUE: 'red',
        AVAILABLE: 'green',
        IN_USE: 'blue',
        MAINTENANCE: 'orange',
    }
    return colors[status] || 'gray'
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        ACTIVE: 'Ativo',
        INACTIVE: 'Inativo',
        PENDING: 'Pendente',
        CONFIRMED: 'Confirmado',
        CANCELLED: 'Cancelado',
        PAID: 'Pago',
        OVERDUE: 'Vencido',
        AVAILABLE: 'Disponível',
        IN_USE: 'Em Uso',
        MAINTENANCE: 'Manutenção',
        CHECKED_IN: 'Check-in Feito',
        CHECKED_OUT: 'Check-out Feito',
    }
    return labels[status] || status
}

// Sleep helper
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Debounce
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}
