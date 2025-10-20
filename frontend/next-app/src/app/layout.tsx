import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/**
 * Корневой layout приложения
 * 
 * Особенности:
 * - Определяет глобальные стили и шрифты для всего приложения
 * - Настраивает метаданные для SEO и социальных сетей
 * - Обеспечивает единообразный дизайн на всех страницах
 * - Интегрирует провайдеры для глобального состояния
 * - Использует современные Google Fonts (Geist Sans и Geist Mono)
 */

// Настройка основного шрифта Geist Sans
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Настройка моноширинного шрифта Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Метаданные для SEO и социальных сетей
export const metadata: Metadata = {
  title: "Frontend Dev Test Task",
  description: "Тестовое задание на позицию Frontend-разработчик - Менеджер товаров",
};

/**
 * Корневой компонент layout
 * 
 * @param children - Дочерние компоненты (страницы приложения)
 * @returns JSX элемент с HTML структурой и провайдерами
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Провайдеры для глобального состояния и контекста */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
