import { useEffect } from "react";

// Content is already in its reading position before observation starts.
export default function useEditorialScenes(main, pathname) {
  useEffect(() => {
    const root = main.current;
    if (!root?.classList.contains("caderno") || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.dataset.printed = "true";
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -5% 0px" });
    function register(node) {
      if (!(node instanceof Element)) return;
      if (node.matches("[data-scene]")) observer.observe(node);
      node.querySelectorAll("[data-scene]").forEach(el => observer.observe(el));
    }
    register(root);
    const changes = new MutationObserver(records => {
      for (const record of records) record.addedNodes.forEach(register);
    });
    changes.observe(root, { childList: true, subtree: true });
    return () => { observer.disconnect(); changes.disconnect(); };
  }, [main, pathname]);
}
