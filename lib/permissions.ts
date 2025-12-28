export enum Role {
    VISITOR = 'VISITOR',
    MEMBER = 'MEMBER',
    COACH = 'COACH',
    ADMIN = 'ADMIN',
}

export type Permission =
    | 'view_public_content'
    | 'view_member_content'
    | 'manage_reservations'
    | 'manage_trainings'
    | 'manage_payments'
    | 'manage_users'
    | 'manage_boats'
    | 'manage_content'
    | 'manage_elections'
    | 'view_analytics'

const rolePermissions: Record<Role, Permission[]> = {
    [Role.VISITOR]: [
        'view_public_content',
    ],
    [Role.MEMBER]: [
        'view_public_content',
        'view_member_content',
        'manage_reservations',
    ],
    [Role.COACH]: [
        'view_public_content',
        'view_member_content',
        'manage_reservations',
        'manage_trainings',
    ],
    [Role.ADMIN]: [
        'view_public_content',
        'view_member_content',
        'manage_reservations',
        'manage_trainings',
        'manage_payments',
        'manage_users',
        'manage_boats',
        'manage_content',
        'manage_elections',
        'view_analytics',
    ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => hasPermission(role, permission))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => hasPermission(role, permission))
}

export function canAccessRoute(role: Role, route: string): boolean {
    // Rotas públicas
    if (route.startsWith('/') && !route.startsWith('/dashboard') && !route.startsWith('/admin') && !route.startsWith('/coach')) {
        return true
    }

    // Rotas de dashboard (membros)
    if (route.startsWith('/dashboard')) {
        return [Role.MEMBER, Role.COACH, Role.ADMIN].includes(role)
    }

    // Rotas de treinador
    if (route.startsWith('/coach')) {
        return [Role.COACH, Role.ADMIN].includes(role)
    }

    // Rotas de admin
    if (route.startsWith('/admin')) {
        return role === Role.ADMIN
    }

    return false
}
