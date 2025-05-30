document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    const navLinksWithSubmenu = document.querySelectorAll('.nav-item.has-submenu > a');

    // Toggle do menu mobile (hamburger)
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            primaryNav.setAttribute('data-visible', !isVisible);
            navToggle.setAttribute('aria-expanded', !isVisible);
        });
    }

    // Toggle dos submenus para acessibilidade e mobile
    navLinksWithSubmenu.forEach(link => {
        link.addEventListener('click', function (e) {
            // Prevenir comportamento padrão se for apenas para abrir submenu
            // Se o link principal tiver um href="#", previne o salto na página
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }

            const parentItem = this.parentElement;
            const submenu = parentItem.querySelector('.submenu');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Fecha outros submenus abertos (opcional, mas bom para UX)
            if (window.innerWidth <= 768) { // Apenas em mobile/tablet
                 document.querySelectorAll('.nav-item.has-submenu.open').forEach(openItem => {
                    if (openItem !== parentItem) {
                        openItem.classList.remove('open');
                        openItem.querySelector('a').setAttribute('aria-expanded', 'false');
                    }
                });
            }


            // Toggle o submenu atual
            if (submenu) {
                parentItem.classList.toggle('open'); // Para CSS poder estilizar o item pai
                this.setAttribute('aria-expanded', !isExpanded);
                // Não é mais necessário controlar display: block/none aqui pois
                // .nav-item:hover .submenu e .nav-item.open .submenu no CSS cuidam disso.
                // Em mobile, a classe 'open' é mais crucial.
            }
        });

        // Adiciona listeners para teclado para abrir/fechar submenus
        link.addEventListener('keydown', function(e) {
            const parentItem = this.parentElement;
            const submenu = parentItem.querySelector('.submenu');
            if (!submenu) return;

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                parentItem.classList.toggle('open');
                if (!isExpanded) {
                    submenu.querySelector('a').focus(); // Foca no primeiro item do submenu
                }
            }
        });

        // Fechar submenu com Escape
        const submenu = link.parentElement.querySelector('.submenu');
        if (submenu) {
            submenu.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    link.setAttribute('aria-expanded', 'false');
                    link.parentElement.classList.remove('open');
                    link.focus(); // Volta o foco para o link pai
                }
            });
        }
    });

    // Fechar menu mobile se clicar fora dele (opcional)
    document.addEventListener('click', function(event) {
        const isClickInsideNav = primaryNav.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);
        if (!isClickInsideNav && !isClickOnToggle && primaryNav.getAttribute('data-visible') === 'true') {
            primaryNav.setAttribute('data-visible', 'false');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});