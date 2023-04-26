const getMenuFrontEnd = (role = 'USER_ROLE')=> {

    const menu = [
        {
            titulo: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Main', url: '/' },
                { titulo: 'Graficas', url: 'grafica1' },
                { titulo: 'ProgressBar', url: 'progress' },
                { titulo: 'Promesas', url: 'promesas' },
                { titulo: 'Rxjs', url: 'rxjs' },
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
               // { titulo: 'usuarios' , url: 'usuarios'},
                { titulo: 'Hospitales', url: 'hospitales' },
                { titulo: 'Medicos', url: 'medicos' },
            ]
        },
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'usuarios', url: 'usuarios' });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}