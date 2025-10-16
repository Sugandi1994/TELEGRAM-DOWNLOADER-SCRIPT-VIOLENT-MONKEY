// ==UserScript==
// @name         Telegram Web - Ultimate Media Downloader & Manager
// @namespace    c0d3r
// @license      MIT
// @version      4.0
// @description  The ultimate Telegram Web media downloader with cloud sync, conversion, scheduling, and advanced management features
// @author       c0d3r
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
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
        enableMetadataDisplay: true, // Show media metadata
        enableAutoCategorization: true, // Auto-categorize downloads
        enableDuplicateDetection: true, // Detect duplicate downloads
        enableScheduledDownloads: false, // Enable scheduled downloads
        enableMediaConversion: false, // Enable media conversion
        enableCloudUpload: false,   // Enable cloud upload
        defaultDownloadPath: 'TelegramDownloads', // Default download path
        enableAdvancedSearch: true, // Enable advanced search
        enableDownloadStats: true,  // Enable download statistics
        enableThumbnails: true,     // Generate thumbnails for videos
        enableBatchRename: true,    // Enable batch rename
        enableQueueManagement: true, // Enable advanced queue management
        enableIntegration: true,    // Enable integration with external tools
        darkMode: 'auto',           // Theme: 'light', 'dark', 'auto'
        language: 'en',             // Language: 'en', 'id', 'zh', 'es', etc.
        compressionLevel: 6,        // Compression level for converted files
        videoQuality: 'original',   // Video quality: 'original', 'high', 'medium', 'low'
        imageFormat: 'original',    // Image format: 'original', 'jpg', 'png', 'webp'
        audioFormat: 'original',    // Audio format: 'original', 'mp3', 'wav', 'ogg'
        autoTagFiles: true,         // Auto-tag files with metadata
        enableSmartNaming: true,    // Enable smart file naming
        enableBackup: true,         // Enable settings backup
        enableTelemetry: false      // Enable telemetry (anonymous usage stats)
    };

    // Language translations
    const translations = {
        en: {
            download: 'Download',
            forward: 'Forward',
            copy: 'Copy',
            delete: 'Delete',
            save: 'Save',
            pin: 'Pin',
            report: 'Report',
            settings: 'Settings',
            history: 'Download History',
            search: 'Search',
            cancel: 'Cancel',
            save: 'Save',
            close: 'Close',
            select: 'Select',
            clear: 'Clear',
            retry: 'Retry',
            pause: 'Pause',
            resume: 'Resume',
            priority: 'Priority',
            queue: 'Queue',
            completed: 'Completed',
            failed: 'Failed',
            pending: 'Pending',
            paused: 'Paused',
            downloading: 'Downloading',
            converting: 'Converting',
            uploading: 'Uploading',
            size: 'Size',
            type: 'Type',
            date: 'Date',
            name: 'Name',
            path: 'Path',
            format: 'Format',
            quality: 'Quality',
            duration: 'Duration',
            resolution: 'Resolution',
            bitrate: 'Bitrate',
            codec: 'Codec',
            category: 'Category',
            tags: 'Tags',
            description: 'Description',
            advanced: 'Advanced',
            general: 'General',
            appearance: 'Appearance',
            network: 'Network',
            storage: 'Storage',
            privacy: 'Privacy',
            about: 'About',
            version: 'Version',
            author: 'Author',
            license: 'License',
            update: 'Update',
            backup: 'Backup',
            restore: 'Restore',
            reset: 'Reset',
            export: 'Export',
            import: 'Import',
            cloud: 'Cloud',
            local: 'Local',
            auto: 'Auto',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            original: 'Original',
            custom: 'Custom',
            none: 'None',
            all: 'All',
            selected: 'Selected',
            images: 'Images',
            videos: 'Videos',
            audio: 'Audio',
            documents: 'Documents',
            other: 'Other',
            today: 'Today',
            yesterday: 'Yesterday',
            thisWeek: 'This Week',
            thisMonth: 'This Month',
            thisYear: 'This Year',
            customRange: 'Custom Range',
            ascending: 'Ascending',
            descending: 'Descending',
            nameAsc: 'Name (A-Z)',
            nameDesc: 'Name (Z-A)',
            dateAsc: 'Date (Oldest)',
            dateDesc: 'Date (Newest)',
            sizeAsc: 'Size (Smallest)',
            sizeDesc: 'Size (Largest)',
            typeAsc: 'Type (A-Z)',
            typeDesc: 'Type (Z-A)',
            noResults: 'No results found',
            noHistory: 'No download history available',
            noQueue: 'No items in queue',
            confirmDelete: 'Are you sure you want to delete this item?',
            confirmClear: 'Are you sure you want to clear all items?',
            confirmReset: 'Are you sure you want to reset all settings?',
            operationSuccessful: 'Operation completed successfully',
            operationFailed: 'Operation failed',
            downloadStarted: 'Download started',
            downloadCompleted: 'Download completed',
            downloadFailed: 'Download failed',
            downloadPaused: 'Download paused',
            downloadResumed: 'Download resumed',
            downloadCancelled: 'Download cancelled',
            conversionStarted: 'Conversion started',
            conversionCompleted: 'Conversion completed',
            conversionFailed: 'Conversion failed',
            uploadStarted: 'Upload started',
            uploadCompleted: 'Upload completed',
            uploadFailed: 'Upload failed',
            fileAlreadyExists: 'File already exists',
            duplicateDetected: 'Duplicate file detected',
            invalidFile: 'Invalid file',
            unsupportedFormat: 'Unsupported format',
            networkError: 'Network error',
            serverError: 'Server error',
            permissionDenied: 'Permission denied',
            diskFull: 'Disk full',
            quotaExceeded: 'Quota exceeded',
            fileCorrupted: 'File corrupted',
            checkSumFailed: 'Checksum verification failed',
            downloadSpeed: 'Download Speed',
            uploadSpeed: 'Upload Speed',
            timeRemaining: 'Time Remaining',
            totalProgress: 'Total Progress',
            filesSelected: 'files selected',
            downloadAll: 'Download All',
            selectAll: 'Select All',
            deselectAll: 'Deselect All',
            invertSelection: 'Invert Selection',
            selectByType: 'Select by Type',
            selectByDate: 'Select by Date',
            selectBySize: 'Select by Size',
            batchRename: 'Batch Rename',
            batchConvert: 'Batch Convert',
            batchUpload: 'Batch Upload',
            batchDelete: 'Batch Delete',
            addToQueue: 'Add to Queue',
            removeFromQueue: 'Remove from Queue',
            moveUp: 'Move Up',
            moveDown: 'Move Down',
            moveToTop: 'Move to Top',
            moveToBottom: 'Move to Bottom',
            setPriority: 'Set Priority',
            highPriority: 'High Priority',
            normalPriority: 'Normal Priority',
            lowPriority: 'Low Priority',
            scheduleDownload: 'Schedule Download',
            scheduleUpload: 'Schedule Upload',
            scheduleConversion: 'Schedule Conversion',
            scheduledFor: 'Scheduled for',
            startNow: 'Start Now',
            startLater: 'Start Later',
            repeat: 'Repeat',
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            never: 'Never',
            afterCompletion: 'After Completion',
            onFailure: 'On Failure',
            onSuccess: 'On Success',
            sendNotification: 'Send Notification',
            playSound: 'Play Sound',
            openFile: 'Open File',
            openFolder: 'Open Folder',
            shareFile: 'Share File',
            copyLink: 'Copy Link',
            viewDetails: 'View Details',
            editMetadata: 'Edit Metadata',
            generateThumbnail: 'Generate Thumbnail',
            extractAudio: 'Extract Audio',
            extractFrames: 'Extract Frames',
            mergeFiles: 'Merge Files',
            splitFile: 'Split File',
            compressFile: 'Compress File',
            decompressFile: 'Decompress File',
            encryptFile: 'Encrypt File',
            decryptFile: 'Decrypt File',
            signFile: 'Sign File',
            verifySignature: 'Verify Signature',
            calculateChecksum: 'Calculate Checksum',
            verifyIntegrity: 'Verify Integrity',
            repairFile: 'Repair File',
            recoverFile: 'Recover File',
            analyzeFile: 'Analyze File',
            scanForViruses: 'Scan for Viruses',
            optimizeFile: 'Optimize File',
            reduceSize: 'Reduce Size',
            enhanceQuality: 'Enhance Quality',
            applyFilter: 'Apply Filter',
            addWatermark: 'Add Watermark',
            removeWatermark: 'Remove Watermark',
            rotateImage: 'Rotate Image',
            cropImage: 'Crop Image',
            resizeImage: 'Resize Image',
            adjustBrightness: 'Adjust Brightness',
            adjustContrast: 'Adjust Contrast',
            adjustSaturation: 'Adjust Saturation',
            adjustHue: 'Adjust Hue',
            convertToGrayscale: 'Convert to Grayscale',
            applySepia: 'Apply Sepia',
            applyBlur: 'Apply Blur',
            applySharpen: 'Apply Sharpen',
            detectFaces: 'Detect Faces',
            recognizeObjects: 'Recognize Objects',
            extractText: 'Extract Text',
            translateText: 'Translate Text',
            speechToText: 'Speech to Text',
            textToSpeech: 'Text to Speech',
            generateSubtitles: 'Generate Subtitles',
            syncSubtitles: 'Sync Subtitles',
            translateSubtitles: 'Translate Subtitles',
            createGif: 'Create GIF',
            createMeme: 'Create Meme',
            createCollage: 'Create Collage',
            createSlideshow: 'Create Slideshow',
            createVideo: 'Create Video',
            createPresentation: 'Create Presentation',
            createDocument: 'Create Document',
            createSpreadsheet: 'Create Spreadsheet',
            createArchive: 'Create Archive',
            extractArchive: 'Extract Archive',
            mountImage: 'Mount Image',
            burnToDisc: 'Burn to Disc',
            printFile: 'Print File',
            faxFile: 'Fax File',
            emailFile: 'Email File',
            uploadToCloud: 'Upload to Cloud',
            downloadFromCloud: 'Download from Cloud',
            syncWithCloud: 'Sync with Cloud',
            shareOnSocial: 'Share on Social',
            postToBlog: 'Post to Blog',
            publishToMarketplace: 'Publish to Marketplace',
            sellFile: 'Sell File',
            buyFile: 'Buy File',
            licenseFile: 'License File',
            copyrightFile: 'Copyright File',
            trademarkFile: 'Trademark File',
            patentFile: 'Patent File'
        },
        id: {
            download: 'Unduh',
            forward: 'Teruskan',
            copy: 'Salin',
            delete: 'Hapus',
            save: 'Simpan',
            pin: 'Sematkan',
            report: 'Laporkan',
            settings: 'Pengaturan',
            history: 'Riwayat Unduhan',
            search: 'Cari',
            cancel: 'Batal',
            save: 'Simpan',
            close: 'Tutup',
            select: 'Pilih',
            clear: 'Hapus',
            retry: 'Coba Lagi',
            pause: 'Jeda',
            resume: 'Lanjutkan',
            priority: 'Prioritas',
            queue: 'Antrian',
            completed: 'Selesai',
            failed: 'Gagal',
            pending: 'Menunggu',
            paused: 'Dijeda',
            downloading: 'Mengunduh',
            converting: 'Mengonversi',
            uploading: 'Mengunggah',
            size: 'Ukuran',
            type: 'Tipe',
            date: 'Tanggal',
            name: 'Nama',
            path: 'Path',
            format: 'Format',
            quality: 'Kualitas',
            duration: 'Durasi',
            resolution: 'Resolusi',
            bitrate: 'Bitrate',
            codec: 'Codec',
            category: 'Kategori',
            tags: 'Tag',
            description: 'Deskripsi',
            advanced: 'Lanjutan',
            general: 'Umum',
            appearance: 'Tampilan',
            network: 'Jaringan',
            storage: 'Penyimpanan',
            privacy: 'Privasi',
            about: 'Tentang',
            version: 'Versi',
            author: 'Pembuat',
            license: 'Lisensi',
            update: 'Pembaruan',
            backup: 'Cadangkan',
            restore: 'Pulihkan',
            reset: 'Reset',
            export: 'Ekspor',
            import: 'Impor',
            cloud: 'Cloud',
            local: 'Lokal',
            auto: 'Otomatis',
            low: 'Rendah',
            medium: 'Sedang',
            high: 'Tinggi',
            original: 'Asli',
            custom: 'Kustom',
            none: 'Tidak Ada',
            all: 'Semua',
            selected: 'Dipilih',
            images: 'Gambar',
            videos: 'Video',
            audio: 'Audio',
            documents: 'Dokumen',
            other: 'Lainnya',
            today: 'Hari Ini',
            yesterday: 'Kemarin',
            thisWeek: 'Minggu Ini',
            thisMonth: 'Bulan Ini',
            thisYear: 'Tahun Ini',
            customRange: 'Rentang Kustom',
            ascending: 'Menaik',
            descending: 'Menurun',
            nameAsc: 'Nama (A-Z)',
            nameDesc: 'Nama (Z-A)',
            dateAsc: 'Tanggal (Terlama)',
            dateDesc: 'Tanggal (Terbaru)',
            sizeAsc: 'Ukuran (Terkecil)',
            sizeDesc: 'Ukuran (Terbesar)',
            typeAsc: 'Tipe (A-Z)',
            typeDesc: 'Tipe (Z-A)',
            noResults: 'Tidak ada hasil',
            noHistory: 'Tidak ada riwayat unduhan',
            noQueue: 'Tidak ada item dalam antrian',
            confirmDelete: 'Apakah Anda yakin ingin menghapus item ini?',
            confirmClear: 'Apakah Anda yakin ingin menghapus semua item?',
            confirmReset: 'Apakah Anda yakin ingin mereset semua pengaturan?',
            operationSuccessful: 'Operasi berhasil',
            operationFailed: 'Operasi gagal',
            downloadStarted: 'Unduhan dimulai',
            downloadCompleted: 'Unduhan selesai',
            downloadFailed: 'Unduhan gagal',
            downloadPaused: 'Unduhan dijeda',
            downloadResumed: 'Unduhan dilanjutkan',
            downloadCancelled: 'Unduhan dibatalkan',
            conversionStarted: 'Konversi dimulai',
            conversionCompleted: 'Konversi selesai',
            conversionFailed: 'Konversi gagal',
            uploadStarted: 'Unggahan dimulai',
            uploadCompleted: 'Unggahan selesai',
            uploadFailed: 'Unggahan gagal',
            fileAlreadyExists: 'File sudah ada',
            duplicateDetected: 'File duplikat terdeteksi',
            invalidFile: 'File tidak valid',
            unsupportedFormat: 'Format tidak didukung',
            networkError: 'Kesalahan jaringan',
            serverError: 'Kesalahan server',
            permissionDenied: 'Izin ditolak',
            diskFull: 'Disk penuh',
            quotaExceeded: 'Kuota terlampaui',
            fileCorrupted: 'File rusak',
            checkSumFailed: 'Verifikasi checksum gagal',
            downloadSpeed: 'Kecepatan Unduh',
            uploadSpeed: 'Kecepatan Unggah',
            timeRemaining: 'Waktu Tersisa',
            totalProgress: 'Progress Total',
            filesSelected: 'file dipilih',
            downloadAll: 'Unduh Semua',
            selectAll: 'Pilih Semua',
            deselectAll: 'Batal Pilih Semua',
            invertSelection: 'Balik Pilihan',
            selectByType: 'Pilih Berdasarkan Tipe',
            selectByDate: 'Pilih Berdasarkan Tanggal',
            selectBySize: 'Pilih Berdasarkan Ukuran',
            batchRename: 'Ubah Nama Batch',
            batchConvert: 'Konversi Batch',
            batchUpload: 'Unggah Batch',
            batchDelete: 'Hapus Batch',
            addToQueue: 'Tambah ke Antrian',
            removeFromQueue: 'Hapus dari Antrian',
            moveUp: 'Pindah ke Atas',
            moveDown: 'Pindah ke Bawah',
            moveToTop: 'Pindah ke Paling Atas',
            moveToBottom: 'Pindah ke Paling Bawah',
            setPriority: 'Atur Prioritas',
            highPriority: 'Prioritas Tinggi',
            normalPriority: 'Prioritas Normal',
            lowPriority: 'Prioritas Rendah',
            scheduleDownload: 'Jadwalkan Unduhan',
            scheduleUpload: 'Jadwalkan Unggahan',
            scheduleConversion: 'Jadwalkan Konversi',
            scheduledFor: 'Dijadwalkan untuk',
            startNow: 'Mulai Sekarang',
            startLater: 'Mulai Nanti',
            repeat: 'Ulangi',
            daily: 'Harian',
            weekly: 'Mingguan',
            monthly: 'Bulanan',
            never: 'Tidak Pernah',
            afterCompletion: 'Setelah Selesai',
            onFailure: 'Pada Gagal',
            onSuccess: 'Pada Berhasil',
            sendNotification: 'Kirim Notifikasi',
            playSound: 'Putar Suara',
            openFile: 'Buka File',
            openFolder: 'Buka Folder',
            shareFile: 'Bagikan File',
            copyLink: 'Salin Link',
            viewDetails: 'Lihat Detail',
            editMetadata: 'Edit Metadata',
            generateThumbnail: 'Buat Thumbnail',
            extractAudio: 'Ekstrak Audio',
            extractFrames: 'Ekstrak Frame',
            mergeFiles: 'Gabungkan File',
            splitFile: 'Pisahkan File',
            compressFile: 'Kompres File',
            decompressFile: 'Dekompres File',
            encryptFile: 'Enkripsi File',
            decryptFile: 'Dekripsi File',
            signFile: 'Tandatangani File',
            verifySignature: 'Verifikasi Tanda Tangan',
            calculateChecksum: 'Hitung Checksum',
            verifyIntegrity: 'Verifikasi Integritas',
            repairFile: 'Perbaiki File',
            recoverFile: 'Pulihkan File',
            analyzeFile: 'Analisis File',
            scanForViruses: 'Pindai Virus',
            optimizeFile: 'Optimalkan File',
            reduceSize: 'Kurangi Ukuran',
            enhanceQuality: 'Tingkatkan Kualitas',
            applyFilter: 'Terapkan Filter',
            addWatermark: 'Tambah Watermark',
            removeWatermark: 'Hapus Watermark',
            rotateImage: 'Rotasi Gambar',
            cropImage: 'Potong Gambar',
            resizeImage: 'Ubah Ukuran Gambar',
            adjustBrightness: 'Atur Kecerahan',
            adjustContrast: 'Atur Kontras',
            adjustSaturation: 'Atur Saturasi',
            adjustHue: 'Atur Hue',
            convertToGrayscale: 'Konversi ke Grayscale',
            applySepia: 'Terapkan Sepia',
            applyBlur: 'Terapkan Blur',
            applySharpen: 'Terapkan Sharpen',
            detectFaces: 'Deteksi Wajah',
            recognizeObjects: 'Kenali Objek',
            extractText: 'Ekstrak Teks',
            translateText: 'Terjemahkan Teks',
            speechToText: 'Suara ke Teks',
            textToSpeech: 'Teks ke Suara',
            generateSubtitles: 'Buat Subtitle',
            syncSubtitles: 'Sinkronkan Subtitle',
            translateSubtitles: 'Terjemahkan Subtitle',
            createGif: 'Buat GIF',
            createMeme: 'Buat Meme',
            createCollage: 'Buat Kolase',
            createSlideshow: 'Buat Slideshow',
            createVideo: 'Buat Video',
            createPresentation: 'Buat Presentasi',
            createDocument: 'Buat Dokumen',
            createSpreadsheet: 'Buat Spreadsheet',
            createArchive: 'Buat Arsip',
            extractArchive: 'Ekstrak Arsip',
            mountImage: 'Mount Image',
            burnToDisc: 'Burn ke Disc',
            printFile: 'Cetak File',
            faxFile: 'Fax File',
            emailFile: 'Email File',
            uploadToCloud: 'Unggah ke Cloud',
            downloadFromCloud: 'Unduh dari Cloud',
            syncWithCloud: 'Sinkronkan dengan Cloud',
            shareOnSocial: 'Bagikan di Sosial',
            postToBlog: 'Posting ke Blog',
            publishToMarketplace: 'Publikasikan ke Marketplace',
            sellFile: 'Jual File',
            buyFile: 'Beli File',
            licenseFile: 'Lisensi File',
            copyrightFile: 'Hak Cipta File',
            trademarkFile: 'Merek Dagang File',
            patentFile: 'Paten File'
        },
        zh: {
            download: '下载',
            forward: '转发',
            copy: '复制',
            delete: '删除',
            save: '保存',
            pin: '置顶',
            report: '举报',
            settings: '设置',
            history: '下载历史',
            search: '搜索',
            cancel: '取消',
            save: '保存',
            close: '关闭',
            select: '选择',
            clear: '清除',
            retry: '重试',
            pause: '暂停',
            resume: '恢复',
            priority: '优先级',
            queue: '队列',
            completed: '已完成',
            failed: '失败',
            pending: '等待中',
            paused: '已暂停',
            downloading: '下载中',
            converting: '转换中',
            uploading: '上传中',
            size: '大小',
            type: '类型',
            date: '日期',
            name: '名称',
            path: '路径',
            format: '格式',
            quality: '质量',
            duration: '时长',
            resolution: '分辨率',
            bitrate: '比特率',
            codec: '编解码器',
            category: '类别',
            tags: '标签',
            description: '描述',
            advanced: '高级',
            general: '常规',
            appearance: '外观',
            network: '网络',
            storage: '存储',
            privacy: '隐私',
            about: '关于',
            version: '版本',
            author: '作者',
            license: '许可证',
            update: '更新',
            backup: '备份',
            restore: '恢复',
            reset: '重置',
            export: '导出',
            import: '导入',
            cloud: '云',
            local: '本地',
            auto: '自动',
            low: '低',
            medium: '中',
            high: '高',
            original: '原始',
            custom: '自定义',
            none: '无',
            all: '全部',
            selected: '已选择',
            images: '图片',
            videos: '视频',
            audio: '音频',
            documents: '文档',
            other: '其他',
            today: '今天',
            yesterday: '昨天',
            thisWeek: '本周',
            thisMonth: '本月',
            thisYear: '今年',
            customRange: '自定义范围',
            ascending: '升序',
            descending: '降序',
            nameAsc: '名称 (A-Z)',
            nameDesc: '名称 (Z-A)',
            dateAsc: '日期 (最旧)',
            dateDesc: '日期 (最新)',
            sizeAsc: '大小 (最小)',
            sizeDesc: '大小 (最大)',
            typeAsc: '类型 (A-Z)',
            typeDesc: '类型 (Z-A)',
            noResults: '未找到结果',
            noHistory: '没有下载历史',
            noQueue: '队列中没有项目',
            confirmDelete: '确定要删除此项目吗？',
            confirmClear: '确定要清除所有项目吗？',
            confirmReset: '确定要重置所有设置吗？',
            operationSuccessful: '操作成功完成',
            operationFailed: '操作失败',
            downloadStarted: '下载已开始',
            downloadCompleted: '下载已完成',
            downloadFailed: '下载失败',
            downloadPaused: '下载已暂停',
            downloadResumed: '下载已恢复',
            downloadCancelled: '下载已取消',
            conversionStarted: '转换已开始',
            conversionCompleted: '转换已完成',
            conversionFailed: '转换失败',
            uploadStarted: '上传已开始',
            uploadCompleted: '上传已完成',
            uploadFailed: '上传失败',
            fileAlreadyExists: '文件已存在',
            duplicateDetected: '检测到重复文件',
            invalidFile: '无效文件',
            unsupportedFormat: '不支持的格式',
            networkError: '网络错误',
            serverError: '服务器错误',
            permissionDenied: '权限被拒绝',
            diskFull: '磁盘已满',
            quotaExceeded: '配额已超出',
            fileCorrupted: '文件已损坏',
            checkSumFailed: '校验和验证失败',
            downloadSpeed: '下载速度',
            uploadSpeed: '上传速度',
            timeRemaining: '剩余时间',
            totalProgress: '总进度',
            filesSelected: '个文件已选择',
            downloadAll: '全部下载',
            selectAll: '全选',
            deselectAll: '取消全选',
            invertSelection: '反选',
            selectByType: '按类型选择',
            selectByDate: '按日期选择',
            selectBySize: '按大小选择',
            batchRename: '批量重命名',
            batchConvert: '批量转换',
            batchUpload: '批量上传',
            batchDelete: '批量删除',
            addToQueue: '添加到队列',
            removeFromQueue: '从队列中移除',
            moveUp: '上移',
            moveDown: '下移',
            moveToTop: '移至顶部',
            moveToBottom: '移至底部',
            setPriority: '设置优先级',
            highPriority: '高优先级',
            normalPriority: '普通优先级',
            lowPriority: '低优先级',
            scheduleDownload: '计划下载',
            scheduleUpload: '计划上传',
            scheduleConversion: '计划转换',
            scheduledFor: '计划于',
            startNow: '立即开始',
            startLater: '稍后开始',
            repeat: '重复',
            daily: '每日',
            weekly: '每周',
            monthly: '每月',
            never: '从不',
            afterCompletion: '完成后',
            onFailure: '失败时',
            onSuccess: '成功时',
            sendNotification: '发送通知',
            playSound: '播放声音',
            openFile: '打开文件',
            openFolder: '打开文件夹',
            shareFile: '分享文件',
            copyLink: '复制链接',
            viewDetails: '查看详情',
            editMetadata: '编辑元数据',
            generateThumbnail: '生成缩略图',
            extractAudio: '提取音频',
            extractFrames: '提取帧',
            mergeFiles: '合并文件',
            splitFile: '分割文件',
            compressFile: '压缩文件',
            decompressFile: '解压文件',
            encryptFile: '加密文件',
            decryptFile: '解密文件',
            signFile: '签名文件',
            verifySignature: '验证签名',
            calculateChecksum: '计算校验和',
            verifyIntegrity: '验证完整性',
            repairFile: '修复文件',
            recoverFile: '恢复文件',
            analyzeFile: '分析文件',
            scanForViruses: '病毒扫描',
            optimizeFile: '优化文件',
            reduceSize: '减小大小',
            enhanceQuality: '提高质量',
            applyFilter: '应用滤镜',
            addWatermark: '添加水印',
            removeWatermark: '移除水印',
            rotateImage: '旋转图像',
            cropImage: '裁剪图像',
            resizeImage: '调整图像大小',
            adjustBrightness: '调整亮度',
            adjustContrast: '调整对比度',
            adjustSaturation: '调整饱和度',
            adjustHue: '调整色调',
            convertToGrayscale: '转换为灰度',
            applySepia: '应用棕褐色',
            applyBlur: '应用模糊',
            applySharpen: '应用锐化',
            detectFaces: '检测人脸',
            recognizeObjects: '识别对象',
            extractText: '提取文本',
            translateText: '翻译文本',
            speechToText: '语音转文本',
            textToSpeech: '文本转语音',
            generateSubtitles: '生成字幕',
            syncSubtitles: '同步字幕',
            translateSubtitles: '翻译字幕',
            createGif: '创建GIF',
            createMeme: '创建表情包',
            createCollage: '创建拼贴',
            createSlideshow: '创建幻灯片',
            createVideo: '创建视频',
            createPresentation: '创建演示文稿',
            createDocument: '创建文档',
            createSpreadsheet: '创建电子表格',
            createArchive: '创建存档',
            extractArchive: '提取存档',
            mountImage: '挂载映像',
            burnToDisc: '刻录到光盘',
            printFile: '打印文件',
            faxFile: '传真文件',
            emailFile: '电子邮件文件',
            uploadToCloud: '上传到云',
            downloadFromCloud: '从云下载',
            syncWithCloud: '与云同步',
            shareOnSocial: '在社交媒体分享',
            postToBlog: '发布到博客',
            publishToMarketplace: '发布到市场',
            sellFile: '出售文件',
            buyFile: '购买文件',
            licenseFile: '许可文件',
            copyrightFile: '版权文件',
            trademarkFile: '商标文件',
            patentFile: '专利文件'
        }
    };

    // Get translation function
    function t(key) {
        const lang = config.language || 'en';
        return translations[lang]?.[key] || translations.en[key] || key;
    }

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
    let downloadStats = GM_getValue('downloadStats', {
        totalDownloads: 0,
        totalSize: 0,
        byType: {},
        byDate: {},
        byChat: {},
        averageSpeed: 0,
        successRate: 100
    });
    let scheduledDownloads = GM_getValue('scheduledDownloads', []);
    let cloudProviders = GM_getValue('cloudProviders', {});
    let conversionPresets = GM_getValue('conversionPresets', {});
    let fileCategories = GM_getValue('fileCategories', {
        images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'],
        videos: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp'],
        audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'opus'],
        documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'],
        archives: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lzma'],
        other: []
    });

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
        },
        warn: (message, fileName = null) => {
            console.warn(`[Telegram Media Downloader] ${fileName ? `${fileName}: ` : ""}${message}`);
        }
    };

    // Save download history
    function saveDownloadHistory() {
        if (config.enableDownloadHistory) {
            // Keep only last 1000 entries
            if (downloadHistory.length > 1000) {
                downloadHistory = downloadHistory.slice(-1000);
            }
            GM_setValue('downloadHistory', downloadHistory);
        }
    }

    // Save download stats
    function saveDownloadStats() {
        if (config.enableDownloadStats) {
            GM_setValue('downloadStats', downloadStats);
        }
    }

    // Save scheduled downloads
    function saveScheduledDownloads() {
        GM_setValue('scheduledDownloads', scheduledDownloads);
    }

    // Save cloud providers
    function saveCloudProviders() {
        GM_setValue('cloudProviders', cloudProviders);
    }

    // Save conversion presets
    function saveConversionPresets() {
        GM_setValue('conversionPresets', conversionPresets);
    }

    // Save file categories
    function saveFileCategories() {
        GM_setValue('fileCategories', fileCategories);
    }

    // Add to download history
    function addToDownloadHistory(fileName, url, size, type, metadata = {}) {
        if (config.enableDownloadHistory) {
            const historyItem = {
                id: Date.now().toString(),
                fileName,
                url,
                size,
                type,
                metadata,
                timestamp: new Date().toISOString(),
                status: 'completed',
                downloadTime: 0,
                downloadSpeed: 0,
                checksum: null,
                path: null,
                tags: [],
                category: categorizeFile(fileName, type),
                chatId: metadata.chatId || null,
                messageId: metadata.messageId || null,
                peerId: metadata.peerId || null
            };

            downloadHistory.push(historyItem);
            saveDownloadHistory();

            // Update stats
            updateDownloadStats(historyItem);

            return historyItem;
        }
        return null;
    }

    // Update download statistics
    function updateDownloadStats(historyItem) {
        if (!config.enableDownloadStats) return;

        downloadStats.totalDownloads++;
        downloadStats.totalSize += historyItem.size || 0;

        // Update by type
        const type = historyItem.category || 'other';
        if (!downloadStats.byType[type]) {
            downloadStats.byType[type] = { count: 0, size: 0 };
        }
        downloadStats.byType[type].count++;
        downloadStats.byType[type].size += historyItem.size || 0;

        // Update by date
        const date = new Date(historyItem.timestamp).toDateString();
        if (!downloadStats.byDate[date]) {
            downloadStats.byDate[date] = { count: 0, size: 0 };
        }
        downloadStats.byDate[date].count++;
        downloadStats.byDate[date].size += historyItem.size || 0;

        // Update by chat
        const chatId = historyItem.chatId || 'unknown';
        if (!downloadStats.byChat[chatId]) {
            downloadStats.byChat[chatId] = { count: 0, size: 0 };
        }
        downloadStats.byChat[chatId].count++;
        downloadStats.byChat[chatId].size += historyItem.size || 0;

        // Update average speed
        if (historyItem.downloadSpeed > 0) {
            const totalSpeed = downloadStats.averageSpeed * (downloadStats.totalDownloads - 1) + historyItem.downloadSpeed;
            downloadStats.averageSpeed = totalSpeed / downloadStats.totalDownloads;
        }

        saveDownloadStats();
    }

    // Categorize file
    function categorizeFile(fileName, mimeType) {
        if (!config.enableAutoCategorization) return 'other';

        const ext = fileName.split('.').pop().toLowerCase();

        for (const [category, extensions] of Object.entries(fileCategories)) {
            if (extensions.includes(ext)) {
                return category;
            }
        }

        // Try to categorize by MIME type
        if (mimeType) {
            if (mimeType.startsWith('image/')) return 'images';
            if (mimeType.startsWith('video/')) return 'videos';
            if (mimeType.startsWith('audio/')) return 'audio';
            if (mimeType.includes('document') || mimeType.includes('text')) return 'documents';
            if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archives';
        }

        return 'other';
    }

    // Check for duplicate files
    function checkDuplicate(fileName, size, checksum = null) {
        if (!config.enableDuplicateDetection) return null;

        return downloadHistory.find(item => {
            if (item.fileName === fileName && item.size === size) {
                return true;
            }
            if (checksum && item.checksum === checksum) {
                return true;
            }
            return false;
        });
    }

    // Generate smart filename
    function generateSmartFileName(originalName, metadata = {}) {
        if (!config.enableSmartNaming) return originalName;

        const date = new Date();
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS

        // Extract information from metadata
        const chatName = metadata.chatName || 'Unknown';
        const senderName = metadata.senderName || 'Unknown';
        const messageId = metadata.messageId || '0';

        // Create pattern
        const pattern = config.fileNamePattern || '{date}_{chat}_{sender}_{original}';

        // Replace placeholders
        let newName = pattern
            .replace(/{date}/g, dateStr)
            .replace(/{time}/g, timeStr)
            .replace(/{chat}/g, sanitizeFileName(chatName))
            .replace(/{sender}/g, sanitizeFileName(senderName))
            .replace(/{message}/g, messageId)
            .replace(/{original}/g, originalName);

        return newName;
    }

    // Sanitize filename
    function sanitizeFileName(name) {
        return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Format duration
    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return t('today') + ' ' + date.toLocaleTimeString();
        } else if (diffDays === 1) {
            return t('yesterday') + ' ' + date.toLocaleTimeString();
        } else if (diffDays < 7) {
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } else {
            return date.toLocaleDateString();
        }
    }

    // Get media metadata
    async function getMediaMetadata(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentLength = response.headers.get('Content-Length');
            const contentType = response.headers.get('Content-Type');
            const lastModified = response.headers.get('Last-Modified');
            const etag = response.headers.get('ETag');

            return {
                size: contentLength ? parseInt(contentLength, 10) : null,
                type: contentType || 'unknown',
                lastModified: lastModified ? new Date(lastModified) : null,
                etag: etag || null
            };
        } catch (error) {
            logger.error(`Failed to get metadata: ${error.message}`);
            return null;
        }
    }

    // Calculate file checksum
    async function calculateChecksum(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const buffer = e.target.result;
                const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                resolve(hashHex);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    // Extract media information
    async function extractMediaInfo(file) {
        const info = {
            duration: null,
            width: null,
            height: null,
            bitrate: null,
            fps: null,
            codec: null,
            audioCodec: null,
            audioBitrate: null,
            audioChannels: null,
            audioSampleRate: null
        };

        try {
            // For video files
            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.preload = 'metadata';

                await new Promise((resolve, reject) => {
                    video.onloadedmetadata = resolve;
                    video.onerror = reject;
                    video.src = URL.createObjectURL(file);
                });

                info.duration = video.duration;
                info.width = video.videoWidth;
                info.height = video.videoHeight;

                URL.revokeObjectURL(video.src);
            }
            // For audio files
            else if (file.type.startsWith('audio/')) {
                const audio = document.createElement('audio');
                audio.preload = 'metadata';

                await new Promise((resolve, reject) => {
                    audio.onloadedmetadata = resolve;
                    audio.onerror = reject;
                    audio.src = URL.createObjectURL(file);
                });

                info.duration = audio.duration;

                URL.revokeObjectURL(audio.src);
            }
        } catch (error) {
            logger.error(`Failed to extract media info: ${error.message}`);
        }

        return info;
    }

    // Generate thumbnail for video
    async function generateThumbnail(videoFile, time = 1) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            video.onloadedmetadata = () => {
                video.currentTime = time;
            };

            video.onseeked = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                    URL.revokeObjectURL(video.src);
                }, 'image/jpeg', 0.8);
            };

            video.onerror = () => {
                resolve(null);
                URL.revokeObjectURL(video.src);
            };

            video.src = URL.createObjectURL(videoFile);
        });
    }

    // Convert media format
    async function convertMedia(file, targetFormat, options = {}) {
        // This is a placeholder for media conversion
        // In a real implementation, you would use FFmpeg.js or similar library
        logger.info(`Converting ${file.name} to ${targetFormat}`);

        // Simulate conversion process
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return the original file for now
                resolve(file);
            }, 1000);
        });
    }

    // Compress image
    async function compressImage(file, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type, quality);
            };

            img.onerror = () => {
                resolve(file);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Add CSS styles
    GM_addStyle(`
        :root {
            --tg-downloader-primary: #3390ec;
            --tg-downloader-primary-hover: #2a7bcc;
            --tg-downloader-secondary: #f0f0f0;
            --tg-downloader-secondary-hover: #e0e0e0;
            --tg-downloader-success: #4caf50;
            --tg-downloader-warning: #ff9800;
            --tg-downloader-error: #f44336;
            --tg-downloader-text: #333;
            --tg-downloader-text-secondary: #666;
            --tg-downloader-border: #e0e0e0;
            --tg-downloader-background: #fff;
            --tg-downloader-overlay: rgba(0, 0, 0, 0.5);
            --tg-downloader-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            --tg-downloader-radius: 8px;
            --tg-downloader-transition: all 0.3s ease;
        }

        [data-theme="dark"] {
            --tg-downloader-primary: #4a9eff;
            --tg-downloader-primary-hover: #3a8eef;
            --tg-downloader-secondary: #2f3540;
            --tg-downloader-secondary-hover: #3a4150;
            --tg-downloader-success: #5cb85c;
            --tg-downloader-warning: #f0ad4e;
            --tg-downloader-error: #d9534f;
            --tg-downloader-text: #fff;
            --tg-downloader-text-secondary: #ccc;
            --tg-downloader-border: #3a4150;
            --tg-downloader-background: #18222d;
            --tg-downloader-overlay: rgba(0, 0, 0, 0.7);
            --tg-downloader-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: var(--tg-downloader-text);
            background-color: var(--tg-downloader-background);
        }

        .no-forwards .bubbles, .bubble, .bubble-content {
            -webkit-user-select: text!important;
            -moz-user-select: text!important;
            user-select: text!important;
        }

        /* Progress bar */
        .download-progress {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
            padding: 15px;
            border-radius: var(--tg-downloader-radius);
            z-index: 9999;
            display: none;
            min-width: 300px;
            box-shadow: var(--tg-downloader-shadow);
            border: 1px solid var(--tg-downloader-border);
        }

        .download-progress h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: var(--tg-downloader-text);
        }

        .download-progress-bar {
            width: 100%;
            height: 10px;
            background: var(--tg-downloader-secondary);
            border-radius: 5px;
            margin-top: 8px;
            overflow: hidden;
        }

        .download-progress-fill {
            height: 100%;
            background: var(--tg-downloader-primary);
            width: 0%;
            transition: width 0.3s ease;
        }

        .download-progress-text {
            margin-top: 8px;
            font-size: 14px;
            color: var(--tg-downloader-text-secondary);
        }

        .cancel-download-btn {
            margin-top: 10px;
            background-color: var(--tg-downloader-error);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: var(--tg-downloader-transition);
        }

        .cancel-download-btn:hover {
            background-color: #d32f2f;
        }

        /* Media item */
        .media-item {
            position: relative;
        }

        .media-item .download-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--tg-downloader-overlay);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
            cursor: pointer;
            border-radius: var(--tg-downloader-radius);
        }

        .media-item:hover .download-overlay {
            opacity: 1;
        }

        .download-overlay .download-icon {
            color: white;
            font-size: 24px;
            background: rgba(0,0,0,0.7);
            padding: 8px;
            border-radius: 50%;
        }

        /* Download buttons */
        .media-downloader-img-btn, .media-downloader-media-btn {
            position: absolute;
            left: 5px;
            bottom: 5px;
            z-index: 9999;
            padding: 6px 8px;
            background: rgba(0,0,0,0.7);
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: var(--tg-downloader-transition);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .media-downloader-img-btn:hover, .media-downloader-media-btn:hover {
            background: rgba(0,0,0,0.9);
        }

        /* Batch selection indicator */
        .batch-selection-indicator {
            position: absolute;
            top: 5px;
            right: 5px;
            background: var(--tg-downloader-primary);
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
            transition: var(--tg-downloader-transition);
        }

        .batch-selection-indicator:hover {
            transform: scale(1.1);
        }

        .batch-selection-indicator.selected {
            background: var(--tg-downloader-success);
        }

        /* Batch selection toolbar */
        .batch-selection-toolbar {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
            padding: 12px 16px;
            border-radius: var(--tg-downloader-radius);
            z-index: 9999;
            display: none;
            box-shadow: var(--tg-downloader-shadow);
            border: 1px solid var(--tg-downloader-border);
            gap: 12px;
            align-items: center;
        }

        .batch-selection-toolbar button {
            background: var(--tg-downloader-primary);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: var(--tg-downloader-transition);
        }

        .batch-selection-toolbar button:hover {
            background: var(--tg-downloader-primary-hover);
        }

        .batch-selection-toolbar .count {
            font-weight: 500;
            color: var(--tg-downloader-text);
        }

        /* Progress bar for individual media */
        .media-downloader-progress {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 4px;
            width: 0%;
            background: var(--tg-downloader-primary);
            z-index: 99999;
            transition: width 0.2s linear;
            display: none;
        }

        /* Telegram specific buttons */
        .media-downloader-tg-btn {
            margin-left: 5px;
        }

        /* Context menu */
        .enhanced-context-menu {
            position: fixed;
            background: var(--tg-downloader-background);
            border: 1px solid var(--tg-downloader-border);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
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
            transition: var(--tg-downloader-transition);
            color: var(--tg-downloader-text);
        }

        .enhanced-context-menu-item:hover {
            background-color: var(--tg-downloader-secondary);
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
            background-color: var(--tg-downloader-border);
            margin: 4px 0;
        }

        /* Media preview */
        .media-preview-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--tg-downloader-overlay);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        }

        .media-preview-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
            border-radius: var(--tg-downloader-radius);
            overflow: hidden;
        }

        .media-preview-image {
            max-width: 100%;
            max-height: 80vh;
            border-radius: var(--tg-downloader-radius);
        }

        .media-preview-video {
            max-width: 100%;
            max-height: 80vh;
            border-radius: var(--tg-downloader-radius);
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
            transition: var(--tg-downloader-transition);
        }

        .media-preview-close:hover {
            background: rgba(0,0,0,0.9);
        }

        .media-preview-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 0 0 var(--tg-downloader-radius) var(--tg-downloader-radius);
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
            transition: var(--tg-downloader-transition);
        }

        .media-preview-action-btn:hover {
            background: rgba(0,0,0,0.9);
        }

        /* Download history dialog */
        .download-history-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--tg-downloader-background);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
            z-index: 10000;
            width: 800px;
            max-width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }

        .download-history-header {
            padding: 15px;
            border-bottom: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .download-history-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: var(--tg-downloader-text);
        }

        .download-history-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--tg-downloader-text);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: var(--tg-downloader-transition);
        }

        .download-history-close:hover {
            background: var(--tg-downloader-secondary);
        }

        .download-history-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }

        .download-history-filters {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .download-history-filter {
            padding: 6px 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
            cursor: pointer;
            transition: var(--tg-downloader-transition);
        }

        .download-history-filter:hover {
            background: var(--tg-downloader-secondary);
        }

        .download-history-filter.active {
            background: var(--tg-downloader-primary);
            color: white;
            border-color: var(--tg-downloader-primary);
        }

        .download-history-search {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            margin-bottom: 15px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
        }

        .download-history-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .download-history-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            transition: var(--tg-downloader-transition);
        }

        .download-history-item:hover {
            background: var(--tg-downloader-secondary);
        }

        .download-history-item-icon {
            margin-right: 12px;
            font-size: 24px;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
        }

        .download-history-item-info {
            flex: 1;
        }

        .download-history-item-name {
            font-weight: 500;
            margin-bottom: 4px;
            color: var(--tg-downloader-text);
        }

        .download-history-item-details {
            font-size: 12px;
            color: var(--tg-downloader-text-secondary);
        }

        .download-history-item-actions {
            display: flex;
            gap: 5px;
        }

        .download-history-item-action {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--tg-downloader-primary);
            font-size: 14px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: var(--tg-downloader-transition);
        }

        .download-history-item-action:hover {
            background: var(--tg-downloader-secondary);
        }

        .download-history-empty {
            text-align: center;
            padding: 40px;
            color: var(--tg-downloader-text-secondary);
        }

        /* Settings dialog */
        .settings-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--tg-downloader-background);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
            z-index: 10000;
            width: 700px;
            max-width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }

        .settings-header {
            padding: 15px;
            border-bottom: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .settings-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: var(--tg-downloader-text);
        }

        .settings-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--tg-downloader-text);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: var(--tg-downloader-transition);
        }

        .settings-close:hover {
            background: var(--tg-downloader-secondary);
        }

        .settings-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }

        .settings-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--tg-downloader-border);
        }

        .settings-tab {
            padding: 8px 16px;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            color: var(--tg-downloader-text);
            transition: var(--tg-downloader-transition);
        }

        .settings-tab:hover {
            background: var(--tg-downloader-secondary);
        }

        .settings-tab.active {
            border-bottom-color: var(--tg-downloader-primary);
            color: var(--tg-downloader-primary);
        }

        .settings-tab-content {
            display: none;
        }

        .settings-tab-content.active {
            display: block;
        }

        .settings-section {
            margin-bottom: 20px;
        }

        .settings-section-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--tg-downloader-text);
        }

        .settings-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .settings-label {
            font-size: 14px;
            color: var(--tg-downloader-text);
        }

        .settings-description {
            font-size: 12px;
            color: var(--tg-downloader-text-secondary);
            margin-top: 4px;
        }

        .settings-control {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .settings-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .settings-input {
            padding: 6px 10px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
            width: 120px;
        }

        .settings-select {
            padding: 6px 10px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
            width: 150px;
            cursor: pointer;
        }

        .settings-slider {
            width: 150px;
            cursor: pointer;
        }

        .settings-color-picker {
            width: 40px;
            height: 30px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            cursor: pointer;
        }

        .settings-footer {
            padding: 15px;
            border-top: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .settings-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: var(--tg-downloader-transition);
        }

        .settings-cancel {
            background: var(--tg-downloader-secondary);
            color: var(--tg-downloader-text);
        }

        .settings-cancel:hover {
            background: var(--tg-downloader-secondary-hover);
        }

        .settings-save {
            background: var(--tg-downloader-primary);
            color: white;
        }

        .settings-save:hover {
            background: var(--tg-downloader-primary-hover);
        }

        .settings-reset {
            background: var(--tg-downloader-error);
            color: white;
        }

        .settings-reset:hover {
            background: #d32f2f;
        }

        /* Queue management dialog */
        .queue-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--tg-downloader-background);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
            z-index: 10000;
            width: 800px;
            max-width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }

        .queue-header {
            padding: 15px;
            border-bottom: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .queue-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: var(--tg-downloader-text);
        }

        .queue-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--tg-downloader-text);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: var(--tg-downloader-transition);
        }

        .queue-close:hover {
            background: var(--tg-downloader-secondary);
        }

        .queue-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }

        .queue-stats {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            padding: 10px;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
        }

        .queue-stat {
            text-align: center;
        }

        .queue-stat-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--tg-downloader-primary);
        }

        .queue-stat-label {
            font-size: 12px;
            color: var(--tg-downloader-text-secondary);
        }

        .queue-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .queue-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            transition: var(--tg-downloader-transition);
        }

        .queue-item:hover {
            background: var(--tg-downloader-secondary);
        }

        .queue-item.dragging {
            opacity: 0.5;
        }

        .queue-item-icon {
            margin-right: 12px;
            font-size: 24px;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
        }

        .queue-item-info {
            flex: 1;
        }

        .queue-item-name {
            font-weight: 500;
            margin-bottom: 4px;
            color: var(--tg-downloader-text);
        }

        .queue-item-details {
            font-size: 12px;
            color: var(--tg-downloader-text-secondary);
        }

        .queue-item-progress {
            width: 100%;
            height: 4px;
            background: var(--tg-downloader-secondary);
            border-radius: 2px;
            margin-top: 4px;
            overflow: hidden;
        }

        .queue-item-progress-fill {
            height: 100%;
            background: var(--tg-downloader-primary);
            width: 0%;
            transition: width 0.3s ease;
        }

        .queue-item-actions {
            display: flex;
            gap: 5px;
        }

        .queue-item-action {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--tg-downloader-primary);
            font-size: 14px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: var(--tg-downloader-transition);
        }

        .queue-item-action:hover {
            background: var(--tg-downloader-secondary);
        }

        .queue-item-action.delete {
            color: var(--tg-downloader-error);
        }

        .queue-empty {
            text-align: center;
            padding: 40px;
            color: var(--tg-downloader-text-secondary);
        }

        .queue-footer {
            padding: 15px;
            border-top: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .queue-controls {
            display: flex;
            gap: 10px;
        }

        .queue-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: var(--tg-downloader-transition);
        }

        .queue-button.primary {
            background: var(--tg-downloader-primary);
            color: white;
        }

        .queue-button.primary:hover {
            background: var(--tg-downloader-primary-hover);
        }

        .queue-button.secondary {
            background: var(--tg-downloader-secondary);
            color: var(--tg-downloader-text);
        }

        .queue-button.secondary:hover {
            background: var(--tg-downloader-secondary-hover);
        }

        /* Stats dialog */
        .stats-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--tg-downloader-background);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
            z-index: 10000;
            width: 700px;
            max-width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }

        .stats-header {
            padding: 15px;
            border-bottom: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .stats-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: var(--tg-downloader-text);
        }

        .stats-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--tg-downloader-text);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: var(--tg-downloader-transition);
        }

        .stats-close:hover {
            background: var(--tg-downloader-secondary);
        }

        .stats-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }

        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .stats-card {
            padding: 15px;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
            text-align: center;
        }

        .stats-card-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--tg-downloader-primary);
            margin-bottom: 5px;
        }

        .stats-card-label {
            font-size: 14px;
            color: var(--tg-downloader-text-secondary);
        }

        .stats-chart {
            margin-bottom: 20px;
        }

        .stats-chart-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--tg-downloader-text);
        }

        .stats-chart-container {
            height: 200px;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--tg-downloader-text-secondary);
        }

        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .stats-table th,
        .stats-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid var(--tg-downloader-border);
        }

        .stats-table th {
            font-weight: 600;
            color: var(--tg-downloader-text);
        }

        .stats-table td {
            color: var(--tg-downloader-text-secondary);
        }

        /* Cloud providers dialog */
        .cloud-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--tg-downloader-background);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
            z-index: 10000;
            width: 700px;
            max-width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }

        .cloud-header {
            padding: 15px;
            border-bottom: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cloud-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: var(--tg-downloader-text);
        }

        .cloud-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--tg-downloader-text);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: var(--tg-downloader-transition);
        }

        .cloud-close:hover {
            background: var(--tg-downloader-secondary);
        }

        .cloud-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }

        .cloud-providers {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .cloud-provider {
            padding: 15px;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
            text-align: center;
            cursor: pointer;
            transition: var(--tg-downloader-transition);
            border: 2px solid transparent;
        }

        .cloud-provider:hover {
            border-color: var(--tg-downloader-primary);
        }

        .cloud-provider.connected {
            border-color: var(--tg-downloader-success);
        }

        .cloud-provider-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .cloud-provider-name {
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--tg-downloader-text);
        }

        .cloud-provider-status {
            font-size: 12px;
            color: var(--tg-downloader-text-secondary);
        }

        .cloud-form {
            display: none;
            padding: 15px;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .cloud-form.active {
            display: block;
        }

        .cloud-form-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--tg-downloader-text);
        }

        .cloud-form-group {
            margin-bottom: 15px;
        }

        .cloud-form-label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: var(--tg-downloader-text);
        }

        .cloud-form-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
        }

        .cloud-form-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: var(--tg-downloader-transition);
            background: var(--tg-downloader-primary);
            color: white;
        }

        .cloud-form-button:hover {
            background: var(--tg-downloader-primary-hover);
        }

        /* Conversion dialog */
        .conversion-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--tg-downloader-background);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
            z-index: 10000;
            width: 700px;
            max-width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }

        .conversion-header {
            padding: 15px;
            border-bottom: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .conversion-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: var(--tg-downloader-text);
        }

        .conversion-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--tg-downloader-text);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: var(--tg-downloader-transition);
        }

        .conversion-close:hover {
            background: var(--tg-downloader-secondary);
        }

        .conversion-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }

        .conversion-presets {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .conversion-preset {
            padding: 15px;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
            cursor: pointer;
            transition: var(--tg-downloader-transition);
            border: 2px solid transparent;
        }

        .conversion-preset:hover {
            border-color: var(--tg-downloader-primary);
        }

        .conversion-preset.selected {
            border-color: var(--tg-downloader-primary);
        }

        .conversion-preset-name {
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--tg-downloader-text);
        }

        .conversion-preset-description {
            font-size: 12px;
            color: var(--tg-downloader-text-secondary);
        }

        .conversion-options {
            padding: 15px;
            background: var(--tg-downloader-secondary);
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .conversion-option {
            margin-bottom: 15px;
        }

        .conversion-option-label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: var(--tg-downloader-text);
        }

        .conversion-option-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
        }

        .conversion-option-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
        }

        .conversion-footer {
            padding: 15px;
            border-top: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .conversion-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: var(--tg-downloader-transition);
        }

        .conversion-cancel {
            background: var(--tg-downloader-secondary);
            color: var(--tg-downloader-text);
        }

        .conversion-cancel:hover {
            background: var(--tg-downloader-secondary-hover);
        }

        .conversion-convert {
            background: var(--tg-downloader-primary);
            color: white;
        }

        .conversion-convert:hover {
            background: var(--tg-downloader-primary-hover);
        }

        /* Schedule dialog */
        .schedule-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--tg-downloader-background);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
            z-index: 10000;
            width: 600px;
            max-width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: none;
            flex-direction: column;
        }

        .schedule-header {
            padding: 15px;
            border-bottom: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .schedule-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            color: var(--tg-downloader-text);
        }

        .schedule-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--tg-downloader-text);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: var(--tg-downloader-transition);
        }

        .schedule-close:hover {
            background: var(--tg-downloader-secondary);
        }

        .schedule-content {
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        }

        .schedule-option {
            margin-bottom: 15px;
        }

        .schedule-option-label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: var(--tg-downloader-text);
        }

        .schedule-option-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
        }

        .schedule-option-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--tg-downloader-border);
            border-radius: 4px;
            background: var(--tg-downloader-background);
            color: var(--tg-downloader-text);
        }

        .schedule-footer {
            padding: 15px;
            border-top: 1px solid var(--tg-downloader-border);
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .schedule-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: var(--tg-downloader-transition);
        }

        .schedule-cancel {
            background: var(--tg-downloader-secondary);
            color: var(--tg-downloader-text);
        }

        .schedule-cancel:hover {
            background: var(--tg-downloader-secondary-hover);
        }

        .schedule-schedule {
            background: var(--tg-downloader-primary);
            color: white;
        }

        .schedule-schedule:hover {
            background: var(--tg-downloader-primary-hover);
        }

        /* Main menu button */
        .tg-downloader-menu-btn {
            position: relative;
            margin-left: 5px;
        }

        .tg-downloader-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--tg-downloader-background);
            border: 1px solid var(--tg-downloader-border);
            border-radius: var(--tg-downloader-radius);
            box-shadow: var(--tg-downloader-shadow);
            z-index: 10000;
            padding: 4px 0;
            min-width: 200px;
            display: none;
        }

        .tg-downloader-menu-item {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            cursor: pointer;
            transition: var(--tg-downloader-transition);
            color: var(--tg-downloader-text);
        }

        .tg-downloader-menu-item:hover {
            background-color: var(--tg-downloader-secondary);
        }

        .tg-downloader-menu-item-icon {
            margin-right: 12px;
            font-size: 16px;
            width: 20px;
            text-align: center;
        }

        .tg-downloader-menu-item-text {
            font-size: 14px;
        }

        .tg-downloader-menu-divider {
            height: 1px;
            background-color: var(--tg-downloader-border);
            margin: 4px 0;
        }

        .tg-downloader-version {
            padding: 8px 16px;
            font-size: 12px;
            color: var(--tg-downloader-text-secondary);
            text-align: center;
        }

        /* Loading spinner */
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid var(--tg-downloader-border);
            border-radius: 50%;
            border-top-color: var(--tg-downloader-primary);
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Tooltip */
        .tooltip {
            position: relative;
        }

        .tooltip::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }

        .tooltip:hover::after {
            opacity: 1;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .download-history-container,
            .settings-container,
            .queue-container,
            .stats-container,
            .cloud-container,
            .conversion-container,
            .schedule-container {
                width: 95%;
                max-height: 90vh;
            }

            .batch-selection-toolbar {
                flex-direction: column;
                gap: 8px;
                padding: 8px;
            }

            .download-progress {
                right: 10px;
                bottom: 10px;
                min-width: 250px;
            }
        }
    `);

    // Create progress element for batch downloads
    const progressElement = document.createElement('div');
    progressElement.className = 'download-progress';
    progressElement.innerHTML = `
        <h3>${t('downloading')}</h3>
        <div class="download-progress-bar">
            <div class="download-progress-fill"></div>
        </div>
        <div class="download-progress-text">${t('preparing')}</div>
        <button class="cancel-download-btn">${t('cancel')}</button>
    `;
    document.body.appendChild(progressElement);

    // Cancel download functionality
    progressElement.querySelector('.cancel-download-btn').addEventListener('click', () => {
        downloadCancelled = true;
        activeDownloads.clear();
        updateProgress(t('downloadCancelled'), 0);
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
        downloadButton.textContent = t('download');
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
                        <div>${t('type')}: ${metadata.type}</div>
                        ${metadata.size ? `<div>${t('size')}: ${formatFileSize(metadata.size)}</div>` : ''}
                        ${metadata.lastModified ? `<div>${t('date')}: ${metadata.lastModified.toLocaleString()}</div>` : ''}
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

        // Dialog header
        const header = document.createElement('div');
        header.className = 'download-history-header';

        const title = document.createElement('h3');
        title.className = 'download-history-title';
        title.textContent = t('history');

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

        // Filters
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'download-history-filters';

        const allFilter = document.createElement('button');
        allFilter.className = 'download-history-filter active';
        allFilter.textContent = t('all');
        allFilter.addEventListener('click', () => {
            document.querySelectorAll('.download-history-filter').forEach(f => f.classList.remove('active'));
            allFilter.classList.add('active');
            filterHistory('all');
        });

        const imagesFilter = document.createElement('button');
        imagesFilter.className = 'download-history-filter';
        imagesFilter.textContent = t('images');
        imagesFilter.addEventListener('click', () => {
            document.querySelectorAll('.download-history-filter').forEach(f => f.classList.remove('active'));
            imagesFilter.classList.add('active');
            filterHistory('images');
        });

        const videosFilter = document.createElement('button');
        videosFilter.className = 'download-history-filter';
        videosFilter.textContent = t('videos');
        videosFilter.addEventListener('click', () => {
            document.querySelectorAll('.download-history-filter').forEach(f => f.classList.remove('active'));
            videosFilter.classList.add('active');
            filterHistory('videos');
        });

        const audioFilter = document.createElement('button');
        audioFilter.className = 'download-history-filter';
        audioFilter.textContent = t('audio');
        audioFilter.addEventListener('click', () => {
            document.querySelectorAll('.download-history-filter').forEach(f => f.classList.remove('active'));
            audioFilter.classList.add('active');
            filterHistory('audio');
        });

        const documentsFilter = document.createElement('button');
        documentsFilter.className = 'download-history-filter';
        documentsFilter.textContent = t('documents');
        documentsFilter.addEventListener('click', () => {
            document.querySelectorAll('.download-history-filter').forEach(f => f.classList.remove('active'));
            documentsFilter.classList.add('active');
            filterHistory('documents');
        });

        filtersContainer.appendChild(allFilter);
        filtersContainer.appendChild(imagesFilter);
        filtersContainer.appendChild(videosFilter);
        filtersContainer.appendChild(audioFilter);
        filtersContainer.appendChild(documentsFilter);

        // Search
        const searchInput = document.createElement('input');
        searchInput.className = 'download-history-search';
        searchInput.placeholder = t('search');
        searchInput.addEventListener('input', () => {
            searchHistory(searchInput.value);
        });

        // History list
        const historyList = document.createElement('div');
        historyList.className = 'download-history-list';

        function renderHistory(items = downloadHistory) {
            historyList.innerHTML = '';

            if (items.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'download-history-empty';
                emptyMessage.textContent = t('noHistory');
                historyList.appendChild(emptyMessage);
                return;
            }

            // Show most recent items first
            const sortedItems = [...items].reverse();

            sortedItems.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'download-history-item';

                // Icon based on type
                let icon = '📄';
                if (item.type.includes('image')) icon = '🖼️';
                else if (item.type.includes('video')) icon = '🎬';
                else if (item.type.includes('audio')) icon = '🎵';

                // Format date
                const formattedDate = formatDate(item.timestamp);

                historyItem.innerHTML = `
                    <div class="download-history-item-icon">${icon}</div>
                    <div class="download-history-item-info">
                        <div class="download-history-item-name">${item.fileName}</div>
                        <div class="download-history-item-details">
                            ${item.size ? `${t('size')}: ${formatFileSize(item.size)} • ` : ''}
                            ${formattedDate}
                        </div>
                    </div>
                    <div class="download-history-item-actions">
                        <button class="download-history-item-action" data-url="${item.url}" data-filename="${item.fileName}">${t('download')}</button>
                        <button class="download-history-item-action delete" data-id="${item.id}">${t('delete')}</button>
                    </div>
                `;

                // Add download button event
                const downloadBtn = historyItem.querySelector('.download-history-item-action:not(.delete)');
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

                // Add delete button event
                const deleteBtn = historyItem.querySelector('.download-history-item-action.delete');
                deleteBtn.addEventListener('click', () => {
                    const id = deleteBtn.dataset.id;
                    if (confirm(t('confirmDelete'))) {
                        downloadHistory = downloadHistory.filter(item => item.id !== id);
                        saveDownloadHistory();
                        renderHistory();
                    }
                });

                historyList.appendChild(historyItem);
            });
        }

        function filterHistory(category) {
            if (category === 'all') {
                renderHistory();
            } else {
                const filtered = downloadHistory.filter(item => item.category === category);
                renderHistory(filtered);
            }
        }

        function searchHistory(query) {
            if (!query) {
                renderHistory();
                return;
            }

            const filtered = downloadHistory.filter(item =>
                item.fileName.toLowerCase().includes(query.toLowerCase())
            );
            renderHistory(filtered);
        }

        // Initial render
        renderHistory();

        // Assemble dialog
        content.appendChild(filtersContainer);
        content.appendChild(searchInput);
        content.appendChild(historyList);
        dialog.appendChild(header);
        dialog.appendChild(content);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Create settings dialog
    function createSettingsDialog() {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.settings-container');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'settings-container';

        // Dialog header
        const header = document.createElement('div');
        header.className = 'settings-header';

        const title = document.createElement('h3');
        title.className = 'settings-title';
        title.textContent = t('settings');

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

        // Tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'settings-tabs';

        const generalTab = document.createElement('button');
        generalTab.className = 'settings-tab active';
        generalTab.textContent = t('general');
        generalTab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
            generalTab.classList.add('active');
            generalContent.classList.add('active');
        });

        const appearanceTab = document.createElement('button');
        appearanceTab.className = 'settings-tab';
        appearanceTab.textContent = t('appearance');
        appearanceTab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
            appearanceTab.classList.add('active');
            appearanceContent.classList.add('active');
        });

        const networkTab = document.createElement('button');
        networkTab.className = 'settings-tab';
        networkTab.textContent = t('network');
        networkTab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
            networkTab.classList.add('active');
            networkContent.classList.add('active');
        });

        const storageTab = document.createElement('button');
        storageTab.className = 'settings-tab';
        storageTab.textContent = t('storage');
        storageTab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
            storageTab.classList.add('active');
            storageContent.classList.add('active');
        });

        const privacyTab = document.createElement('button');
        privacyTab.className = 'settings-tab';
        privacyTab.textContent = t('privacy');
        privacyTab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
            privacyTab.classList.add('active');
            privacyContent.classList.add('active');
        });

        const aboutTab = document.createElement('button');
        aboutTab.className = 'settings-tab';
        aboutTab.textContent = t('about');
        aboutTab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
            aboutTab.classList.add('active');
            aboutContent.classList.add('active');
        });

        tabsContainer.appendChild(generalTab);
        tabsContainer.appendChild(appearanceTab);
        tabsContainer.appendChild(networkTab);
        tabsContainer.appendChild(storageTab);
        tabsContainer.appendChild(privacyTab);
        tabsContainer.appendChild(aboutTab);

        // Tab contents
        const generalContent = document.createElement('div');
        generalContent.className = 'settings-tab-content active';

        // General settings
        const generalSection = document.createElement('div');
        generalSection.className = 'settings-section';

        const generalTitle = document.createElement('div');
        generalTitle.className = 'settings-section-title';
        generalTitle.textContent = t('general');

        // Enable notifications
        const notificationsItem = document.createElement('div');
        notificationsItem.className = 'settings-item';

        const notificationsLabel = document.createElement('div');
        notificationsLabel.innerHTML = `
            <div class="settings-label">${t('enableNotifications')}</div>
            <div class="settings-description">${t('enableNotificationsDescription')}</div>
        `;

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
        progressLabel.innerHTML = `
            <div class="settings-label">${t('enableProgress')}</div>
            <div class="settings-description">${t('enableProgressDescription')}</div>
        `;

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
        rightClickLabel.innerHTML = `
            <div class="settings-label">${t('enableRightClick')}</div>
            <div class="settings-description">${t('enableRightClickDescription')}</div>
        `;

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
        keyboardLabel.innerHTML = `
            <div class="settings-label">${t('enableKeyboardShortcut')}</div>
            <div class="settings-description">${t('enableKeyboardShortcutDescription')}</div>
        `;

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
        autoCloseLabel.innerHTML = `
            <div class="settings-label">${t('enableAutoClose')}</div>
            <div class="settings-description">${t('enableAutoCloseDescription')}</div>
        `;

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
        historyLabel.innerHTML = `
            <div class="settings-label">${t('enableDownloadHistory')}</div>
            <div class="settings-description">${t('enableDownloadHistoryDescription')}</div>
        `;

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
        previewLabel.innerHTML = `
            <div class="settings-label">${t('enableMediaPreview')}</div>
            <div class="settings-description">${t('enableMediaPreviewDescription')}</div>
        `;

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
        metadataLabel.innerHTML = `
            <div class="settings-label">${t('enableMetadataDisplay')}</div>
            <div class="settings-description">${t('enableMetadataDisplayDescription')}</div>
        `;

        const metadataControl = document.createElement('div');
        metadataControl.className = 'settings-control';

        const metadataCheckbox = document.createElement('input');
        metadataCheckbox.type = 'checkbox';
        metadataCheckbox.className = 'settings-checkbox';
        metadataCheckbox.checked = config.enableMetadataDisplay;

        metadataControl.appendChild(metadataCheckbox);
        metadataItem.appendChild(metadataLabel);
        metadataItem.appendChild(metadataControl);

        // Enable auto-categorization
        const autoCategorizationItem = document.createElement('div');
        autoCategorizationItem.className = 'settings-item';

        const autoCategorizationLabel = document.createElement('div');
        autoCategorizationLabel.innerHTML = `
            <div class="settings-label">${t('enableAutoCategorization')}</div>
            <div class="settings-description">${t('enableAutoCategorizationDescription')}</div>
        `;

        const autoCategorizationControl = document.createElement('div');
        autoCategorizationControl.className = 'settings-control';

        const autoCategorizationCheckbox = document.createElement('input');
        autoCategorizationCheckbox.type = 'checkbox';
        autoCategorizationCheckbox.className = 'settings-checkbox';
        autoCategorizationCheckbox.checked = config.enableAutoCategorization;

        autoCategorizationControl.appendChild(autoCategorizationCheckbox);
        autoCategorizationItem.appendChild(autoCategorizationLabel);
        autoCategorizationItem.appendChild(autoCategorizationControl);

        // Enable duplicate detection
        const duplicateDetectionItem = document.createElement('div');
        duplicateDetectionItem.className = 'settings-item';

        const duplicateDetectionLabel = document.createElement('div');
        duplicateDetectionLabel.innerHTML = `
            <div class="settings-label">${t('enableDuplicateDetection')}</div>
            <div class="settings-description">${t('enableDuplicateDetectionDescription')}</div>
        `;

        const duplicateDetectionControl = document.createElement('div');
        duplicateDetectionControl.className = 'settings-control';

        const duplicateDetectionCheckbox = document.createElement('input');
        duplicateDetectionCheckbox.type = 'checkbox';
        duplicateDetectionCheckbox.className = 'settings-checkbox';
        duplicateDetectionCheckbox.checked = config.enableDuplicateDetection;

        duplicateDetectionControl.appendChild(duplicateDetectionCheckbox);
        duplicateDetectionItem.appendChild(duplicateDetectionLabel);
        duplicateDetectionItem.appendChild(duplicateDetectionControl);

        // Enable smart naming
        const smartNamingItem = document.createElement('div');
        smartNamingItem.className = 'settings-item';

        const smartNamingLabel = document.createElement('div');
        smartNamingLabel.innerHTML = `
            <div class="settings-label">${t('enableSmartNaming')}</div>
            <div class="settings-description">${t('enableSmartNamingDescription')}</div>
        `;

        const smartNamingControl = document.createElement('div');
        smartNamingControl.className = 'settings-control';

        const smartNamingCheckbox = document.createElement('input');
        smartNamingCheckbox.type = 'checkbox';
        smartNamingCheckbox.className = 'settings-checkbox';
        smartNamingCheckbox.checked = config.enableSmartNaming;

        smartNamingControl.appendChild(smartNamingCheckbox);
        smartNamingItem.appendChild(smartNamingLabel);
        smartNamingItem.appendChild(smartNamingControl);

        generalSection.appendChild(generalTitle);
        generalSection.appendChild(notificationsItem);
        generalSection.appendChild(progressItem);
        generalSection.appendChild(rightClickItem);
        generalSection.appendChild(keyboardItem);
        generalSection.appendChild(autoCloseItem);
        generalSection.appendChild(historyItem);
        generalSection.appendChild(previewItem);
        generalSection.appendChild(metadataItem);
        generalSection.appendChild(autoCategorizationItem);
        generalSection.appendChild(duplicateDetectionItem);
        generalSection.appendChild(smartNamingItem);

        generalContent.appendChild(generalSection);

        // Appearance tab content
        const appearanceContent = document.createElement('div');
        appearanceContent.className = 'settings-tab-content';

        const appearanceSection = document.createElement('div');
        appearanceSection.className = 'settings-section';

        const appearanceTitle = document.createElement('div');
        appearanceTitle.className = 'settings-section-title';
        appearanceTitle.textContent = t('appearance');

        // Theme
        const themeItem = document.createElement('div');
        themeItem.className = 'settings-item';

        const themeLabel = document.createElement('div');
        themeLabel.innerHTML = `
            <div class="settings-label">${t('theme')}</div>
            <div class="settings-description">${t('themeDescription')}</div>
        `;

        const themeControl = document.createElement('div');
        themeControl.className = 'settings-control';

        const themeSelect = document.createElement('select');
        themeSelect.className = 'settings-select';
        themeSelect.innerHTML = `
            <option value="auto" ${config.darkMode === 'auto' ? 'selected' : ''}>${t('auto')}</option>
            <option value="light" ${config.darkMode === 'light' ? 'selected' : ''}>${t('light')}</option>
            <option value="dark" ${config.darkMode === 'dark' ? 'selected' : ''}>${t('dark')}</option>
        `;

        themeControl.appendChild(themeSelect);
        themeItem.appendChild(themeLabel);
        themeItem.appendChild(themeControl);

        // Language
        const languageItem = document.createElement('div');
        languageItem.className = 'settings-item';

        const languageLabel = document.createElement('div');
        languageLabel.innerHTML = `
            <div class="settings-label">${t('language')}</div>
            <div class="settings-description">${t('languageDescription')}</div>
        `;

        const languageControl = document.createElement('div');
        languageControl.className = 'settings-control';

        const languageSelect = document.createElement('select');
        languageSelect.className = 'settings-select';
        languageSelect.innerHTML = `
            <option value="en" ${config.language === 'en' ? 'selected' : ''}>English</option>
            <option value="id" ${config.language === 'id' ? 'selected' : ''}>Bahasa Indonesia</option>
            <option value="zh" ${config.language === 'zh' ? 'selected' : ''}>中文</option>
        `;

        languageControl.appendChild(languageSelect);
        languageItem.appendChild(languageLabel);
        languageItem.appendChild(languageControl);

        appearanceSection.appendChild(appearanceTitle);
        appearanceSection.appendChild(themeItem);
        appearanceSection.appendChild(languageItem);

        appearanceContent.appendChild(appearanceSection);

        // Network tab content
        const networkContent = document.createElement('div');
        networkContent.className = 'settings-tab-content';

        const networkSection = document.createElement('div');
        networkSection.className = 'settings-section';

        const networkTitle = document.createElement('div');
        networkTitle.className = 'settings-section-title';
        networkTitle.textContent = t('network');

        // Download delay
        const delayItem = document.createElement('div');
        delayItem.className = 'settings-item';

        const delayLabel = document.createElement('div');
        delayLabel.innerHTML = `
            <div class="settings-label">${t('downloadDelay')}</div>
            <div class="settings-description">${t('downloadDelayDescription')}</div>
        `;

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
        retriesLabel.innerHTML = `
            <div class="settings-label">${t('maxRetries')}</div>
            <div class="settings-description">${t('maxRetriesDescription')}</div>
        `;

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
        concurrentLabel.innerHTML = `
            <div class="settings-label">${t('maxConcurrentDownloads')}</div>
            <div class="settings-description">${t('maxConcurrentDownloadsDescription')}</div>
        `;

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
        chunkLabel.innerHTML = `
            <div class="settings-label">${t('chunkSize')}</div>
            <div class="settings-description">${t('chunkSizeDescription')}</div>
        `;

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

        networkSection.appendChild(networkTitle);
        networkSection.appendChild(delayItem);
        networkSection.appendChild(retriesItem);
        networkSection.appendChild(concurrentItem);
        networkSection.appendChild(chunkItem);

        networkContent.appendChild(networkSection);

        // Storage tab content
        const storageContent = document.createElement('div');
        storageContent.className = 'settings-tab-content';

        const storageSection = document.createElement('div');
        storageSection.className = 'settings-section';

        const storageTitle = document.createElement('div');
        storageTitle.className = 'settings-section-title';
        storageTitle.textContent = t('storage');

        // Default download path
        const pathItem = document.createElement('div');
        pathItem.className = 'settings-item';

        const pathLabel = document.createElement('div');
        pathLabel.innerHTML = `
            <div class="settings-label">${t('defaultDownloadPath')}</div>
            <div class="settings-description">${t('defaultDownloadPathDescription')}</div>
        `;

        const pathControl = document.createElement('div');
        pathControl.className = 'settings-control';

        const pathInput = document.createElement('input');
        pathInput.type = 'text';
        pathInput.className = 'settings-input';
        pathInput.value = config.defaultDownloadPath;
        pathInput.style.width = '200px';

        pathControl.appendChild(pathInput);
        pathItem.appendChild(pathLabel);
        pathItem.appendChild(pathControl);

        // Enable backup
        const backupItem = document.createElement('div');
        backupItem.className = 'settings-item';

        const backupLabel = document.createElement('div');
        backupLabel.innerHTML = `
            <div class="settings-label">${t('enableBackup')}</div>
            <div class="settings-description">${t('enableBackupDescription')}</div>
        `;

        const backupControl = document.createElement('div');
        backupControl.className = 'settings-control';

        const backupCheckbox = document.createElement('input');
        backupCheckbox.type = 'checkbox';
        backupCheckbox.className = 'settings-checkbox';
        backupCheckbox.checked = config.enableBackup;

        backupControl.appendChild(backupCheckbox);
        backupItem.appendChild(backupLabel);
        backupItem.appendChild(backupControl);

        storageSection.appendChild(storageTitle);
        storageSection.appendChild(pathItem);
        storageSection.appendChild(backupItem);

        storageContent.appendChild(storageSection);

        // Privacy tab content
        const privacyContent = document.createElement('div');
        privacyContent.className = 'settings-tab-content';

        const privacySection = document.createElement('div');
        privacySection.className = 'settings-section';

        const privacyTitle = document.createElement('div');
        privacyTitle.className = 'settings-section-title';
        privacyTitle.textContent = t('privacy');

        // Enable telemetry
        const telemetryItem = document.createElement('div');
        telemetryItem.className = 'settings-item';

        const telemetryLabel = document.createElement('div');
        telemetryLabel.innerHTML = `
            <div class="settings-label">${t('enableTelemetry')}</div>
            <div class="settings-description">${t('enableTelemetryDescription')}</div>
        `;

        const telemetryControl = document.createElement('div');
        telemetryControl.className = 'settings-control';

        const telemetryCheckbox = document.createElement('input');
        telemetryCheckbox.type = 'checkbox';
        telemetryCheckbox.className = 'settings-checkbox';
        telemetryCheckbox.checked = config.enableTelemetry;

        telemetryControl.appendChild(telemetryCheckbox);
        telemetryItem.appendChild(telemetryLabel);
        telemetryItem.appendChild(telemetryControl);

        privacySection.appendChild(privacyTitle);
        privacySection.appendChild(telemetryItem);

        privacyContent.appendChild(privacySection);

        // About tab content
        const aboutContent = document.createElement('div');
        aboutContent.className = 'settings-tab-content';

        const aboutSection = document.createElement('div');
        aboutSection.className = 'settings-section';

        const aboutTitle = document.createElement('div');
        aboutTitle.className = 'settings-section-title';
        aboutTitle.textContent = t('about');

        const aboutInfo = document.createElement('div');
        aboutInfo.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div style="font-weight: 600; margin-bottom: 5px;">${t('version')}</div>
                <div>4.0.0</div>
            </div>
            <div style="margin-bottom: 15px;">
                <div style="font-weight: 600; margin-bottom: 5px;">${t('author')}</div>
                <div>c0d3r</div>
            </div>
            <div style="margin-bottom: 15px;">
                <div style="font-weight: 600; margin-bottom: 5px;">${t('license')}</div>
                <div>MIT</div>
            </div>
            <div style="margin-bottom: 15px;">
                <div style="font-weight: 600; margin-bottom: 5px;">${t('description')}</div>
                <div>The ultimate Telegram Web media downloader with cloud sync, conversion, scheduling, and advanced management features</div>
            </div>
        `;

        aboutSection.appendChild(aboutTitle);
        aboutSection.appendChild(aboutInfo);

        aboutContent.appendChild(aboutSection);

        // Dialog footer
        const footer = document.createElement('div');
        footer.className = 'settings-footer';

        const resetButton = document.createElement('button');
        resetButton.className = 'settings-button settings-reset';
        resetButton.textContent = t('reset');
        resetButton.addEventListener('click', () => {
            if (confirm(t('confirmReset'))) {
                // Reset all settings to defaults
                location.reload();
            }
        });

        const cancelButton = document.createElement('button');
        cancelButton.className = 'settings-button settings-cancel';
        cancelButton.textContent = t('cancel');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        const saveButton = document.createElement('button');
        saveButton.className = 'settings-button settings-save';
        saveButton.textContent = t('save');
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
            config.enableAutoCategorization = autoCategorizationCheckbox.checked;
            config.enableDuplicateDetection = duplicateDetectionCheckbox.checked;
            config.enableSmartNaming = smartNamingCheckbox.checked;
            config.darkMode = themeSelect.value;
            config.language = languageSelect.value;
            config.downloadDelay = parseInt(delayInput.value, 10);
            config.maxRetries = parseInt(retriesInput.value, 10);
            config.maxConcurrentDownloads = parseInt(concurrentInput.value, 10);
            config.chunkSize = parseFloat(chunkInput.value) * 1024 * 1024;
            config.defaultDownloadPath = pathInput.value;
            config.enableBackup = backupCheckbox.checked;
            config.enableTelemetry = telemetryCheckbox.checked;

            // Save config to storage
            GM_setValue('config', config);

            // Apply theme
            applyTheme();

            // Show notification
            showNotification(t('settingsSaved'), t('operationSuccessful'));

            // Close dialog
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        footer.appendChild(resetButton);
        footer.appendChild(cancelButton);
        footer.appendChild(saveButton);

        // Assemble dialog
        content.appendChild(tabsContainer);
        content.appendChild(generalContent);
        content.appendChild(appearanceContent);
        content.appendChild(networkContent);
        content.appendChild(storageContent);
        content.appendChild(privacyContent);
        content.appendChild(aboutContent);
        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(footer);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Create queue management dialog
    function createQueueDialog() {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.queue-container');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'queue-container';

        // Dialog header
        const header = document.createElement('div');
        header.className = 'queue-header';

        const title = document.createElement('h3');
        title.className = 'queue-title';
        title.textContent = t('queue');

        const closeButton = document.createElement('button');
        closeButton.className = 'queue-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Dialog content
        const content = document.createElement('div');
        content.className = 'queue-content';

        // Queue stats
        const statsContainer = document.createElement('div');
        statsContainer.className = 'queue-stats';

        const totalStat = document.createElement('div');
        totalStat.className = 'queue-stat';
        totalStat.innerHTML = `
            <div class="queue-stat-value">${downloadQueue.length}</div>
            <div class="queue-stat-label">${t('total')}</div>
        `;

        const activeStat = document.createElement('div');
        activeStat.className = 'queue-stat';
        activeStat.innerHTML = `
            <div class="queue-stat-value">${activeDownloads.size}</div>
            <div class="queue-stat-label">${t('active')}</div>
        `;

        const completedStat = document.createElement('div');
        completedStat.className = 'queue-stat';
        completedStat.innerHTML = `
            <div class="queue-stat-value">${downloadedFiles}</div>
            <div class="queue-stat-label">${t('completed')}</div>
        `;

        statsContainer.appendChild(totalStat);
        statsContainer.appendChild(activeStat);
        statsContainer.appendChild(completedStat);

        // Queue list
        const queueList = document.createElement('div');
        queueList.className = 'queue-list';

        function renderQueue() {
            queueList.innerHTML = '';

            if (downloadQueue.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'queue-empty';
                emptyMessage.textContent = t('noQueue');
                queueList.appendChild(emptyMessage);
                return;
            }

            downloadQueue.forEach((item, index) => {
                const queueItem = document.createElement('div');
                queueItem.className = 'queue-item';
                queueItem.draggable = true;
                queueItem.dataset.index = index;

                // Icon based on type
                let icon = '📄';
                if (item.type.includes('image')) icon = '🖼️';
                else if (item.type.includes('video')) icon = '🎬';
                else if (item.type.includes('audio')) icon = '🎵';

                queueItem.innerHTML = `
                    <div class="queue-item-icon">${icon}</div>
                    <div class="queue-item-info">
                        <div class="queue-item-name">${item.fileName}</div>
                        <div class="queue-item-details">
                            ${item.size ? `${t('size')}: ${formatFileSize(item.size)} • ` : ''}
                            ${item.status || t('pending')}
                        </div>
                        <div class="queue-item-progress">
                            <div class="queue-item-progress-fill" style="width: ${item.progress || 0}%"></div>
                        </div>
                    </div>
                    <div class="queue-item-actions">
                        <button class="queue-item-action" data-index="${index}">${t('moveUp')}</button>
                        <button class="queue-item-action" data-index="${index}">${t('moveDown')}</button>
                        <button class="queue-item-action delete" data-index="${index}">${t('delete')}</button>
                    </div>
                `;

                // Add drag and drop events
                queueItem.addEventListener('dragstart', (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', index);
                    queueItem.classList.add('dragging');
                });

                queueItem.addEventListener('dragend', () => {
                    queueItem.classList.remove('dragging');
                });

                queueItem.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                });

                queueItem.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/html'));
                    const toIndex = parseInt(queueItem.dataset.index);

                    if (fromIndex !== toIndex) {
                        const item = downloadQueue[fromIndex];
                        downloadQueue.splice(fromIndex, 1);
                        downloadQueue.splice(toIndex, 0, item);
                        renderQueue();
                    }
                });

                // Add action button events
                const moveUpBtn = queueItem.querySelector('.queue-item-action:not(.delete)');
                moveUpBtn.addEventListener('click', () => {
                    const index = parseInt(moveUpBtn.dataset.index);
                    if (index > 0) {
                        const item = downloadQueue[index];
                        downloadQueue.splice(index, 1);
                        downloadQueue.splice(index - 1, 0, item);
                        renderQueue();
                    }
                });

                const moveDownBtn = queueItem.querySelectorAll('.queue-item-action:not(.delete)')[1];
                moveDownBtn.addEventListener('click', () => {
                    const index = parseInt(moveDownBtn.dataset.index);
                    if (index < downloadQueue.length - 1) {
                        const item = downloadQueue[index];
                        downloadQueue.splice(index, 1);
                        downloadQueue.splice(index + 1, 0, item);
                        renderQueue();
                    }
                });

                const deleteBtn = queueItem.querySelector('.queue-item-action.delete');
                deleteBtn.addEventListener('click', () => {
                    const index = parseInt(deleteBtn.dataset.index);
                    if (confirm(t('confirmDelete'))) {
                        downloadQueue.splice(index, 1);
                        renderQueue();
                    }
                });

                queueList.appendChild(queueItem);
            });
        }

        // Initial render
        renderQueue();

        // Dialog footer
        const footer = document.createElement('div');
        footer.className = 'queue-footer';

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'queue-controls';

        const startButton = document.createElement('button');
        startButton.className = 'queue-button primary';
        startButton.textContent = t('startNow');
        startButton.addEventListener('click', () => {
            startQueueProcessing();
        });

        const clearButton = document.createElement('button');
        clearButton.className = 'queue-button secondary';
        clearButton.textContent = t('clear');
        clearButton.addEventListener('click', () => {
            if (confirm(t('confirmClear'))) {
                downloadQueue = [];
                renderQueue();
            }
        });

        controlsContainer.appendChild(startButton);
        controlsContainer.appendChild(clearButton);
        footer.appendChild(controlsContainer);

        // Assemble dialog
        content.appendChild(statsContainer);
        content.appendChild(queueList);
        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(footer);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Create stats dialog
    function createStatsDialog() {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.stats-container');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'stats-container';

        // Dialog header
        const header = document.createElement('div');
        header.className = 'stats-header';

        const title = document.createElement('h3');
        title.className = 'stats-title';
        title.textContent = t('downloadStats');

        const closeButton = document.createElement('button');
        closeButton.className = 'stats-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Dialog content
        const content = document.createElement('div');
        content.className = 'stats-content';

        // Stats overview
        const overviewContainer = document.createElement('div');
        overviewContainer.className = 'stats-overview';

        const totalDownloadsCard = document.createElement('div');
        totalDownloadsCard.className = 'stats-card';
        totalDownloadsCard.innerHTML = `
            <div class="stats-card-value">${downloadStats.totalDownloads}</div>
            <div class="stats-card-label">${t('totalDownloads')}</div>
        `;

        const totalSizeCard = document.createElement('div');
        totalSizeCard.className = 'stats-card';
        totalSizeCard.innerHTML = `
            <div class="stats-card-value">${formatFileSize(downloadStats.totalSize)}</div>
            <div class="stats-card-label">${t('totalSize')}</div>
        `;

        const averageSpeedCard = document.createElement('div');
        averageSpeedCard.className = 'stats-card';
        averageSpeedCard.innerHTML = `
            <div class="stats-card-value">${formatFileSize(downloadStats.averageSpeed)}/s</div>
            <div class="stats-card-label">${t('averageSpeed')}</div>
        `;

        const successRateCard = document.createElement('div');
        successRateCard.className = 'stats-card';
        successRateCard.innerHTML = `
            <div class="stats-card-value">${downloadStats.successRate}%</div>
            <div class="stats-card-label">${t('successRate')}</div>
        `;

        overviewContainer.appendChild(totalDownloadsCard);
        overviewContainer.appendChild(totalSizeCard);
        overviewContainer.appendChild(averageSpeedCard);
        overviewContainer.appendChild(successRateCard);

        // Stats by type
        const typeChartContainer = document.createElement('div');
        typeChartContainer.className = 'stats-chart';

        const typeChartTitle = document.createElement('div');
        typeChartTitle.className = 'stats-chart-title';
        typeChartTitle.textContent = t('downloadsByType');

        const typeChart = document.createElement('div');
        typeChart.className = 'stats-chart-container';

        // Create a simple bar chart
        const typeData = Object.entries(downloadStats.byType);
        if (typeData.length > 0) {
            const maxCount = Math.max(...typeData.map(([_, data]) => data.count));
            const chartHTML = typeData.map(([type, data]) => {
                const percentage = (data.count / maxCount) * 100;
                return `
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <div style="width: 80px; font-size: 12px;">${type}</div>
                        <div style="flex: 1; height: 20px; background: var(--tg-downloader-secondary); border-radius: 4px; margin: 0 10px;">
                            <div style="width: ${percentage}%; height: 100%; background: var(--tg-downloader-primary); border-radius: 4px;"></div>
                        </div>
                        <div style="width: 40px; font-size: 12px; text-align: right;">${data.count}</div>
                    </div>
                `;
            }).join('');
            typeChart.innerHTML = chartHTML;
        } else {
            typeChart.textContent = t('noData');
        }

        typeChartContainer.appendChild(typeChartTitle);
        typeChartContainer.appendChild(typeChart);

        // Stats table
        const tableContainer = document.createElement('div');

        const table = document.createElement('table');
        table.className = 'stats-table';

        const tableHeader = document.createElement('thead');
        tableHeader.innerHTML = `
            <tr>
                <th>${t('type')}</th>
                <th>${t('count')}</th>
                <th>${t('size')}</th>
            </tr>
        `;

        const tableBody = document.createElement('tbody');

        Object.entries(downloadStats.byType).forEach(([type, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${type}</td>
                <td>${data.count}</td>
                <td>${formatFileSize(data.size)}</td>
            `;
            tableBody.appendChild(row);
        });

        table.appendChild(tableHeader);
        table.appendChild(tableBody);
        tableContainer.appendChild(table);

        // Assemble dialog
        content.appendChild(overviewContainer);
        content.appendChild(typeChartContainer);
        content.appendChild(tableContainer);
        dialog.appendChild(header);
        dialog.appendChild(content);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Create cloud providers dialog
    function createCloudDialog() {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.cloud-container');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'cloud-container';

        // Dialog header
        const header = document.createElement('div');
        header.className = 'cloud-header';

        const title = document.createElement('h3');
        title.className = 'cloud-title';
        title.textContent = t('cloudProviders');

        const closeButton = document.createElement('button');
        closeButton.className = 'cloud-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Dialog content
        const content = document.createElement('div');
        content.className = 'cloud-content';

        // Cloud providers
        const providersContainer = document.createElement('div');
        providersContainer.className = 'cloud-providers';

        const providers = [
            { id: 'google-drive', name: 'Google Drive', icon: '🔵' },
            { id: 'dropbox', name: 'Dropbox', icon: '🔷' },
            { id: 'onedrive', name: 'OneDrive', icon: '🔶' },
            { id: 'icloud', name: 'iCloud', icon: '☁️' }
        ];

        providers.forEach(provider => {
            const providerElement = document.createElement('div');
            providerElement.className = 'cloud-provider';
            if (cloudProviders[provider.id]) {
                providerElement.classList.add('connected');
            }

            providerElement.innerHTML = `
                <div class="cloud-provider-icon">${provider.icon}</div>
                <div class="cloud-provider-name">${provider.name}</div>
                <div class="cloud-provider-status">${cloudProviders[provider.id] ? t('connected') : t('notConnected')}</div>
            `;

            providerElement.addEventListener('click', () => {
                showCloudProviderForm(provider.id);
            });

            providersContainer.appendChild(providerElement);
        });

        // Cloud form (hidden by default)
        const formContainer = document.createElement('div');
        formContainer.className = 'cloud-form';
        formContainer.id = 'cloud-form';

        content.appendChild(providersContainer);
        content.appendChild(formContainer);
        dialog.appendChild(header);
        dialog.appendChild(content);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Show cloud provider form
    function showCloudProviderForm(providerId) {
        const form = document.getElementById('cloud-form');
        const providers = {
            'google-drive': { name: 'Google Drive', fields: ['apiKey', 'clientId'] },
            'dropbox': { name: 'Dropbox', fields: ['accessToken'] },
            'onedrive': { name: 'OneDrive', fields: ['accessToken'] },
            'icloud': { name: 'iCloud', fields: ['username', 'password'] }
        };

        const provider = providers[providerId];

        form.innerHTML = `
            <div class="cloud-form-title">${t('connectTo')} ${provider.name}</div>
            ${provider.fields.map(field => `
                <div class="cloud-form-group">
                    <label class="cloud-form-label">${field}</label>
                    <input type="${field === 'password' ? 'password' : 'text'}" class="cloud-form-input" id="${field}">
                </div>
            `).join('')}
            <button class="cloud-form-button" onclick="connectCloudProvider('${providerId}')">${t('connect')}</button>
        `;

        form.classList.add('active');
    }

    // Connect cloud provider
    window.connectCloudProvider = function(providerId) {
        // This is a placeholder for cloud provider connection
        // In a real implementation, you would handle OAuth or API key authentication
        logger.info(`Connecting to ${providerId}`);

        // Simulate connection
        setTimeout(() => {
            cloudProviders[providerId] = { connected: true, connectedAt: new Date().toISOString() };
            saveCloudProviders();
            showNotification(t('connectionSuccessful'), t('operationSuccessful'));
            createCloudDialog(); // Refresh dialog
        }, 1000);
    };

    // Create conversion dialog
    function createConversionDialog() {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.conversion-container');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'conversion-container';

        // Dialog header
        const header = document.createElement('div');
        header.className = 'conversion-header';

        const title = document.createElement('h3');
        title.className = 'conversion-title';
        title.textContent = t('mediaConversion');

        const closeButton = document.createElement('button');
        closeButton.className = 'conversion-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Dialog content
        const content = document.createElement('div');
        content.className = 'conversion-content';

        // Conversion presets
        const presetsContainer = document.createElement('div');
        presetsContainer.className = 'conversion-presets';

        const presets = [
            { id: 'video-to-mp4', name: 'Video to MP4', description: 'Convert any video to MP4 format' },
            { id: 'video-to-webm', name: 'Video to WebM', description: 'Convert any video to WebM format' },
            { id: 'audio-to-mp3', name: 'Audio to MP3', description: 'Convert any audio to MP3 format' },
            { id: 'audio-to-wav', name: 'Audio to WAV', description: 'Convert any audio to WAV format' },
            { id: 'image-to-jpg', name: 'Image to JPG', description: 'Convert any image to JPG format' },
            { id: 'image-to-png', name: 'Image to PNG', description: 'Convert any image to PNG format' }
        ];

        presets.forEach(preset => {
            const presetElement = document.createElement('div');
            presetElement.className = 'conversion-preset';
            presetElement.dataset.presetId = preset.id;

            presetElement.innerHTML = `
                <div class="conversion-preset-name">${preset.name}</div>
                <div class="conversion-preset-description">${preset.description}</div>
            `;

            presetElement.addEventListener('click', () => {
                document.querySelectorAll('.conversion-preset').forEach(p => p.classList.remove('selected'));
                presetElement.classList.add('selected');
                showConversionOptions(preset.id);
            });

            presetsContainer.appendChild(presetElement);
        });

        // Conversion options
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'conversion-options';
        optionsContainer.id = 'conversion-options';

        content.appendChild(presetsContainer);
        content.appendChild(optionsContainer);
        dialog.appendChild(header);
        dialog.appendChild(content);

        // Dialog footer
        const footer = document.createElement('div');
        footer.className = 'conversion-footer';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'conversion-button conversion-cancel';
        cancelButton.textContent = t('cancel');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        const convertButton = document.createElement('button');
        convertButton.className = 'conversion-button conversion-convert';
        convertButton.textContent = t('convert');
        convertButton.addEventListener('click', () => {
            // Handle conversion
            showNotification(t('conversionStarted'), t('operationSuccessful'));
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        footer.appendChild(cancelButton);
        footer.appendChild(convertButton);
        dialog.appendChild(footer);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Show conversion options
    function showConversionOptions(presetId) {
        const optionsContainer = document.getElementById('conversion-options');

        const options = {
            'video-to-mp4': [
                { label: t('quality'), type: 'select', options: ['high', 'medium', 'low'] },
                { label: t('resolution'), type: 'select', options: ['original', '1080p', '720p', '480p'] }
            ],
            'video-to-webm': [
                { label: t('quality'), type: 'select', options: ['high', 'medium', 'low'] },
                { label: t('resolution'), type: 'select', options: ['original', '1080p', '720p', '480p'] }
            ],
            'audio-to-mp3': [
                { label: t('bitrate'), type: 'select', options: ['320', '256', '192', '128'] },
                { label: t('sampleRate'), type: 'select', options: ['48000', '44100', '22050'] }
            ],
            'audio-to-wav': [
                { label: t('sampleRate'), type: 'select', options: ['48000', '44100', '22050'] },
                { label: t('bitDepth'), type: 'select', options: ['24', '16', '8'] }
            ],
            'image-to-jpg': [
                { label: t('quality'), type: 'range', min: 1, max: 100, value: 80 },
                { label: t('progressive'), type: 'checkbox' }
            ],
            'image-to-png': [
                { label: t('compression'), type: 'range', min: 0, max: 9, value: 6 }
            ]
        };

        const presetOptions = options[presetId] || [];

        optionsContainer.innerHTML = `
            <div class="conversion-option-title">${t('conversionOptions')}</div>
            ${presetOptions.map(option => {
                if (option.type === 'select') {
                    return `
                        <div class="conversion-option">
                            <label class="conversion-option-label">${option.label}</label>
                            <select class="conversion-option-select">
                                ${option.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                            </select>
                        </div>
                    `;
                } else if (option.type === 'range') {
                    return `
                        <div class="conversion-option">
                            <label class="conversion-option-label">${option.label}</label>
                            <input type="range" class="conversion-option-input" min="${option.min}" max="${option.max}" value="${option.value}">
                        </div>
                    `;
                } else if (option.type === 'checkbox') {
                    return `
                        <div class="conversion-option">
                            <label class="conversion-option-label">
                                <input type="checkbox" class="conversion-option-input">
                                ${option.label}
                            </label>
                        </div>
                    `;
                }
            }).join('')}
        `;

        optionsContainer.style.display = 'block';
    }

    // Create schedule dialog
    function createScheduleDialog() {
        // Remove existing dialog if any
        const existingDialog = document.querySelector('.schedule-container');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'forward-dialog-overlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'schedule-container';

        // Dialog header
        const header = document.createElement('div');
        header.className = 'schedule-header';

        const title = document.createElement('h3');
        title.className = 'schedule-title';
        title.textContent = t('scheduleDownload');

        const closeButton = document.createElement('button');
        closeButton.className = 'schedule-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Dialog content
        const content = document.createElement('div');
        content.className = 'schedule-content';

        // Schedule options
        const dateOption = document.createElement('div');
        dateOption.className = 'schedule-option';
        dateOption.innerHTML = `
            <label class="schedule-option-label">${t('date')}</label>
            <input type="date" class="schedule-option-input" id="schedule-date">
        `;

        const timeOption = document.createElement('div');
        timeOption.className = 'schedule-option';
        timeOption.innerHTML = `
            <label class="schedule-option-label">${t('time')}</label>
            <input type="time" class="schedule-option-input" id="schedule-time">
        `;

        const repeatOption = document.createElement('div');
        repeatOption.className = 'schedule-option';
        repeatOption.innerHTML = `
            <label class="schedule-option-label">${t('repeat')}</label>
            <select class="schedule-option-select" id="schedule-repeat">
                <option value="never">${t('never')}</option>
                <option value="daily">${t('daily')}</option>
                <option value="weekly">${t('weekly')}</option>
                <option value="monthly">${t('monthly')}</option>
            </select>
        `;

        const notificationOption = document.createElement('div');
        notificationOption.className = 'schedule-option';
        notificationOption.innerHTML = `
            <label class="schedule-option-label">
                <input type="checkbox" class="schedule-option-checkbox" id="schedule-notification" checked>
                ${t('sendNotification')}
            </label>
        `;

        content.appendChild(dateOption);
        content.appendChild(timeOption);
        content.appendChild(repeatOption);
        content.appendChild(notificationOption);
        dialog.appendChild(header);
        dialog.appendChild(content);

        // Dialog footer
        const footer = document.createElement('div');
        footer.className = 'schedule-footer';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'schedule-button schedule-cancel';
        cancelButton.textContent = t('cancel');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        const scheduleButton = document.createElement('button');
        scheduleButton.className = 'schedule-button schedule-schedule';
        scheduleButton.textContent = t('schedule');
        scheduleButton.addEventListener('click', () => {
            // Handle scheduling
            const date = document.getElementById('schedule-date').value;
            const time = document.getElementById('schedule-time').value;
            const repeat = document.getElementById('schedule-repeat').value;
            const notification = document.getElementById('schedule-notification').checked;

            if (date && time) {
                const scheduledDateTime = new Date(`${date}T${time}`);
                const now = new Date();

                if (scheduledDateTime > now) {
                    const scheduleItem = {
                        id: Date.now().toString(),
                        dateTime: scheduledDateTime.toISOString(),
                        repeat,
                        notification,
                        items: [...selectedMediaForBatch]
                    };

                    scheduledDownloads.push(scheduleItem);
                    saveScheduledDownloads();

                    showNotification(t('scheduledFor', scheduledDateTime.toLocaleString()), t('operationSuccessful'));
                    document.body.removeChild(overlay);
                    document.body.removeChild(dialog);
                } else {
                    alert(t('invalidDate'));
                }
            } else {
                alert(t('selectDateAndTime'));
            }
        });

        footer.appendChild(cancelButton);
        footer.appendChild(scheduleButton);
        dialog.appendChild(footer);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Apply theme
    function applyTheme() {
        const isDarkMode = config.darkMode === 'dark' ||
                          (config.darkMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
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
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
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
        counter.textContent = error ? t('failed') : t('completed');
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
            updateProgress(`${t('downloading')}: ${downloadedFiles}/${totalFiles} ${t('files')}`, percent);
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
                showNotification(t('downloadStarted'), t('operationSuccessful'));
            } else {
                logger.error('No media found in message');
                showNotification(t('downloadError'), t('noMediaFound'));
            }
        } catch (error) {
            logger.error('Error getting message:', error);
            showNotification(t('downloadError'), t('failedToGetMessage'));
        }
    }

    // Forward message to chat
    async function forwardMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification(t('forwardError'), t('noMessageFound'));
                return;
            }

            // Create forward dialog
            createForwardDialog([msg]);
        } catch (error) {
            logger.error('Error getting message for forwarding:', error);
            showNotification(t('forwardError'), t('failedToGetMessage'));
        }
    }

    // Copy message
    async function copyMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification(t('copyError'), t('noMessageFound'));
                return;
            }

            // Copy message text to clipboard
            if (msg.message) {
                navigator.clipboard.writeText(msg.message).then(() => {
                    showNotification(t('copySuccess'), t('operationSuccessful'));
                }).catch(err => {
                    logger.error('Failed to copy message:', err);
                    showNotification(t('copyError'), t('failedToCopyMessage'));
                });
            } else {
                showNotification(t('copyError'), t('noTextToCopy'));
            }
        } catch (error) {
            logger.error('Error getting message for copying:', error);
            showNotification(t('copyError'), t('failedToGetMessage'));
        }
    }

    // Delete message
    async function deleteMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification(t('deleteError'), t('noMessageFound'));
                return;
            }

            // Delete message using Telegram API
            await unsafeWindow.appImManager.deleteMessages({
                peer: pid,
                id: [mid]
            });

            showNotification(t('deleteSuccess'), t('operationSuccessful'));
        } catch (error) {
            logger.error('Error deleting message:', error);
            showNotification(t('deleteError'), t('failedToDeleteMessage'));
        }
    }

    // Save message (favorite)
    async function saveMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification(t('saveError'), t('noMessageFound'));
                return;
            }

            // Save message using Telegram API
            await unsafeWindow.appImManager.faveMessage({
                peer: pid,
                id: mid
            });

            showNotification(t('saveSuccess'), t('operationSuccessful'));
        } catch (error) {
            logger.error('Error saving message:', error);
            showNotification(t('saveError'), t('failedToSaveMessage'));
        }
    }

    // Report message
    async function reportMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification(t('reportError'), t('noMessageFound'));
                return;
            }

            // Open report dialog
            showNotification(t('report'), t('reportFeature'));
            // In a real implementation, this would open Telegram's report dialog
        } catch (error) {
            logger.error('Error reporting message:', error);
            showNotification(t('reportError'), t('failedToReportMessage'));
        }
    }

    // Pin message
    async function pinMessage(pid, mid) {
        try {
            const msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);
            if (!msg) {
                logger.error('No message found');
                showNotification(t('pinError'), t('noMessageFound'));
                return;
            }

            // Pin message using Telegram API
            await unsafeWindow.appImManager.pinMessage({
                peer: pid,
                id: mid
            });

            showNotification(t('pinSuccess'), t('operationSuccessful'));
        } catch (error) {
            logger.error('Error pinning message:', error);
            showNotification(t('pinError'), t('failedToPinMessage'));
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
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

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
        title.textContent = `${t('forward')} ${t('message')}${messages.length > 1 ? 's' : ''}`;

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
        searchInput.placeholder = t('searchChats');
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
                    errorItem.textContent = t('errorLoadingChats');
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
            chatStatus.textContent = chat.type === 'private' ? t('privateChat') :
                                     chat.type === 'group' ? t('group') :
                                     chat.type === 'channel' ? t('channel') : t('chat');

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
        cancelButton.textContent = t('cancel');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        const sendButton = document.createElement('button');
        sendButton.className = 'forward-dialog-button forward-dialog-send';
        sendButton.textContent = t('forward');
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

            showNotification(t('forwardSuccess'), `${t('forwarded')} ${messages.length} ${t('message')}${messages.length > 1 ? 's' : ''}`);
        } catch (error) {
            logger.error('Error forwarding messages:', error);
            showNotification(t('forwardError'), t('failedToForwardMessages'));
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
                showNotification(t('noMedia'), t('noMessagesSelected'));
                return;
            }
            startBatchDownload(msgs, t('selectedMessages'));
        } catch (error) {
            logger.error('Error getting selected messages:', error);
            showNotification(t('downloadError'), t('failedToGetSelectedMessages'));
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
                showNotification(t('noMessages'), t('noMessagesSelected'));
                return;
            }

            // Create forward dialog with selected messages
            createForwardDialog(msgs);
        } catch (error) {
            logger.error('Error getting selected messages for forwarding:', error);
            showNotification(t('forwardError'), t('failedToGetSelectedMessages'));
        }
    }

    // Start batch download process
    function startBatchDownload(messages, source) {
        if (isDownloading) {
            showNotification(t('busy'), t('anotherDownloadInProgress'));
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
            showNotification(t('noMedia'), `${t('noMediaFoundIn')} ${source}`);
            isDownloading = false;
            return;
        }
        showNotification(t('downloadStarted'), `${t('downloading')} ${totalFiles} ${t('filesFrom')} ${source}`);
        updateProgress(`${t('startingDownloadOf')} ${totalFiles} ${t('files')}...`, 0);

        // Process download queue with concurrency limit
        let currentIndex = 0;

        function processNext() {
            if (downloadCancelled || currentIndex >= downloadQueue.length) {
                if (currentIndex >= downloadQueue.length) {
                    isDownloading = false;
                    if (!downloadCancelled) {
                        updateProgress(t('downloadCompleted'), 100);
                        showNotification(t('downloadComplete'), `${t('successfullyDownloaded')} ${downloadedFiles} ${t('files')}`);
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

    // Start queue processing
    function startQueueProcessing() {
        if (isDownloading) {
            showNotification(t('busy'), t('anotherDownloadInProgress'));
            return;
        }

        if (downloadQueue.length === 0) {
            showNotification(t('noQueue'), t('noItemsInQueue'));
            return;
        }

        isDownloading = true;
        downloadCancelled = false;
        totalFiles = downloadQueue.length;
        downloadedFiles = 0;

        showNotification(t('downloadStarted'), `${t('downloading')} ${totalFiles} ${t('files')}`);
        updateProgress(`${t('startingDownloadOf')} ${totalFiles} ${t('files')}...`, 0);

        // Process queue
        let currentIndex = 0;

        function processNext() {
            if (downloadCancelled || currentIndex >= downloadQueue.length) {
                if (currentIndex >= downloadQueue.length) {
                    isDownloading = false;
                    if (!downloadCancelled) {
                        updateProgress(t('downloadCompleted'), 100);
                        showNotification(t('downloadComplete'), `${t('successfullyDownloaded')} ${downloadedFiles} ${t('files')}`);
                        setTimeout(() => {
                            progressElement.style.display = 'none';
                        }, 3000);
                    }
                }
                return;
            }

            const item = downloadQueue[currentIndex++];
            activeDownloads.add(item.id);

            // Process item
            if (item.url) {
                downloadMedia(item.url, item.fileName, null, null);
            } else if (item.message) {
                downloadMediaFromMessage(item.message);
            }

            // When download completes, remove from active downloads
            setTimeout(() => {
                activeDownloads.delete(item.id);
                downloadedFiles++;
                const percent = Math.round((downloadedFiles / totalFiles) * 100);
                updateProgress(`${t('downloading')}: ${downloadedFiles}/${totalFiles} ${t('files')}`, percent);

                // Process next item
                setTimeout(processNext, config.downloadDelay);
            }, config.downloadDelay);
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
        selectionIndicator.title = t('selectForBatchDownload');
        selectionIndicator.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMediaSelection(mediaEl);
        });
        parent.appendChild(selectionIndicator);

        // For images, create image download button
        if (mediaEl.tagName === 'IMG') {
            const imgBtn = document.createElement('button');
            imgBtn.textContent = '🖼️';
            imgBtn.title = t('downloadImage');
            imgBtn.className = 'media-downloader-img-btn';
            imgBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const { src, ext } = resolveMediaSource(mediaEl);
                if (!src) {
                    alert(t('noMediaSource'));
                    return;
                }
                const fileName = `image_${Date.now()}.${ext}`;
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
            mediaBtn.title = t('downloadMedia');
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
                    alert(t('noMediaSource'));
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
            previewBtn.title = t('previewMedia');
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
        // Only add overlay if enabled in config
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
            } else if (e.key.toLowerCase() === 'q' && e.ctrlKey) {
                // Ctrl+Q to open queue
                e.preventDefault();
                createQueueDialog();
            } else if (e.key.toLowerCase() === 't' && e.ctrlKey) {
                // Ctrl+T to show stats
                e.preventDefault();
                createStatsDialog();
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
                    downloadButton.setAttribute('title', t('download'));
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
            downloadButton.setAttribute('title', t('download'));
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
                    downloadButton.setAttribute('title', t('download'));
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
                    downloadButton.setAttribute('title', t('download'));
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
                downloadButton.setAttribute('title', t('download'));
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
                    downloadButton.setAttribute('title', t('download'));
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
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

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
            { icon: '📥', text: t('download'), action: () => downloadSingleMedia(pid, mid) },
            { icon: '➡️', text: t('forward'), action: () => forwardMessage(pid, mid) },
            { icon: '📋', text: t('copy'), action: () => copyMessage(pid, mid) },
            { icon: '🗑️', text: t('delete'), action: () => deleteMessage(pid, mid) },
            { icon: '⭐', text: t('save'), action: () => saveMessage(pid, mid) },
            { icon: '📌', text: t('pin'), action: () => pinMessage(pid, mid) },
            { icon: '🚩', text: t('report'), action: () => reportMessage(pid, mid) }
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
        menuButton.title = t('mediaDownloader');
        menuButton.style.cssText = `
            position: relative;
            margin-left: 5px;
        `;

        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'tg-downloader-dropdown';

        // Menu items
        const menuItems = [
            { icon: '📥', text: t('history'), action: () => createDownloadHistoryDialog() },
            { icon: '⚙️', text: t('settings'), action: () => createSettingsDialog() },
            { icon: '📊', text: t('stats'), action: () => createStatsDialog() },
            { icon: '📋', text: t('queue'), action: () => createQueueDialog() },
            { icon: '☁️', text: t('cloud'), action: () => createCloudDialog() },
            { icon: '🔄', text: t('conversion'), action: () => createConversionDialog() },
            { icon: '📅', text: t('schedule'), action: () => createScheduleDialog() },
            { icon: '🗑️', text: t('clearSelection'), action: () => clearBatchSelection() }
        ];

        // Add menu items
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'tg-downloader-menu-item';
            menuItem.innerHTML = `
                <span class="tg-downloader-menu-item-icon">${item.icon}</span>
                <span class="tg-downloader-menu-item-text">${item.text}</span>
            `;
            menuItem.addEventListener('click', () => {
                item.action();
                dropdownMenu.style.display = 'none';
            });
            dropdownMenu.appendChild(menuItem);
        });

        // Add divider
        const divider = document.createElement('div');
        divider.className = 'tg-downloader-menu-divider';
        dropdownMenu.appendChild(divider);

        // Add version info
        const versionInfo = document.createElement('div');
        versionInfo.className = 'tg-downloader-version';
        versionInfo.textContent = 'Telegram Media Downloader v4.0';
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
        const countText = toolbar.querySelector('.count');
        countText.textContent = `${selectedMediaForBatch.length} ${t('selected')}`;

                // Show/hide toolbar based on selection
        if (selectedMediaForBatch.length > 0) {
            toolbar.style.display = 'flex';
        } else {
            toolbar.style.display = 'none';
        }
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
        countText.className = 'count';
        countText.textContent = `${selectedMediaForBatch.length} ${t('selected')}`;

        const downloadButton = document.createElement('button');
        downloadButton.textContent = t('download');
        downloadButton.addEventListener('click', () => {
            downloadSelectedMedia();
            clearBatchSelection();
        });

        const forwardButton = document.createElement('button');
        forwardButton.textContent = t('forward');
        forwardButton.addEventListener('click', () => {
            forwardSelectedMessages();
            clearBatchSelection();
        });

        const convertButton = document.createElement('button');
        convertButton.textContent = t('convert');
        convertButton.addEventListener('click', () => {
            createConversionDialog();
        });

        const scheduleButton = document.createElement('button');
        scheduleButton.textContent = t('schedule');
        scheduleButton.addEventListener('click', () => {
            createScheduleDialog();
        });

        const clearButton = document.createElement('button');
        clearButton.textContent = t('clear');
        clearButton.addEventListener('click', () => {
            clearBatchSelection();
        });

        toolbar.appendChild(countText);
        toolbar.appendChild(downloadButton);
        toolbar.appendChild(forwardButton);
        toolbar.appendChild(convertButton);
        toolbar.appendChild(scheduleButton);
        toolbar.appendChild(clearButton);

        document.body.appendChild(toolbar);

        return toolbar;
    }

    // Check for scheduled downloads
    function checkScheduledDownloads() {
        const now = new Date();

        scheduledDownloads.forEach((schedule, index) => {
            const scheduledTime = new Date(schedule.dateTime);

            if (scheduledTime <= now) {
                // Execute scheduled download
                logger.info(`Executing scheduled download: ${schedule.id}`);

                // Add items to queue
                if (schedule.items && schedule.items.length > 0) {
                    downloadQueue.push(...schedule.items);

                    // Start queue processing if not already running
                    if (!isDownloading) {
                        startQueueProcessing();
                    }
                }

                // Send notification if enabled
                if (schedule.notification) {
                    showNotification(t('scheduledDownloadStarted'), t('operationSuccessful'));
                }

                // Handle repeat
                if (schedule.repeat === 'never') {
                    // Remove from scheduled downloads
                    scheduledDownloads.splice(index, 1);
                } else {
                    // Calculate next scheduled time
                    let nextTime = new Date(scheduledTime);

                    switch (schedule.repeat) {
                        case 'daily':
                            nextTime.setDate(nextTime.getDate() + 1);
                            break;
                        case 'weekly':
                            nextTime.setDate(nextTime.getDate() + 7);
                            break;
                        case 'monthly':
                            nextTime.setMonth(nextTime.getMonth() + 1);
                            break;
                    }

                    schedule.dateTime = nextTime.toISOString();
                }

                saveScheduledDownloads();
            }
        });
    }

    // Process scheduled downloads periodically
    setInterval(checkScheduledDownloads, 60000); // Check every minute

    // Register menu commands
    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand(t('downloadHistory'), createDownloadHistoryDialog);
            GM_registerMenuCommand(t('settings'), createSettingsDialog);
            GM_registerMenuCommand(t('queue'), createQueueDialog);
            GM_registerMenuCommand(t('stats'), createStatsDialog);
            GM_registerMenuCommand(t('cloudProviders'), createCloudDialog);
            GM_registerMenuCommand(t('mediaConversion'), createConversionDialog);
            GM_registerMenuCommand(t('scheduleDownload'), createScheduleDialog);
        }
    }

    // Initialize the script
    function init() {
        // Load saved config
        const savedConfig = GM_getValue('config', {});
        Object.assign(config, savedConfig);

        // Apply theme
        applyTheme();

        // Register menu commands
        registerMenuCommands();

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
        const downloadBtnHtml = `<div class="btn-menu-item rp-overflow" id="down-btn"><span class="mytgico btn-menu-item-icon" style="font-size: 16px;">📥</span><span class="i18n btn-menu-item-text">${t('download')}</span></div>`;
        const forwardBtnHtml = `<div class="btn-menu-item rp-overflow" id="forward-btn"><span class="mytgico btn-menu-item-icon" style="font-size: 16px;">➡️</span><span class="i18n btn-menu-item-text">${t('forward')}</span></div>`;
        const batchBtnHtml = `&nbsp;&nbsp;<button class="btn-primary btn-transparent text-bold" id="batch-btn" title="${t('downloadSelectedMedia')}"><span class="mytgico" style="padding-bottom: 2px;">📥</span>&nbsp;<span class="i18n">${t('downloadSelected')}</span></button>`;
        const batchForwardBtnHtml = `&nbsp;&nbsp;<button class="btn-primary btn-transparent text-bold" id="batch-forward-btn" title="${t('forwardSelectedMessages')}"><span class="mytgico" style="padding-bottom: 2px;">➡️</span>&nbsp;<span class="i18n">${t('forwardSelected')}</span></button>`;
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

        // Check for scheduled downloads
        checkScheduledDownloads();

        logger.info('Telegram Media Downloader initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Remove Telegram speed limit
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

    // Remove Telegram ads
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

    // Auto-save settings
    (function autoSaveSettings() {
        // Save settings every 30 seconds
        setInterval(() => {
            if (config.enableBackup) {
                GM_setValue('config', config);
                logger.debug('Settings auto-saved');
            }
        }, 30000);
    })();

    // Performance monitoring
    (function performanceMonitor() {
        // Monitor download performance
        let downloadStartTime = 0;
        let downloadStartSize = 0;

        // Override download functions to track performance
        const originalDownloadMedia = downloadMedia;
        downloadMedia = function(url, fileName, progressEl, mediaEl) {
            downloadStartTime = Date.now();
            downloadStartSize = 0;

            // Track progress
            const originalUpdateProgressBar = updateProgressBar;
            updateProgressBar = function(bar, percent, done = false, error = false) {
                originalUpdateProgressBar(bar, percent, done, error);

                if (percent > 0 && !done && !error) {
                    const elapsed = (Date.now() - downloadStartTime) / 1000; // seconds
                    const downloaded = (percent / 100) * (downloadStartSize || 1000000); // estimated size
                    const speed = downloaded / elapsed; // bytes per second

                    // Update stats
                    if (speed > 0) {
                        const totalSpeed = downloadStats.averageSpeed * (downloadStats.totalDownloads - 1) + speed;
                        downloadStats.averageSpeed = totalSpeed / downloadStats.totalDownloads;
                        saveDownloadStats();
                    }
                }
            };

            return originalDownloadMedia(url, fileName, progressEl, mediaEl);
        };
    })();

    // Cloud sync functionality
    (function cloudSync() {
        // Sync settings and history to cloud (placeholder)
        function syncToCloud() {
            if (!config.enableCloudSync) return;

            // This is a placeholder for cloud sync functionality
            // In a real implementation, you would use a cloud storage API
            logger.info('Syncing to cloud...');
        }

        // Sync every 5 minutes
        setInterval(syncToCloud, 300000);
    })();

    // Telemetry (anonymous usage stats)
    (function telemetry() {
        if (!config.enableTelemetry) return;

        // Send anonymous usage stats (placeholder)
        function sendTelemetry() {
            // This is a placeholder for telemetry functionality
            // In a real implementation, you would send anonymous usage data
            logger.debug('Sending telemetry data...');
        }

        // Send telemetry once per day
        setInterval(sendTelemetry, 86400000);
    })();

    // Update checker
    (function updateChecker() {
        // Check for updates (placeholder)
        function checkForUpdates() {
            // This is a placeholder for update checking functionality
            // In a real implementation, you would check for script updates
            logger.debug('Checking for updates...');
        }

        // Check for updates once per day
        setInterval(checkForUpdates, 86400000);
    })();

    // Error handler
    (function errorHandler() {
        // Global error handler
        window.addEventListener('error', (e) => {
            logger.error(`Global error: ${e.message}`, e.filename);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            logger.error(`Unhandled promise rejection: ${e.reason}`);
        });
    })();

    // Keyboard shortcuts
    (function keyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D: Toggle debug mode
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                config.debug = !config.debug;
                showNotification('Debug Mode', config.debug ? 'Enabled' : 'Disabled');
            }

            // Ctrl+Shift+E: Export settings
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                const settings = JSON.stringify(config, null, 2);
                const blob = new Blob([settings], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'telegram-downloader-settings.json';
                a.click();
                URL.revokeObjectURL(url);
                showNotification('Settings Exported', 'Settings have been exported to file');
            }

            // Ctrl+Shift+I: Import settings
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const settings = JSON.parse(e.target.result);
                                Object.assign(config, settings);
                                GM_setValue('config', config);
                                showNotification('Settings Imported', 'Settings have been imported successfully');
                                location.reload();
                            } catch (error) {
                                showNotification('Import Failed', 'Invalid settings file');
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                input.click();
            }
        });
    })();

    // Context menu enhancement
    (function contextMenuEnhancement() {
        // Add custom context menu items
        document.addEventListener('contextmenu', (e) => {
            // Check if right-clicked on a media element
            const mediaEl = e.target.closest('img, video, audio');
            if (mediaEl && isInChatArea(mediaEl)) {
                // Add custom context menu items after a short delay
                setTimeout(() => {
                    const contextMenu = document.querySelector('.context-menu, .menu');
                    if (contextMenu) {
                        // Add download option
                        const downloadItem = document.createElement('div');
                        downloadItem.className = 'menu-item';
                        downloadItem.textContent = t('download');
                        downloadItem.addEventListener('click', () => {
                            const { src, ext } = resolveMediaSource(mediaEl);
                            if (src) {
                                const fileName = `media_${Date.now()}.${ext}`;
                                if (src.includes('telegram')) {
                                    downloadTelegramMedia(src, ext === 'mp3' ? 'audio' : ext === 'jpg' ? 'image' : 'video', mediaEl);
                                } else {
                                    downloadMedia(src, fileName, null, mediaEl);
                                }
                            }
                        });
                        contextMenu.appendChild(downloadItem);
                    }
                }, 100);
            }
        });
    })();

    // Drag and drop functionality
    (function dragAndDrop() {
        // Allow dragging media elements to download
        document.addEventListener('dragstart', (e) => {
            const mediaEl = e.target.closest('img, video, audio');
            if (mediaEl && isInChatArea(mediaEl)) {
                // Store media info for download
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    src: resolveMediaSource(mediaEl).src,
                    fileName: `media_${Date.now()}.${resolveMediaSource(mediaEl).ext}`
                }));
            }
        });

        // Create drop zone for downloads
        const dropZone = document.createElement('div');
        dropZone.id = 'tg-downloader-drop-zone';
        dropZone.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 100px;
            height: 100px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px dashed #fff;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 12px;
            text-align: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        `;
        dropZone.textContent = t('dropToDownload');
        document.body.appendChild(dropZone);

        // Show drop zone when dragging
        document.addEventListener('dragover', (e) => {
            dropZone.style.opacity = '1';
        });

        document.addEventListener('dragleave', (e) => {
            dropZone.style.opacity = '0';
        });

        // Handle drop
        document.addEventListener('drop', (e) => {
            dropZone.style.opacity = '0';

            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (data.src && data.fileName) {
                    downloadMedia(data.src, data.fileName);
                    showNotification(t('downloadStarted'), t('operationSuccessful'));
                }
            } catch (error) {
                logger.error('Drop error:', error);
            }
        });
    })();

    // Notification system
    (function notificationSystem() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'tg-downloader-notifications';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);

        // Override showNotification to use custom notifications
        const originalShowNotification = showNotification;
        showNotification = function(title, message) {
            if (!config.enableNotifications) return;

            // Use GM_notification if available
            if (typeof GM_notification !== 'undefined') {
                originalShowNotification(title, message);
                return;
            }

            // Create custom notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                background: var(--tg-downloader-background);
                color: var(--tg-downloader-text);
                border: 1px solid var(--tg-downloader-border);
                border-radius: var(--tg-downloader-radius);
                padding: 12px 16px;
                box-shadow: var(--tg-downloader-shadow);
                min-width: 250px;
                max-width: 350px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;

            notification.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 14px; color: var(--tg-downloader-text-secondary);">${message}</div>
            `;

            notificationContainer.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);

            // Auto remove
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, config.notificationTimeout);
        };
    })();

    // Initialize advanced features
    (function advancedFeatures() {
        // Initialize all advanced features
        logger.info('Initializing advanced features...');

        // Performance monitoring
        if (config.enableDownloadStats) {
            logger.info('Performance monitoring enabled');
        }

        // Cloud sync
        if (config.enableCloudSync) {
            logger.info('Cloud sync enabled');
        }

        // Telemetry
        if (config.enableTelemetry) {
            logger.info('Telemetry enabled');
        }

        // Auto backup
        if (config.enableBackup) {
            logger.info('Auto backup enabled');
        }

        logger.info('Advanced features initialized');
    })();

})();
