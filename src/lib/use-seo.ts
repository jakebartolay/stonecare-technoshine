import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "product";
}

function getAbsoluteUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element?.setAttribute(name, value);
  });

  return element;
}

export function useSeo({ title, description, image = "/icon.png", type = "website" }: SeoOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    const absoluteImage = getAbsoluteUrl(image);
    const url = window.location.href;
    const selectors = [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:type"]',
      'meta[property="og:url"]',
      'meta[property="og:image"]',
      'meta[name="twitter:card"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
    ];
    const previousMeta = selectors.map((selector) => {
      const element = document.head.querySelector<HTMLMetaElement>(selector);

      return {
        selector,
        existed: Boolean(element),
        content: element?.getAttribute("content") ?? "",
      };
    });

    document.title = title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: url,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: absoluteImage,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });

    return () => {
      document.title = previousTitle;
      previousMeta.forEach(({ selector, existed, content }) => {
        const element = document.head.querySelector<HTMLMetaElement>(selector);

        if (!element) {
          return;
        }

        if (!existed) {
          element.remove();
          return;
        }

        element.setAttribute("content", content);
      });
    };
  }, [description, image, title, type]);
}
