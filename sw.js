// Your Service Worker. You can use its instance with the keyword `self`
// Example: self.addEventListener(...)

const appShellCacheName = 'app-shell-v1';
const appShellFilesToCache = [
    // TODO: 2a - Declare files and URLs to cache at Service Worker installation
];

const appCaches = [
    appShellCacheName,
];

// TODO: 2b - On install, add app shell files to cache

// TODO: 2c - On activation, remove obsolete caches

// TODO: 2d - On intercepted fetch, use the strategy of your choice to respond to requests
