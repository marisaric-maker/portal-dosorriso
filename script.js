/* ================= INTEGRATA - SCRIPT PRINCIPAL ================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ================= ANO ATUAL NO FOOTER ================= */
    const anoAtual = document.getElementById('ano-atual');
    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }

    /* ================= HEADER DINÂMICO ================= */
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    /* ================= BOTÃO VOLTAR AO TOPO ================= */
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ================= MENU MOBILE ================= */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const closeMenu = () => {
        navMenu.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    };

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Fecha o menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fecha o menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (
            navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            closeMenu();
        }
    });

    /* ================= SCROLL SUAVE ================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ================= LINK ATIVO NO MENU ================= */
    const sections = document.querySelectorAll('section[id]');

    const highlightMenu = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (!link) return;

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightMenu);
    highlightMenu();

    /* ================= ANIMAÇÃO REVEAL AO SCROLL ================= */
    const revealElements = document.querySelectorAll(
        '.diferencial-card, .servico-card, .estrutura-card, .depoimento-card, .contato-card, .sobre-content, .sobre-image, .info-item'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = (entry.target.dataset.delay || 0) * 100;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach((el, index) => {
        el.dataset.delay = (index % 4);
        revealObserver.observe(el);
    });

    /* ================= CONTADORES ANIMADOS (HERO) ================= */
    const stats = document.querySelectorAll('.stat strong');

    const animateCounter = (el) => {
        const text = el.textContent;
        const match = text.match(/(\+?)(\d+)(\.?)(\d*)/);

        if (!match) return;

        const prefix = match[1];
        const numStr = match[2].replace('.', '') + (match[4] || '');
        const targetNum = parseInt(numStr, 10);
        const hasPlus = prefix === '+';

        let current = 0;
        const step = Math.max(1, Math.ceil(targetNum / 60));
        const duration = 1500;
        const intervalTime = duration / (targetNum / step);

        const timer = setInterval(() => {
            current += step;
            if (current >= targetNum) {
                current = targetNum;
                clearInterval(timer);
            }
            const formatted = current.toLocaleString('pt-BR');
            el.textContent = (hasPlus ? '+' : '') + formatted;
        }, intervalTime);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    /* ================= MÁSCARA DE TELEFONE ================= */
    const telefoneInput = document.getElementById('telefone');

    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d{0,2}).*/, '($1');
            }

            e.target.value = value;
        });
    }

    /* ================= VALIDAÇÃO E ENVIO DO FORMULÁRIO ================= */
    const contatoForm = document.getElementById('contato-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contatoForm) {
        contatoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem').value.trim();

            // Validações
            if (!nome || nome.length < 3) {
                showFeedback('Por favor, informe seu nome completo.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback('Por favor, informe um e-mail válido.', 'error');
                return;
            }

            if (telefone.replace(/\D/g, '').length < 10) {
                showFeedback('Por favor, informe um telefone válido com DDD.', 'error');
                return;
            }

            if (!assunto) {
                showFeedback('Por favor, selecione um assunto.', 'error');
                return;
            }

            if (!mensagem || mensagem.length < 10) {
                showFeedback('Por favor, escreva uma mensagem com pelo menos 10 caracteres.', 'error');
                return;
            }

            // Simulação de envio
            const submitBtn = contatoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

            setTimeout(() => {
                showFeedback(
                    `Obrigado, ${nome.split(' ')[0]}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`,
                    'success'
                );
                contatoForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    function showFeedback(message, type) {
        if (!formFeedback) return;
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback ' + type;

        setTimeout(() => {
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';
        }, 6000);
    }

    /* ================= EFEITO PARALLAX SUAVE NO HERO ================= */
    const heroCircle = document.querySelector('.hero-circle');
    const floatingCards = document.querySelectorAll('.floating-card');

    if (window.matchMedia('(min-width: 1024px)').matches) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            if (heroCircle) {
                heroCircle.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            }

            floatingCards.forEach((card, i) => {
                const factor = i === 0 ? 18 : -18;
                card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    /* ================= CONSOLE INFO ================= */
    console.log('%c🦷 Integrata', 'color: #00b4d8; font-size: 24px; font-weight: bold;');
    console.log('%cCentro de Referência em Saúde Odontológica', 'color: #06d6a0; font-size: 14px;');
    console.log('%cSite desenvolvido com carinho para cuidar do seu sorriso 💙', 'color: #64748b; font-size: 12px;');

});
