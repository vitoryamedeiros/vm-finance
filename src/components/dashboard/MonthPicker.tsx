"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function MonthPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentMonth = Number(searchParams.get('month')) || new Date().getMonth() + 1;
  const currentYear = Number(searchParams.get('year')) || new Date().getFullYear();

  const handleMonthChange = (direction: number) => {
    let nextMonth = currentMonth + direction;
    let nextYear = currentYear;

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    } else if (nextMonth < 1) {
      nextMonth = 12;
      nextYear--;
    }

    router.push(`/dashboard?month=${nextMonth}&year=${nextYear}`);
  };

  return (
    <div className="flex items-center gap-3 bg-white border-4 border-black p-1 inline-flex shadow-[6px_6px_0_0_#000] rounded-none shrink-0 min-w-fit">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleMonthChange(-1)}
        className="text-black hover:bg-black/5 transition-all rounded-none h-10 w-10 border-r-2 border-black/5"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <div className="px-6 py-2 text-center">
        <span className="font-heading uppercase tracking-widest text-sm text-[#D81176] font-black whitespace-nowrap">
          {MONTHS[currentMonth - 1]} {currentYear}
        </span>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleMonthChange(1)}
        className="text-black hover:bg-black/5 transition-all rounded-none h-10 w-10 border-l-2 border-black/5"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
