document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const mainMenu = document.querySelector('nav[aria-label="Navegação principal"]');
    const menuToggleButton = document.querySelector('.menu-toggle-btn');

    // Função para fechar todos os submenus abertos, exceto um específico
    function closeAllSubmenus(exceptThisButton = null) {
        dropdownToggles.forEach(btn => {
            if (btn !== exceptThisButton) {
                const submenuId = btn.getAttribute('aria-controls');
                const submenu = document.getElementById(submenuId);
                if (submenu) {
                    btn.setAttribute('aria-expanded', 'false');
                    submenu.setAttribute('hidden', '');
                }
            }
        });
    }

    dropdownToggles.forEach(toggle => {
        const submenuId = toggle.getAttribute('aria-controls');
        const submenu = document.getElementById(submenuId);
        const submenuItems = submenu ? Array.from(submenu.querySelectorAll('a')) : [];

        toggle.addEventListener('click', function (event) {
            event.preventDefault(); // Previne comportamento padrão se for um link
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Fecha outros submenus (especialmente útil em desktop)
            if (!isExpanded && window.innerWidth > 768) { // Apenas em desktop
                closeAllSubmenus(this);
            }

            this.setAttribute('aria-expanded', String(!isExpanded));
            submenu.toggleAttribute('hidden');

            if (!isExpanded && submenuItems.length > 0 && window.innerWidth > 768) { // Foco no desktop
                // Atraso pequeno para garantir que o submenu esteja visível antes do foco
                setTimeout(() => submenuItems[0].focus(), 50);
            } else if (isExpanded) {
                // Se fechando, e o foco estava dentro, retorna ao botão
                if (submenu.contains(document.activeElement)) {
                    this.focus();
                }
            }
        });

        // Navegação por teclado dentro do submenu
        if (submenuItems.length > 0) {
            submenuItems.forEach((item, index) => {
                item.addEventListener('keydown', function(event) {
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        submenuItems[(index + 1) % submenuItems.length].focus();
                    } else if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        submenuItems[(index - 1 + submenuItems.length) % submenuItems.length].focus();
                    } else if (event.key === 'Escape') {
                        event.preventDefault();
                        submenu.setAttribute('hidden', '');
                        toggle.setAttribute('aria-expanded', 'false');
                        toggle.focus();
                    } else if (event.key === 'Tab' && !event.shiftKey && index === submenuItems.length - 1) {
                        // Opcional: fechar submenu ao sair com Tab do último item
                        // setTimeout(() => { // Pequeno delay para permitir o foco natural
                        //     if (!submenu.contains(document.activeElement)) {
                        //         submenu.setAttribute('hidden', '');
                        //         toggle.setAttribute('aria-expanded', 'false');
                        //     }
                        // }, 0);
                    }
                });
            });
        }

        // Fechar submenu com a tecla Escape quando o foco está no botão toggle
        toggle.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                if (this.getAttribute('aria-expanded') === 'true') {
                    event.preventDefault();
                    submenu.setAttribute('hidden', '');
                    this.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Fechar submenus se clicar fora deles (apenas em desktop)
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768) return; // Não aplicar em mobile onde o comportamento é diferente

        let isClickInsideMenu = false;
        let clickedToggle = null;

        dropdownToggles.forEach(toggle => {
            const submenu = document.getElementById(toggle.getAttribute('aria-controls'));
            if (toggle.contains(event.target) || (submenu && submenu.contains(event.target))) {
                isClickInsideMenu = true;
                if (toggle.contains(event.target)) clickedToggle = toggle;
            }
        });

        if (!isClickInsideMenu) {
            closeAllSubmenus();
        } else if (clickedToggle && clickedToggle.getAttribute('aria-expanded') === 'true') {
            // Se clicou em um toggle que já estava aberto, não feche os outros
            // A lógica do toggle individual já cuidará disso
        }
    });

    // Toggle do menu hambúrguer
    if (menuToggleButton && mainMenu) {
        menuToggleButton.setAttribute('aria-expanded', 'false');
        menuToggleButton.setAttribute('aria-controls', 'main-menu-ul'); // ID da UL principal

        menuToggleButton.addEventListener('click', function() {
            const isExpanded = mainMenu.classList.contains('active');
            mainMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', String(!isExpanded));
            if (!isExpanded) {
                // Opcional: focar no primeiro item do menu ao abrir
                const firstMenuItem = mainMenu.querySelector('ul.main-menu > li > a, ul.main-menu > li > button');
                if (firstMenuItem) setTimeout(() => firstMenuItem.focus(), 50);
            }
        });
    }
});