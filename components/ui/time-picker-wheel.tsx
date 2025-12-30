'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimePickerWheelProps {
    value: string;
    onChange: (time: string) => void;
    minHour?: number;
    maxHour?: number;
    minuteStep?: number;
}

export function TimePickerWheel({
    value,
    onChange,
    minHour = 5,
    maxHour = 20,
    minuteStep = 5
}: TimePickerWheelProps) {
    const [selectedHour, setSelectedHour] = useState(() => {
        if (value) {
            const [h] = value.split(':').map(Number);
            return h;
        }
        return minHour + 1;
    });

    const [selectedMinute, setSelectedMinute] = useState(() => {
        if (value) {
            const [, m] = value.split(':').map(Number);
            return m;
        }
        return 0;
    });

    const hours = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i);
    const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);

    useEffect(() => {
        const timeStr = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
        onChange(timeStr);
    }, [selectedHour, selectedMinute, onChange]);

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {/* Hora */}
            <WheelColumn
                items={hours}
                selectedValue={selectedHour}
                onSelect={setSelectedHour}
                formatItem={(h) => h.toString().padStart(2, '0')}
            />

            {/* Separador */}
            <div className="text-4xl font-bold text-white/60">:</div>

            {/* Minutos */}
            <WheelColumn
                items={minutes}
                selectedValue={selectedMinute}
                onSelect={setSelectedMinute}
                formatItem={(m) => m.toString().padStart(2, '0')}
            />
        </div>
    );
}

interface WheelColumnProps {
    items: number[];
    selectedValue: number;
    onSelect: (value: number) => void;
    formatItem: (value: number) => string;
}

function WheelColumn({ items, selectedValue, onSelect, formatItem }: WheelColumnProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemHeight = 48;
    const visibleItems = 5; // Quantos itens são visíveis
    const centerOffset = Math.floor(visibleItems / 2);

    const selectedIndex = items.indexOf(selectedValue);

    useEffect(() => {
        if (containerRef.current && selectedIndex >= 0) {
            const scrollY = selectedIndex * itemHeight;
            containerRef.current.scrollTo({ top: scrollY, behavior: 'smooth' });
        }
    }, [selectedIndex]);

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollY = containerRef.current.scrollTop;
            const index = Math.round(scrollY / itemHeight);
            const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
            if (items[clampedIndex] !== selectedValue) {
                onSelect(items[clampedIndex]);
            }
        }
    };

    const handleItemClick = (value: number) => {
        onSelect(value);
    };

    return (
        <div className="relative">
            {/* Highlight central */}
            <div
                className="absolute left-0 right-0 pointer-events-none z-10"
                style={{
                    top: `${centerOffset * itemHeight}px`,
                    height: `${itemHeight}px`
                }}
            >
                <div className="h-full bg-white/10 rounded-lg border-y border-white/20" />
            </div>

            {/* Gradientes de fade */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />

            {/* Container scrollável */}
            <div
                ref={containerRef}
                className="overflow-y-auto scrollbar-hide"
                style={{
                    height: `${visibleItems * itemHeight}px`,
                    scrollSnapType: 'y mandatory'
                }}
                onScroll={handleScroll}
            >
                {/* Padding superior para centralizar */}
                <div style={{ height: `${centerOffset * itemHeight}px` }} />

                {items.map((item) => {
                    const isSelected = item === selectedValue;
                    return (
                        <motion.button
                            key={item}
                            onClick={() => handleItemClick(item)}
                            className={`
                                w-20 flex items-center justify-center font-mono text-3xl
                                transition-all duration-200
                                ${isSelected
                                    ? 'text-white font-bold scale-110'
                                    : 'text-white/30 hover:text-white/50'}
                            `}
                            style={{
                                height: `${itemHeight}px`,
                                scrollSnapAlign: 'center'
                            }}
                        >
                            {formatItem(item)}
                        </motion.button>
                    );
                })}

                {/* Padding inferior para centralizar */}
                <div style={{ height: `${centerOffset * itemHeight}px` }} />
            </div>
        </div>
    );
}
