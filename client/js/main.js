BUTO.requires = {
    mainTemplate: require("./mainT.js"),
    modules: {
        modelAR: require("./plugins/modelAR.js"),
        mcdatatable: require("./plugins/vue-mcdatatable.js").component,
        mapsClient: require("@google/maps")
    },
    components: {
        toolbar: require("./component/toolbar.js"),
        map: require("./component/map.js"),
        
        menu: require("./component/common/menu.js"),
        dashboard: require("./component/common/dashboard.js"),
        
        clientesRegistrados: require("./component/clientes/clientesRegistrados.js"),
        importadorClientes: require("./component/clientes/importadorClientes.js"),
        
        tiendasRegistradas: require("./component/tiendas/tiendasRegistradas.js"),
        nuevaTienda: require("./component/tiendas/nuevaTienda.js"),
        
        recursosRegistrados: require("./component/recursos_humanos/recursosRegistrados.js"),
        nuevoRecurso: require("./component/recursos_humanos/nuevoRecurso.js"),
        
        rutasRegistradas: require("./component/rutas/rutasRegistradas.js"),
        nuevaRuta: require("./component/rutas/nuevaRuta.js")
    }
};

Vue.http.get("/init-user-data").then(function(userResponse){
    if(userResponse.status === 200 && userResponse.body.success){
        (function(){
            new BUTO.requires.modules.modelAR({
                baseURL: userResponse.body.baseURL,
                dataURL: userResponse.body.dataURL,
                token: userResponse.body.access_token
                
                //baseURL: "https://alquimia3.adelantoad.com/index.php/api/",
                //tokenURL: "oauth2/token",
                //dataURL: "v1/",
                //contentType: "application/x-www-form-urlencoded",
                //accessData: {
                //    headers: {
                //        Authorization: "Basic dGVzdGNsaWVudDp0ZXN0cGFzcw==",   //username: testclient || password: testpass
                //    },
                //    body: {
                //        grant_type:"password", 
                //        username:"administrador", 
                //        password:"acceso_7h8j9k0l!!"
                //    }
                //}
            },
            function(modelCreator){
                BUTO.components = {
                    main: new Vue({
                        el: "#main",
                        template: BUTO.requires.mainTemplate,
                        data: {
                            profile: {
                                name: "Unknown",
                                email: null
                            },
                            active: {
                                first: 0,
                                second: 0,
                                third: 0
                            },
                            loader: new Vue({
                                data: {
                                    active: false,
                                    message: "Cargando"
                                },
                                methods: {
                                    loading(){
                                        this.active = true;
                                    },
                                    loaded(){
                                        this.active = false;
                                    }
                                }
                            }),
                            confirm: new Vue({
                                data: {
                                    description: {
                                        title: "",
                                        text: "",
                                        accept: "",
                                        cancel: ""
                                    },
                                    active: false
                                },
                                methods: {
                                    onAccept: function(){}
                                }
                            }),
                            alert: new Vue({
                                data: {
                                    description: {
                                        title: "",
                                        text: "",
                                        ok: ""
                                    },
                                    active: false
                                }
                            }),
                            models: {
                                perfil: new modelCreator("perfil"),
                                usuario: new modelCreator("usuario"),
                                cliente: new modelCreator("cliente"),
                                clienteEmpleado: new modelCreator(["cliente", "empleado"]),
                                clienteSucursal: new modelCreator(["cliente", "sucursal"]),
                                usuarioEmpleado: new modelCreator("usuario-empleado"),
                                empleado: new modelCreator("empleado"),
                                empleadoCliente: new modelCreator(["empleado", "cliente"]),
                                empleadoHorario: new modelCreator(["empleado", "horario"]),
                                sucursal: new modelCreator("sucursal"),
                                sucursalCliente: new modelCreator(["sucursal", "cliente"]),
                                sucursalHorario: new modelCreator(["sucursal", "horario"]),
                                ruta: new modelCreator("ruta"),
                                rutaPunto: new modelCreator(["ruta", "punto"]),
                                rutaPuntoServicio: new modelCreator(["ruta", "punto", "servicio"]),
                                proyeccionServicio: new modelCreator("proyeccion-servicio"),
                                proyeccionTrabajo: new modelCreator("proyeccion-trabajo"),
                                proyeccionTrabajoServicio: new modelCreator(["proyeccion-trabajo", "servicio"])
                            },
                            children: {
                                map: BUTO.requires.components.map,
                                toolbar: BUTO.requires.components.toolbar,
                                menu: BUTO.requires.components.menu,
                                dashboard: BUTO.requires.components.dashboard,
                                clientesRegistrados: BUTO.requires.components.clientesRegistrados,
                                importadorClientes: BUTO.requires.components.importadorClientes,
                                tiendasRegistradas: BUTO.requires.components.tiendasRegistradas,
                                nuevaTienda: BUTO.requires.components.nuevaTienda,
                                recursosRegistrados: BUTO.requires.components.recursosRegistrados,
                                nuevoRecurso: BUTO.requires.components.nuevoRecurso,
                                rutasRegistradas: BUTO.requires.components.rutasRegistradas,
                                nuevaRuta: BUTO.requires.components.nuevaRuta,
                            }
                        },
                        methods: {
                            setView: function(e){
                                var me = this,
                                    inPos = false;
                                if(this.active.first === e.first &&
                                   this.active.second === e.second &&
                                   this.active.third === e.third)
                                    inPos = true;
                                else{
                                    this.active.first = e.first;
                                    this.active.second = e.second;
                                    this.active.third = e.third;
                                }
                                if(!inPos){
                                    if(e.first === 1 && e.second === 0 && e.third === 0)
                                            me.children.clientesRegistrados.active = 0;
                                    else if(e.first === 2 && e.second === 0 && e.third === 0)
                                            me.children.tiendasRegistradas.active = 0;
                                    else if(e.first === 3 && e.second === 0 && e.third === 0)
                                            me.children.recursosRegistrados.active = 0;
                                    else if(e.first === 4 && e.second === 0 && e.third === 0)
                                            me.children.rutasRegistradas.active = 0;
                                    Vue.nextTick(function(){
                                        if(e.first === 1 && e.second === 0 && e.third === 1)
                                            me.children.importadorClientes.init();
                                        if(e.first === 2 && e.second === 0 && e.third === 1)
                                            me.children.nuevaTienda.init(false);
                                        else if(e.first === 3 && e.second === 0 && e.third === 1)
                                            me.children.nuevoRecurso.init(false);
                                        else if(e.first === 4 && e.second === 0 && e.third === 1)
                                            me.children.nuevaRuta.init(false);
                                        
                                    });
                                }
                                
                            },
                            mask: function(t, e, val){
                                var value,
                                    i;
                                if(e.key !== "Backspace"){
                                    switch(t){
                                        case "time":
                                            if(val !== null && val.length >= 2){
                                                value = val.split(":").join("");
                                                val = "";
                                                for(i = 0; i < value.length; i++)
                                                    val += (!isNaN(parseInt(value[i]))) ? value[i] : "";
                                                value = val;
                                                val = "";
                                                for(i = 0; i < value.length; i++)
                                                    val += (i === 1 || i === 3) ? value[i] + ":" : value[i];
                                            }
                                            break;
                                        case "date":                                            
                                            break;
                                    }
                                }
                                return val;
                            }
                        },
                        created: function(){
                            var me = this;
                            BUTO.init(userResponse);
                            this.models.perfil.get({},
                            function(success){
                                me.profile.name = success.body.nombre;
                                me.profile.email = success.body.correo;
                            },
                            function(error){
                                console.log(error);
                                window.location = "/logout";
                            });
                            BUTO.requires.components.dashboard.init();
                            BUTO.requires.components.clientesRegistrados.init({
                                cliente: this.models.cliente,
                                clienteSucursal: this.models.clienteSucursal,
                                sucursal: this.models.sucursal,
                                sucursalHorario: this.models.sucursalHorario,
                                clienteEmpleado: this.models.clienteEmpleado,
                                usuarioEmpleado: this.models.usuarioEmpleado,
                                empleado: this.models.empleado,
                                empleadoHorario: this.models.empleadoHorario,
                                mask: this.mask
                            });
                            BUTO.requires.components.importadorClientes.init({
                                cliente: this.models.cliente
                            });
                            
                            BUTO.requires.components.tiendasRegistradas.init({
                                sucursal: this.models.sucursal,
                                sucursalHorario: this.models.sucursalHorario,
                                mask: this.mask
                            });
                            BUTO.requires.components.nuevaTienda.init({
                                sucursal: this.models.sucursal,
                                sucursalHorario: this.models.sucursalHorario
                            });
                            
                            BUTO.requires.components.recursosRegistrados.init({
                                usuario: this.models.usuario,
                                usuarioEmpleado: this.models.usuarioEmpleado,
                                empleado: this.models.empleado,
                                empleadoHorario: this.models.empleadoHorario,
                                ruta: this.models.ruta,
                                rutaPunto: this.models.rutaPunto,
                                rutaPuntoServicio: this.models.rutaPuntoServicio,
                                sucursal: this.models.sucursal,
                                sucursalHorario: this.models.sucursalHorario,
                                sucursalCliente: this.models.sucursalCliente,
                                proyeccionServicio: this.models.proyeccionServicio,
                                proyeccionTrabajo: this.models.proyeccionTrabajo,
                                proyeccionTrabajoServicio: this.models.proyeccionTrabajoServicio,
                                mask: this.mask
                            });
                            BUTO.requires.components.nuevoRecurso.init({
                                usuarioEmpleado: this.models.usuarioEmpleado,
                                empleado: this.models.empleado,
                                empleadoHorario: this.models.empleadoHorario
                            });
                            
                            BUTO.requires.components.rutasRegistradas.init({
                                ruta: this.models.ruta,
                                rutaPunto: this.models.rutaPunto,
                                rutaPuntoServicio: this.models.rutaPuntoServicio,
                                sucursal: this.models.sucursal,
                                sucursalHorario: this.models.sucursalHorario,
                                sucursalCliente: this.models.sucursalCliente,
                                mask: this.mask
                            });
                            BUTO.requires.components.nuevaRuta.init({
                                ruta: this.models.ruta,
                                rutaPunto: this.models.rutaPunto,
                                rutaPuntoServicio: this.models.rutaPuntoServicio,
                                sucursal: this.models.sucursal,
                                sucursalHorario: this.models.sucursalHorario,
                                sucursalCliente: this.models.sucursalCliente
                            });
                        },
                        mounted: function(){
                            //this.children.map.init();
                        }
                    })
                };
            },
            function(error){
                console.log(error);
            });
        })();
    }
    else{
        window.location = "/logout";
    }
});
BUTO.init = function(response){
    BUTO.requires.components.map.token = response.body.apiKey;
    BUTO.requires.components.map.mapsClient = BUTO.requires.modules.mapsClient.createClient({
        key: response.body.apiKey
    });
};