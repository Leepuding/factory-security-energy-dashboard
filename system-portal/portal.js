const host = window.location.hostname || "1.13.195.57";

const targets = {
  cockpit: `http://${host}:28080/`,
  document: `http://${host}:28080/document-analysis.html`,
};

document.querySelectorAll("[data-service]").forEach((link) => {
  const target = targets[link.dataset.service];
  if (target) link.href = target;
});
