// Script para corrigir imports do Prisma
// Este arquivo lista todos os arquivos que precisam ser corrigidos

const filesToFix = [
    'app/api/workouts/[id]/gps-points/route.ts',
    'app/api/workouts/[id]/complete/route.ts',
    'app/api/workouts/templates/route.ts',
    'app/api/workouts/start/route.ts',
    'app/api/workouts/history/route.ts',
    'app/api/workouts/analytics/route.ts',
    'app/api/waitlist/route.ts',
    'app/api/volunteer/tasks/[id]/submit/route.ts',
    'app/api/volunteer/tasks/[id]/review/route.ts',
    'app/api/volunteer/tasks/[id]/accept/route.ts',
    'app/api/tides/upload/route.ts',
    'app/api/resources/route.ts',
    'app/api/reservations/[id]/check-out/route.ts',
    'app/api/reservations/[id]/check-in/route.ts',
    'app/api/reservations/route.ts',
    'app/api/profile/anamnese/route.ts',
    'app/api/maintenance/tickets/route.ts',
    'app/api/gamification/user-stats/[userId]/route.ts',
    'app/api/gamification/unlock-badge/route.ts',
    'app/api/gamification/leaderboard/route.ts',
    'app/api/gamification/badges/route.ts',
    'app/api/gamification/award-points/route.ts',
    'app/api/coach/pending-reservations/route.ts',
    'app/api/coach/reservations/[id]/approve/route.ts',
    'app/api/coach/reservations/[id]/reject/route.ts',
];

// Substituir:
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
//
// Por:
// import { prisma } from '@/lib/db';
