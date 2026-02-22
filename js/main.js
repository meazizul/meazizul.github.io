        document.getElementById('year').textContent = new Date().getFullYear();

        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;
        
        // Check for saved theme preference or default to light (OpenAI style)
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
        }
        // Light is default - no attribute needed
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            if (newTheme === 'dark') {
                htmlElement.setAttribute('data-theme', 'dark');
            } else {
                htmlElement.removeAttribute('data-theme');
            }
            
            localStorage.setItem('theme', newTheme);
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // ==========================================
        // AI WISDOM WIDGET (Subtle Affirmations)
        // ==========================================
        const wisdomWidget = document.getElementById('wisdom-widget');
        const wisdomToggle = document.getElementById('wisdom-toggle');
        const wisdomCard = document.getElementById('wisdom-card');
        const wisdomText = document.getElementById('wisdom-text');
        const wisdomImage = document.getElementById('wisdom-image');

        const affirmations = [
            { text: "Your neural networks aren't the only things learning—you're growing every day.", img: "assets/affirmations/101.jpg" },
            { text: "Every gradient descent leads somewhere meaningful.", img: "assets/affirmations/102.jpg" },
            { text: "The best models are built by curious minds like yours.", img: "assets/affirmations/103.jpg" },
            { text: "Your attention mechanism is focused on the right things.", img: "assets/affirmations/104.jpg" },
            { text: "You're not just training models, you're shaping the future.", img: "assets/affirmations/105.jpg" },
            { text: "Even transformers started with a single attention head.", img: "assets/affirmations/106.jpg" },
            { text: "Your loss function is decreasing—keep iterating.", img: "assets/affirmations/107.jpg" },
            { text: "Behind every breakthrough is someone who refused to stop fine-tuning.", img: "assets/affirmations/108.jpg" },
            { text: "Your embeddings capture more dimensions than you realize.", img: "assets/affirmations/109.jpg" },
            { text: "Every epoch brings you closer to convergence.", img: "assets/affirmations/110.jpg" },
            { text: "The world needs engineers who care about AI ethics. You matter.", img: "assets/affirmations/201.jpg" },
            { text: "AGI might be uncertain, but your potential isn't.", img: "assets/affirmations/202.jpg" },
            { text: "You're the human in human-AI collaboration.", img: "assets/affirmations/203.jpg" },
            { text: "The best hyperparameter you have is persistence.", img: "assets/affirmations/204.jpg" },
            { text: "Your career trajectory has the best optimizer: you.", img: "assets/affirmations/205.jpg" },
            { text: "Regularization keeps models from overfitting. Rest keeps you from burning out.", img: "assets/affirmations/302.jpg" },
            { text: "The most powerful compute is a well-rested mind.", img: "assets/affirmations/303.jpg" },
            { text: "Even GPUs need cooling. Take a break.", img: "assets/affirmations/304.jpg" },
            { text: "Dropout makes networks stronger. Setbacks make you resilient.", img: "assets/affirmations/401.jpg" },
            { text: "Like skip connections, your past experiences strengthen who you are today.", img: "assets/affirmations/403.jpg" },
            { text: "Ensemble methods work because diversity is powerful. So are you.", img: "assets/affirmations/404.jpg" },
            { text: "You're not stuck in a local minimum—you're gathering momentum.", img: "assets/affirmations/408.jpg" },
            { text: "The next big paper might have your name on it.", img: "assets/affirmations/501.jpg" },
            { text: "Innovation doesn't require permission. Keep building.", img: "assets/affirmations/503.jpg" },
            { text: "Latent space is full of possibilities. So is your future.", img: "assets/affirmations/509.jpg" }
        ];

        let wisdomIndex = Math.floor(Math.random() * affirmations.length);

        // Preload images
        affirmations.forEach(aff => {
            const img = new Image();
            img.src = aff.img;
        });

        function showWisdom() {
            const aff = affirmations[wisdomIndex];
            wisdomText.textContent = `"${aff.text}"`;
            wisdomImage.src = aff.img;
        }

        function nextWisdom() {
            wisdomIndex = (wisdomIndex + 1) % affirmations.length;
            showWisdom();
        }

        // Initialize
        showWisdom();

        // Toggle widget
        if (wisdomToggle) {
            wisdomToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                wisdomWidget.classList.toggle('open');
            });
        }

        // Click card for next wisdom
        if (wisdomCard) {
            wisdomCard.addEventListener('click', nextWisdom);
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (wisdomWidget && !wisdomWidget.contains(e.target)) {
                wisdomWidget.classList.remove('open');
            }
        });

        // Computer Vision Filters for Profile Picture
        const profileImg = document.getElementById('profile-img');
        const profileCanvas = document.getElementById('profile-canvas');
        const profileCtx = profileCanvas.getContext('2d');
        const filterSelect = document.getElementById('cv-filter-select');
        const cvInfoBtn = document.getElementById('cv-info-btn');
        const cvTooltip = document.getElementById('cv-tooltip');
        const tooltipTitle = document.getElementById('tooltip-title');
        const tooltipDesc = document.getElementById('tooltip-desc');
        const tooltipKernel = document.getElementById('tooltip-kernel');
        
        let originalImageData = null;

        // Filter information for tooltips
        const filterInfo = {
            original: {
                title: 'Original Image',
                desc: 'No kernel applied. The raw RGB image data as captured by the camera.',
                kernel: ''
            },
            sobel: {
                title: 'Sobel Edge Detection',
                desc: 'Computes image gradients using convolution kernels to detect edges. Combines horizontal (Gx) and vertical (Gy) derivatives.',
                kernel: 'Gx:          Gy:\n[-1  0  1]   [-1 -2 -1]\n[-2  0  2]   [ 0  0  0]\n[-1  0  1]   [ 1  2  1]'
            },
            prewitt: {
                title: 'Prewitt Edge Detection',
                desc: 'Similar to Sobel but with uniform weights. Less sensitive to noise but may miss fine details.',
                kernel: 'Gx:          Gy:\n[-1  0  1]   [-1 -1 -1]\n[-1  0  1]   [ 0  0  0]\n[-1  0  1]   [ 1  1  1]'
            },
            laplacian: {
                title: 'Laplacian Kernel',
                desc: 'Second-order derivative operator that detects edges in all directions. Sensitive to noise but finds fine edges.',
                kernel: '[ 0 -1  0 ]\n[-1  4 -1 ]\n[ 0 -1  0 ]'
            },
            gaussian: {
                title: 'Gaussian Blur',
                desc: 'Smooths the image using a weighted average kernel that approximates a Gaussian distribution. Reduces noise and detail.',
                kernel: '1/16 × [ 1  2  1 ]\n       [ 2  4  2 ]\n       [ 1  2  1 ]'
            },
            box: {
                title: 'Box Blur (Mean Kernel)',
                desc: 'Simple averaging kernel that replaces each pixel with the mean of its neighbors. Fast but can cause blocky artifacts.',
                kernel: '1/9 × [ 1  1  1 ]\n      [ 1  1  1 ]\n      [ 1  1  1 ]'
            },
            grayscale: {
                title: 'Grayscale Conversion',
                desc: 'Converts RGB to luminance using perceptual weights based on human eye sensitivity to different wavelengths.',
                kernel: 'Y = 0.299R + 0.587G + 0.114B\n\n(ITU-R BT.601 standard)'
            },
            threshold: {
                title: 'Binary Threshold',
                desc: 'Converts grayscale to binary (black/white) based on a threshold value. Used in segmentation and OCR preprocessing.',
                kernel: 'if (pixel > 128)\n  output = 255\nelse\n  output = 0'
            },
            sharpen: {
                title: 'Sharpening Kernel',
                desc: 'Enhances edges by subtracting a blurred version from the original. Uses a high-pass kernel.',
                kernel: '[ 0 -1  0 ]\n[-1  5 -1 ]\n[ 0 -1  0 ]'
            },
            emboss: {
                title: 'Emboss Effect',
                desc: 'Creates a 3D relief effect by computing directional gradients, making the image appear raised or stamped.',
                kernel: '[-2 -1  0 ]\n[-1  1  1 ]\n[ 0  1  2 ]'
            },
            sepia: {
                title: 'Sepia Tone',
                desc: 'Applies a warm brownish tone reminiscent of antique photographs. Uses a color transformation matrix.',
                kernel: 'R\' = 0.393R + 0.769G + 0.189B\nG\' = 0.349R + 0.686G + 0.168B\nB\' = 0.272R + 0.534G + 0.131B'
            },
            invert: {
                title: 'Color Inversion (Negative)',
                desc: 'Inverts all color values, creating a photographic negative effect. Each channel: output = 255 - input.',
                kernel: 'R\' = 255 - R\nG\' = 255 - G\nB\' = 255 - B'
            }
        };

        // Load and draw the original image
        profileImg.onload = function() {
            profileCtx.drawImage(profileImg, 0, 0, 280, 280);
            originalImageData = profileCtx.getImageData(0, 0, 280, 280);
        };

        // If image is already cached
        if (profileImg.complete) {
            profileCtx.drawImage(profileImg, 0, 0, 280, 280);
            originalImageData = profileCtx.getImageData(0, 0, 280, 280);
        }

        // Convolution helper function
        function applyConvolution(kernel, divisor = 1, offset = 0) {
            if (!originalImageData) return;

            const width = 280;
            const height = 280;
            const src = originalImageData.data;
            const output = profileCtx.createImageData(width, height);
            const dst = output.data;
            const kSize = kernel.length;
            const kHalf = Math.floor(kSize / 2);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;

                    for (let ky = 0; ky < kSize; ky++) {
                        for (let kx = 0; kx < kSize; kx++) {
                            const py = Math.min(height - 1, Math.max(0, y + ky - kHalf));
                            const px = Math.min(width - 1, Math.max(0, x + kx - kHalf));
                            const idx = (py * width + px) * 4;
                            const weight = kernel[ky][kx];

                            r += src[idx] * weight;
                            g += src[idx + 1] * weight;
                            b += src[idx + 2] * weight;
                        }
                    }

                    const idx = (y * width + x) * 4;
                    dst[idx] = Math.min(255, Math.max(0, r / divisor + offset));
                    dst[idx + 1] = Math.min(255, Math.max(0, g / divisor + offset));
                    dst[idx + 2] = Math.min(255, Math.max(0, b / divisor + offset));
                    dst[idx + 3] = src[idx + 3];
                }
            }

            profileCtx.putImageData(output, 0, 0);
        }

        // Sobel filter
        function applySobel() {
            if (!originalImageData) return;

            const width = 280;
            const height = 280;
            const src = originalImageData.data;
            const output = profileCtx.createImageData(width, height);
            const dst = output.data;

            const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
            const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

            // Convert to grayscale
            const gray = new Float32Array(width * height);
            for (let i = 0; i < width * height; i++) {
                gray[i] = 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];
            }

            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    let gx = 0, gy = 0;

                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = (y + ky) * width + (x + kx);
                            gx += gray[idx] * sobelX[ky + 1][kx + 1];
                            gy += gray[idx] * sobelY[ky + 1][kx + 1];
                        }
                    }

                    const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
                    const idx = (y * width + x) * 4;

                    // Purple-tinted edges
                    dst[idx] = Math.min(255, magnitude * 0.6 + 99 * (magnitude / 255));
                    dst[idx + 1] = Math.min(255, magnitude * 0.3 + 50 * (magnitude / 255));
                    dst[idx + 2] = Math.min(255, magnitude * 0.9 + 241 * (magnitude / 255));
                    dst[idx + 3] = 255;
                }
            }

            // Handle border pixels
            for (let i = 0; i < width; i++) {
                dst[(i) * 4 + 3] = 255;
                dst[((height - 1) * width + i) * 4 + 3] = 255;
            }
            for (let i = 0; i < height; i++) {
                dst[(i * width) * 4 + 3] = 255;
                dst[(i * width + width - 1) * 4 + 3] = 255;
            }

            profileCtx.putImageData(output, 0, 0);
        }

        // Grayscale filter
        function applyGrayscale() {
            if (!originalImageData) return;

            const width = 280;
            const height = 280;
            const src = originalImageData.data;
            const output = profileCtx.createImageData(width, height);
            const dst = output.data;

            for (let i = 0; i < width * height; i++) {
                const gray = 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];
                dst[i * 4] = gray;
                dst[i * 4 + 1] = gray;
                dst[i * 4 + 2] = gray;
                dst[i * 4 + 3] = src[i * 4 + 3];
            }

            profileCtx.putImageData(output, 0, 0);
        }

        // Prewitt edge detection
        function applyPrewitt() {
            if (!originalImageData) return;

            const width = 280;
            const height = 280;
            const src = originalImageData.data;
            const output = profileCtx.createImageData(width, height);
            const dst = output.data;

            const prewittX = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
            const prewittY = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]];

            const gray = new Float32Array(width * height);
            for (let i = 0; i < width * height; i++) {
                gray[i] = 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];
            }

            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    let gx = 0, gy = 0;

                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = (y + ky) * width + (x + kx);
                            gx += gray[idx] * prewittX[ky + 1][kx + 1];
                            gy += gray[idx] * prewittY[ky + 1][kx + 1];
                        }
                    }

                    const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
                    const idx = (y * width + x) * 4;

                    // Cyan-tinted edges
                    dst[idx] = Math.min(255, magnitude * 0.3 + 50 * (magnitude / 255));
                    dst[idx + 1] = Math.min(255, magnitude * 0.8 + 200 * (magnitude / 255));
                    dst[idx + 2] = Math.min(255, magnitude * 0.9 + 220 * (magnitude / 255));
                    dst[idx + 3] = 255;
                }
            }

            for (let i = 0; i < width; i++) {
                dst[(i) * 4 + 3] = 255;
                dst[((height - 1) * width + i) * 4 + 3] = 255;
            }
            for (let i = 0; i < height; i++) {
                dst[(i * width) * 4 + 3] = 255;
                dst[(i * width + width - 1) * 4 + 3] = 255;
            }

            profileCtx.putImageData(output, 0, 0);
        }

        // Laplacian edge detection
        function applyLaplacian() {
            if (!originalImageData) return;

            const width = 280;
            const height = 280;
            const src = originalImageData.data;
            const output = profileCtx.createImageData(width, height);
            const dst = output.data;

            const laplacian = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];

            const gray = new Float32Array(width * height);
            for (let i = 0; i < width * height; i++) {
                gray[i] = 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];
            }

            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    let sum = 0;

                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = (y + ky) * width + (x + kx);
                            sum += gray[idx] * laplacian[ky + 1][kx + 1];
                        }
                    }

                    const value = Math.min(255, Math.abs(sum));
                    const idx = (y * width + x) * 4;

                    // Green-tinted edges
                    dst[idx] = Math.min(255, value * 0.4);
                    dst[idx + 1] = Math.min(255, value * 1.0 + 180 * (value / 255));
                    dst[idx + 2] = Math.min(255, value * 0.3);
                    dst[idx + 3] = 255;
                }
            }

            for (let i = 0; i < width; i++) {
                dst[(i) * 4 + 3] = 255;
                dst[((height - 1) * width + i) * 4 + 3] = 255;
            }
            for (let i = 0; i < height; i++) {
                dst[(i * width) * 4 + 3] = 255;
                dst[(i * width + width - 1) * 4 + 3] = 255;
            }

            profileCtx.putImageData(output, 0, 0);
        }

        // Threshold filter
        function applyThreshold() {
            if (!originalImageData) return;

            const width = 280;
            const height = 280;
            const src = originalImageData.data;
            const output = profileCtx.createImageData(width, height);
            const dst = output.data;

            for (let i = 0; i < width * height; i++) {
                const gray = 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];
                const value = gray > 128 ? 255 : 0;
                dst[i * 4] = value;
                dst[i * 4 + 1] = value;
                dst[i * 4 + 2] = value;
                dst[i * 4 + 3] = src[i * 4 + 3];
            }

            profileCtx.putImageData(output, 0, 0);
        }

        // Sepia filter
        function applySepia() {
            if (!originalImageData) return;

            const width = 280;
            const height = 280;
            const src = originalImageData.data;
            const output = profileCtx.createImageData(width, height);
            const dst = output.data;

            for (let i = 0; i < width * height; i++) {
                const r = src[i * 4];
                const g = src[i * 4 + 1];
                const b = src[i * 4 + 2];

                dst[i * 4] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
                dst[i * 4 + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
                dst[i * 4 + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
                dst[i * 4 + 3] = src[i * 4 + 3];
            }

            profileCtx.putImageData(output, 0, 0);
        }

        // Invert filter
        function applyInvert() {
            if (!originalImageData) return;

            const width = 280;
            const height = 280;
            const src = originalImageData.data;
            const output = profileCtx.createImageData(width, height);
            const dst = output.data;

            for (let i = 0; i < width * height; i++) {
                dst[i * 4] = 255 - src[i * 4];
                dst[i * 4 + 1] = 255 - src[i * 4 + 1];
                dst[i * 4 + 2] = 255 - src[i * 4 + 2];
                dst[i * 4 + 3] = src[i * 4 + 3];
            }

            profileCtx.putImageData(output, 0, 0);
        }

        // Apply selected filter
        function applyFilter(filterName) {
            if (!originalImageData) return;

            switch (filterName) {
                case 'original':
                    profileCtx.putImageData(originalImageData, 0, 0);
                    break;
                case 'sobel':
                    applySobel();
                    break;
                case 'prewitt':
                    applyPrewitt();
                    break;
                case 'laplacian':
                    applyLaplacian();
                    break;
                case 'gaussian':
                    applyConvolution([
                        [1, 2, 1],
                        [2, 4, 2],
                        [1, 2, 1]
                    ], 16);
                    break;
                case 'box':
                    applyConvolution([
                        [1, 1, 1],
                        [1, 1, 1],
                        [1, 1, 1]
                    ], 9);
                    break;
                case 'grayscale':
                    applyGrayscale();
                    break;
                case 'threshold':
                    applyThreshold();
                    break;
                case 'sharpen':
                    applyConvolution([
                        [0, -1, 0],
                        [-1, 5, -1],
                        [0, -1, 0]
                    ]);
                    break;
                case 'emboss':
                    applyConvolution([
                        [-2, -1, 0],
                        [-1, 1, 1],
                        [0, 1, 2]
                    ], 1, 128);
                    break;
                case 'sepia':
                    applySepia();
                    break;
                case 'invert':
                    applyInvert();
                    break;
            }

            // Update tooltip content
            const info = filterInfo[filterName];
            tooltipTitle.textContent = info.title;
            tooltipDesc.textContent = info.desc;
            tooltipKernel.textContent = info.kernel;
            tooltipKernel.style.display = info.kernel ? 'block' : 'none';
        }

        // Filter select event listener
        filterSelect.addEventListener('change', function() {
            applyFilter(this.value);
        });

        // Tooltip toggle
        let tooltipVisible = false;
        cvInfoBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            tooltipVisible = !tooltipVisible;
            cvTooltip.classList.toggle('active', tooltipVisible);
        });

        // Close tooltip when clicking outside
        document.addEventListener('click', function(e) {
            if (!cvTooltip.contains(e.target) && !cvInfoBtn.contains(e.target)) {
                tooltipVisible = false;
                cvTooltip.classList.remove('active');
            }
        });

        // Initialize tooltip with original info
        applyFilter('original');

        // ==========================================
        // AI PLAYGROUND DEMOS
        // ==========================================

        // --- Neural Network Visualizer ---
        const nnCanvas = document.getElementById('nn-canvas');
        const nnCtx = nnCanvas.getContext('2d');
        const nnTooltip = document.getElementById('nn-tooltip');
        let nnLayers = [4, 6, 6, 3];
        let nnNodes = [];
        let nnActivations = [];
        let nnGradients = [];
        let nnWeights = [];
        let nnWeightsOriginal = []; // Store original weights for L2 visualization
        let nnDropoutMask = [];
        let nnAnimating = false;
        let nnMode = 'forward'; // 'forward' or 'backward'
        let nnActivationFn = 'relu';
        let nnHoveredNode = null;
        let nnDropoutEnabled = false;
        let nnDropoutRate = 0.5;
        let nnL2Lambda = 0;

        // Activation functions
        const activationFns = {
            relu: (x) => Math.max(0, x),
            sigmoid: (x) => 1 / (1 + Math.exp(-x * 5)),
            tanh: (x) => Math.tanh(x * 2)
        };

        function nnResize() {
            const rect = nnCanvas.parentElement.getBoundingClientRect();
            nnCanvas.width = rect.width;
            nnCanvas.height = rect.height;
            nnInitNodes();
            nnDraw();
        }

        function nnInitNodes() {
            nnNodes = [];
            nnActivations = [];
            nnGradients = [];
            nnWeights = [];
            nnWeightsOriginal = [];
            nnDropoutMask = [];
            const padding = 40;
            const layerSpacing = (nnCanvas.width - padding * 2) / (nnLayers.length - 1);
            
            nnLayers.forEach((count, layerIdx) => {
                const layer = [];
                const activationLayer = [];
                const gradientLayer = [];
                const dropoutLayer = [];
                const nodeSpacing = (nnCanvas.height - padding * 2) / (count + 1);
                for (let i = 0; i < count; i++) {
                    layer.push({
                        x: padding + layerIdx * layerSpacing,
                        y: padding + (i + 1) * nodeSpacing,
                        layer: layerIdx
                    });
                    // Initialize input layer with activations (for forward mode)
                    // Initialize output layer with gradients (for backprop mode)
                    const isInputLayer = layerIdx === 0;
                    const isOutputLayer = layerIdx === nnLayers.length - 1;
                    const initActivation = isInputLayer ? Math.random() * 0.6 + 0.4 : 0;
                    const initGradient = isOutputLayer ? Math.random() * 0.6 + 0.4 : 0;
                    activationLayer.push(initActivation);
                    gradientLayer.push(initGradient);
                    // Dropout: don't drop input or output layers
                    const isHidden = layerIdx > 0 && layerIdx < nnLayers.length - 1;
                    dropoutLayer.push(isHidden ? Math.random() > nnDropoutRate : true);
                }
                nnNodes.push(layer);
                nnActivations.push(activationLayer);
                nnGradients.push(gradientLayer);
                nnDropoutMask.push(dropoutLayer);
            });

            // Initialize random weights
            for (let l = 0; l < nnLayers.length - 1; l++) {
                const layerWeights = [];
                const layerWeightsOrig = [];
                for (let i = 0; i < nnLayers[l]; i++) {
                    const nodeWeights = [];
                    const nodeWeightsOrig = [];
                    for (let j = 0; j < nnLayers[l + 1]; j++) {
                        const w = Math.random() * 0.8 + 0.2;
                        nodeWeights.push(w);
                        nodeWeightsOrig.push(w);
                    }
                    layerWeights.push(nodeWeights);
                    layerWeightsOrig.push(nodeWeightsOrig);
                }
                nnWeights.push(layerWeights);
                nnWeightsOriginal.push(layerWeightsOrig);
            }
        }

        function nnRegenerateDropoutMask() {
            nnDropoutMask = [];
            nnLayers.forEach((count, layerIdx) => {
                const dropoutLayer = [];
                for (let i = 0; i < count; i++) {
                    const isHidden = layerIdx > 0 && layerIdx < nnLayers.length - 1;
                    dropoutLayer.push(isHidden ? Math.random() > nnDropoutRate : true);
                }
                nnDropoutMask.push(dropoutLayer);
            });
        }

        function nnApplyL2Decay() {
            // Recalculate weights from original based on L2 lambda
            for (let l = 0; l < nnWeights.length; l++) {
                for (let i = 0; i < nnWeights[l].length; i++) {
                    for (let j = 0; j < nnWeights[l][i].length; j++) {
                        // Apply decay effect: higher L2 = more shrinkage
                        const decayFactor = 1 - nnL2Lambda * 0.9;
                        nnWeights[l][i][j] = nnWeightsOriginal[l][i][j] * decayFactor;
                        nnWeights[l][i][j] = Math.max(0.05, nnWeights[l][i][j]);
                    }
                }
            }
        }

        function nnDraw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            nnCtx.clearRect(0, 0, nnCanvas.width, nnCanvas.height);
            
            // Draw connections with weight-based thickness
            for (let l = 0; l < nnNodes.length - 1; l++) {
                for (let i = 0; i < nnNodes[l].length; i++) {
                    for (let j = 0; j < nnNodes[l + 1].length; j++) {
                        const weight = nnWeights[l]?.[i]?.[j] || 0.5;
                        const activation = Math.min(nnActivations[l][i], nnActivations[l + 1][j]);
                        const gradient = Math.min(nnGradients[l][i], nnGradients[l + 1]?.[j] || 0);
                        
                        // Check if either node is dropped out
                        const srcDropped = nnDropoutEnabled && !nnDropoutMask[l]?.[i];
                        const dstDropped = nnDropoutEnabled && !nnDropoutMask[l + 1]?.[j];
                        const isDroppedConnection = srcDropped || dstDropped;
                        
                        nnCtx.beginPath();
                        nnCtx.moveTo(nnNodes[l][i].x, nnNodes[l][i].y);
                        nnCtx.lineTo(nnNodes[l + 1][j].x, nnNodes[l + 1][j].y);
                        
                        if (isDroppedConnection) {
                            // Dropped connection - very faint
                            nnCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
                            nnCtx.lineWidth = 0.5;
                        } else if (gradient > 0) {
                            // Backprop mode - red gradient flow
                            nnCtx.strokeStyle = `rgba(239, 68, 68, ${0.3 + gradient * 0.7})`;
                            nnCtx.lineWidth = 1 + weight * 2 + gradient * 2;
                        } else if (activation > 0) {
                            // Forward mode - blue activation flow
                            nnCtx.strokeStyle = `rgba(99, 102, 241, ${0.2 + activation * 0.8})`;
                            nnCtx.lineWidth = 1 + weight * 2;
                        } else {
                            // Inactive - show weight as thickness
                            nnCtx.strokeStyle = isDark ? `rgba(255,255,255,${0.05 + weight * 0.15})` : `rgba(0,0,0,${0.05 + weight * 0.1})`;
                            nnCtx.lineWidth = 0.5 + weight * 1.5;
                        }
                        nnCtx.stroke();
                    }
                }
            }
            
            // Draw nodes
            nnNodes.forEach((layer, l) => {
                layer.forEach((node, i) => {
                    const activation = nnActivations[l][i];
                    const gradient = nnGradients[l][i];
                    const isHovered = nnHoveredNode && nnHoveredNode.l === l && nnHoveredNode.i === i;
                    const isDropped = nnDropoutEnabled && !nnDropoutMask[l]?.[i];
                    const radius = 10 + Math.max(activation, gradient) * 4 + (isHovered ? 2 : 0);
                    
                    nnCtx.beginPath();
                    nnCtx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                    
                    if (isDropped) {
                        // Dropped out node - gray with X
                        nnCtx.fillStyle = isDark ? 'rgba(100,100,100,0.2)' : 'rgba(150,150,150,0.2)';
                        nnCtx.strokeStyle = isDark ? 'rgba(100,100,100,0.4)' : 'rgba(150,150,150,0.4)';
                        nnCtx.setLineDash([3, 3]);
                    } else if (gradient > 0) {
                        // Backprop - red glow
                        const grad = nnCtx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius + 4);
                        grad.addColorStop(0, `rgba(239, 68, 68, ${gradient})`);
                        grad.addColorStop(1, `rgba(239, 68, 68, ${gradient * 0.3})`);
                        nnCtx.fillStyle = grad;
                        nnCtx.strokeStyle = '#ef4444';
                        nnCtx.setLineDash([]);
                    } else if (activation > 0) {
                        // Forward - blue glow
                        const grad = nnCtx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius + 4);
                        grad.addColorStop(0, `rgba(99, 102, 241, ${activation})`);
                        grad.addColorStop(1, `rgba(99, 102, 241, ${activation * 0.3})`);
                        nnCtx.fillStyle = grad;
                        nnCtx.strokeStyle = '#6366f1';
                        nnCtx.setLineDash([]);
                    } else {
                        nnCtx.fillStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
                        nnCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
                        nnCtx.setLineDash([]);
                    }
                    
                    if (isHovered && !isDropped) {
                        nnCtx.strokeStyle = '#10b981';
                        nnCtx.lineWidth = 2.5;
                        nnCtx.setLineDash([]);
                    } else {
                        nnCtx.lineWidth = 1.5;
                    }
                    
                    nnCtx.fill();
                    nnCtx.stroke();
                    nnCtx.setLineDash([]);
                    
                    // Draw X for dropped nodes
                    if (isDropped) {
                        nnCtx.beginPath();
                        nnCtx.moveTo(node.x - 5, node.y - 5);
                        nnCtx.lineTo(node.x + 5, node.y + 5);
                        nnCtx.moveTo(node.x + 5, node.y - 5);
                        nnCtx.lineTo(node.x - 5, node.y + 5);
                        nnCtx.strokeStyle = isDark ? 'rgba(239, 68, 68, 0.6)' : 'rgba(220, 38, 38, 0.6)';
                        nnCtx.lineWidth = 2;
                        nnCtx.stroke();
                    }
                });
            });

            // Draw layer labels
            nnCtx.font = '9px "IBM Plex Sans"';
            nnCtx.fillStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
            nnCtx.textAlign = 'center';
            const labels = ['Input', ...Array(nnLayers.length - 2).fill('Hidden'), 'Output'];
            nnNodes.forEach((layer, l) => {
                if (layer[0]) {
                    nnCtx.fillText(labels[l] || 'Hidden', layer[0].x, 18);
                }
            });
        }

        function nnSetLayers(count) {
            if (nnAnimating) return;
            // Update button states using onclick attribute matching
            document.querySelectorAll('[onclick*="nnSetLayers"]').forEach(btn => {
                const btnCount = parseInt(btn.textContent);
                btn.classList.toggle('active', btnCount === count);
            });
            if (count === 3) nnLayers = [4, 6, 3];
            else if (count === 4) nnLayers = [4, 5, 5, 3];
            else nnLayers = [4, 5, 6, 5, 3];
            nnInitNodes();
            // Re-apply mode highlighting after layer change
            nnSetMode(nnMode);
        }

        function nnSetMode(mode) {
            if (nnAnimating) return;
            nnMode = mode;
            // Update button states using onclick attribute matching
            document.querySelectorAll('[onclick*="nnSetMode"]').forEach(btn => {
                const isForwardBtn = btn.getAttribute('onclick').includes("'forward'");
                btn.classList.toggle('active', (mode === 'forward') === isForwardBtn);
            });
            
            // Reset and set appropriate initial values based on mode
            if (mode === 'forward') {
                // Highlight input layer (activations), clear gradients
                nnActivations = nnActivations.map((l, idx) => 
                    idx === 0 ? l.map(() => Math.random() * 0.6 + 0.4) : l.map(() => 0)
                );
                nnGradients = nnGradients.map(l => l.map(() => 0));
            } else {
                // Highlight output layer (gradients), clear activations
                const lastIdx = nnGradients.length - 1;
                nnGradients = nnGradients.map((l, idx) => 
                    idx === lastIdx ? l.map(() => Math.random() * 0.6 + 0.4) : l.map(() => 0)
                );
                nnActivations = nnActivations.map(l => l.map(() => 0));
            }
            nnDraw();
        }

        function nnSetActivation(fn) {
            nnActivationFn = fn;
        }

        function nnToggleDropout() {
            nnDropoutEnabled = !nnDropoutEnabled;
            const btn = document.getElementById('nn-dropout-btn');
            if (btn) {
                btn.textContent = `Dropout: ${nnDropoutEnabled ? '50%' : 'Off'}`;
                btn.classList.toggle('active', nnDropoutEnabled);
            }
            if (nnDropoutEnabled) {
                nnRegenerateDropoutMask();
            }
            nnDraw();
        }

        function nnAnimateForward(layerIdx) {
            if (layerIdx >= nnLayers.length - 1) {
                setTimeout(() => {
                    // Reset hidden/output layers but keep input layer values
                    nnActivations = nnActivations.map((l, idx) => 
                        idx === 0 ? l : l.map(() => 0)
                    );
                    nnAnimating = false;
                    // Apply L2 weight decay after forward pass
                    nnApplyL2Decay();
                    nnDraw();
                }, 5000); // Pause to see final state
                return;
            }
            
            setTimeout(() => {
                const actFn = activationFns[nnActivationFn];
                for (let j = 0; j < nnActivations[layerIdx + 1].length; j++) {
                    if (nnDropoutEnabled && !nnDropoutMask[layerIdx + 1]?.[j]) {
                        nnActivations[layerIdx + 1][j] = 0;
                        continue;
                    }
                    let sum = 0, count = 0;
                    for (let i = 0; i < nnActivations[layerIdx].length; i++) {
                        if (nnDropoutEnabled && !nnDropoutMask[layerIdx]?.[i]) continue;
                        sum += nnActivations[layerIdx][i] * nnWeights[layerIdx][i][j];
                        count++;
                    }
                    const raw = count > 0 ? sum / count + Math.random() * 0.2 : 0;
                    nnActivations[layerIdx + 1][j] = Math.min(1, actFn(raw));
                }
                nnDraw();
                nnAnimateForward(layerIdx + 1);
            }, 350);
        }

        function nnAnimateBackward(layerIdx) {
            if (layerIdx < 0) {
                setTimeout(() => {
                    const lastIdx = nnGradients.length - 1;
                    nnGradients = nnGradients.map((l, idx) => 
                        idx === lastIdx ? l : l.map(() => 0)
                    );
                    nnAnimating = false;
                    nnApplyL2Decay();
                    nnDraw();
                }, 5000); // Pause to see final state
                return;
            }
            
            setTimeout(() => {
                for (let i = 0; i < nnGradients[layerIdx].length; i++) {
                    if (nnDropoutEnabled && !nnDropoutMask[layerIdx]?.[i]) {
                        nnGradients[layerIdx][i] = 0;
                        continue;
                    }
                    let sum = 0, count = 0;
                    if (layerIdx < nnLayers.length - 1) {
                        for (let j = 0; j < nnGradients[layerIdx + 1].length; j++) {
                            if (nnDropoutEnabled && !nnDropoutMask[layerIdx + 1]?.[j]) continue;
                            sum += nnGradients[layerIdx + 1][j] * (nnWeights[layerIdx]?.[i]?.[j] || 0.5);
                            count++;
                        }
                    }
                    nnGradients[layerIdx][i] = Math.min(1, (count > 0 ? sum / count : 0) + Math.random() * 0.3);
                }
                nnDraw();
                nnAnimateBackward(layerIdx - 1);
            }, 350);
        }

        nnCanvas.addEventListener('click', (e) => {
            if (nnAnimating) return;
            const rect = nnCanvas.getBoundingClientRect();
            // Scale coordinates to match canvas internal size
            const scaleX = nnCanvas.width / rect.width;
            const scaleY = nnCanvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            const clickRadius = 25; // Larger click area for easier interaction
            
            if (nnMode === 'forward') {
                // Check input nodes
                for (let i = 0; i < nnNodes[0].length; i++) {
                    const node = nnNodes[0][i];
                    const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
                    if (dist < clickRadius) {
                        nnActivations[0][i] = 1;
                        nnAnimating = true;
                        nnDraw();
                        nnAnimateForward(0);
                        return;
                    }
                }
            } else {
                // Check output nodes for backprop
                const lastLayer = nnNodes[nnNodes.length - 1];
                for (let i = 0; i < lastLayer.length; i++) {
                    const node = lastLayer[i];
                    const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
                    if (dist < clickRadius) {
                        nnGradients[nnGradients.length - 1][i] = 1;
                        nnAnimating = true;
                        nnDraw();
                        nnAnimateBackward(nnLayers.length - 2);
                        return;
                    }
                }
            }
        });

        // Hover tooltip
        nnCanvas.addEventListener('mousemove', (e) => {
            const rect = nnCanvas.getBoundingClientRect();
            // Scale coordinates to match canvas internal size
            const scaleX = nnCanvas.width / rect.width;
            const scaleY = nnCanvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            nnHoveredNode = null;
            for (let l = 0; l < nnNodes.length; l++) {
                for (let i = 0; i < nnNodes[l].length; i++) {
                    const node = nnNodes[l][i];
                    const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
                    if (dist < 20) {
                        nnHoveredNode = { l, i };
                        const act = nnActivations[l][i];
                        const grad = nnGradients[l][i];
                        const layerName = l === 0 ? 'Input' : l === nnNodes.length - 1 ? 'Output' : `Hidden ${l}`;
                        
                        const isDropped = nnDropoutEnabled && !nnDropoutMask[l]?.[i];
                        const primaryVal = nnMode === 'forward' ? act : grad;
                        const primaryLabel = nnMode === 'forward' ? 'a' : '∇';
                        const primaryColor = nnMode === 'forward' ? '#6366f1' : '#ef4444';
                        nnTooltip.innerHTML = `
                            <span class="label">${layerName} Node ${i + 1}</span>
                            ${isDropped ? '<span class="value" style="color:#ef4444">DROPPED</span>' : 
                                `<span class="value" style="color:${primaryColor}">${primaryLabel}=${primaryVal.toFixed(3)}</span>`}
                        `;
                        // Position tooltip within canvas bounds
                        const tooltipW = 100, tooltipH = 40;
                        const rect = nnCanvas.getBoundingClientRect();
                        let tooltipX = node.x + 15;
                        let tooltipY = node.y - 10;
                        // If near right edge, show on left side of node
                        if (tooltipX + tooltipW > nnCanvas.width) tooltipX = node.x - tooltipW - 10;
                        // If near top, show below node
                        if (tooltipY < 5) tooltipY = node.y + 20;
                        // If near bottom, show above node
                        if (tooltipY + tooltipH > nnCanvas.height) tooltipY = node.y - tooltipH - 10;
                        nnTooltip.style.left = Math.max(5, tooltipX) + 'px';
                        nnTooltip.style.top = Math.max(5, tooltipY) + 'px';
                        nnTooltip.classList.add('visible');
                        nnDraw();
                        return;
                    }
                }
            }
            nnTooltip.classList.remove('visible');
            nnDraw();
        });

        nnCanvas.addEventListener('mouseleave', () => {
            nnHoveredNode = null;
            nnTooltip.classList.remove('visible');
            nnDraw();
        });

        // --- Embedding Space Explorer ---
        const embedCanvas = document.getElementById('embed-canvas');
        const embedCtx = embedCanvas.getContext('2d');
        let embedWords = [];
        let embedOffset = { x: 0, y: 0 };
        let embedZoom = 1;
        let embedDragging = false;
        let embedLastPos = { x: 0, y: 0 };
        let embedCategory = 'tech';

        const embedData = {
            tech: [
                { word: 'PyTorch', x: 0.2, y: 0.3 }, { word: 'TensorFlow', x: 0.25, y: 0.35 },
                { word: 'Neural', x: 0.3, y: 0.4 }, { word: 'Network', x: 0.35, y: 0.38 },
                { word: 'GPU', x: 0.15, y: 0.5 }, { word: 'CUDA', x: 0.18, y: 0.55 },
                { word: 'Model', x: 0.5, y: 0.5 }, { word: 'Training', x: 0.55, y: 0.45 },
                { word: 'Inference', x: 0.6, y: 0.52 }, { word: 'Weights', x: 0.45, y: 0.42 },
                { word: 'Transformer', x: 0.7, y: 0.3 }, { word: 'Attention', x: 0.75, y: 0.35 },
                { word: 'LLM', x: 0.8, y: 0.4 }, { word: 'GPT', x: 0.78, y: 0.32 },
                { word: 'BERT', x: 0.72, y: 0.28 }, { word: 'Embedding', x: 0.5, y: 0.65 }
            ],
            emotions: [
                { word: 'Happy', x: 0.7, y: 0.2 }, { word: 'Joy', x: 0.75, y: 0.25 },
                { word: 'Excited', x: 0.8, y: 0.22 }, { word: 'Sad', x: 0.3, y: 0.7 },
                { word: 'Melancholy', x: 0.28, y: 0.75 }, { word: 'Angry', x: 0.2, y: 0.3 },
                { word: 'Furious', x: 0.18, y: 0.25 }, { word: 'Calm', x: 0.6, y: 0.6 },
                { word: 'Peaceful', x: 0.65, y: 0.65 }, { word: 'Anxious', x: 0.4, y: 0.4 },
                { word: 'Nervous', x: 0.38, y: 0.45 }, { word: 'Love', x: 0.8, y: 0.7 },
                { word: 'Affection', x: 0.82, y: 0.68 }, { word: 'Fear', x: 0.25, y: 0.5 }
            ],
            animals: [
                { word: 'Dog', x: 0.3, y: 0.3 }, { word: 'Wolf', x: 0.28, y: 0.25 },
                { word: 'Cat', x: 0.6, y: 0.3 }, { word: 'Lion', x: 0.55, y: 0.25 },
                { word: 'Tiger', x: 0.58, y: 0.22 }, { word: 'Bird', x: 0.5, y: 0.7 },
                { word: 'Eagle', x: 0.52, y: 0.65 }, { word: 'Sparrow', x: 0.48, y: 0.72 },
                { word: 'Fish', x: 0.8, y: 0.6 }, { word: 'Shark', x: 0.82, y: 0.55 },
                { word: 'Whale', x: 0.78, y: 0.65 }, { word: 'Horse', x: 0.2, y: 0.6 },
                { word: 'Zebra', x: 0.22, y: 0.55 }, { word: 'Snake', x: 0.4, y: 0.5 }
            ]
        };

        function embedResize() {
            const rect = embedCanvas.parentElement.getBoundingClientRect();
            embedCanvas.width = rect.width;
            embedCanvas.height = rect.height;
            embedDraw();
        }

        function embedDraw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            embedCtx.clearRect(0, 0, embedCanvas.width, embedCanvas.height);
            
            // Draw grid
            embedCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
            embedCtx.lineWidth = 1;
            const gridSize = 40 * embedZoom;
            for (let x = embedOffset.x % gridSize; x < embedCanvas.width; x += gridSize) {
                embedCtx.beginPath();
                embedCtx.moveTo(x, 0);
                embedCtx.lineTo(x, embedCanvas.height);
                embedCtx.stroke();
            }
            for (let y = embedOffset.y % gridSize; y < embedCanvas.height; y += gridSize) {
                embedCtx.beginPath();
                embedCtx.moveTo(0, y);
                embedCtx.lineTo(embedCanvas.width, y);
                embedCtx.stroke();
            }
            
            // Draw words
            embedWords.forEach(item => {
                const x = item.x * embedCanvas.width * embedZoom + embedOffset.x;
                const y = item.y * embedCanvas.height * embedZoom + embedOffset.y;
                
                if (x < -50 || x > embedCanvas.width + 50 || y < -20 || y > embedCanvas.height + 20) return;
                
                // Draw dot
                embedCtx.beginPath();
                embedCtx.arc(x, y, 5, 0, Math.PI * 2);
                embedCtx.fillStyle = '#6366f1';
                embedCtx.fill();
                
                // Draw label
                embedCtx.font = '11px "IBM Plex Sans"';
                embedCtx.fillStyle = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
                embedCtx.fillText(item.word, x + 8, y + 4);
            });
        }

        function embedSetCategory(cat) {
            embedCategory = cat;
            embedWords = embedData[cat];
            const embedCard = document.querySelector('.ai-playground-grid .demo-card:nth-child(2)');
            embedCard.querySelectorAll('.demo-controls .demo-btn').forEach((btn, i) => {
                btn.classList.toggle('active', ['tech', 'emotions', 'animals'][i] === cat);
            });
            embedDraw();
        }

        function embedReset() {
            embedOffset = { x: 0, y: 0 };
            embedZoom = 1;
            embedDraw();
        }

        embedCanvas.addEventListener('mousedown', (e) => {
            embedDragging = true;
            embedLastPos = { x: e.clientX, y: e.clientY };
        });

        embedCanvas.addEventListener('mousemove', (e) => {
            if (embedDragging) {
                embedOffset.x += e.clientX - embedLastPos.x;
                embedOffset.y += e.clientY - embedLastPos.y;
                embedLastPos = { x: e.clientX, y: e.clientY };
                embedDraw();
            }
        });

        embedCanvas.addEventListener('mouseup', () => embedDragging = false);
        embedCanvas.addEventListener('mouseleave', () => embedDragging = false);

        embedCanvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            embedZoom = Math.max(0.5, Math.min(3, embedZoom * zoomFactor));
            embedDraw();
        });

        // --- Attention Heatmap ---
        const attnCanvas = document.getElementById('attn-canvas');
        const attnCtx = attnCanvas.getContext('2d');
        let attnSentenceIdx = 0;
        let attnHover = { row: -1, col: -1 };

        const attnSentences = [
            { tokens: ['The', 'cat', 'sat', 'on', 'the', 'mat'], weights: null },
            { tokens: ['I', 'love', 'machine', 'learning'], weights: null },
            { tokens: ['Attention', 'is', 'all', 'you', 'need'], weights: null }
        ];

        // Generate random attention weights
        attnSentences.forEach(s => {
            const n = s.tokens.length;
            s.weights = Array(n).fill().map(() => {
                const row = Array(n).fill().map(() => Math.random());
                const sum = row.reduce((a, b) => a + b);
                return row.map(v => v / sum);
            });
        });

        function attnResize() {
            const rect = attnCanvas.parentElement.getBoundingClientRect();
            attnCanvas.width = rect.width;
            attnCanvas.height = rect.height;
            attnDraw();
        }

        function attnDraw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            attnCtx.clearRect(0, 0, attnCanvas.width, attnCanvas.height);
            
            const sentence = attnSentences[attnSentenceIdx];
            const n = sentence.tokens.length;
            const padding = 50;
            const cellSize = Math.min((attnCanvas.width - padding * 2) / n, (attnCanvas.height - padding * 2) / n);
            const startX = (attnCanvas.width - cellSize * n) / 2;
            const startY = padding;
            
            // Draw cells
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const weight = sentence.weights[i][j];
                    const x = startX + j * cellSize;
                    const y = startY + i * cellSize;
                    
                    // Cell color
                    const alpha = weight;
                    attnCtx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
                    attnCtx.fillRect(x, y, cellSize - 1, cellSize - 1);
                    
                    // Highlight on hover
                    if (i === attnHover.row && j === attnHover.col) {
                        attnCtx.strokeStyle = '#fff';
                        attnCtx.lineWidth = 2;
                        attnCtx.strokeRect(x, y, cellSize - 1, cellSize - 1);
                        
                        // Show weight value
                        attnCtx.fillStyle = isDark ? '#fff' : '#000';
                        attnCtx.font = 'bold 11px "JetBrains Mono"';
                        attnCtx.fillText(weight.toFixed(2), x + cellSize / 2 - 15, y + cellSize / 2 + 4);
                    }
                }
            }
            
            // Draw labels
            attnCtx.font = '10px "IBM Plex Sans"';
            attnCtx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
            
            // Top labels (keys)
            for (let j = 0; j < n; j++) {
                attnCtx.save();
                attnCtx.translate(startX + j * cellSize + cellSize / 2, startY - 5);
                attnCtx.rotate(-Math.PI / 4);
                attnCtx.fillText(sentence.tokens[j], 0, 0);
                attnCtx.restore();
            }
            
            // Left labels (queries)
            attnCtx.textAlign = 'right';
            for (let i = 0; i < n; i++) {
                attnCtx.fillText(sentence.tokens[i], startX - 8, startY + i * cellSize + cellSize / 2 + 4);
            }
            attnCtx.textAlign = 'left';
        }

        function attnSetSentence(idx) {
            attnSentenceIdx = idx;
            const attnCard = document.querySelector('.ai-playground-grid .demo-card:nth-child(3)');
            attnCard.querySelectorAll('.demo-controls .demo-btn').forEach((btn, i) => {
                btn.classList.toggle('active', i === idx);
            });
            attnDraw();
        }

        attnCanvas.addEventListener('mousemove', (e) => {
            const rect = attnCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const sentence = attnSentences[attnSentenceIdx];
            const n = sentence.tokens.length;
            const padding = 50;
            const cellSize = Math.min((attnCanvas.width - padding * 2) / n, (attnCanvas.height - padding * 2) / n);
            const startX = (attnCanvas.width - cellSize * n) / 2;
            const startY = padding;
            
            const col = Math.floor((x - startX) / cellSize);
            const row = Math.floor((y - startY) / cellSize);
            
            if (row >= 0 && row < n && col >= 0 && col < n) {
                attnHover = { row, col };
            } else {
                attnHover = { row: -1, col: -1 };
            }
            attnDraw();
        });

        attnCanvas.addEventListener('mouseleave', () => {
            attnHover = { row: -1, col: -1 };
            attnDraw();
        });

        // L2 Regularization slider for NN Visualizer
        const nnL2Slider = document.getElementById('nn-l2');
        const nnL2Val = document.getElementById('nn-l2-val');
        if (nnL2Slider) {
            nnL2Slider.addEventListener('input', () => {
                nnL2Lambda = nnL2Slider.value / 100;
                nnL2Val.textContent = nnL2Lambda.toFixed(2);
                // Recalculate weights from original and redraw
                nnApplyL2Decay();
                nnDraw();
            });
        }

        // --- Gradient Descent Visualizer (AutoGrad) ---
        const gdCanvas = document.getElementById('gd-canvas');
        const gdCtx = gdCanvas.getContext('2d');
        let gdSurface = 'quadratic';
        let gdOptimizer = 'sgd';
        let gdLR = 0.02;
        let gdPaths = []; // Array of optimizer paths for comparison
        let gdAnimating = false;
        let gdCompareMode = false;
        
        // Surface functions
        const gdSurfaces = {
            quadratic: {
                fn: (x, y) => (x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5),
                name: 'Quadratic Bowl'
            },
            rosenbrock: {
                fn: (x, y) => {
                    const a = 1, b = 100;
                    const sx = x * 4 - 2, sy = y * 4 - 2;
                    return ((a - sx) * (a - sx) + b * (sy - sx * sx) * (sy - sx * sx)) * 0.001;
                },
                name: 'Rosenbrock'
            },
            saddle: {
                fn: (x, y) => {
                    const sx = (x - 0.5) * 4, sy = (y - 0.5) * 4;
                    return (sx * sx - sy * sy) * 0.1 + 0.5;
                },
                name: 'Saddle Point'
            },
            multimodal: {
                fn: (x, y) => {
                    const sx = x * 6 - 3, sy = y * 6 - 3;
                    return (Math.sin(sx) * Math.sin(sy) + (sx * sx + sy * sy) * 0.05) * 0.3 + 0.5;
                },
                name: 'Multi-Modal'
            }
        };
        
        function gdGetLoss(x, y) {
            return gdSurfaces[gdSurface].fn(x, y);
        }

        function gdGetGradient(x, y) {
            const h = 0.001;
            const dx = (gdGetLoss(x + h, y) - gdGetLoss(x - h, y)) / (2 * h);
            const dy = (gdGetLoss(x, y + h) - gdGetLoss(x, y - h)) / (2 * h);
            return { x: dx, y: dy };
        }

        function gdResize() {
            const rect = gdCanvas.parentElement.getBoundingClientRect();
            gdCanvas.width = rect.width;
            gdCanvas.height = rect.height;
            gdDraw();
        }
        
        function gdDraw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            gdCtx.clearRect(0, 0, gdCanvas.width, gdCanvas.height);
            
            // Draw contour surface
            const imageData = gdCtx.createImageData(gdCanvas.width, gdCanvas.height);
            let minLoss = Infinity, maxLoss = -Infinity;
            
            // First pass: find min/max for normalization
            for (let py = 0; py < gdCanvas.height; py += 4) {
                for (let px = 0; px < gdCanvas.width; px += 4) {
                    const loss = gdGetLoss(px / gdCanvas.width, py / gdCanvas.height);
                    minLoss = Math.min(minLoss, loss);
                    maxLoss = Math.max(maxLoss, loss);
                }
            }
            
            // Second pass: draw with normalized colors
            const range = maxLoss - minLoss || 1;
            for (let py = 0; py < gdCanvas.height; py++) {
                for (let px = 0; px < gdCanvas.width; px++) {
                    const loss = gdGetLoss(px / gdCanvas.width, py / gdCanvas.height);
                    const norm = (loss - minLoss) / range;
                    const idx = (py * gdCanvas.width + px) * 4;
                    
                    if (isDark) {
                        // Dark theme: blue (low) to purple to red (high)
                        const r = Math.floor(norm * 180 + 20);
                        const g = Math.floor((1 - Math.abs(norm - 0.5) * 2) * 60 + 20);
                        const b = Math.floor((1 - norm) * 180 + 40);
                        imageData.data[idx] = r;
                        imageData.data[idx + 1] = g;
                        imageData.data[idx + 2] = b;
                    } else {
                        // Light theme: green (low) to yellow to red (high)
                        const r = Math.floor(norm * 200 + 55);
                        const g = Math.floor((1 - norm) * 180 + 75);
                        const b = Math.floor((1 - norm) * 100 + 100);
                        imageData.data[idx] = r;
                        imageData.data[idx + 1] = g;
                        imageData.data[idx + 2] = b;
                    }
                    imageData.data[idx + 3] = 255;
                }
            }
            gdCtx.putImageData(imageData, 0, 0);
            
            // Draw contour lines
            gdCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
            gdCtx.lineWidth = 1;
            const levels = 12;
            for (let level = 0; level < levels; level++) {
                const targetLoss = minLoss + (level / levels) * range;
                gdCtx.beginPath();
                for (let px = 0; px < gdCanvas.width; px += 3) {
                    for (let py = 0; py < gdCanvas.height; py += 3) {
                        const loss = gdGetLoss(px / gdCanvas.width, py / gdCanvas.height);
                        if (Math.abs(loss - targetLoss) < range * 0.02) {
                            gdCtx.moveTo(px, py);
                            gdCtx.arc(px, py, 0.5, 0, Math.PI * 2);
                        }
                    }
                }
                gdCtx.stroke();
            }
            
            // Draw optimization paths
            const colors = {
                sgd: '#ef4444',
                momentum: '#22c55e',
                adam: '#3b82f6'
            };
            
            gdPaths.forEach(pathData => {
                if (pathData.path.length < 2) return;
                
                const color = colors[pathData.optimizer];
            
            // Draw path
                gdCtx.beginPath();
                gdCtx.moveTo(pathData.path[0].x * gdCanvas.width, pathData.path[0].y * gdCanvas.height);
                for (let i = 1; i < pathData.path.length; i++) {
                    gdCtx.lineTo(pathData.path[i].x * gdCanvas.width, pathData.path[i].y * gdCanvas.height);
                }
                gdCtx.strokeStyle = color;
                gdCtx.lineWidth = 2.5;
                gdCtx.stroke();
                
                // Draw points along path
                pathData.path.forEach((point, i) => {
                    const size = i === pathData.path.length - 1 ? 6 : 3;
                    gdCtx.beginPath();
                    gdCtx.arc(point.x * gdCanvas.width, point.y * gdCanvas.height, size, 0, Math.PI * 2);
                    gdCtx.fillStyle = color;
                    gdCtx.fill();
                    if (i === pathData.path.length - 1) {
                        gdCtx.strokeStyle = '#fff';
                        gdCtx.lineWidth = 2;
                        gdCtx.stroke();
            }
                });
                
                // Draw gradient vector at current position
                if (pathData.path.length > 0) {
                    const current = pathData.path[pathData.path.length - 1];
                    const grad = gdGetGradient(current.x, current.y);
                    const gradMag = Math.sqrt(grad.x * grad.x + grad.y * grad.y);
                    if (gradMag > 0.001) {
                        const scale = Math.min(50, 30 / gradMag);
                        const endX = current.x * gdCanvas.width - grad.x * scale;
                        const endY = current.y * gdCanvas.height - grad.y * scale;
                        
                        gdCtx.beginPath();
                        gdCtx.moveTo(current.x * gdCanvas.width, current.y * gdCanvas.height);
                        gdCtx.lineTo(endX, endY);
                        gdCtx.strokeStyle = '#f59e0b';
                        gdCtx.lineWidth = 2;
                        gdCtx.stroke();
                        
                        // Arrow head
                        const angle = Math.atan2(endY - current.y * gdCanvas.height, endX - current.x * gdCanvas.width);
                        gdCtx.beginPath();
                        gdCtx.moveTo(endX, endY);
                        gdCtx.lineTo(endX - 8 * Math.cos(angle - 0.4), endY - 8 * Math.sin(angle - 0.4));
                        gdCtx.lineTo(endX - 8 * Math.cos(angle + 0.4), endY - 8 * Math.sin(angle + 0.4));
                        gdCtx.closePath();
                        gdCtx.fillStyle = '#f59e0b';
                        gdCtx.fill();
                    }
                }
            });
            
            // Draw title
            gdCtx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
            gdCtx.font = '12px IBM Plex Sans';
            gdCtx.fillText(gdSurfaces[gdSurface].name, 10, 20);
        }

        function gdStep(pathData) {
            const current = pathData.path[pathData.path.length - 1];
            const grad = gdGetGradient(current.x, current.y);
            let newX, newY;
            
            if (pathData.optimizer === 'sgd') {
                newX = current.x - gdLR * grad.x;
                newY = current.y - gdLR * grad.y;
            } else if (pathData.optimizer === 'momentum') {
                const beta = 0.9;
                pathData.vel.x = beta * pathData.vel.x + gdLR * grad.x;
                pathData.vel.y = beta * pathData.vel.y + gdLR * grad.y;
                newX = current.x - pathData.vel.x;
                newY = current.y - pathData.vel.y;
            } else if (pathData.optimizer === 'adam') {
                const beta1 = 0.9, beta2 = 0.999, eps = 1e-8;
                pathData.t++;
                pathData.m.x = beta1 * pathData.m.x + (1 - beta1) * grad.x;
                pathData.m.y = beta1 * pathData.m.y + (1 - beta1) * grad.y;
                pathData.v.x = beta2 * pathData.v.x + (1 - beta2) * grad.x * grad.x;
                pathData.v.y = beta2 * pathData.v.y + (1 - beta2) * grad.y * grad.y;
                const mHatX = pathData.m.x / (1 - Math.pow(beta1, pathData.t));
                const mHatY = pathData.m.y / (1 - Math.pow(beta1, pathData.t));
                const vHatX = pathData.v.x / (1 - Math.pow(beta2, pathData.t));
                const vHatY = pathData.v.y / (1 - Math.pow(beta2, pathData.t));
                newX = current.x - gdLR * mHatX / (Math.sqrt(vHatX) + eps);
                newY = current.y - gdLR * mHatY / (Math.sqrt(vHatY) + eps);
            }
            
            // Clamp to canvas bounds
            newX = Math.max(0.01, Math.min(0.99, newX));
            newY = Math.max(0.01, Math.min(0.99, newY));
            
            pathData.path.push({ x: newX, y: newY });
        }

        function gdAnimate() {
            if (!gdAnimating || gdPaths.length === 0) return;
            
            let allConverged = true;
            gdPaths.forEach(pathData => {
                if (pathData.path.length < 200) {
                    const current = pathData.path[pathData.path.length - 1];
                    const grad = gdGetGradient(current.x, current.y);
                    const gradMag = Math.sqrt(grad.x * grad.x + grad.y * grad.y);
                    if (gradMag > 0.001) {
                        gdStep(pathData);
                        allConverged = false;
                    }
                }
            });
            
            gdDraw();
            
            if (!allConverged) {
                requestAnimationFrame(gdAnimate);
            } else {
                gdAnimating = false;
            }
        }

        function gdStartOptimization(x, y) {
            if (gdCompareMode) {
                // Compare all optimizers
                gdPaths = [
                    { optimizer: 'sgd', path: [{ x, y }], vel: { x: 0, y: 0 }, m: { x: 0, y: 0 }, v: { x: 0, y: 0 }, t: 0 },
                    { optimizer: 'momentum', path: [{ x, y }], vel: { x: 0, y: 0 }, m: { x: 0, y: 0 }, v: { x: 0, y: 0 }, t: 0 },
                    { optimizer: 'adam', path: [{ x, y }], vel: { x: 0, y: 0 }, m: { x: 0, y: 0 }, v: { x: 0, y: 0 }, t: 0 }
                ];
            } else {
                // Single optimizer
                gdPaths = [
                    { optimizer: gdOptimizer, path: [{ x, y }], vel: { x: 0, y: 0 }, m: { x: 0, y: 0 }, v: { x: 0, y: 0 }, t: 0 }
                ];
            }
            gdAnimating = true;
            gdAnimate();
        }

        function gdSetSurface(surface) {
            gdSurface = surface;
            gdPaths = [];
            gdAnimating = false;
            gdDraw();
            // Update button states - use specific card ID
            const gdCard = document.getElementById('gd-demo-card');
            if (gdCard) {
                gdCard.querySelectorAll('.demo-controls-group:first-child .demo-btn').forEach(btn => {
                    const btnText = btn.textContent.toLowerCase();
                    btn.classList.toggle('active', btnText.includes(surface.substring(0, 4)));
                });
            }
        }
        
        function gdSetOptimizer(opt) {
            gdOptimizer = opt;
            gdCompareMode = false;
            // Update button states - use specific card ID
            const gdCard = document.getElementById('gd-demo-card');
            if (gdCard) {
                const groups = gdCard.querySelectorAll('.demo-controls-group');
                if (groups.length >= 2) {
                    groups[1].querySelectorAll('.demo-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.textContent.toLowerCase() === opt);
                    });
                }
            }
            // Deactivate compare button
            const compareBtn = document.getElementById('gd-compare-btn');
            if (compareBtn) compareBtn.classList.remove('active');
        }
        
        function gdReset() {
            gdPaths = [];
            gdAnimating = false;
            gdCompareMode = false;
            gdDraw();
            // Deactivate compare button
            const compareBtn = document.getElementById('gd-compare-btn');
            if (compareBtn) compareBtn.classList.remove('active');
        }
        
        function gdCompare() {
            gdCompareMode = true;
            // Highlight compare button
            const compareBtn = document.getElementById('gd-compare-btn');
            if (compareBtn) compareBtn.classList.add('active');
            // Deactivate individual optimizer buttons - use specific card ID
            const gdCard = document.getElementById('gd-demo-card');
            if (gdCard) {
                const groups = gdCard.querySelectorAll('.demo-controls-group');
                if (groups.length >= 2) {
                    groups[1].querySelectorAll('.demo-btn').forEach(btn => btn.classList.remove('active'));
                }
            }
        }
        
        // Canvas click handler
        if (gdCanvas) {
            gdCanvas.addEventListener('click', (e) => {
                const rect = gdCanvas.getBoundingClientRect();
                const scaleX = gdCanvas.width / rect.width;
                const scaleY = gdCanvas.height / rect.height;
                const x = ((e.clientX - rect.left) * scaleX) / gdCanvas.width;
                const y = ((e.clientY - rect.top) * scaleY) / gdCanvas.height;
                gdStartOptimization(x, y);
            });

            // Learning rate slider
            const gdLRSlider = document.getElementById('gd-lr');
            const gdLRVal = document.getElementById('gd-lr-val');
            if (gdLRSlider) {
                gdLRSlider.addEventListener('input', () => {
                    gdLR = gdLRSlider.value / 1000;
                    gdLRVal.textContent = gdLR.toFixed(3);
                });
                }
        }

        // Initialize all demos on load
        function initPlaygroundDemos() {
            nnResize();
            embedWords = embedData.tech;
            embedResize();
            attnResize();
            if (gdCanvas) gdResize();
        }

        // Wait for DOM and fonts to load
        if (document.readyState === 'complete') {
            initPlaygroundDemos();
        } else {
            window.addEventListener('load', initPlaygroundDemos);
        }
        window.addEventListener('resize', () => {
            nnResize();
            embedResize();
            attnResize();
            if (gdCanvas) gdResize();
        });

        // Expose functions to global scope for onclick handlers
        window.nnSetLayers = nnSetLayers;
        window.nnSetMode = nnSetMode;
        window.nnSetActivation = nnSetActivation;
        window.nnToggleDropout = nnToggleDropout;
        window.embedSetCategory = embedSetCategory;
        window.embedReset = embedReset;
        window.attnSetSentence = attnSetSentence;
        window.gdSetSurface = gdSetSurface;
        window.gdSetOptimizer = gdSetOptimizer;
        window.gdReset = gdReset;
        window.gdCompare = gdCompare;

        // ==========================================
        // CHATBOT
        // ==========================================
        const chatbotContainer = document.getElementById('chatbot-container');
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotWindow = document.getElementById('chatbot-window');
        const chatbotMessages = document.getElementById('chatbot-messages');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSend = document.getElementById('chatbot-send');
        const chatbotSuggestions = document.getElementById('chatbot-suggestions');

        // Open chatbot by default on desktop only (>600px)
        if (chatbotContainer && window.innerWidth > 600) {
            chatbotContainer.classList.add('open');
        }

        // ====== LLM Configuration ======
        // Set this to your deployed Cloudflare Worker URL
        // If empty or null, falls back to pattern matching
        const CHATBOT_WORKER_URL = 'https://llm-chat-app-template.onlinerj.workers.dev';
        
        // Conversation history for context
        let chatHistory = [];
        
        // ====== End LLM Configuration ======

        // Knowledge base about Rajat (used for fallback)
        const rajatKnowledge = {
            name: "Rajat Jaiswal",
            role: "Machine Learning Engineer & AI Researcher",
            email: "onlinerj@live.com",
            github: "https://github.com/onlinerj",
            linkedin: "https://linkedin.com/in/rajatjw",
            calendly: "https://calendly.com/onlinerj",
            
            about: "Rajat is an AI researcher and engineer with expertise in building and deploying AI models in production for trillion-dollar companies including Aramco.",
            
            experience: [
                { title: "AI Research Fellow", desc: "Research on Foundation Models across various research areas" },
                { title: "Lead AI/ML Engineer", desc: "Led a team of engineers building generative AI products and infrastructure" },
                { title: "Machine Learning Engineer", desc: "Developed and deployed production-level AI models for trillion-dollar companies including Aramco" }
            ],
            
            education: [
                "MS in Applied Artificial Intelligence with Software Engineering Specialization",
                "B.Tech [Hons.] in Computer Science and Engineering"
            ],
            
            certifications: [
                "Microsoft Azure (5x Certified): AI-900, AZ-900, DP-900, DP-100, PL-900",
                "Nvidia Deep Learning Institute: Accelerated Computing with CUDA"
            ],
            
            research: [
                "Foundation Models", "LLM Privacy & Security", "Federated Learning",
                "RL / LLM Alignment", "GPU Acceleration", "Multi-Modal AI",
                "Distributed LLM Training", "LLM Architecture", "Computer Vision",
                "Natural Language Processing", "Multi Agent Systems", "RAG",
                "GraphML", "Prompt Engineering", "Neurosymbolic AI", "Scaling Laws",
                "Pre-Training", "Post-Training", "LLM Evaluations", "Deep Agents", "Deep RL",
                "Model Threat & Defense", "Security Classification", "Adversarial ML", "Differential Privacy",
                "World Models", "Robotics", "Vision Language Action Models"
            ],
            
            skills: {
                hpc: ["PyTorch", "PyTorch Distributed", "PyTorch Geometric", "TensorFlow", "JAX", "CUDA", "DeepSpeed", "Megatron-LM", "Ray", "Triton", "SLURM", "ONNX", "NCCL"],
                genai: ["Transformers", "HuggingFace", "OpenAI API", "Claude API", "vLLM", "NumPy", "Matplotlib"],
                agentic: ["LangChain", "LangGraph", "ADK", "FastMCP", "LangSmith", "TauBench"],
                vectordb: ["Qdrant", "ChromaDB", "FAISS", "Pinecone", "Weaviate", "pgvector", "Milvus", "DiskANN"],
                mlops: ["Docker", "Kubernetes", "Terraform", "MLflow", "Kubeflow", "TFX", "AWS", "Azure", "GCP", "HELM", "DeepEval"],
                production: ["TF Serving", "Vertex AI", "SageMaker", "TensorBoard", "TFDV", "TFMA", "Prometheus", "Grafana", "W&B"],
                web: ["React", "Vue", "Angular", "Next.js", "Node.js", "Express.js"],
                data: ["BeautifulSoup", "Scrapy", "Selenium", "Firecrawl", "comcrawl", "datatrove"],
                languages: ["Python", "C++", "Java", "JavaScript", "TypeScript", "Node.js", "SQL"]
            },
            
        };

        // Pattern matching responses
        const chatPatterns = [
            {
                patterns: [/hi|hello|hey|greetings|howdy/i],
                response: () => `Hello! 👋 I'm here to tell you about Rajat. What would you like to know? You can ask about his experience, skills, research, or how to contact him!`
            },
            {
                patterns: [/who (is|are you)|about (you|rajat)|tell me about/i],
                response: () => `${rajatKnowledge.about}\n\nHe's currently working as an ${rajatKnowledge.experience[0].title}, focusing on ${rajatKnowledge.experience[0].desc.toLowerCase()}.`
            },
            {
                patterns: [/experience|work|job|career|worked|position/i],
                response: () => {
                    let resp = "Here's Rajat's professional experience:\n\n";
                    rajatKnowledge.experience.forEach((exp, i) => {
                        resp += `🔹 **${exp.title}**\n${exp.desc}\n\n`;
                    });
                    return resp;
                }
            },
            {
                patterns: [/education|study|degree|university|college|school/i],
                response: () => `🎓 **Education:**\n\n• ${rajatKnowledge.education.join('\n• ')}`
            },
            {
                patterns: [/certification|certified|certificate/i],
                response: () => `📜 **Certifications:**\n\n• ${rajatKnowledge.certifications.join('\n• ')}`
            },
            {
                patterns: [/research|interest|focus|specializ/i],
                response: () => `🔬 **Research Areas:**\n\n${rajatKnowledge.research.join(' • ')}`
            },
            {
                patterns: [/skill|technolog|framework|tool|stack|know|proficient/i],
                response: () => `💻 **Technical Skills:**\n\n**HPC & Deep Learning:** ${rajatKnowledge.skills.hpc.slice(0, 6).join(', ')}\n\n**GenAI & LLMs:** ${rajatKnowledge.skills.genai.slice(0, 5).join(', ')}\n\n**MLOps & Infra:** ${rajatKnowledge.skills.mlops.slice(0, 5).join(', ')}\n\n...and many more! Check the Frameworks section on this page for the full list.`
            },
            {
                patterns: [/pytorch|tensorflow|deep learning|neural/i],
                response: () => `Rajat is highly proficient in PyTorch and deep learning! He works extensively with PyTorch, TensorFlow, JAX, and CUDA for building production-grade AI systems. His expertise spans CNNs, Transformers, LLMs, and Federated Learning.`
            },
            {
                patterns: [/llm|large language|gpt|transformer|nlp/i],
                response: () => `Rajat has extensive experience with LLMs and transformers! His research areas include LLM Architecture, LLM Privacy & Security, and RL/LLM Alignment. He works with tools like HuggingFace, vLLM, LangChain, and LlamaIndex.`
            },
            {
                patterns: [/contact|email|reach|connect|hire|hiring|recruit/i],
                response: () => `📬 **Get in Touch:**\n\n📧 Email: ${rajatKnowledge.email}\n💼 LinkedIn: ${rajatKnowledge.linkedin}\n📅 Schedule a call: ${rajatKnowledge.calendly}\n🐙 GitHub: ${rajatKnowledge.github}\n\nRajat is open to exciting AI/ML opportunities!`
            },
            {
                patterns: [/github|code|open source|project/i],
                response: () => `🐙 **GitHub:**\n\nCheck out Rajat's work on GitHub: ${rajatKnowledge.github}`
            },
            {
                patterns: [/aramco|enterprise|production|deploy/i],
                response: () => `Rajat has built and deployed AI models in production for trillion-dollar companies including **Aramco**. He specializes in bringing cutting-edge machine learning solutions to enterprise scale.`
            },
            {
                patterns: [/federated|privacy|distributed/i],
                response: () => `Rajat specializes in **Federated Learning** and **Distributed LLM Training**! These are among his core research areas, focusing on privacy-preserving AI and scaling models across distributed systems.`
            },
            {
                patterns: [/azure|aws|cloud|gcp/i],
                response: () => `☁️ **Cloud Expertise:**\n\nRajat is **5x Microsoft Azure Certified** (AI-900, AZ-900, DP-900, DP-100, PL-900) and has experience with AWS and GCP. He's skilled in cloud-native MLOps with Docker, Kubernetes, and Kubeflow.`
            },
            {
                patterns: [/cuda|gpu|nvidia|accelerat/i],
                response: () => `⚡ **GPU & CUDA:**\n\nRajat is certified by **Nvidia Deep Learning Institute** in Accelerated Computing with CUDA. His research includes GPU Acceleration, and he works with CUDA, TensorRT, OpenAI Triton, and NCCL.`
            },
            {
                patterns: [/cv|computer vision|image/i],
                response: () => `👁️ **Computer Vision:**\n\nRajat has expertise in Computer Vision, from classical techniques (check out the CV kernels on his profile picture!) to modern deep learning approaches with CNNs and Vision Transformers.`
            },
            {
                patterns: [/thank|thanks|thx|appreciate/i],
                response: () => `You're welcome! 😊 Feel free to ask if you have more questions about Rajat, or reach out directly at ${rajatKnowledge.email}!`
            },
            {
                patterns: [/bye|goodbye|see you|later/i],
                response: () => `Goodbye! 👋 Thanks for your interest in Rajat's work. Don't hesitate to reach out if you'd like to connect!`
            },
            {
                patterns: [/help|what can you|how do|commands/i],
                response: () => `I can answer questions about Rajat! Try asking:\n\n• What's your experience?\n• Tell me about your research\n• What are your skills?\n• How can I contact you?\n• Tell me about your education\n• What certifications do you have?`
            }
        ];

        // Default response for unmatched queries
        const defaultResponses = [
            "That's an interesting question! I may not have specific info on that, but feel free to reach out to Rajat directly at " + rajatKnowledge.email,
            "I'm not sure about that specific topic. Try asking about Rajat's experience, skills, research, or how to contact him!",
            "Hmm, I don't have that info. You can ask about: experience, education, skills, research areas, or contact info!"
        ];

        function getChatResponse(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            // Check each pattern
            for (const pattern of chatPatterns) {
                for (const regex of pattern.patterns) {
                    if (regex.test(lowerMessage)) {
                        return pattern.response();
                    }
                }
            }
            
            // Return a random default response
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            // Simple markdown-like formatting
            content = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            
            contentDiv.innerHTML = content;
            messageDiv.appendChild(contentDiv);
            chatbotMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-content typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            `;
            chatbotMessages.appendChild(typingDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function removeTypingIndicator() {
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
        }

        async function sendMessage() {
            const message = chatbotInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, true);
            chatbotInput.value = '';
            
            // Add to history
            chatHistory.push({ role: 'user', content: message });
            
            // Hide suggestions after first message
            if (chatbotSuggestions) {
                chatbotSuggestions.style.display = 'none';
            }
            
            // Show typing indicator
            showTypingIndicator();
            
            let response;
            
            // Try LLM API if configured
            if (CHATBOT_WORKER_URL) {
                try {
                    const apiResponse = await fetch(CHATBOT_WORKER_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message,
                            history: chatHistory.slice(-10) // Send last 10 messages for context
                        })
                    });
                    
                    if (apiResponse.ok) {
                        const data = await apiResponse.json();
                        if (data.response && !data.fallback) {
                            response = data.response;
                        }
                    }
                } catch (error) {
                    console.log('LLM API unavailable, using fallback:', error.message);
                }
            }
            
            // Fallback to pattern matching
            if (!response) {
                // Small delay for pattern matching to feel natural
                await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
                response = getChatResponse(message);
            }
            
            removeTypingIndicator();
            addMessage(response);
            
            // Add bot response to history
            chatHistory.push({ role: 'assistant', content: response });
            
            // Keep history manageable
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-20);
            }
        }

        // Toggle chat window
        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', () => {
                chatbotContainer.classList.toggle('open');
                if (chatbotContainer.classList.contains('open')) {
                    chatbotInput.focus();
                }
            });
        }

        // Close button (mobile)
        const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
        if (chatbotCloseBtn) {
            chatbotCloseBtn.addEventListener('click', () => {
                chatbotContainer.classList.remove('open');
            });
        }

        // Send message on button click
        if (chatbotSend) {
            chatbotSend.addEventListener('click', sendMessage);
        }

        // Send message on Enter key
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }

        // Handle suggestion chips
        if (chatbotSuggestions) {
            chatbotSuggestions.addEventListener('click', (e) => {
                if (e.target.classList.contains('suggestion-chip')) {
                    const question = e.target.getAttribute('data-question');
                    chatbotInput.value = question;
                    sendMessage();
                }
            });
        }