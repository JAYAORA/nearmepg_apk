import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);


  export const injectPdfCssFix = () => {
  const style = document.createElement("style");
  style.id = "pdf-css-fix";

  style.innerHTML = `
    :root {
      --background: #ffffff !important;
      --foreground: #0f172a !important;
      --card: #ffffff !important;
      --card-foreground: #0f172a !important;
      --popover: #ffffff !important;
      --popover-foreground: #0f172a !important;
      --primary: #111827 !important;
      --primary-foreground: #ffffff !important;
      --secondary: #f3f4f6 !important;
      --secondary-foreground: #111827 !important;
      --muted: #f3f4f6 !important;
      --muted-foreground: #6b7280 !important;
      --accent: #f3f4f6 !important;
      --accent-foreground: #111827 !important;
      --border: #e5e7eb !important;
      --input: #e5e7eb !important;
      --ring: #9ca3af !important;
    }
  `;

  document.head.appendChild(style);
};

export const removePdfCssFix = () => {
  document.getElementById("pdf-css-fix")?.remove();
};