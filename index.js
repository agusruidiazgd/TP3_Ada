
let datos = [];

const crearFila = (dato) =>{
    const tbody = document.querySelector(`#tbody`);
    
    const trow = document.createElement("tr");
    trow.className = 'tr-style'; // TODO: estilar tr-style !!!!!!!!!!!!!!!!!!!!!!!!!!
    //trow.id = `Producto-${idProd}`;
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

const onLoad = () => {
    cargarDatos();
    //para poner los add event listeners
}