import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  favicon?: string;
}

export const PageMeta = ({ title, favicon }: PageMetaProps) => {
  useEffect(() => {
    document.title = title;
    if (favicon) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = favicon;
      }
    }
  }, [title, favicon]);

  return null; 
};