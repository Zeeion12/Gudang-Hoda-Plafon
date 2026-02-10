import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MdCalendarToday } from 'react-icons/md';
import { cn } from '@/lib/utils';

export interface DateRange {
    from: Date;
    to: Date;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Quick preset buttons
    const presets = [
        {
            label: 'Hari Ini',
            getValue: () => {
                const today = new Date();
                return { from: today, to: today };
            },
        },
        {
            label: '7 Hari Terakhir',
            getValue: () => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return { from: weekAgo, to: today };
            },
        },
        {
            label: '30 Hari Terakhir',
            getValue: () => {
                const today = new Date();
                const monthAgo = new Date(today);
                monthAgo.setDate(monthAgo.getDate() - 30);
                return { from: monthAgo, to: today };
            },
        },
        {
            label: 'Bulan Ini',
            getValue: () => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                return { from: firstDay, to: today };
            },
        },
    ];

    const handlePresetClick = (preset: typeof presets[0]) => {
        onChange(preset.getValue());
        setIsOpen(false);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-(--color-text-secondary)">
                Periode Tanggal
            </label>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !value && 'text-muted-foreground'
                        )}
                    >
                        <MdCalendarToday className="mr-2 h-4 w-4" />
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, 'dd MMM yyyy')} -{' '}
                                    {format(value.to, 'dd MMM yyyy')}
                                </>
                            ) : (
                                format(value.from, 'dd MMM yyyy')
                            )
                        ) : (
                            <span>Pilih rentang tanggal</span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <div className="flex">
                        {/* Preset Buttons */}
                        <div className="flex flex-col gap-1 border-r p-3">
                            <p className="text-xs font-medium text-(--color-text-muted) mb-2">
                                Preset
                            </p>
                            {presets.map((preset) => (
                                <Button
                                    key={preset.label}
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start text-xs"
                                    onClick={() => handlePresetClick(preset)}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>

                        {/* Calendar */}
                        <div className="p-3">
                            <Calendar
                                mode="range"
                                selected={{
                                    from: value?.from,
                                    to: value?.to,
                                }}
                                onSelect={(range) => {
                                    if (range?.from && range?.to) {
                                        onChange({ from: range.from, to: range.to });
                                    }
                                }}
                                numberOfMonths={2}
                                defaultMonth={value?.from}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}