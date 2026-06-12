import { Component, OnInit } from '@angular/core';

interface Habit {
  id: number;
  name: string;
  emoji: string;
  completedDays: number[];
}

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.css']
})
export class HabitTrackerComponent implements OnInit {

  challengeName = 'Reto de Verano';
  startDate = new Date(2026, 5, 1);
  today = new Date();
  currentDay: number;
  totalDays = 100;
  currentMonth: number;
  currentYear: number;
  daysInMonth: number[];

  habits: Habit[] = [
    { id: 1, name: 'Despertar temprano',  emoji: '🌅', completedDays: [] },
    { id: 2, name: 'Ejercicio (1 hora)',   emoji: '💪', completedDays: [] },
    { id: 3, name: 'Trabajo profundo',     emoji: '🧠', completedDays: [] },
    { id: 4, name: 'Leer 20 páginas',      emoji: '📖', completedDays: [] },
    { id: 5, name: 'No procrastinar',      emoji: '🚫', completedDays: [] },
    { id: 6, name: 'Meditar 20 min',       emoji: '🧘', completedDays: [] },
    { id: 7, name: 'Hacer journaling',     emoji: '✍️', completedDays: [] },
    { id: 8, name: 'Comer saludable',      emoji: '🍎', completedDays: [] },
    { id: 9, name: 'Crear contenido',      emoji: '📱', completedDays: [] },
  ];

  newHabitName = '';
  newHabitEmoji = '⭐';
  showAddForm = false;

  constructor() {
    this.currentDay = this.getDayOfChallenge();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.daysInMonth = this.getDaysArray();
  }

  ngOnInit(): void {
    this.loadFromStorage();
  }

  getDayOfChallenge(): number {
    const diff = this.today.getTime() - this.startDate.getTime();
    const day = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(day, this.totalDays));
  }

  getDaysArray(): number[] {
    const count = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  isCompletedToday(habit: Habit): boolean {
    return habit.completedDays.includes(this.today.getDate());
  }

  isCompletedOnDay(habit: Habit, day: number): boolean {
    return habit.completedDays.includes(day);
  }

  isFutureDay(day: number): boolean {
    return day > this.today.getDate();
  }

  toggleHabit(habit: Habit): void {
    const todayDate = this.today.getDate();
    const idx = habit.completedDays.indexOf(todayDate);
    if (idx > -1) {
      habit.completedDays.splice(idx, 1);
    } else {
      habit.completedDays.push(todayDate);
    }
    this.saveToStorage();
  }

  toggleDayCell(habit: Habit, day: number): void {
    if (this.isFutureDay(day)) return;
    const idx = habit.completedDays.indexOf(day);
    if (idx > -1) {
      habit.completedDays.splice(idx, 1);
    } else {
      habit.completedDays.push(day);
    }
    this.saveToStorage();
  }

  getTodayProgress(): number {
    if (!this.habits.length) return 0;
    const done = this.habits.filter(h => this.isCompletedToday(h)).length;
    return Math.round((done / this.habits.length) * 100);
  }

  getCompletedTodayCount(): number {
    return this.habits.filter(h => this.isCompletedToday(h)).length;
  }

  getChallengeProgress(): number {
    return Math.round((this.currentDay / this.totalDays) * 100);
  }

  getMonthCompletionRate(day: number): number {
    if (!this.habits.length) return 0;
    const done = this.habits.filter(h => h.completedDays.includes(day)).length;
    return Math.round((done / this.habits.length) * 100);
  }

  addHabit(): void {
    if (!this.newHabitName.trim()) return;
    this.habits.push({
      id: Date.now(),
      name: this.newHabitName.trim(),
      emoji: this.newHabitEmoji || '⭐',
      completedDays: []
    });
    this.newHabitName = '';
    this.newHabitEmoji = '⭐';
    this.showAddForm = false;
    this.saveToStorage();
  }

  removeHabit(id: number): void {
    this.habits = this.habits.filter(h => h.id !== id);
    this.saveToStorage();
  }

  saveToStorage(): void {
    localStorage.setItem('habitTracker_v1', JSON.stringify({
      habits: this.habits,
      challengeName: this.challengeName,
      startDate: this.startDate.toISOString()
    }));
  }

  loadFromStorage(): void {
    try {
      const raw = localStorage.getItem('habitTracker_v1');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.habits) this.habits = data.habits;
      if (data.challengeName) this.challengeName = data.challengeName;
      if (data.startDate) {
        this.startDate = new Date(data.startDate);
        this.currentDay = this.getDayOfChallenge();
      }
    } catch (_) {}
  }

  getFormattedDate(): string {
    return this.today.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getMonthName(): string {
    return this.today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }
}
