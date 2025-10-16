// ==UserScript==
// @name         Telegram Web - Enhanced Media Downloader & Forward (Improved)
// @namespace    Mr.Soe
// @license      MIT
// @version      3.0
// @description  Bypass Telegram's saving content restrictions; download media with buttons, right-click, shortcuts, batch download, and more enhanced features
// @author       Mr.Soe
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/477900/Telegram%20Web%20-%20Enhanced%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/477900/Telegram%20Web%20-%20Enhanced%20Media%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Redirect to WebK version if on WebA
    if (window.location.pathname.startsWith('/a/')) {
        window.location.replace(window.location.href.replace('.org/a/', '.org/k/'));
        return;
    }

    // Enhanced configuration
    const config = {
        downloadDelay: 1000,        // Delay between downloads (ms)
        maxRetries: 3,              // Max retries for failed downloads
        notificationTimeout: 5000,  // Notification display time
        enableNotifications: true,   // Enable browser notifications
        enableProgress: true,       // Show download progress
        enableRightClick: true,     // Enable right-click context menu
        enableKeyboardShortcut: true, // Enable keyboard shortcut (D key)
        enableAutoClose: true,      // Auto-close media viewer after download
        autoCloseDelay: 1000,       // Delay before closing media viewer
        chunkSize: 1024 * 1024,     // 1MB chunks for downloading
        progressColor: '#4caf50',
        progressErrorColor: '#D16666',
        progressCompleteColor: '#2196f3',
        enableOverlay: false,       // Disable overlay on selected media
        enableDownloadHistory: true, // Enable download history
        enableMediaPreview: true,   // Enable media preview
        enableCloudSync: false,     // Enable cloud sync (future feature)
        maxConcurrentDownloads: 3,  // Max concurrent downloads
        enableMetadataDisplay: true // Show media metadata
    };

    // Global variables
    let downloadQueue = [];
    let activeDownloads = new Set();
    let isDownloading = false;
    let downloadCancelled = false;
    let totalFiles = 0;
    let downloadedFiles = 0;
    let hoveredElement = null;
    let downloadHistory = GM_getValue('downloadHistory', []);
    let selectedMediaForBatch = [];
    let mediaPreviewContainer = null;

    // Logger
    const logger = {
        info: (message, fileName = null) => {
            console.log(`[Telegram Media Downloader] ${fileName ? `${fileName}: ` : ""}${message}`);
        },
        error: (message, fileName = null) => {
            console.error(`[Telegram Media Downloader] ${fileName ? `${fileName}: ` : ""}${message}`);
        },
        debug: (message, fileName = null) => {
            if (config.debug) {
                console.log(`[Telegram Media Downloader DEBUG] ${fileName ? `${fileName}: ` : ""}${message}`);
            }
        }
    };

    // Save download history
    function saveDownloadHistory() {
        if (config.enableDownloadHistory) {
            // Keep only last 100 entries
            if (downloadHistory.length > 100) {
                downloadHistory = downloadHistory.slice(-100);
            }
            GM_setValue('downloadHistory', downloadHistory);
        }
    }

    // Add to download history
    function addToDownloadHistory(fileName, url, size, type) {
        if (config.enableDownloadHistory) {
            downloadHistory.push({
                fileName,
                url,
                size,
                type,
                timestamp: new Date().toISOString()
            });
            saveDownloadHistory();
        }
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Get media metadata
    async function getMediaMetadata(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentLength = response.headers.get('Content-Length');
            const contentType = response.headers.get('Content-Type');
            const lastModified = response.headers.get('Last-Modified');

            return {
                size: contentLength ? parseInt(contentLength, 10) : null,
                type: contentType || 'unknown',
                lastModified: lastModified ? new Date(lastModified) : null
            };
        } catch (error) {
            logger.error(`Failed to get metadata: ${error.message}`);
            return null;
        }
    }

    // Add CSS styles
    GM_addStyle(`
        .no-forwards .bubbles, .bubble, .bubble-content {
            -webkit-user-select: text!important;
            -moz-user-select: text!important;
            user-select: text!important;
        }
        .download-progress {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 9999;
            display: none;
            min-width: 250px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .download-progress h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .download-progress-bar {
            width: 100%;
            height: 10px;
            background: #333;
            border-radius: 5px;
            margin-top: 8px;
            overflow: hidden;
        }
        .download-progress-fill {
            height: 100%;
            background: ${config.progressColor};
            width: 0%;
            transition: width 0.3s ease;
        }
        .download-progress-text {
            margin-top: 8px;
            font-size: 14px;
        }
        .cancel-download-btn {
            margin-top: 10px;
            background-color: #f44336;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .cancel-download-btn:hover {
            background-color: #d32f2f;
        }
        .media-item {
            position: relative;
        }
        .media-item .download-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
            cursor: pointer;
            border-radius: 8px;
        }
        /* PERUBAHAN: Hanya menampilkan overlay jika diaktifkan di config */
        ${config.enableOverlay ? '.media-item:hover .download-overlay { opacity: 1; }' : ''}
        .download-overlay .download-icon {
            color: white;
            font-size: 24px;
            background: rgba(0,0,0,0.7);
            padding: 8px;
            border-radius: 50%;
        }
        .media-downloader-img-btn, .media-downloader-media-btn {
            position: absolute;
            left: 5px;
            bottom: 5px;
            z-index: 9999;
            padding: 4px 6px;
            background: rgba(0,0,0,0.7);
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        }
        .media-downloader-img-btn:hover, .media-downloader-media-btn:hover {
            background: rgba(0,0,0,0.9);
        }
        .media-downloader-context-menu {
            position: fixed;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 13px;
            cursor: pointer;
            z-index: 999999;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .media-downloader-progress {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 4px;
            width: 0%;
            background: ${config.progressColor};
            z-index: 99999;
            transition: width 0.2s linear;
            display: none;
        }
        .media-downloader-tg-btn {
            margin-left: 5px;
        }
        /* Forward dialog styles */
        .forward-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--background-color, #fff);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            width: 400px;
            max-width: 90%;
            max-height: 70vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .forward-dialog-header {
            padding: 15px;
            border-bottom: 1px solid var(--border-color, #eee);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .forward-dialog-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
        }
        .forward-dialog-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-color, #333);
        }
        .forward-dialog-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }
        .forward-dialog-search {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--border-color, #ddd);
            border-radius: 4px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }
        .forward-dialog-chats {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .forward-dialog-chat {
            display: flex;
            align-items: center;
            padding: 10px;
            cursor: pointer;
            border-radius: 4px;
        }
        .forward-dialog-chat:hover {
            background-color: var(--hover-color, #f5f5f5);
        }
        .forward-dialog-chat-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
            background-color: var(--avatar-bg, #ddd);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .forward-dialog-chat-info {
            flex: 1;
        }
        .forward-dialog-chat-name {
            font-weight: 500;
            margin-bottom: 2px;
        }
        .forward-dialog-chat-status {
            font-size: 12px;
            color: var(--secondary-text-color, #999);
        }
        .forward-dialog-footer {
            padding: 10px 15px;
            border-top: 1px solid var(--border-color, #eee);
            display: flex;
            justify-content: flex-end;
        }
        .forward-dialog-button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        }
        .forward-dialog-cancel {
            background-color: var(--secondary-bg, #f0f0f0);
            color: var(--text-color, #333);
        }
        .forward-dialog-send {
            background-color: var(--primary-color, #3390ec);
            color: white;
        }
        .forward-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999;
        }
        /* Enhanced context menu styles */
        .enhanced-context-menu {
            position: fixed;
            background: var(--background-color, #fff);
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            padding: 4px 0;
            min-width: 180px;
            display: none;
        }
        .enhanced-context-menu-item {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            cursor: pointer;
            transition: background-color 0.2s;
            color: var(--text-color, #333);
        }
        .enhanced-context-menu-item:hover {
            background-color: var(--hover-color, #f5f5f5);
        }
        .enhanced-context-menu-item-icon {
            margin-right: 12px;
            font-size: 16px;
            width: 20px;
            text-align: center;
        }
        .enhanced-context-menu-item-text {
            font-size: 14px;
        }
        .enhanced-context-menu-divider {
            height: 1px;
            background-color: var(--border-color, #e0e0e0);
            margin: 4px 0;
        }
        /* Media preview styles */
        .media-preview-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.8);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        }
        .media-preview-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
        }
        .media-preview-image {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 8px;
        }
        .media-preview-video {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 8px;
        }
        .media-preview-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .media-preview-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 0 0 8px 8px;
        }
        .media-preview-actions {
            position: absolute;
            top: 10px;
            left: 10px;
            display: flex;
            gap: 10px;
        }
        .media-preview-action-btn {
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
        }
        .media-preview-action-btn:hover {
            background: rgba(0,0,0,0.9);
        }
        /* Download history styles */
        .download-history-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--background-color, #fff);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            width: 600px;
            max-width: 90%;
            max-height: 70vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }
        .download-history-header {
            padding: 15px;
            border-bottom: 1px solid var(--border-color, #eee);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .download-history-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
        }
        .download-history-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-color, #333);
        }
        .download-history-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }
        .download-history-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid var(--border-color, #eee);
        }
        .download-history-item:last-child {
            border-bottom: none;
        }
        .download-history-item-icon {
            margin-right: 10px;
            font-size: 20px;
        }
        .download-history-item-info {
            flex: 1;
        }
        .download-history-item-name {
            font-weight: 500;
            margin-bottom: 2px;
        }
        .download-history-item-details {
            font-size: 12px;
            color: var(--secondary-text-color, #999);
        }
        .download-history-item-actions {
            display: flex;
            gap: 5px;
        }
        .download-history-item-action {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--primary-color, #3390ec);
            font-size: 14px;
        }
        .download-history-empty {
            text-align: center;
            padding: 20px;
            color: var(--secondary-text-color, #999);
        }
        /* Settings dialog styles */
        .settings-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--background-color, #fff);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            width: 500px;
            max-width: 90%;
            max-height: 70vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }
        .settings-header {
            padding: 15px;
            border-bottom: 1px solid var(--border-color, #eee);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .settings-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
        }
        .settings-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-color, #333);
        }
        .settings-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }
        .settings-section {
            margin-bottom: 20px;
        }
        .settings-section-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text-color, #333);
        }
        .settings-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .settings-label {
            font-size: 14px;
            color: var(--text-color, #333);
        }
        .settings-control {
            display: flex;
            align-items: center;
        }
        .settings-checkbox {
            margin-right: 5px;
        }
        .settings-input {
            width: 80px;
            padding: 5px;
            border: 1px solid var(--border-color, #ddd);
            border-radius: 4px;
        }
        .settings-footer {
            padding: 10px 15px;
            border-top: 1px solid var(--border-color, #eee);
            display: flex;
            justify-content: flex-end;
        }
        .settings-button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        }
        .settings-cancel {
            background-color: var(--secondary-bg, #f0f0f0);
            color: var(--text-color, #333);
        }
        .settings-save {
            background-color: var(--primary-color, #3390ec);
            color: white;
        }
        /* Batch selection styles */
        .batch-selection-indicator {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0,0,0,0.7);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            z-index: 9999;
            cursor: pointer;
        }
        .batch-selection-indicator.selected {
            background: var(--primary-color, #3390ec);
        }
        .batch-selection-toolbar {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            z-index: 9999;
            display: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .batch-selection-toolbar button {
            background: none;
            border: none;
            color: white;
            margin: 0 5px;
            cursor: pointer;
            font-size: 14px;
        }
        .batch-selection-toolbar button:hover {
            text-decoration: underline;
        }
    `);

    // Create progress element for batch downloads
    const progressElement = document.createElement('div');
    progressElement.className = 'download-progress';
    progressElement.innerHTML = `
        <h3>Downloading Media</h3>
        <div class="download-progress-bar">
            <div class="download-progress-fill"></div>
        </div>
        <div class="download-progress-text">Preparing downloads...</div>
        <button class="cancel-download-btn">Cancel</button>
    `;
    document.body.appendChild(progressElement);

    // Cancel download functionality
    progressElement.querySelector('.cancel-download-btn').addEventListener('click', () => {
        downloadCancelled = true;
        activeDownloads.clear();
        updateProgress('Download cancelled', 0);
        setTimeout(() => {
            progressElement.style.display = 'none';
        }, 2000);
    });

    // Create media preview container
    function createMediaPreviewContainer() {
        if (mediaPreviewContainer) return mediaPreviewContainer;

        mediaPreviewContainer = document.createElement('div');
        mediaPreviewContainer.className = 'media-preview-container';

        const content = document.createElement('div');
        content.className = 'media-preview-content';

        const closeButton = document.createElement('button');
        closeButton.className = 'media-preview-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            mediaPreviewContainer.style.display = 'none';
        });

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'media-preview-actions';

        const downloadButton = document.createElement('button');
        downloadButton.className = 'media-preview-action-btn';
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', () => {
            const mediaElement = content.querySelector('.media-preview-image, .media-preview-video');
            if (mediaElement) {
                const { src, ext } = resolveMediaSource(mediaElement);
                if (src) {
                    const fileName = `media_${Date.now()}.${ext}`;
                    if (src.includes('telegram')) {
                        downloadTelegramMedia(src, ext === 'mp3' ? 'audio' : ext === 'jpg' ? 'image' : 'video', mediaElement);
                    } else {
                        downloadMedia(src, fileName, null, mediaElement);
                    }
                }
            }
        });

        const infoContainer = document.createElement('div');
        infoContainer.className = 'media-preview-info';

        actionsContainer.appendChild(downloadButton);
        content.appendChild(closeButton);
        content.appendChild(actionsContainer);
        content.appendChild(infoContainer);
        mediaPreviewContainer.appendChild(content);
        document.body.appendChild(mediaPreviewContainer);

        return mediaPreviewContainer;
    }

    // Show media preview
    async function showMediaPreview(mediaEl) {
        if (!config.enableMediaPreview) return;

        const container = createMediaPreviewContainer();
        const content = container.querySelector('.media-preview-content');
        const infoContainer = content.querySelector('.media-preview-info');

        // Clear previous content
        const mediaElement = content.querySelector('.media-preview-image, .media-preview-video');
        if (mediaElement) {
            mediaElement.remove();
        }

        // Get media source
        const { src, ext } = resolveMediaSource(mediaEl);
        if (!src) return;

        // Create appropriate media element
        let newMediaElement;
        if (mediaEl.tagName === 'IMG') {
            newMediaElement = document.createElement('img');
            newMediaElement.className = 'media-preview-image';
            newMediaElement.src = src;
        } else if (mediaEl.tagName === 'VIDEO') {
            newMediaElement = document.createElement('video');
            newMediaElement.className = 'media-preview-video';
            newMediaElement.src = src;
            newMediaElement.controls = true;
        }

        if (newMediaElement) {
            content.insertBefore(newMediaElement, infoContainer);

            // Get and display metadata
            if (config.enableMetadataDisplay) {
                const metadata = await getMediaMetadata(src);
                if (metadata) {
                    infoContainer.innerHTML = `
                        <div>File type: ${metadata.type}</div>
                        ${metadata.size ? `<div>Size: ${formatFileSize(metadata.size)}</div>` : ''}
                        ${metadata.lastModified ? `<div>Modified: ${metadata.lastModified.toLocaleString()}</div>` : ''}
                    `;
                }
            }

            // Show container
            container.style.display = 'flex';
        }
    }

    // Create download history dialog
    function createDownloadHistoryDialog() {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.download-history-container');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'download-history-container';

        // Get theme colors
        const isDarkMode = document.documentElement.classList.contains('night') ||
                          document.documentElement.classList.contains('theme-dark');

        // Set CSS variables based on theme
        if (isDarkMode) {
            dialog.style.setProperty('--background-color', '#18222d');
            dialog.style.setProperty('--border-color', '#2f3540');
            dialog.style.setProperty('--text-color', '#fff');
            dialog.style.setProperty('--secondary-text-color', '#8a8a8a');
            dialog.style.setProperty('--hover-color', '#1f2936');
            dialog.style.setProperty('--avatar-bg', '#2f3540');
            dialog.style.setProperty('--secondary-bg', '#2f3540');
            dialog.style.setProperty('--primary-color', '#4a9eff');
        } else {
            dialog.style.setProperty('--background-color', '#fff');
            dialog.style.setProperty('--border-color', '#e0e0e0');
            dialog.style.setProperty('--text-color', '#333');
            dialog.style.setProperty('--secondary-text-color', '#999');
            dialog.style.setProperty('--hover-color', '#f5f5f5');
            dialog.style.setProperty('--avatar-bg', '#ddd');
            dialog.style.setProperty('--secondary-bg', '#f0f0f0');
            dialog.style.setProperty('--primary-color', '#3390ec');
        }

        // Dialog header
        const header = document.createElement('div');
        header.className = 'download-history-header';

        const title = document.createElement('h3');
        title.className = 'download-history-title';
        title.textContent = 'Download History';

        const closeButton = document.createElement('button');
        closeButton.className = 'download-history-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Dialog content
        const content = document.createElement('div');
        content.className = 'download-history-content';

        if (downloadHistory.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'download-history-empty';
            emptyMessage.textContent = 'No download history available';
            content.appendChild(emptyMessage);
        } else {
            // Show most recent items first
            const sortedHistory = [...downloadHistory].reverse();

            sortedHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'download-history-item';

                // Icon based on type
                let icon = '📄';
                if (item.type.includes('image')) icon = '🖼️';
                else if (item.type.includes('video')) icon = '🎬';
                else if (item.type.includes('audio')) icon = '🎵';

                // Format date
                const date = new Date(item.timestamp);
                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

                historyItem.innerHTML = `
                    <div class="download-history-item-icon">${icon}</div>
                    <div class="download-history-item-info">
                        <div class="download-history-item-name">${item.fileName}</div>
                        <div class="download-history-item-details">
                            ${item.size ? `Size: ${formatFileSize(item.size)} • ` : ''}
                            ${formattedDate}
                        </div>
                    </div>
                    <div class="download-history-item-actions">
                        <button class="download-history-item-action" data-url="${item.url}" data-filename="${item.fileName}">Download</button>
                    </div>
                `;

                // Add download button event
                const downloadBtn = historyItem.querySelector('.download-history-item-action');
                downloadBtn.addEventListener('click', () => {
                    const url = downloadBtn.dataset.url;
                    const fileName = downloadBtn.dataset.filename;

                    if (url.includes('telegram')) {
                        // Determine type from URL or filename
                        let type = 'video';
                        if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
                            type = 'image';
                        } else if (fileName.endsWith('.mp3') || fileName.endsWith('.ogg')) {
                            type = 'audio';
                        }
                        downloadTelegramMedia(url, type);
                    } else {
                        downloadMedia(url, fileName);
                    }
                });

                content.appendChild(historyItem);
            });
        }

        // Assemble dialog
        dialog.appendChild(header);
        dialog.appendChild(content);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Create settings dialog
    function createSettingsDialog() {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.settings-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'settings-dialog';

        // Get theme colors
        const isDarkMode = document.documentElement.classList.contains('night') ||
                          document.documentElement.classList.contains('theme-dark');

        // Set CSS variables based on theme
        if (isDarkMode) {
            dialog.style.setProperty('--background-color', '#18222d');
            dialog.style.setProperty('--border-color', '#2f3540');
            dialog.style.setProperty('--text-color', '#fff');
            dialog.style.setProperty('--secondary-text-color', '#8a8a8a');
            dialog.style.setProperty('--hover-color', '#1f2936');
            dialog.style.setProperty('--avatar-bg', '#2f3540');
            dialog.style.setProperty('--secondary-bg', '#2f3540');
            dialog.style.setProperty('--primary-color', '#4a9eff');
        } else {
            dialog.style.setProperty('--background-color', '#fff');
            dialog.style.setProperty('--border-color', '#e0e0e0');
            dialog.style.setProperty('--text-color', '#333');
            dialog.style.setProperty('--secondary-text-color', '#999');
            dialog.style.setProperty('--hover-color', '#f5f5f5');
            dialog.style.setProperty('--avatar-bg', '#ddd');
            dialog.style.setProperty('--secondary-bg', '#f0f0f0');
            dialog.style.setProperty('--primary-color', '#3390ec');
        }

        // Dialog header
        const header = document.createElement('div');
        header.className = 'settings-header';

        const title = document.createElement('h3');
        title.className = 'settings-title';
        title.textContent = 'Downloader Settings';

        const closeButton = document.createElement('button');
        closeButton.className = 'settings-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Dialog content
        const content = document.createElement('div');
        content.className = 'settings-content';

        // General settings section
        const generalSection = document.createElement('div');
        generalSection.className = 'settings-section';

        const generalTitle = document.createElement('div');
        generalTitle.className = 'settings-section-title';
        generalTitle.textContent = 'General';

        // Enable notifications
        const notificationsItem = document.createElement('div');
        notificationsItem.className = 'settings-item';

        const notificationsLabel = document.createElement('div');
        notificationsLabel.className = 'settings-label';
        notificationsLabel.textContent = 'Enable notifications';

        const notificationsControl = document.createElement('div');
        notificationsControl.className = 'settings-control';

        const notificationsCheckbox = document.createElement('input');
        notificationsCheckbox.type = 'checkbox';
        notificationsCheckbox.className = 'settings-checkbox';
        notificationsCheckbox.checked = config.enableNotifications;

        notificationsControl.appendChild(notificationsCheckbox);
        notificationsItem.appendChild(notificationsLabel);
        notificationsItem.appendChild(notificationsControl);

        // Enable progress
        const progressItem = document.createElement('div');
        progressItem.className = 'settings-item';

        const progressLabel = document.createElement('div');
        progressLabel.className = 'settings-label';
        progressLabel.textContent = 'Show download progress';

        const progressControl = document.createElement('div');
        progressControl.className = 'settings-control';

        const progressCheckbox = document.createElement('input');
        progressCheckbox.type = 'checkbox';
        progressCheckbox.className = 'settings-checkbox';
        progressCheckbox.checked = config.enableProgress;

        progressControl.appendChild(progressCheckbox);
        progressItem.appendChild(progressLabel);
        progressItem.appendChild(progressControl);

        // Enable right-click
        const rightClickItem = document.createElement('div');
        rightClickItem.className = 'settings-item';

        const rightClickLabel = document.createElement('div');
        rightClickLabel.className = 'settings-label';
        rightClickLabel.textContent = 'Enable right-click menu';

        const rightClickControl = document.createElement('div');
        rightClickControl.className = 'settings-control';

        const rightClickCheckbox = document.createElement('input');
        rightClickCheckbox.type = 'checkbox';
        rightClickCheckbox.className = 'settings-checkbox';
        rightClickCheckbox.checked = config.enableRightClick;

        rightClickControl.appendChild(rightClickCheckbox);
        rightClickItem.appendChild(rightClickLabel);
        rightClickItem.appendChild(rightClickControl);

        // Enable keyboard shortcut
        const keyboardItem = document.createElement('div');
        keyboardItem.className = 'settings-item';

        const keyboardLabel = document.createElement('div');
        keyboardLabel.className = 'settings-label';
        keyboardLabel.textContent = 'Enable keyboard shortcut (D key)';

        const keyboardControl = document.createElement('div');
        keyboardControl.className = 'settings-control';

        const keyboardCheckbox = document.createElement('input');
        keyboardCheckbox.type = 'checkbox';
        keyboardCheckbox.className = 'settings-checkbox';
        keyboardCheckbox.checked = config.enableKeyboardShortcut;

        keyboardControl.appendChild(keyboardCheckbox);
        keyboardItem.appendChild(keyboardLabel);
        keyboardItem.appendChild(keyboardControl);

        // Enable auto-close
        const autoCloseItem = document.createElement('div');
        autoCloseItem.className = 'settings-item';

        const autoCloseLabel = document.createElement('div');
        autoCloseLabel.className = 'settings-label';
        autoCloseLabel.textContent = 'Auto-close media viewer';

        const autoCloseControl = document.createElement('div');
        autoCloseControl.className = 'settings-control';

        const autoCloseCheckbox = document.createElement('input');
        autoCloseCheckbox.type = 'checkbox';
        autoCloseCheckbox.className = 'settings-checkbox';
        autoCloseCheckbox.checked = config.enableAutoClose;

        autoCloseControl.appendChild(autoCloseCheckbox);
        autoCloseItem.appendChild(autoCloseLabel);
        autoCloseItem.appendChild(autoCloseControl);

        // Enable download history
        const historyItem = document.createElement('div');
        historyItem.className = 'settings-item';

        const historyLabel = document.createElement('div');
        historyLabel.className = 'settings-label';
        historyLabel.textContent = 'Enable download history';

        const historyControl = document.createElement('div');
        historyControl.className = 'settings-control';

        const historyCheckbox = document.createElement('input');
        historyCheckbox.type = 'checkbox';
        historyCheckbox.className = 'settings-checkbox';
        historyCheckbox.checked = config.enableDownloadHistory;

        historyControl.appendChild(historyCheckbox);
        historyItem.appendChild(historyLabel);
        historyItem.appendChild(historyControl);

        // Enable media preview
        const previewItem = document.createElement('div');
        previewItem.className = 'settings-item';

        const previewLabel = document.createElement('div');
        previewLabel.className = 'settings-label';
        previewLabel.textContent = 'Enable media preview';

        const previewControl = document.createElement('div');
        previewControl.className = 'settings-control';

        const previewCheckbox = document.createElement('input');
        previewCheckbox.type = 'checkbox';
        previewCheckbox.className = 'settings-checkbox';
        previewCheckbox.checked = config.enableMediaPreview;

        previewControl.appendChild(previewCheckbox);
        previewItem.appendChild(previewLabel);
        previewItem.appendChild(previewControl);

        // Enable metadata display
        const metadataItem = document.createElement('div');
        metadataItem.className = 'settings-item';

        const metadataLabel = document.createElement('div');
        metadataLabel.className = 'settings-label';
        metadataLabel.textContent = 'Show media metadata';

        const metadataControl = document.createElement('div');
        metadataControl.className = 'settings-control';

        const metadataCheckbox = document.createElement('input');
        metadataCheckbox.type = 'checkbox';
        metadataCheckbox.className = 'settings-checkbox';
        metadataCheckbox.checked = config.enableMetadataDisplay;

        metadataControl.appendChild(metadataCheckbox);
        metadataItem.appendChild(metadataLabel);
        metadataItem.appendChild(metadataControl);

        generalSection.appendChild(generalTitle);
        generalSection.appendChild(notificationsItem);
        generalSection.appendChild(progressItem);
        generalSection.appendChild(rightClickItem);
        generalSection.appendChild(keyboardItem);
        generalSection.appendChild(autoCloseItem);
        generalSection.appendChild(historyItem);
        generalSection.appendChild(previewItem);
        generalSection.appendChild(metadataItem);

        // Advanced settings section
        const advancedSection = document.createElement('div');
        advancedSection.className = 'settings-section';

        const advancedTitle = document.createElement('div');
        advancedTitle.className = 'settings-section-title';
        advancedTitle.textContent = 'Advanced';

        // Download delay
        const delayItem = document.createElement('div');
        delayItem.className = 'settings-item';

        const delayLabel = document.createElement('div');
        delayLabel.className = 'settings-label';
        delayLabel.textContent = 'Download delay (ms)';

        const delayControl = document.createElement('div');
        delayControl.className = 'settings-control';

        const delayInput = document.createElement('input');
        delayInput.type = 'number';
        delayInput.className = 'settings-input';
        delayInput.value = config.downloadDelay;
        delayInput.min = '0';
        delayInput.max = '10000';
        delayInput.step = '100';

        delayControl.appendChild(delayInput);
        delayItem.appendChild(delayLabel);
        delayItem.appendChild(delayControl);

        // Max retries
        const retriesItem = document.createElement('div');
        retriesItem.className = 'settings-item';

        const retriesLabel = document.createElement('div');
        retriesLabel.className = 'settings-label';
        retriesLabel.textContent = 'Max retries';

        const retriesControl = document.createElement('div');
        retriesControl.className = 'settings-control';

        const retriesInput = document.createElement('input');
        retriesInput.type = 'number';
        retriesInput.className = 'settings-input';
        retriesInput.value = config.maxRetries;
        retriesInput.min = '0';
        retriesInput.max = '10';
        retriesInput.step = '1';

        retriesControl.appendChild(retriesInput);
        retriesItem.appendChild(retriesLabel);
        retriesItem.appendChild(retriesControl);

        // Max concurrent downloads
        const concurrentItem = document.createElement('div');
        concurrentItem.className = 'settings-item';

        const concurrentLabel = document.createElement('div');
        concurrentLabel.className = 'settings-label';
        concurrentLabel.textContent = 'Max concurrent downloads';

        const concurrentControl = document.createElement('div');
        concurrentControl.className = 'settings-control';

        const concurrentInput = document.createElement('input');
        concurrentInput.type = 'number';
        concurrentInput.className = 'settings-input';
        concurrentInput.value = config.maxConcurrentDownloads;
        concurrentInput.min = '1';
        concurrentInput.max = '10';
        concurrentInput.step = '1';

        concurrentControl.appendChild(concurrentInput);
        concurrentItem.appendChild(concurrentLabel);
        concurrentItem.appendChild(concurrentControl);

        // Chunk size
        const chunkItem = document.createElement('div');
        chunkItem.className = 'settings-item';

        const chunkLabel = document.createElement('div');
        chunkLabel.className = 'settings-label';
        chunkLabel.textContent = 'Chunk size (MB)';

        const chunkControl = document.createElement('div');
        chunkControl.className = 'settings-control';

        const chunkInput = document.createElement('input');
        chunkInput.type = 'number';
        chunkInput.className = 'settings-input';
        chunkInput.value = config.chunkSize / (1024 * 1024);
        chunkInput.min = '0.1';
        chunkInput.max = '10';
        chunkInput.step = '0.1';

        chunkControl.appendChild(chunkInput);
        chunkItem.appendChild(chunkLabel);
        chunkItem.appendChild(chunkControl);

        advancedSection.appendChild(advancedTitle);
        advancedSection.appendChild(delayItem);
        advancedSection.appendChild(retriesItem);
        advancedSection.appendChild(concurrentItem);
        advancedSection.appendChild(chunkItem);

        // Dialog footer
        const footer = document.createElement('div');
        footer.className = 'settings-footer';

        const resetButton = document.createElement('button');
        resetButton.className = 'settings-button settings-cancel';
        resetButton.textContent = 'Reset to defaults';
        resetButton.addEventListener('click', () => {
            // Reset all inputs to default values
            notificationsCheckbox.checked = true;
            progressCheckbox.checked = true;
            rightClickCheckbox.checked = true;
            keyboardCheckbox.checked = true;
            autoCloseCheckbox.checked = true;
            historyCheckbox.checked = true;
            previewCheckbox.checked = true;
            metadataCheckbox.checked = true;
            delayInput.value = 1000;
            retriesInput.value = 3;
            concurrentInput.value = 3;
            chunkInput.value = 1;
        });

        const cancelButton = document.createElement('button');
        cancelButton.className = 'settings-button settings-cancel';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        const saveButton = document.createElement('button');
        saveButton.className = 'settings-button settings-save';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => {
            // Update config with new values
            config.enableNotifications = notificationsCheckbox.checked;
            config.enableProgress = progressCheckbox.checked;
            config.enableRightClick = rightClickCheckbox.checked;
            config.enableKeyboardShortcut = keyboardCheckbox.checked;
            config.enableAutoClose = autoCloseCheckbox.checked;
            config.enableDownloadHistory = historyCheckbox.checked;
            config.enableMediaPreview = previewCheckbox.checked;
            config.enableMetadataDisplay = metadataCheckbox.checked;
            config.downloadDelay = parseInt(delayInput.value, 10);
            config.maxRetries = parseInt(retriesInput.value, 10);
            config.maxConcurrentDownloads = parseInt(concurrentInput.value, 10);
            config.chunkSize = parseFloat(chunkInput.value) * 1024 * 1024;

            // Save config to storage
            GM_setValue('config', config);

            // Show notification
            showNotification('Settings Saved', 'Your settings have been saved successfully');

            // Close dialog
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        footer.appendChild(resetButton);
        footer.appendChild(cancelButton);
        footer.appendChild(saveButton);

        // Assemble dialog
        content.appendChild(generalSection);
        content.appendChild(advancedSection);
        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(footer);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Create batch selection toolbar
    function createBatchSelectionToolbar() {
        // Remove existing toolbar if any
        const existingToolbar = document.querySelector('.batch-selection-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
        }

        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'batch-selection-toolbar';

        const countText = document.createElement('span');
        countText.textContent = `${selectedMediaForBatch.length} selected`;

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', () => {
            downloadSelectedMedia();
            clearBatchSelection();
        });

        const forwardButton = document.createElement('button');
        forwardButton.textContent = 'Forward';
        forwardButton.addEventListener('click', () => {
            forwardSelectedMessages();
            clearBatchSelection();
        });

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', () => {
            clearBatchSelection();
        });

        toolbar.appendChild(countText);
        toolbar.appendChild(downloadButton);
        toolbar.appendChild(forwardButton);
        toolbar.appendChild(clearButton);

        document.body.appendChild(toolbar);

        return toolbar;
    }

    // Clear batch selection
    function clearBatchSelection() {
        selectedMediaForBatch = [];

        // Remove all selection indicators
        document.querySelectorAll('.batch-selection-indicator').forEach(indicator => {
            indicator.remove();
        });

        // Hide toolbar
        const toolbar = document.querySelector('.batch-selection-toolbar');
        if (toolbar) {
            toolbar.style.display = 'none';
        }
    }

    // Toggle media selection for batch
    function toggleMediaSelection(mediaEl) {
        const mediaId = mediaEl.dataset.mediaId || Math.random().toString(36).substring(2, 10);
        mediaEl.dataset.mediaId = mediaId;

        const index = selectedMediaForBatch.findIndex(item => item.mediaId === mediaId);

        if (index === -1) {
            // Add to selection
            selectedMediaForBatch.push({
                mediaId,
                element: mediaEl,
                peerId: mediaEl.dataset.peerId,
                messageId: mediaEl.dataset.mid
            });

            // Add selection indicator
            const indicator = document.createElement('div');
            indicator.className = 'batch-selection-indicator selected';
            indicator.textContent = '✓';
            mediaEl.appendChild(indicator);
        } else {
            // Remove from selection
            selectedMediaForBatch.splice(index, 1);

            // Remove selection indicator
            const indicator = mediaEl.querySelector('.batch-selection-indicator');
            if (indicator) {
                indicator.remove();
            }
        }

        // Update or create toolbar
        let toolbar = document.querySelector('.batch-selection-toolbar');
        if (!toolbar) {
            toolbar = createBatchSelectionToolbar();
        }

        // Update count
        const countText = toolbar.querySelector('span');
        countText.textContent = `${selectedMediaForBatch.length} selected`;

        // Show/hide toolbar based on selection
        if (selectedMediaForBatch.length > 0) {
            toolbar.style.display = 'flex';
        } else {
            toolbar.style.display = 'none';
        }
    }

    // Show notification
    function showNotification(title, message) {
        if (config.enableNotifications && GM_notification) {
            GM_notification({
                title: title,
                text: message,
                timeout: config.notificationTimeout,
                onclick: () => {
                    window.focus();
                }
            });
        }
    }

    // Update progress display for batch downloads
    function updateProgress(status, percent) {
        if (!config.enableProgress) return;
        const statusElement = progressElement.querySelector('.download-progress-text');
        const progressFill = progressElement.querySelector('.download-progress-fill');
        statusElement.textContent = status;
        progressFill.style.width = `${percent}%`;
        progressElement.style.display = 'block';
        logger.info(`Download progress: ${status} (${percent}%)`);
    }

    // Create progress bar for individual media downloads
    function createProgressBar(mediaEl) {
        const bar = document.createElement('div');
        bar.className = 'media-downloader-progress';
        if (mediaEl.parentNode.style.position === 'static') {
            mediaEl.parentNode.style.position = 'relative';
        }
        mediaEl.parentNode.appendChild(bar);
        return bar;
    }

    // Update individual progress bar
    function updateProgressBar(bar, percent, done = false, error = false) {
        if (!bar) return;
        bar.style.display = 'block';
        bar.style.width = `${percent}%`;
        if (done) {
            bar.style.background = error ? config.progressErrorColor : config.progressCompleteColor;
            setTimeout(() => { bar.style.display = 'none'; }, 2000);
        }
    }

    // Create Telegram progress bar
    function createTelegramProgressBar(videoId, fileName) {
        const isDarkMode = document.documentElement.classList.contains('night') ||
                          document.documentElement.classList.contains('theme-dark');
        const container = document.getElementById('media-downloader-progress-container') || (() => {
            const div = document.createElement('div');
            div.id = 'media-downloader-progress-container';
            div.style.cssText = `
                position: fixed;
                bottom: 0;
                right: 0;
                z-index: ${location.pathname.startsWith('/k/') ? 4 : 1600};
                max-width: 20rem;
            `;
            document.body.appendChild(div);
            return div;
        })();
        const innerContainer = document.createElement('div');
        innerContainer.id = `media-downloader-progress-${videoId}`;
        innerContainer.style.cssText = `
            width: 20rem;
            margin-top: 0.4rem;
            padding: 0.6rem;
            background-color: ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)'};
            border-radius: 0.5rem;
        `;
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 0.5rem;';
        const title = document.createElement('p');
        title.className = 'filename';
        title.style.cssText = 'margin: 0; color: white; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
        title.textContent = fileName;
        const closeButton = document.createElement('div');
        closeButton.style.cssText = 'cursor: pointer; font-size: 1.2rem; color: #8a8a8a;';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => container.removeChild(innerContainer);
        header.appendChild(title);
        header.appendChild(closeButton);
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            background-color: #e2e2e2;
            position: relative;
            width: 100%;
            height: 1rem;
            border-radius: 1rem;
            overflow: hidden;
        `;
        const counter = document.createElement('p');
        counter.style.cssText = `
            position: absolute;
            z-index: 5;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            color: black;
            font-size: 0.8rem;
        `;
        const progress = document.createElement('div');
        progress.style.cssText = `
            position: absolute;
            height: 100%;
            width: 0%;
            background-color: #6093B5;
            transition: width 0.3s ease;
        `;
        progressBar.appendChild(counter);
        progressBar.appendChild(progress);
        innerContainer.appendChild(header);
        innerContainer.appendChild(progressBar);
        container.appendChild(innerContainer);
        return { counter, progress, innerContainer };
    }

    // Update Telegram progress bar
    function updateTelegramProgress(videoId, progress) {
        const container = document.getElementById(`media-downloader-progress-${videoId}`);
        if (!container) return;
        const counter = container.querySelector('p');
        const progressBar = container.querySelector('div > div:last-child');
        counter.textContent = `${progress}%`;
        progressBar.style.width = `${progress}%`;
    }

    // Complete Telegram progress bar
    function completeTelegramProgress(videoId, error = false) {
        const container = document.getElementById(`media-downloader-progress-${videoId}`);
        if (!container) return;
        const counter = container.querySelector('p');
        const progressBar = container.querySelector('div > div:last-child');
        counter.textContent = error ? 'Failed' : 'Completed';
        progressBar.style.backgroundColor = error ? config.progressErrorColor : '#B6C649';
        progressBar.style.width = '100%';
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 3000);
    }

    // Utility functions
    function hashCode(s) {
        let h = 0, l = s.length, i = 0;
        if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
        return h >>> 0;
    }

    function getFileName(url, ext) {
        try {
            const metadata = JSON.parse(decodeURIComponent(url.split('/').pop()));
            if (metadata.fileName) return metadata.fileName;
        } catch (e) {}
        return `media_${hashCode(url)}.${ext}`;
    }

    function triggerDownload(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Check if media is visible
    function isMediaVisible(mediaEl) {
        if (!mediaEl) return false;
        // Check if element is visible in viewport
        const rect = mediaEl.getBoundingClientRect();
        const isVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        // For Telegram, check if media is in viewer
        const inViewer = !!mediaEl.closest('#MediaViewer, .media-viewer-whole, #stories-viewer, #StoryViewer');
        return isVisible || inViewer;
    }

    // Open media if not already opened
    async function openMediaIfNeeded(mediaEl) {
        // If media is already visible, no need to do anything
        if (isMediaVisible(mediaEl)) {
            return true;
        }
        // Special handling for Telegram
        try {
            // Find clickable element to open media
            let clickableElement = mediaEl;
            // If media is video or image in thumbnail
            if (mediaEl.tagName === 'VIDEO' || mediaEl.tagName === 'IMG') {
                // Find container element that can be clicked
                const container = mediaEl.closest('.Message, .media-container, .thumbnail, .photo');
                if (container) {
                    clickableElement = container;
                }
            }
            // Save previous state
            const wasPaused = mediaEl.tagName === 'VIDEO' || mediaEl.tagName === 'AUDIO' ? mediaEl.paused : true;
            // Click element to open media
            clickableElement.click();
            // Wait until media is opened
            await new Promise(resolve => {
                const checkVisibility = () => {
                    if (isMediaVisible(mediaEl)) {
                        resolve();
                    } else {
                        setTimeout(checkVisibility, 100);
                    }
                };
                checkVisibility();
            });
            // If media is video/audio, ensure it's fully loaded
            if (mediaEl.tagName === 'VIDEO' || mediaEl.tagName === 'AUDIO') {
                // Play briefly then pause to ensure media is loaded
                await mediaEl.play();
                mediaEl.pause();
                // Return to previous state if it should be paused
                if (wasPaused) {
                    mediaEl.pause();
                }
            }
            return true;
        } catch (e) {
            logger.error(`Failed to open media: ${e.message}`);
            return false;
        }
    }

    // Close media viewer
    function closeMediaViewer(mediaEl) {
        if (!mediaEl || !config.enableAutoClose) return;
        try {
            // Try to find close button in viewer
            const viewer = mediaEl.closest('#MediaViewer, .media-viewer-whole, #stories-viewer, #StoryViewer');
            if (viewer) {
                const closeButton = viewer.querySelector('button[title="Close"], button.close, .Button.icon-close, .btn-icon.tgico-close');
                if (closeButton) {
                    closeButton.click();
                    return;
                }
                // Alternative: press ESC key
                const escEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(escEvent);
            }
        } catch (e) {
            logger.error(`Failed to close media viewer: ${e.message}`);
        }
    }

    // Resolve media source
    function resolveMediaSource(mediaEl) {
        let src = null, ext = 'mp4';
        if (mediaEl.tagName === 'VIDEO') {
            src = mediaEl.currentSrc || mediaEl.src;
            ext = 'mp4';
        } else if (mediaEl.tagName === 'AUDIO') {
            src = mediaEl.currentSrc || mediaEl.src;
            ext = 'mp3';
        } else if (mediaEl.tagName === 'IMG') {
            src = mediaEl.src;
            ext = 'jpg';
        }
        return { src, ext };
    }

    // Check if element is in chat area
    function isInChatArea(element) {
        // Check if element is in Telegram chat area
        const chatSelectors = [
            '.Message',     // WebZ
            '.message',     // WebK
            '.chat',        // General
            '.messages-container', // General
            '.chat-list',   // General
            '.history',     // WebK
            '.bubbles',     // WebK
            '.bubble',      // WebK
            '.chat-content', // WebZ
            '.chat-input-container' // WebZ
        ];
        for (const selector of chatSelectors) {
            if (element.closest(selector)) {
                return true;
            }
        }
        return false;
    }

    // Download media using chunks
    async function downloadMedia(url, fileName, progressEl, mediaEl) {
        try {
            const resp = await fetch(url, { headers: { Range: 'bytes=0-' }});
            if (!resp.ok) throw Error(`HTTP Error: ${resp.status}`);
            const contentRange = resp.headers.get('Content-Range');
            const totalSize = contentRange ? parseInt(contentRange.split('/')[1], 10) : null;
            const mime = resp.headers.get('Content-Type') || 'application/octet-stream';
            if (resp.headers.get('Accept-Ranges') === 'bytes' && totalSize) {
                const chunkSize = Math.min(config.chunkSize, totalSize);
                const segmentCount = Math.ceil(totalSize / chunkSize);
                const parts = [];
                for (let i = 0; i < segmentCount; i++) {
                    const start = i * chunkSize;
                    const end = Math.min(start + chunkSize - 1, totalSize - 1);
                    const partResp = await fetch(url, {
                        headers: { Range: `bytes=${start}-${end}` }
                    });
                    if (!partResp.ok) throw Error(`Chunk Error: ${partResp.status}`);
                    const buf = await partResp.arrayBuffer();
                    parts.push(buf);
                    const percent = Math.round(((end + 1) / totalSize) * 100);
                    if (progressEl) {
                        if (progressEl.classList.contains('media-downloader-progress')) {
                            updateProgressBar(progressEl, percent, percent === 100);
                        } else {
                            updateTelegramProgress(progressEl.id.split('-').pop(), percent);
                        }
                    }
                }
                const blob = new Blob(parts, { type: mime });
                triggerDownload(blob, fileName);

                // Add to download history
                addToDownloadHistory(fileName, url, totalSize, mime);

                if (progressEl) {
                    if (progressEl.classList.contains('media-downloader-progress')) {
                        updateProgressBar(progressEl, 100, true);
                    } else {
                        completeTelegramProgress(progressEl.id.split('-').pop());
                    }
                }
                // Close media after download if it's a duration media
                if (mediaEl && (mediaEl.tagName === 'VIDEO' || mediaEl.tagName === 'AUDIO')) {
                    setTimeout(() => {
                        closeMediaViewer(mediaEl);
                    }, config.autoCloseDelay);
                }
            } else {
                const blob = await resp.blob();
                triggerDownload(blob, fileName);

                // Add to download history
                addToDownloadHistory(fileName, url, blob.size, blob.type);

                if (progressEl) {
                    if (progressEl.classList.contains('media-downloader-progress')) {
                        updateProgressBar(progressEl, 100, true);
                    } else {
                        completeTelegramProgress(progressEl.id.split('-').pop());
                    }
                }
                // Close media after download if it's a duration media
                if (mediaEl && (mediaEl.tagName === 'VIDEO' || mediaEl.tagName === 'AUDIO')) {
                    setTimeout(() => {
                        closeMediaViewer(mediaEl);
                    }, config.autoCloseDelay);
                }
            }
        } catch (err) {
            logger.error(`Download failed: ${err.message}`, fileName);
            if (progressEl) {
                if (progressEl.classList.contains('media-downloader-progress')) {
                    updateProgressBar(progressEl, 0, true, true);
                } else {
                    completeTelegramProgress(progressEl.id.split('-').pop(), true);
                }
            }
        }
    }

    // Download Telegram restricted media
    function downloadTelegramMedia(url, type = 'video', mediaEl) {
        const videoId = `${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
        const fileName = getFileName(url, type === 'video' ? 'mp4' : type === 'audio' ? 'ogg' : 'jpg');
        logger.info(`Telegram Download: ${url}`, fileName);
        const { counter, progress, innerContainer } = createTelegramProgressBar(videoId, fileName);
        let blobs = [];
        let nextOffset = 0;
        let totalSize = null;
        const fetchNextPart = async () => {
            try {
                const resp = await fetch(url, {
                    headers: { Range: `bytes=${nextOffset}-` }
                });
                if (![200, 206].includes(resp.status)) {
                    throw new Error(`HTTP Error: ${resp.status}`);
                }
                const mime = resp.headers.get('Content-Type').split(';')[0];
                if (!mime.startsWith(type === 'audio' ? 'audio/' : type === 'video' ? 'video/' : 'image/')) {
                    throw new Error(`Invalid MIME type: ${mime}`);
                }
                const contentRange = resp.headers.get('Content-Range');
                if (!contentRange) throw new Error('No Content-Range header');
                const match = contentRange.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
                if (!match) throw new Error('Invalid Content-Range format');
                const startOffset = parseInt(match[1], 10);
                const endOffset = parseInt(match[2], 10);
                const currentTotalSize = parseInt(match[3], 10);
                if (startOffset !== nextOffset) {
                    throw new Error(`Gap detected: expected ${nextOffset}, got ${startOffset}`);
                }
                if (totalSize && currentTotalSize !== totalSize) {
                    throw new Error(`Size mismatch: expected ${totalSize}, got ${currentTotalSize}`);
                }
                nextOffset = endOffset + 1;
                totalSize = currentTotalSize;
                const blob = await resp.blob();
                blobs.push(blob);
                const percent = Math.round((nextOffset / totalSize) * 100);
                counter.textContent = `${percent}%`;
                progress.style.width = `${percent}%`;
                if (nextOffset < totalSize) {
                    fetchNextPart();
                } else {
                    const finalBlob = new Blob(blobs, { type: mime });
                    triggerDownload(finalBlob, fileName);

                    // Add to download history
                    addToDownloadHistory(fileName, url, totalSize, mime);

                    completeTelegramProgress(videoId);
                    // Close media after download if it's a duration media
                    if (mediaEl && (type === 'video' || type === 'audio')) {
                        setTimeout(() => {
                            closeMediaViewer(mediaEl);
                        }, config.autoCloseDelay);
                    }
                }
            } catch (err) {
                logger.error(`Download failed: ${err.message}`, fileName);
                completeTelegramProgress(videoId, true);
            }
        };
        fetchNextPart();
    }

    // Extract media from message and download to disk
    function downloadMediaFromMessage(msg, retryCount = 0) {
        if (!msg.media || downloadCancelled) return;
        let myMedia = null;
        let mediaType = '';
        // Check for different media types
        if (msg.media.photo) {
            myMedia = msg.media.photo;
            mediaType = 'Photo';
        } else if (msg.media.document) {
            myMedia = msg.media.document;
            mediaType = 'Document';
        } else if (msg.media.video) {
            myMedia = msg.media.video;
            mediaType = 'Video';
        } else if (msg.media.audio) {
            myMedia = msg.media.audio;
            mediaType = 'Audio';
        }
        if (!myMedia) return;
        try {
            logger.info(`Downloading ${mediaType}:`, myMedia);
            unsafeWindow.appDownloadManager.downloadToDisc({media: myMedia});
            downloadedFiles++;
            const percent = totalFiles > 0 ? Math.round((downloadedFiles / totalFiles) * 100) : 0;
            updateProgress(`Downloading: ${downloadedFiles}/${totalFiles} files`, percent);
        } catch (error) {
            logger.error('Download error:', error);
            if (retryCount < config.maxRetries) {
                logger.info(`Retrying download (${retryCount + 1}/${config.maxRetries})...`);
                setTimeout(() => downloadMediaFromMessage(msg, retryCount + 1), 1000);
            } else {
                logger.error('Max retries reached for download');
            }
        }
    }

    // Throttle download of multiple medias
    function slowDown(secs, msg) {
        if (downloadCancelled) return;
        setTimeout(() => {
            downloadMediaFromMessage(msg);
        }, secs * config.downloadDelay);
    }

    // Get message object then download
    async function downloadSingleMedia(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (msg && msg.media) {
                downloadMediaFromMessage(msg);
                showNotification('Download Started', 'Media download has started');
            } else {
                logger.error('No media found in message');
                showNotification('Download Error', 'No media found in this message');
            }
        } catch (error) {
            logger.error('Error getting message:', error);
            showNotification('Download Error', 'Failed to get message data');
        }
    }

    // Forward message to chat
    async function forwardMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification('Forward Error', 'No message found');
                return;
            }

            // Create forward dialog
            createForwardDialog([msg]);
        } catch (error) {
            logger.error('Error getting message for forwarding:', error);
            showNotification('Forward Error', 'Failed to get message data');
        }
    }

    // Copy message
    async function copyMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification('Copy Error', 'No message found');
                return;
            }

            // Copy message text to clipboard
            if (msg.message) {
                navigator.clipboard.writeText(msg.message).then(() => {
                    showNotification('Copy Success', 'Message copied to clipboard');
                }).catch(err => {
                    logger.error('Failed to copy message:', err);
                    showNotification('Copy Error', 'Failed to copy message');
                });
            } else {
                showNotification('Copy Error', 'No text to copy');
            }
        } catch (error) {
            logger.error('Error getting message for copying:', error);
            showNotification('Copy Error', 'Failed to get message data');
        }
    }

    // Delete message
    async function deleteMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification('Delete Error', 'No message found');
                return;
            }

            // Delete message using Telegram API
            await unsafeWindow.appImManager.deleteMessages({
                peer: pid,
                id: [mid]
            });

            showNotification('Delete Success', 'Message deleted');
        } catch (error) {
            logger.error('Error deleting message:', error);
            showNotification('Delete Error', 'Failed to delete message');
        }
    }

    // Save message (favorite)
    async function saveMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification('Save Error', 'No message found');
                return;
            }

            // Save message using Telegram API
            await unsafeWindow.appImManager.faveMessage({
                peer: pid,
                id: mid
            });

            showNotification('Save Success', 'Message saved to favorites');
        } catch (error) {
            logger.error('Error saving message:', error);
            showNotification('Save Error', 'Failed to save message');
        }
    }

    // Report message
    async function reportMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification('Report Error', 'No message found');
                return;
            }

            // Open report dialog
            showNotification('Report', 'Report feature would open report dialog');
            // In a real implementation, this would open Telegram's report dialog
        } catch (error) {
            logger.error('Error reporting message:', error);
            showNotification('Report Error', 'Failed to report message');
        }
    }

    // Pin message
    async function pinMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification('Pin Error', 'No message found');
                return;
            }

            // Pin message using Telegram API
            await unsafeWindow.appImManager.pinMessage({
                peer: pid,
                id: mid
            });

            showNotification('Pin Success', 'Message pinned');
        } catch (error) {
            logger.error('Error pinning message:', error);
            showNotification('Pin Error', 'Failed to pin message');
        }
    }

    // Create forward dialog
    function createForwardDialog(messages) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'forward-dialog';

        // Get theme colors
        const isDarkMode = document.documentElement.classList.contains('night') ||
                          document.documentElement.classList.contains('theme-dark');

        // Set CSS variables based on theme
        if (isDarkMode) {
            dialog.style.setProperty('--background-color', '#18222d');
            dialog.style.setProperty('--border-color', '#2f3540');
            dialog.style.setProperty('--text-color', '#fff');
            dialog.style.setProperty('--secondary-text-color', '#8a8a8a');
            dialog.style.setProperty('--hover-color', '#1f2936');
            dialog.style.setProperty('--avatar-bg', '#2f3540');
            dialog.style.setProperty('--secondary-bg', '#2f3540');
            dialog.style.setProperty('--primary-color', '#4a9eff');
        } else {
            dialog.style.setProperty('--background-color', '#fff');
            dialog.style.setProperty('--border-color', '#e0e0e0');
            dialog.style.setProperty('--text-color', '#333');
            dialog.style.setProperty('--secondary-text-color', '#999');
            dialog.style.setProperty('--hover-color', '#f5f5f5');
            dialog.style.setProperty('--avatar-bg', '#ddd');
            dialog.style.setProperty('--secondary-bg', '#f0f0f0');
            dialog.style.setProperty('--primary-color', '#3390ec');
        }

        // Dialog header
        const header = document.createElement('div');
        header.className = 'forward-dialog-header';

        const title = document.createElement('h3');
        title.className = 'forward-dialog-title';
        title.textContent = `Forward Message${messages.length > 1 ? 's' : ''}`;

        const closeButton = document.createElement('button');
        closeButton.className = 'forward-dialog-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Dialog content
        const content = document.createElement('div');
        content.className = 'forward-dialog-content';

        // Search input
        const searchInput = document.createElement('input');
        searchInput.className = 'forward-dialog-search';
        searchInput.placeholder = 'Search chats...';
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            filterChats(query);
        });

        // Chats list
        const chatsList = document.createElement('ul');
        chatsList.className = 'forward-dialog-chats';

        // Get chats from Telegram
        let selectedChatId = null;

        function loadChats() {
            // Clear existing chats
            chatsList.innerHTML = '';

            // Get chats from Telegram app
            try {
                const chats = unsafeWindow.appChatsManager.getAllChats();

                // Sort chats by last message time
                const sortedChats = Object.values(chats).sort((a, b) => {
                    return (b.lastMessageDate || 0) - (a.lastMessageDate || 0);
                });

                // Add chats to list
                sortedChats.forEach(chat => {
                    if (chat.id && chat.title) {
                        const chatItem = createChatItem(chat);
                        chatsList.appendChild(chatItem);
                    }
                });
            } catch (error) {
                logger.error('Error loading chats:', error);

                // Fallback: try to get chats from DOM
                try {
                    const chatElements = document.querySelectorAll('.chat-item, .chat-list-item, .chat');

                    chatElements.forEach(el => {
                        const titleEl = el.querySelector('.title, .chat-title, .name');
                        const title = titleEl ? titleEl.textContent.trim() : 'Unknown';

                        if (title) {
                            const chat = {
                                id: el.dataset.peerId || el.dataset.chatId || Math.random().toString(36),
                                title: title,
                                type: 'private'
                            };

                            const chatItem = createChatItem(chat);
                            chatsList.appendChild(chatItem);
                        }
                    });
                } catch (domError) {
                    logger.error('Error loading chats from DOM:', domError);

                    // Show error message
                    const errorItem = document.createElement('li');
                    errorItem.className = 'forward-dialog-chat';
                    errorItem.textContent = 'Error loading chats. Please try again.';
                    chatsList.appendChild(errorItem);
                }
            }
        }

        function createChatItem(chat) {
            const chatItem = document.createElement('li');
            chatItem.className = 'forward-dialog-chat';
            chatItem.dataset.chatId = chat.id;

            // Avatar
            const avatar = document.createElement('div');
            avatar.className = 'forward-dialog-chat-avatar';

            // Try to get avatar image
            if (chat.photo && chat.photo.url) {
                const img = document.createElement('img');
                img.src = chat.photo.url;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                avatar.appendChild(img);
            } else {
                // Use initials as fallback
                const initials = chat.title.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                avatar.textContent = initials;
            }

            // Chat info
            const chatInfo = document.createElement('div');
            chatInfo.className = 'forward-dialog-chat-info';

            const chatName = document.createElement('div');
            chatName.className = 'forward-dialog-chat-name';
            chatName.textContent = chat.title;

            const chatStatus = document.createElement('div');
            chatStatus.className = 'forward-dialog-chat-status';
            chatStatus.textContent = chat.type === 'private' ? 'Private Chat' :
                                     chat.type === 'group' ? 'Group' :
                                     chat.type === 'channel' ? 'Channel' : 'Chat';

            chatInfo.appendChild(chatName);
            chatInfo.appendChild(chatStatus);

            chatItem.appendChild(avatar);
            chatItem.appendChild(chatInfo);

            // Add click event
            chatItem.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.forward-dialog-chat').forEach(item => {
                    item.style.backgroundColor = '';
                });

                // Select this chat
                chatItem.style.backgroundColor = 'var(--hover-color)';
                selectedChatId = chat.id;
            });

            return chatItem;
        }

        function filterChats(query) {
            const chatItems = chatsList.querySelectorAll('.forward-dialog-chat');

            chatItems.forEach(item => {
                const chatName = item.querySelector('.forward-dialog-chat-name').textContent.toLowerCase();

                if (chatName.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Load initial chats
        loadChats();

        content.appendChild(searchInput);
        content.appendChild(chatsList);

        // Dialog footer
        const footer = document.createElement('div');
        footer.className = 'forward-dialog-footer';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'forward-dialog-button forward-dialog-cancel';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        const sendButton = document.createElement('button');
        sendButton.className = 'forward-dialog-button forward-dialog-send';
        sendButton.textContent = 'Forward';
        sendButton.disabled = true;
        sendButton.addEventListener('click', () => {
            if (selectedChatId) {
                forwardMessages(messages, selectedChatId);
                document.body.removeChild(overlay);
                document.body.removeChild(dialog);
            }
        });

        // Update send button state when chat is selected
        document.addEventListener('click', () => {
            sendButton.disabled = !selectedChatId;
        });

        footer.appendChild(cancelButton);
        footer.appendChild(sendButton);

        // Assemble dialog
        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(footer);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // Focus search input
        searchInput.focus();
    }

    // Forward messages to selected chat
    async function forwardMessages(messages, chatId) {
        try {
            // Get message IDs
            const messageIds = messages.map(msg => msg.id);

            // Get current peer ID
            const currentPeerId = messages[0].peerId;

            // Forward messages using Telegram API
            await unsafeWindow.appImManager.forwardMessages({
                fromPeer: currentPeerId,
                toPeer: chatId,
                id: messageIds
            });

            showNotification('Forward Success', `Forwarded ${messages.length} message${messages.length > 1 ? 's' : ''}`);
        } catch (error) {
            logger.error('Error forwarding messages:', error);
            showNotification('Forward Error', 'Failed to forward messages');
        }
    }

    // Download multiple medias from selected messages
    async function downloadSelectedMedia() {
        try {
            let msgs = [];

            // Check if we have batch selected media
            if (selectedMediaForBatch.length > 0) {
                // Get message objects for selected media
                for (const item of selectedMediaForBatch) {
                    try {
                        const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(item.peerId, item.messageId);
                        if (msg && msg.media) {
                            msgs.push(msg);
                        }
                    } catch (error) {
                        logger.error('Error getting message for batch download:', error);
                    }
                }
            } else {
                // Fallback to original method
                msgs = await unsafeWindow.appImManager.chat.selection.getSelectedMessages();
            }

            if (msgs.length === 0) {
                showNotification('No Media', 'No messages selected');
                return;
            }
            startBatchDownload(msgs, 'selected messages');
        } catch (error) {
            logger.error('Error getting selected messages:', error);
            showNotification('Download Error', 'Failed to get selected messages');
        }
    }

    // Forward selected messages
    async function forwardSelectedMessages() {
        try {
            let msgs = [];

            // Check if we have batch selected media
            if (selectedMediaForBatch.length > 0) {
                // Get message objects for selected media
                for (const item of selectedMediaForBatch) {
                    try {
                        const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(item.peerId, item.messageId);
                        if (msg) {
                            msgs.push(msg);
                        }
                    } catch (error) {
                        logger.error('Error getting message for batch forward:', error);
                    }
                }
            } else {
                // Fallback to original method
                msgs = await unsafeWindow.appImManager.chat.selection.getSelectedMessages();
            }

            if (msgs.length === 0) {
                showNotification('No Messages', 'No messages selected');
                return;
            }

            // Create forward dialog with selected messages
            createForwardDialog(msgs);
        } catch (error) {
            logger.error('Error getting selected messages for forwarding:', error);
            showNotification('Forward Error', 'Failed to get selected messages');
        }
    }

    // Start batch download process
    function startBatchDownload(messages, source) {
        if (isDownloading) {
            showNotification('Busy', 'Another download is in progress');
            return;
        }
        isDownloading = true;
        downloadCancelled = false;
        downloadQueue = messages.filter(msg =>
            msg.media && (msg.media.photo || msg.media.document || msg.media.video || msg.media.audio)
        );
        totalFiles = downloadQueue.length;
        downloadedFiles = 0;
        if (totalFiles === 0) {
            showNotification('No Media', `No media found in ${source}`);
            isDownloading = false;
            return;
        }
        showNotification('Download Started', `Downloading ${totalFiles} files from ${source}`);
        updateProgress(`Starting download of ${totalFiles} files...`, 0);

        // Process download queue with concurrency limit
        let currentIndex = 0;

        function processNext() {
            if (downloadCancelled || currentIndex >= downloadQueue.length) {
                if (currentIndex >= downloadQueue.length) {
                    isDownloading = false;
                    if (!downloadCancelled) {
                        updateProgress('Download completed!', 100);
                        showNotification('Download Complete', `Successfully downloaded ${downloadedFiles} files`);
                        setTimeout(() => {
                            progressElement.style.display = 'none';
                        }, 3000);
                    }
                }
                return;
            }

            // Process up to maxConcurrentDownloads at once
            const batch = [];
            for (let i = 0; i < config.maxConcurrentDownloads && currentIndex < downloadQueue.length; i++) {
                batch.push(downloadQueue[currentIndex++]);
            }

            // Process batch
            batch.forEach((msg, index) => {
                activeDownloads.add(msg.id);
                slowDown(index, msg);

                // When download completes, remove from active downloads
                setTimeout(() => {
                    activeDownloads.delete(msg.id);
                    // If all downloads in this batch are done, process next batch
                    if (activeDownloads.size === 0) {
                        setTimeout(processNext, config.downloadDelay);
                    }
                }, index * config.downloadDelay);
            });
        }

        // Start processing
        processNext();
    }

    // Add download button to media elements
    function addDownloadButton(mediaEl) {
        if (mediaEl.dataset.downloadAttached) return;
        mediaEl.dataset.downloadAttached = 'true';
        // Only add button if element is in chat area
        if (!isInChatArea(mediaEl)) {
            return;
        }
        const parent = mediaEl.parentNode;
        if (window.getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        // Add batch selection indicator
        const selectionIndicator = document.createElement('div');
        selectionIndicator.className = 'batch-selection-indicator';
        selectionIndicator.textContent = '+';
        selectionIndicator.title = 'Select for batch download';
        selectionIndicator.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMediaSelection(mediaEl);
        });
        parent.appendChild(selectionIndicator);

        // For images, create image download button
        if (mediaEl.tagName === 'IMG') {
            const imgBtn = document.createElement('button');
            imgBtn.textContent = '🖼️';
            imgBtn.title = 'Download Gambar';
            imgBtn.className = 'media-downloader-img-btn';
            imgBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const { src, ext } = resolveMediaSource(mediaEl);
                if (!src) {
                    alert('Tidak ditemukan sumber media!');
                    return;
                }
                const fileName = `gambar_${Date.now()}.${ext}`;
                // Proceed with download
                if (src.includes('telegram')) {
                    downloadTelegramMedia(src, 'image', mediaEl);
                } else {
                    downloadMedia(src, fileName, null, mediaEl);
                }
            });
            parent.appendChild(imgBtn);
        }
        // For video/audio, create media download button
        if (mediaEl.tagName === 'VIDEO' || mediaEl.tagName === 'AUDIO') {
            const mediaBtn = document.createElement('button');
            mediaBtn.textContent = '🎬';
            mediaBtn.title = 'Download Media';
            mediaBtn.className = 'media-downloader-media-btn';
            // If there's an image button, position media button next to it
            const imgBtn = parent.querySelector('.media-downloader-img-btn');
            if (imgBtn) {
                mediaBtn.style.left = '35px';
            }
            const progressBar = createProgressBar(mediaEl);
            mediaBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const { src, ext } = resolveMediaSource(mediaEl);
                if (!src) {
                    alert('Tidak ditemukan sumber media!');
                    return;
                }
                const fileName = `media_${Date.now()}.${ext}`;
                // Open media if not already opened
                await openMediaIfNeeded(mediaEl);
                // Proceed with download
                if (src.includes('telegram')) {
                    downloadTelegramMedia(src, ext === 'mp3' ? 'audio' : 'video', mediaEl);
                } else {
                    downloadMedia(src, fileName, progressBar, mediaEl);
                }
            });
            parent.appendChild(mediaBtn);
        }

        // Add preview button
        if (config.enableMediaPreview) {
            const previewBtn = document.createElement('button');
            previewBtn.textContent = '👁️';
            previewBtn.title = 'Preview Media';
            previewBtn.className = 'media-downloader-media-btn';
            // Position preview button
            const imgBtn = parent.querySelector('.media-downloader-img-btn');
            const mediaBtn = parent.querySelector('.media-downloader-media-btn');
            if (mediaBtn) {
                previewBtn.style.left = imgBtn ? '65px' : '35px';
            } else if (imgBtn) {
                previewBtn.style.left = '35px';
            }
            previewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showMediaPreview(mediaEl);
            });
            parent.appendChild(previewBtn);
        }
    }

    // Add download overlay to media elements
    function addDownloadOverlay() {
        // PERUBAHAN: Hanya tambahkan overlay jika diaktifkan di config
        if (!config.enableOverlay) return;

        // Add download overlay to images
        document.querySelectorAll('.photo img, .video img, .document-container img').forEach(img => {
            const mediaItem = img.closest('.photo, .video, .document-container');
            if (mediaItem && !mediaItem.querySelector('.download-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'download-overlay';
                overlay.innerHTML = '<span class="download-icon">📥</span>';
                overlay.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const messageEl = mediaItem.closest('[data-mid]');
                    if (messageEl) {
                        const mid = messageEl.dataset.mid;
                        const pid = messageEl.dataset.peerId;
                        downloadSingleMedia(pid, mid);
                    }
                });
                mediaItem.classList.add('media-item');
                mediaItem.appendChild(overlay);
            }
        });
    }

    // Keyboard shortcut
    if (config.enableKeyboardShortcut) {
        document.addEventListener('mouseover', (e) => {
            const el = e.target.closest('video, audio, img');
            if (el && isInChatArea(el)) {
                hoveredElement = el;
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target === hoveredElement) hoveredElement = null;
        });
        document.addEventListener('keydown', async (e) => {
            if (e.key.toLowerCase() === 'd' && hoveredElement) {
                e.preventDefault();
                const { src, ext } = resolveMediaSource(hoveredElement);
                if (src) {
                    const fileName = `media_${Date.now()}.${ext}`;
                    const isVideoOrAudio = hoveredElement.tagName === 'VIDEO' || hoveredElement.tagName === 'AUDIO';
                    // Only for duration media (video/audio), open media if not already opened
                    if (isVideoOrAudio) {
                        await openMediaIfNeeded(hoveredElement);
                    }
                    // Proceed with download
                    if (src.includes('telegram')) {
                        downloadTelegramMedia(src, ext === 'mp3' ? 'audio' : ext === 'jpg' ? 'image' : 'video', hoveredElement);
                    } else {
                        downloadMedia(src, fileName, null, hoveredElement);
                    }
                }
            } else if (e.key.toLowerCase() === 'h' && e.ctrlKey) {
                // Ctrl+H to show download history
                e.preventDefault();
                createDownloadHistoryDialog();
            } else if (e.key.toLowerCase() === 's' && e.ctrlKey) {
                // Ctrl+S to open settings
                e.preventDefault();
                createSettingsDialog();
            }
        });
    }

    // Special Telegram features
    function addTelegramFeatures() {
        // For webz /a/ webapp
        setInterval(() => {
            // Stories
            const storiesContainer = document.getElementById('StoryViewer');
            if (storiesContainer) {
                const createDownloadButton = () => {
                    const downloadButton = document.createElement('button');
                    downloadButton.className = 'Button TkphaPyQ tiny translucent-white round media-downloader-tg-btn';
                    downloadButton.innerHTML = '<i class="icon icon-download"></i>';
                    downloadButton.setAttribute('type', 'button');
                    downloadButton.setAttribute('title', 'Download');
                    downloadButton.onclick = async () => {
                        // Look for video first
                        const video = storiesContainer.querySelector('video');
                        const videoSrc = video?.currentSrc || video?.src;
                        if (videoSrc) {
                            await openMediaIfNeeded(video);
                            downloadTelegramMedia(videoSrc, 'video', video);
                        } else {
                            // If no video, look for image
                            const images = storiesContainer.querySelectorAll('img.PVZ8TOWS');
                            if (images.length > 0) {
                                const imageSrc = images[images.length - 1]?.src;
                                if (imageSrc) downloadTelegramMedia(imageSrc, 'image');
                            }
                        }
                    };
                    return downloadButton;
                };
                const storyHeader = storiesContainer.querySelector('.GrsJNw3y') ||
                                   storiesContainer.querySelector('.DropdownMenu')?.parentNode;
                if (storyHeader && !storyHeader.querySelector('.media-downloader-tg-btn')) {
                    storyHeader.insertBefore(createDownloadButton(), storyHeader.querySelector('button'));
                }
            }
            // Media viewer
            const mediaContainer = document.querySelector('#MediaViewer .MediaViewerSlide--active');
            const mediaViewerActions = document.querySelector('#MediaViewer .MediaViewerActions');
            if (!mediaContainer || !mediaViewerActions) return;
            const videoPlayer = mediaContainer.querySelector('.MediaViewerContent > .VideoPlayer');
            const img = mediaContainer.querySelector('.MediaViewerContent > div > img');
            const downloadButton = document.createElement('button');
            downloadButton.className = 'Button smaller translucent-white round media-downloader-tg-btn';
            downloadButton.innerHTML = '<i class="icon icon-download"></i>';
            downloadButton.setAttribute('type', 'button');
            downloadButton.setAttribute('title', 'Download');
            if (videoPlayer) {
                const video = videoPlayer.querySelector('video');
                const videoUrl = video?.currentSrc || video?.src;
                downloadButton.setAttribute('data-tel-download-url', videoUrl);
                downloadButton.onclick = async () => {
                    await openMediaIfNeeded(video);
                    downloadTelegramMedia(videoUrl, 'video', video);
                };
                // Add to video controls
                const controls = videoPlayer.querySelector('.VideoPlayerControls');
                if (controls) {
                    const buttons = controls.querySelector('.buttons');
                    if (!buttons.querySelector('.media-downloader-tg-btn')) {
                        const spacer = buttons.querySelector('.spacer');
                        if (spacer) spacer.after(downloadButton);
                    }
                }
                // Add to topbar
                if (!mediaViewerActions.querySelector('.media-downloader-tg-btn') &&
                    !mediaViewerActions.querySelector('button[title="Download"]')) {
                    mediaViewerActions.prepend(downloadButton);
                }
            } else if (img && img.src) {
                downloadButton.setAttribute('data-tel-download-url', img.src);
                downloadButton.onclick = () => downloadTelegramMedia(img.src, 'image');
                // Add to topbar
                if (!mediaViewerActions.querySelector('.media-downloader-tg-btn') &&
                    !mediaViewerActions.querySelector('button[title="Download"]')) {
                    mediaViewerActions.prepend(downloadButton);
                }
            }
        }, 500);
        // For webk /k/ webapp
        setInterval(() => {
            // Stories
            const storiesContainer = document.getElementById('stories-viewer');
            if (storiesContainer) {
                const createDownloadButton = () => {
                    const downloadButton = document.createElement('button');
                    downloadButton.className = 'btn-icon rp media-downloader-tg-btn';
                    downloadButton.innerHTML = '<span class="tgico">⬇</span><div class="c-ripple"></div>';
                    downloadButton.setAttribute('type', 'button');
                    downloadButton.setAttribute('title', 'Download');
                    downloadButton.onclick = async () => {
                        // Look for video first
                        const video = storiesContainer.querySelector('video.media-video');
                        const videoSrc = video?.currentSrc || video?.src;
                        if (videoSrc) {
                            await openMediaIfNeeded(video);
                            downloadTelegramMedia(videoSrc, 'video', video);
                        } else {
                            // If no video, look for image
                            const imageSrc = storiesContainer.querySelector('img.media-photo')?.src;
                            if (imageSrc) downloadTelegramMedia(imageSrc, 'image');
                        }
                    };
                    return downloadButton;
                };
                const storyHeader = storiesContainer.querySelector('[class^="_ViewerStoryHeaderRight"]');
                const storyFooter = storiesContainer.querySelector('[class^="_ViewerStoryFooterRight"]');
                if (storyHeader && !storyHeader.querySelector('.media-downloader-tg-btn')) {
                    storyHeader.prepend(createDownloadButton());
                }
                if (storyFooter && !storyFooter.querySelector('.media-downloader-tg-btn')) {
                    storyFooter.prepend(createDownloadButton());
                }
            }
            // Media viewer
            const mediaContainer = document.querySelector('.media-viewer-whole');
            if (!mediaContainer) return;
            const mediaAspecter = mediaContainer.querySelector('.media-viewer-movers .media-viewer-aspecter');
            const mediaButtons = mediaContainer.querySelector('.media-viewer-topbar .media-viewer-buttons');
            if (!mediaAspecter || !mediaButtons) return;
            // Unhide hidden buttons
            const hiddenButtons = mediaButtons.querySelectorAll('button.btn-icon.hide');
            hiddenButtons.forEach(btn => btn.classList.remove('hide'));
            let onDownload = null;
            // Check for existing download button
            const existingDownloadBtn = mediaButtons.querySelector('button.btn-icon.tgico-download');
            if (existingDownloadBtn) {
                onDownload = () => existingDownloadBtn.click();
            }
            // Video player
            if (mediaAspecter.querySelector('.ckin__player')) {
                const controls = mediaAspecter.querySelector('.default__controls.ckin__controls');
                if (controls && !controls.querySelector('.media-downloader-tg-btn')) {
                    const brControls = controls.querySelector('.bottom-controls .right-controls');
                    const downloadButton = document.createElement('button');
                    downloadButton.className = 'btn-icon default__button tgico-download media-downloader-tg-btn';
                    downloadButton.innerHTML = '<span class="tgico">⬇</span>';
                    downloadButton.setAttribute('type', 'button');
                    downloadButton.setAttribute('title', 'Download');
                    if (onDownload) {
                        downloadButton.onclick = onDownload;
                    } else {
                        downloadButton.onclick = async () => {
                            const video = mediaAspecter.querySelector('video');
                            if (video) {
                                await openMediaIfNeeded(video);
                                downloadTelegramMedia(video.src, 'video', video);
                            }
                        };
                    }
                    brControls.prepend(downloadButton);
                }
            }
            // Video element
            else if (mediaAspecter.querySelector('video') && !mediaButtons.querySelector('button.btn-icon.tgico-download')) {
                const downloadButton = document.createElement('button');
                downloadButton.className = 'btn-icon tgico-download media-downloader-tg-btn';
                downloadButton.innerHTML = '<span class="tgico button-icon">⬇</span>';
                downloadButton.setAttribute('type', 'button');
                downloadButton.setAttribute('title', 'Download');
                if (onDownload) {
                    downloadButton.onclick = onDownload;
                } else {
                    downloadButton.onclick = async () => {
                        const video = mediaAspecter.querySelector('video');
                        if (video) {
                            await openMediaIfNeeded(video);
                            downloadTelegramMedia(video.src, 'video', video);
                        }
                    };
                }
                mediaButtons.prepend(downloadButton);
            }
            // Image
            else if (!mediaButtons.querySelector('button.btn-icon.tgico-download')) {
                const img = mediaAspecter.querySelector('img.thumbnail');
                if (img && img.src) {
                    const downloadButton = document.createElement('button');
                    downloadButton.className = 'btn-icon tgico-download media-downloader-tg-btn';
                    downloadButton.innerHTML = '<span class="tgico button-icon">⬇</span>';
                    downloadButton.setAttribute('type', 'button');
                    downloadButton.setAttribute('title', 'Download');
                    if (onDownload) {
                        downloadButton.onclick = onDownload;
                    } else {
                        downloadButton.onclick = () => downloadTelegramMedia(img.src, 'image');
                    }
                    mediaButtons.prepend(downloadButton);
                }
            }
        }, 500);
    }

    // Create enhanced context menu
    function createEnhancedContextMenu(pid, mid, x, y) {
        // Remove any existing context menu
        const existingMenu = document.querySelector('.enhanced-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create new context menu
        const menu = document.createElement('div');
        menu.className = 'enhanced-context-menu';

        // Get theme colors
        const isDarkMode = document.documentElement.classList.contains('night') ||
                          document.documentElement.classList.contains('theme-dark');

        // Set CSS variables based on theme
        if (isDarkMode) {
            menu.style.setProperty('--background-color', '#18222d');
            menu.style.setProperty('--border-color', '#2f3540');
            menu.style.setProperty('--text-color', '#fff');
            menu.style.setProperty('--secondary-text-color', '#8a8a8a');
            menu.style.setProperty('--hover-color', '#1f2936');
        } else {
            menu.style.setProperty('--background-color', '#fff');
            menu.style.setProperty('--border-color', '#e0e0e0');
            menu.style.setProperty('--text-color', '#333');
            menu.style.setProperty('--secondary-text-color', '#999');
            menu.style.setProperty('--hover-color', '#f5f5f5');
        }

        // Menu items
        const menuItems = [
            { icon: '📥', text: 'Download', action: () => downloadSingleMedia(pid, mid) },
            { icon: '➡️', text: 'Forward', action: () => forwardMessage(pid, mid) },
            { icon: '📋', text: 'Copy', action: () => copyMessage(pid, mid) },
            { icon: '🗑️', text: 'Delete', action: () => deleteMessage(pid, mid) },
            { icon: '⭐', text: 'Save', action: () => saveMessage(pid, mid) },
            { icon: '📌', text: 'Pin', action: () => pinMessage(pid, mid) },
            { icon: '🚩', text: 'Report', action: () => reportMessage(pid, mid) }
        ];

        // Add menu items
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'enhanced-context-menu-item';
            menuItem.innerHTML = `
                <span class="enhanced-context-menu-item-icon">${item.icon}</span>
                <span class="enhanced-context-menu-item-text">${item.text}</span>
            `;
            menuItem.addEventListener('click', () => {
                item.action();
                menu.remove();
            });
            menu.appendChild(menuItem);
        });

        // Position menu
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        // Make sure menu is within viewport
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = `${x - rect.width}px`;
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = `${y - rect.height}px`;
        }

        // Add to DOM
        document.body.appendChild(menu);

        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    // Create main menu button
    function createMainMenuButton() {
        // Check if button already exists
        if (document.querySelector('.tg-downloader-menu-btn')) {
            return;
        }

        // Find a suitable place to add the button
        const header = document.querySelector('.chat-header, .chat-list-header, .main-header');
        if (!header) return;

        // Create button
        const menuButton = document.createElement('button');
        menuButton.className = 'tg-downloader-menu-btn btn-icon rp';
        menuButton.innerHTML = '<span class="tgico">⬇</span><div class="c-ripple"></div>';
        menuButton.title = 'Media Downloader';
        menuButton.style.cssText = `
            position: relative;
            margin-left: 5px;
        `;

        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'tg-downloader-dropdown';
        dropdownMenu.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--background-color, #fff);
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            padding: 4px 0;
            min-width: 180px;
            display: none;
        `;

        // Get theme colors
        const isDarkMode = document.documentElement.classList.contains('night') ||
                          document.documentElement.classList.contains('theme-dark');

        // Set CSS variables based on theme
        if (isDarkMode) {
            dropdownMenu.style.setProperty('--background-color', '#18222d');
            dropdownMenu.style.setProperty('--border-color', '#2f3540');
            dropdownMenu.style.setProperty('--text-color', '#fff');
            dropdownMenu.style.setProperty('--secondary-text-color', '#8a8a8a');
            dropdownMenu.style.setProperty('--hover-color', '#1f2936');
        } else {
            dropdownMenu.style.setProperty('--background-color', '#fff');
            dropdownMenu.style.setProperty('--border-color', '#e0e0e0');
            dropdownMenu.style.setProperty('--text-color', '#333');
            dropdownMenu.style.setProperty('--secondary-text-color', '#999');
            dropdownMenu.style.setProperty('--hover-color', '#f5f5f5');
        }

        // Menu items
        const menuItems = [
            { icon: '📥', text: 'Download History', action: () => createDownloadHistoryDialog() },
            { icon: '⚙️', text: 'Settings', action: () => createSettingsDialog() },
            { icon: '📋', text: 'Clear Selection', action: () => clearBatchSelection() }
        ];

        // Add menu items
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'tg-downloader-menu-item';
            menuItem.style.cssText = `
                display: flex;
                align-items: center;
                padding: 8px 16px;
                cursor: pointer;
                transition: background-color 0.2s;
                color: var(--text-color, #333);
            `;
            menuItem.innerHTML = `
                <span style="margin-right: 12px; font-size: 16px; width: 20px; text-align: center;">${item.icon}</span>
                <span style="font-size: 14px;">${item.text}</span>
            `;
            menuItem.addEventListener('click', () => {
                item.action();
                dropdownMenu.style.display = 'none';
            });
            menuItem.addEventListener('mouseover', () => {
                menuItem.style.backgroundColor = 'var(--hover-color, #f5f5f5)';
            });
            menuItem.addEventListener('mouseout', () => {
                menuItem.style.backgroundColor = '';
            });
            dropdownMenu.appendChild(menuItem);
        });

        // Add divider
        const divider = document.createElement('div');
        divider.style.cssText = `
            height: 1px;
            background-color: var(--border-color, #e0e0e0);
            margin: 4px 0;
        `;
        dropdownMenu.appendChild(divider);

        // Add version info
        const versionInfo = document.createElement('div');
        versionInfo.style.cssText = `
            padding: 8px 16px;
            font-size: 12px;
            color: var(--secondary-text-color, #999);
            text-align: center;
        `;
        versionInfo.textContent = 'Telegram Media Downloader v3.0';
        dropdownMenu.appendChild(versionInfo);

        // Toggle dropdown on button click
        menuButton.addEventListener('click', () => {
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            } else {
                dropdownMenu.style.display = 'block';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });

        // Add to DOM
        header.appendChild(menuButton);
        menuButton.appendChild(dropdownMenu);
    }

    // Initialize the script
    function init() {
        // Load saved config
        const savedConfig = GM_getValue('config', {});
        Object.assign(config, savedConfig);

        const colCenter = document.querySelector('#column-center');
        if (!colCenter) {
            logger.error('Column center not found');
            return;
        }

        // Create main menu button
        createMainMenuButton();

        // Array of class names for media
        const clArray = ['photo', 'audio', 'video', 'voice-message', 'media-round', 'grouped-item', 'document-container', 'sticker'];
        // HTML code for buttons
        const downloadBtnHtml = '<div class="btn-menu-item rp-overflow" id="down-btn"><span class="mytgico btn-menu-item-icon" style="font-size: 16px;">📥</span><span class="i18n btn-menu-item-text">Download</span></div>';
        const forwardBtnHtml = '<div class="btn-menu-item rp-overflow" id="forward-btn"><span class="mytgico btn-menu-item-icon" style="font-size: 16px;">➡️</span><span class="i18n btn-menu-item-text">Forward</span></div>';
        const batchBtnHtml = '&nbsp;&nbsp;<button class="btn-primary btn-transparent text-bold" id="batch-btn" title="Download Selected Media"><span class="mytgico" style="padding-bottom: 2px;">📥</span>&nbsp;<span class="i18n">D/L Selected</span></button>';
        const batchForwardBtnHtml = '&nbsp;&nbsp;<button class="btn-primary btn-transparent text-bold" id="batch-forward-btn" title="Forward Selected Messages"><span class="mytgico" style="padding-bottom: 2px;">➡️</span>&nbsp;<span class="i18n">Forward Selected</span></button>';
        // Variables for the current message and peer ID
        let curMid, curPid, needBtn = false;
        // Unlock Ctrl+C to copy selected text
        const origListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type) {
            if (type !== 'copy') {
                origListener.apply(this, arguments);
            }
        };
        // Handle right-click events
        colCenter.addEventListener('contextmenu', (e) => {
            const closest = e.target.closest('[data-mid]');
            if (closest) {
                // Check if the element contains media classes
                if (clArray.some(clName => closest.classList.contains(clName))) {
                    curMid = closest.dataset.mid;
                    curPid = closest.dataset.peerId;

                    // Prevent default context menu
                    e.preventDefault();

                    // Show enhanced context menu
                    createEnhancedContextMenu(curPid, curMid, e.clientX, e.clientY);
                }
            }
        });
        // Observe DOM changes
        const observer = new MutationObserver((mutList) => {
            mutList.forEach((mut) => {
                mut.addedNodes.forEach((anod) => {
                    // Check if context menu has been added
                    if (anod.id === 'bubble-contextmenu' && needBtn) {
                        // Add the custom Download button
                        anod.querySelector('.btn-menu-item')?.insertAdjacentHTML('beforebegin', downloadBtnHtml);
                        anod.querySelector('#down-btn')?.addEventListener('click', () => {
                            downloadSingleMedia(curPid, curMid);
                        });

                        // Add the custom Forward button
                        anod.querySelector('#down-btn')?.insertAdjacentHTML('afterend', forwardBtnHtml);
                        anod.querySelector('#forward-btn')?.addEventListener('click', () => {
                            forwardMessage(curPid, curMid);
                        });
                    }
                    // Check if selection popup has been added
                    if (anod.classList?.contains('selection-wrapper')) {
                        const container = anod.querySelector('.selection-container-left');
                        if (container && !document.getElementById('batch-btn')) {
                            container.insertAdjacentHTML('beforeend', batchBtnHtml);
                            anod.querySelector('#batch-btn')?.addEventListener('click', downloadSelectedMedia);

                            // Add batch forward button
                            container.insertAdjacentHTML('beforeend', batchForwardBtnHtml);
                            anod.querySelector('#batch-forward-btn')?.addEventListener('click', forwardSelectedMessages);
                        }
                    }
                });
                // Add download overlays to new media elements
                addDownloadOverlay();
                // Add download buttons to new media elements
                document.querySelectorAll('video, audio, img').forEach(el => {
                    if (!el.closest('.media-downloader-ignore')) {
                        addDownloadButton(el);
                    }
                });
            });
        });
        // Start observing
        observer.observe(colCenter, { subtree: true, childList: true });
        // Initial scan for existing media elements
        addDownloadOverlay();
        // Add download buttons to existing media elements
        document.querySelectorAll('video, audio, img').forEach(el => {
            if (!el.closest('.media-downloader-ignore')) {
                addDownloadButton(el);
            }
        });
        // Initialize special Telegram features
        addTelegramFeatures();
        logger.info('Telegram Media Downloader initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    (function removeTelegramSpeedLimit() {
        // Patch fetch to bypass artificial speed limits on media downloads
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            return originalFetch.apply(this, args).then(async (res) => {
                const contentType = res.headers.get("Content-Type") || "";
                // Only patch for media and binary files
                if (
                    /^video\//.test(contentType) ||
                    /^audio\//.test(contentType) ||
                    contentType === "application/octet-stream"
                ) {
                    // Read the full body eagerly to avoid slow streams
                    const blob = await res.clone().blob();
                    // Copy headers to a new Headers object to avoid issues with immutable headers
                    const headers = new Headers();
                    res.headers.forEach((v, k) => headers.append(k, v));
                    return new Response(blob, {
                        status: res.status,
                        statusText: res.statusText,
                        headers,
                    });
                }
                return res;
            });
        };
    })();

    (function removeTelegramAds() {
        // Remove sponsored messages and ad banners
        const adSelectors = [
            '[class*="Sponsored"]',
            '[class*="sponsored"]',
            '[class*="AdBanner"]',
            '[class*="ad-banner"]',
            '[data-testid="sponsored-message"]',
            '[data-testid="ad-banner"]'
        ];

        function removeAds(root = document) {
            adSelectors.forEach(selector => {
                root.querySelectorAll(selector).forEach(el => {
                    el.remove();
                });
            });
        }

        // Initial cleanup
        removeAds();

        // Observe DOM for dynamically inserted ads
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        removeAds(node);
                    }
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();

})();
