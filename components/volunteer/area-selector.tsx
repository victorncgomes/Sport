'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { VOLUNTEER_AREAS, VolunteerArea } from '@/lib/config/volunteer-areas';
import { AnimatedCard } from '@/components/ui/animated-card';
import {
    Camera, ShoppingBag, Sparkles, Wrench, Dumbbell, MessageCircle,
    Check
} from 'lucide-react';

// Mapeamento de ícones
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Camera,
    ShoppingBag,
    Sparkles,
    Wrench,
    Dumbbell,
    MessageCircle,
};

interface AreaSelectorProps {
    selectedArea: string | null;
    onAreaSelect: (areaId: string) => void;
    showDescription?: boolean;
    compact?: boolean;
}

export function AreaSelector({
    selectedArea,
    onAreaSelect,
    showDescription = true,
    compact = false
}: AreaSelectorProps) {
    return (
        <div className={cn(
            "grid gap-3",
            compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}>
            {VOLUNTEER_AREAS.map(area => {
                const Icon = iconMap[area.icon] || Camera;
                const isSelected = selectedArea === area.id;

                return (
                    <button
                        key={area.id}
                        onClick={() => onAreaSelect(area.id)}
                        className="text-left"
                    >
                        <AnimatedCard
                            variant="glass"
                            className={cn(
                                "p-4 transition-all cursor-pointer",
                                isSelected
                                    ? `border-2 ${area.colorClass.replace('bg-', 'border-')} shadow-lg`
                                    : "hover:border-white/20"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                        area.colorClass
                                    )}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white text-sm truncate">
                                            {area.name}
                                        </h3>
                                        {isSelected && (
                                            <Check className="w-4 h-4 text-white flex-shrink-0" />
                                        )}
                                    </div>
                                    {showDescription && !compact && (
                                        <p className="text-xs text-white/50 mt-1 line-clamp-2">
                                            {area.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </AnimatedCard>
                    </button>
                );
            })}
        </div>
    );
}

interface AreaBadgeProps {
    areaId: string;
    size?: 'sm' | 'md' | 'lg';
    showName?: boolean;
}

export function AreaBadge({ areaId, size = 'md', showName = true }: AreaBadgeProps) {
    const area = VOLUNTEER_AREAS.find(a => a.id === areaId);
    if (!area) return null;

    const Icon = iconMap[area.icon] || Camera;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-2 text-sm'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full font-bold text-white",
                area.colorClass,
                sizeClasses[size]
            )}
        >
            <Icon className={iconSizes[size]} />
            {showName && area.name}
        </span>
    );
}
