// 页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    // ===== 导航栏交互 =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // 首页导航栏滚动效果
    if (navbar && navbar.classList.contains('transparent')) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 汉堡菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 点击导航链接后关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // ===== 数字滚动动画 =====
    function animateNumber(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            // 格式化数字（添加千位分隔符）
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    // 监测数字区域是否进入视口
    const statsSection = document.querySelector('.stats-section');
    let statsAnimated = false;

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
                    statNumbers.forEach((num, index) => {
                        const target = parseInt(num.getAttribute('data-target'));
                        // 错开动画开始时间
                        setTimeout(() => {
                            animateNumber(num, target, 1500);
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

        statsObserver.observe(statsSection);
    }

    // ===== 滚动显示动画 =====
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.85) {
                el.classList.add('animated');
            }
        });
    };

    // 为各种元素添加动画类
    const addAnimationClasses = () => {
        // section-block 淡入上升
        document.querySelectorAll('.section-block').forEach((el, i) => {
            el.classList.add('fade-in-up');
            el.style.transitionDelay = `${i * 0.1}s`;
        });

        // 图文并排 - 左右滑入
        document.querySelectorAll('.text-image-layout').forEach(el => {
            const textContent = el.querySelector('.text-content');
            const imageSide = el.querySelector('.image-side');
            if (textContent) textContent.classList.add('fade-in-left');
            if (imageSide) imageSide.classList.add('fade-in-right');
            
            // 反向布局
            if (el.classList.contains('reverse')) {
                if (textContent) {
                    textContent.classList.remove('fade-in-left');
                    textContent.classList.add('fade-in-right');
                }
                if (imageSide) {
                    imageSide.classList.remove('fade-in-right');
                    imageSide.classList.add('fade-in-left');
                }
            }
        });

        // 卡片缩放进入
        document.querySelectorAll('.principle-card, .challenge-item, .org-card, .scifi-card, .person-feature, .person-small-card, .tool-card').forEach((el, i) => {
            el.classList.add('scale-in');
            el.style.transitionDelay = `${i * 0.08}s`;
        });

        // 时间线项目
        document.querySelectorAll('.timeline-item, .milestone-item, .event-card').forEach((el, i) => {
            el.classList.add('fade-in-up');
            el.style.transitionDelay = `${i * 0.1}s`;
        });

        // 画廊项目
        document.querySelectorAll('.gallery-item').forEach((el, i) => {
            el.classList.add('scale-in');
            el.style.transitionDelay = `${i * 0.1}s`;
        });
    };

    addAnimationClasses();
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初始检查

    // 滚动时高亮当前导航项
    const sections = document.querySelectorAll('section[id], header[id]');
    
    function highlightNavigation() {
        let scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // ===== 交互：运费计算器 =====
    const freightWeightInput = document.getElementById('freightWeight');
    const freightWeightValue = document.getElementById('freightWeightValue');
    const freightRocketCost = document.getElementById('freightRocketCost');
    const freightElevatorCost = document.getElementById('freightElevatorCost');
    const freightSavings = document.getElementById('freightSavings');

    const formatUsd = (value) => {
        if (!Number.isFinite(value)) return '—';
        return `$${Math.round(value).toLocaleString()}`;
    };

    const updateFreightCalculator = () => {
        if (!freightWeightInput || !freightRocketCost || !freightElevatorCost || !freightSavings) return;
        const weightKg = Number(freightWeightInput.value);

        if (freightWeightValue && Number.isFinite(weightKg)) {
            freightWeightValue.textContent = `${Math.round(weightKg).toLocaleString()} kg`;
        }

        if (!Number.isFinite(weightKg) || weightKg < 0) {
            freightRocketCost.textContent = '—';
            freightElevatorCost.textContent = '—';
            freightSavings.textContent = '—';
            return;
        }

        // 简化估算：用于交互对比展示
        const rocketPerKg = 2000;
        const elevatorPerKg = 200;
        const rocketTotal = weightKg * rocketPerKg;
        const elevatorTotal = weightKg * elevatorPerKg;
        const savings = rocketTotal - elevatorTotal;

        freightRocketCost.textContent = formatUsd(rocketTotal);
        freightElevatorCost.textContent = formatUsd(elevatorTotal);
        freightSavings.textContent = formatUsd(savings);
    };

    if (freightWeightInput) {
        freightWeightInput.addEventListener('input', updateFreightCalculator);
        updateFreightCalculator();
    }

    // ===== 交互：钢缆 vs 碳纳米管拉力对比 =====
    const tensionDiameterInput = document.getElementById('tensionDiameter');
    const tensionLoadInput = document.getElementById('tensionLoad');
    const tensionDiameterValue = document.getElementById('tensionDiameterValue');
    const tensionLoadValue = document.getElementById('tensionLoadValue');
    const tensionSteel = document.getElementById('tensionSteel');
    const tensionSteelSub = document.getElementById('tensionSteelSub');
    const tensionCNT = document.getElementById('tensionCNT');
    const tensionCNTSub = document.getElementById('tensionCNTSub');

    const formatTons = (kg) => {
        if (!Number.isFinite(kg)) return '—';
        return `${(kg / 1000).toFixed(1)} 吨`;
    };

    const formatPercent = (x) => {
        if (!Number.isFinite(x)) return '—';
        return `${(x * 100).toFixed(0)}%`;
    };

    const updateTensionTool = () => {
        if (!tensionDiameterInput || !tensionLoadInput || !tensionSteel || !tensionSteelSub || !tensionCNT || !tensionCNTSub) return;

        const diameterMm = Number(tensionDiameterInput.value);
        const loadTons = Number(tensionLoadInput.value);

        if (tensionDiameterValue && Number.isFinite(diameterMm)) {
            tensionDiameterValue.textContent = `${diameterMm.toFixed(1)} mm`;
        }
        if (tensionLoadValue && Number.isFinite(loadTons)) {
            tensionLoadValue.textContent = `${loadTons.toFixed(1)} t`;
        }

        if (!Number.isFinite(diameterMm) || diameterMm <= 0 || !Number.isFinite(loadTons) || loadTons < 0) {
            tensionSteel.textContent = '—';
            tensionSteelSub.textContent = '—';
            tensionCNT.textContent = '—';
            tensionCNTSub.textContent = '—';
            return;
        }

        // 截面积（m^2）
        const diameterM = diameterMm / 1000;
        const area = Math.PI * Math.pow(diameterM / 2, 2);

        // 载荷（kg -> N）
        const loadKg = loadTons * 1000;
        const g = 9.81;
        const force = loadKg * g;
        const stress = force / area; // Pa

        // 典型强度（Pa），用于对比展示（不代表工程定值）
        const steelStrength = 1.5e9; // 1.5 GPa
        const cntStrength = 3.0e10;  // 30 GPa（较乐观实际）

        const steelUtil = stress / steelStrength;
        const cntUtil = stress / cntStrength;

        const steelMaxKg = (steelStrength * area) / g;
        const cntMaxKg = (cntStrength * area) / g;

        tensionSteel.textContent = steelUtil <= 1 ? `可承受（利用率 ${formatPercent(steelUtil)}）` : `可能断裂（利用率 ${formatPercent(steelUtil)}）`;
        tensionSteelSub.textContent = `该直径下最大约 ${formatTons(steelMaxKg)}（仅抗拉简化）`;

        tensionCNT.textContent = cntUtil <= 1 ? `可承受（利用率 ${formatPercent(cntUtil)}）` : `可能断裂（利用率 ${formatPercent(cntUtil)}）`;
        tensionCNTSub.textContent = `该直径下最大约 ${formatTons(cntMaxKg)}（仅抗拉简化）`;
    };

    if (tensionDiameterInput || tensionLoadInput) {
        tensionDiameterInput?.addEventListener('input', updateTensionTool);
        tensionLoadInput?.addEventListener('input', updateTensionTool);
        updateTensionTool();
    }



    // ===== FAQ 折叠效果 =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');
            
            // 关闭其他打开的FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.display = 'none';
            });
            
            // 切换当前FAQ
            if (!isActive) {
                faqItem.classList.add('active');
                answer.style.display = 'flex';
                answer.style.animation = 'fadeIn 0.3s ease';
            }
        });
    });

    // 初始化：隐藏所有答案
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.display = 'none';
    });

    // ===== 平滑滚动 =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== 卡片悬停效果增强 =====
    const cards = document.querySelectorAll('.principle-card, .challenge-item, .gallery-item, .org-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // ===== 添加脉冲动画 =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // ===== 滚动进度指示 =====
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 向下滚动时隐藏导航栏
        if (navbar && scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else if (navbar) {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // 确保导航栏有过渡效果
    if (navbar) {
        navbar.style.transition = 'transform 0.3s ease';
    }

    console.log('太空电梯网站已加载完成！');
});
