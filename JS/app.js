const salidaInput = document.querySelector("#salida");
const haciaInput = document.querySelector("#hacia");
const idaInput =  document.querySelector("#ida-fecha");
const vueltaInput =  document.querySelector("#vuelta-fecha");
const pasajerosInput = document.querySelector("#pasajeros");
const formulario = document.querySelector('#viaje');
const Submit = document.querySelector('#submit')
const contenedorVuelos = document.querySelector('#vuelos-section')

let editar

eventListener();

function eventListener(){
    salidaInput.addEventListener('input', datosVuelos)
    haciaInput.addEventListener('input', datosVuelos)
    idaInput.addEventListener('input', datosVuelos)
    vueltaInput.addEventListener('input', datosVuelos)
    pasajerosInput.addEventListener('input', datosVuelos)
    formulario.addEventListener('submit', nuevoVuelo)
}

function datosVuelos(e){
    vuelosObj[e.target.name] = e.target.value
}

const vuelosObj = {
    salida:'',
    hacia:'',
    ida:'',
    vuelta:'',
    pasajeros:'',
}

class vuelos{

    constructor(){
        this.vuelos = []
    }

        agregarVuelo(vuelo){
            this.vuelos = [...this.vuelos,vuelo]
        }

        eliminarVuelo(id){
            this.vuelos = this.vuelos.filter(vuelos=>vuelos.id !== id);
        }
}

class UI {

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert', 'd-block', 'col-12');
        
        if(tipo=== 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        document.querySelector('#alert').insertBefore(divMensaje,document.querySelector('.alert-container'));

        setTimeout(()=>{
            divMensaje.remove();
        },4500);
    }

    imprimirVuelos({vuelos}){

        this.limpiarHTML();

        vuelos.forEach(vuelo => {
            const {salida, hacia, ida, vuelta, pasajeros, id} = vuelo

            const divVuelo = document.createElement('div')
                
                divVuelo.dataset.id = id;

            const descVuelo = document.createElement('div')
                descVuelo.innerHTML = `
            <div class="row"> 
            <h1 class="font-weight-bold ml-2 Titulo-Registro">Vuelo desde </h1><h1 class="Registro-Res ml-2"> ${salida}</h1>
            </div>
            <div class="row">
            <h1 class="font-weight-bold ml-2 Titulo-Registro">Hacia </h1><h1 class="Registro-Res ml-2"> ${hacia}</h1>
            </div>

            <div class="mt-5">
                <p><span class="font-weight-bold desc-text ml-3">Fecha de ida: </span>${ida}</p>
                <p><span class="font-weight-bold desc-text ml-3">Fecha de vuelta: </span>${vuelta}</p>
                <p><span class="font-weight-bold desc-text ml-3 ">Cantidad de pasajeros: </span>${pasajeros}</p>
            </div>
            `
            descVuelo.className = "col-12 col-sm-5 col-md-12 mb-5 py-4 px-4 box"    

            const DivButton = document.createElement('div')
                DivButton.className = "row justify-content-around mt-5 mx-4"

            const EditButton = document.createElement('button')
            EditButton.innerHTML = ` <span><i class='bx bx-edit'></i> Editar</span> `
            EditButton.className = "boton"
            EditButton.addEventListener('click', () => {
                cargarEdicion(vuelo)
            })

            const DeleteButton = document.createElement('div')
            DeleteButton.innerHTML = `<span><i class='bx bx-edit'></i> Eliminar</span>`
            DeleteButton.className = "boton e"
            DeleteButton.addEventListener('click', () => {
                eliminarVuelo(id)
            })
        contenedorVuelos.appendChild(divVuelo);
        divVuelo.appendChild(descVuelo)
        descVuelo.appendChild(DivButton)
        DivButton.appendChild(EditButton)
        DivButton.appendChild(DeleteButton)
        })
    }

    limpiarHTML(){
        while(contenedorVuelos.firstChild){
            contenedorVuelos.removeChild(contenedorVuelos.firstChild)
        }
    }
}

const userui = new UI();
const administrarVuelos = new vuelos()

function limpiarHTML(){
    while(contenedorVuelos.firstChild){
        contenedorVuelos.removeChild(contenedorVuelos.firstChild)
    }
}

function nuevoVuelo(e){
    e.preventDefault()

    const {salida, hacia, ida, vuelta, pasajeros} = vuelosObj

    if(salida==='' || hacia==='' || ida==='' || vuelta==='' || pasajeros===''){


        userui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return

    }if(ida >= vuelta){

        userui.imprimirAlerta('La fecha de vuelta no puede ser anterior a la de ida', 'error')
        return
        
    }if(editar){

        editar = false

        reiniciarVueloObj()

        Submit.textContent = 'Registrar Vuelo'

        administrarVuelos.editarVuelo({...vuelosObj})

        userui.imprimirAlerta('Se ha modificado el registro correctamente')

    }else{
        vuelosObj.id = Date.now();
        administrarVuelos.agregarVuelo({...vuelosObj})
        userui.imprimirAlerta('El vuelo se ha registrado correctamente');
        reiniciarVueloObj()
    }

    formulario.reset()
    userui.imprimirVuelos(administrarVuelos);
}

function reiniciarVueloObj(){
    vuelosObj.hacia='';
    vuelosObj.ida='';
    vuelosObj.vuelta='';
    vuelosObj.salida='';
    vuelosObj.pasajeros='';
}

function eliminarVuelo(id){
    administrarVuelos.eliminarVuelo(id);

    userui.imprimirAlerta('El vuelo se elimino correctamente');

    limpiarHTML()
    userui.imprimirVuelos(administrarVuelos);
}

function cargarEdicion(vuelo){
    userui.imprimirAlerta('Estás editando');

    const {salida, hacia, ida, vuelta, pasajeros, id} = vuelo;

    salidaInput.value = vuelosObj.salida = salida;
    haciaInput.value = vuelosObj.hacia = hacia;
    idaInput.value = vuelosObj.ida = ida;
    vueltaInput.value = vuelosObj.vuelta = vuelta;
    pasajerosInput.value = vuelosObj.pasajeros = pasajeros;
    vuelosObj.id = id;

    Submit.textContent = 'Guardar';
    editar = true;
    formulario.removeEventListener('submit', nuevoVuelo);
    formulario.addEventListener('submit', guardarEdicion);
}

function guardarEdicion(e) {
    e.preventDefault();

    const { salida, hacia, ida, vuelta, pasajeros } = vuelosObj;

    if (salida === '' || hacia === '' || ida === '' || vuelta === '' || pasajeros === '') {
        userui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (ida >= vuelta) {
        userui.imprimirAlerta('La fecha de vuelta no puede ser anterior a la de ida', 'error');
        return;
    }

    editar = false;
    Submit.textContent = 'Registrar Vuelo';

    administrarVuelos.editarVuelo({ ...vuelosObj });

    userui.imprimirAlerta('Se ha modificado el registro correctamente');

    formulario.reset();
    userui.imprimirVuelos(administrarVuelos);

    formulario.removeEventListener('submit', guardarEdicion);
    formulario.addEventListener('submit', nuevoVuelo);
}