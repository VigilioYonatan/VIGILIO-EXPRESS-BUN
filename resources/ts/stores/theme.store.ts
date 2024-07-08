import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

type ThemeMode = "light" | "dark" | "default";
function getThemeLocalStorage() {
    let themeMode: ThemeMode = "default";
    if (localStorage.getItem("theme")) {
        themeMode = localStorage.getItem("theme") as ThemeMode;
    }

    return themeMode;
}
export function useThemeStore() {
    const theme = useSignal(getThemeLocalStorage());
    function changeTheme(them: ThemeMode) {
        theme.value = them;
    }
    function changeThemeMode(them: ThemeMode) {
        if (them === theme.value) return;
        if (them === "default") {
            localStorage.removeItem("theme");
            changeTheme(them);
            return;
        }
        localStorage.setItem("theme", them);
        changeTheme(them);
    }
    function lightModeElement() {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
    }
    function darkModeElement() {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
    }

    useEffect(() => {
        if (theme.value === "light") {
            lightModeElement();
            return;
        }

        if (theme.value === "default") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                darkModeElement();
                return;
            }
            lightModeElement();
            return;
        }
        darkModeElement();
    }, [theme.value]);

    return {
        state: theme.value,
        methods: {
            changeThemeMode,
        },
    };
}

export default useThemeStore;
