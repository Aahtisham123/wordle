export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem("wordle-unlimited-theme");var dark=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var root=document.documentElement;root.classList.toggle("dark",dark);root.style.colorScheme=dark?"dark":"light";var raw=localStorage.getItem("wordle-unlimited-preferences");if(raw){var prefs=JSON.parse(raw);if(prefs.highContrast)root.dataset.contrast="high";if(prefs.colorblind)root.dataset.colorblind="true";if(prefs.animation==="off")root.dataset.motion="reduce";}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
