
let datos = [];

const crearFila = (dato) =>{
    const tbody = document.querySelector(`#tbody`);
    
    const trow = document.createElement("tr");
    trow.className = 'tr-style'; // TODO: estilar tr-style !!!!!!!!!!!!!!!!!!!!!!!!!!
    trow.id = `user-${dato.id}`;
    const tCheckbox = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';


    const tName = document.createElement('td');
    tName.innerText = dato.fullname; 

    const tEmail = document.createElement('td');
    tEmail.innerText = dato.email; 

    const tAddress = document.createElement('td');
    tAddress.innerText = dato.address;

    const tPhone = document.createElement('td');
    tPhone.innerText = dato.phone;

    const tAction = document.createElement('td'); //TODO: poner icono boton etc !!!!!!!!!!!!

    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add("btn-green");
    const iEdit = document.createElement('i');
    iEdit.innerHTML = "&#xE254;";
    iEdit.classList.add("material-icons");
    iEdit.title="Edit";    

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add("btn-red");
    const iDelete = document.createElement('i');
    iDelete.innerHTML = "&#xE872;";
    iDelete.classList.add("material-icons");
    iDelete.title="Delete";

    buttonDelete.addEventListener("click", () => {
        //TODO: generar un div con las clases y cosas que lleva el modal de las chicas.
        //donde la data que se cargue sea dato.fullname dato.id dato.phone ................
        //dentro de este modal hay un botton que hay que ponerle un addevent listener

        //sacamos del html:
        eliminarFila(dato.id);
        //sacamos de la api:
        axios.delete(`https://5f7c70d600bd74001690ac5e.mockapi.io/users/${dato.id}`)
            .then(res => console.log(dato))
            .catch(err => console.log(err)); 
    });


    buttonEdit.appendChild(iEdit);
    tAction.appendChild(buttonEdit);
    buttonDelete.appendChild(iDelete);
    tAction.appendChild(buttonDelete);
   

    tCheckbox.appendChild(checkbox);
    trow.appendChild(tCheckbox);
    trow.appendChild(tName);
    trow.appendChild(tEmail);
    trow.appendChild(tAddress);
    trow.appendChild(tPhone);
    trow.appendChild(tAction);
    tbody.appendChild(trow);

}

const cargarDatos = async () =>{
    try{
        const res = await axios.get('https://5f7c70d600bd74001690ac5e.mockapi.io/users')
        datos = res.data;
        console.log(datos);
        datos.map( dato =>{
            crearFila(dato);
        })
        

    }catch(err){
        console.log('ERROR:',err);
    }
}

const eliminarFila = (idUser) => {
    const userAeliminar = document.querySelector(`#user-${idUser}`);
    userAeliminar.remove();
}

const eliminarTodasLasFilas = (fila) =>{
    let list = document.querySelectorAll(fila);
    for(let i of list){
        i.remove();
    }
}


const filtrarDatos = async (searchParam) =>{
    try{
        const res = await axios.get(`https://5f7c70d600bd74001690ac5e.mockapi.io/users/?search=${searchParam}`);
        eliminarTodasLasFilas('.tr-style');
        datos = res.data;
        console.log(datos);
        datos.map( dato =>{
            crearFila(dato);
        })
        
    }catch(err){
        console.log('ERROR:',err);
    }
}

const filtrarUsuarios = () =>{
    const searchParam = document.querySelector("#input-filter-user").value.toLowerCase();
    console.log(searchParam);
    if(searchParam.length < 3) return; 
    //if(searchParam == "") cargarDatos();
    filtrarDatos(searchParam);
}

const eliminarUser = () =>{

}

const onLoad = () => {
    cargarDatos();
    document.querySelector("#btn-filter-user").addEventListener("click" ,filtrarUsuarios);
    //para poner los add event listeners
}