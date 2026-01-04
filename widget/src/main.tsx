import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import styles from './index.css?inline' // Vite feature to get CSS as string

const WIDGET_ID = 'chatbot-widget-root';

function injectWidget() {
    // Check if already injected
    if (document.getElementById(WIDGET_ID)) return;

    // Create host element
    const host = document.createElement('div');
    host.id = WIDGET_ID;
    document.body.appendChild(host);

    // Attach Shadow DOM
    const shadow = host.attachShadow({ mode: 'open' });

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    shadow.appendChild(styleSheet);

    // Mount React
    const mountPoint = document.createElement('div');
    shadow.appendChild(mountPoint);

    ReactDOM.createRoot(mountPoint).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
}

// Auto-inject when script loads
if (typeof window !== 'undefined') {
    injectWidget();
}
