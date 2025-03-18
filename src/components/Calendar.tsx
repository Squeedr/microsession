import React from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

interface CalendarProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function Calendar({ selectedDate, onDateChange }: CalendarProps) {
  const [month, setMonth] = React.useState(new Date());

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMonth(subMonths(month, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">{format(month, 'MMMM yyyy')}</span>
          <button
            onClick={() => setMonth(addMonths(month, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateChange}
        month={month}
        onMonthChange={setMonth}
        className="border-0"
        modifiersStyles={{
          selected: {
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '0.75rem'
          },
          today: {
            backgroundColor: '#eff6ff',
            borderRadius: '0.75rem'
          }
        }}
        styles={{
          caption: { display: 'none' },
          head_cell: { color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 },
          cell: { width: '40px', height: '40px' },
          day: {
            margin: '2px',
            borderRadius: '0.75rem',
            width: '36px',
            height: '36px',
            fontSize: '0.875rem',
            transition: 'all 200ms'
          }
        }}
      />
    </div>
  );
}