window.addEventListener("load",inicio);

let telecentro = new Telecentro();

function inicio(){
	
	document.getElementById("addOp").addEventListener("click",function(e){
		if(document.getElementById("regOp").reportValidity()){
			agregarOperador();
		}
		e.stopPropagation();		
	});
	
	document.getElementById("addCall").addEventListener("click",function(a){
		if(document.getElementById("regLlamadas").reportValidity()){
			agregarLlamada();
		}
		a.stopPropagation();
	})
	
	document.getElementById("OrdenNom").addEventListener("change",function(){
		actualizarPantalla();
	});
	
	document.getElementById("OrdenEdad").addEventListener("change",function(){
		actualizarPantalla();
	});
	
	document.getElementById("callNum").addEventListener("change",function(){
		actualizarPantalla();
	});
	
	document.getElementById("callNom").addEventListener("change",function(){
		actualizarPantalla();
	});
	
	document.getElementById("elegirOp").addEventListener("click",function(){
		consultaOpeardor();
	});
	
	document.getElementById("addDuración").addEventListener("click",function(){
		consultaDuracion();
	});

	document.getElementById("consPalabras").addEventListener("click", function(){
		consultaDescripcion();
	});
	
	document.getElementById("distribucionC").addEventListener("click",function(){
		drawChart();
	})
	
	actualizarPantalla();
	
}

function drawChart(){
	
	let operadores = [];
	let numeroCalls = [];
	let data = [];
	let chart = anychart.pie();
	let contenedor = document.getElementById("piechart");
	
	contenedor.innerHTML = "";
	
	chart.title("Distribucion de llamadas");
	
	
	
	for(llamada of telecentro.obtenerLlamadas()){
		if(operadores.length > 0){
			let ret = false;
			for(let i = 0; i < operadores.length;i++){
				
				if(llamada.operador == operadores[i]){
					numeroCalls[i] = numeroCalls[i] + 1;
					ret = false;
				}else{
					ret = true;
				}
			}
			if(ret){
					operadores.push(llamada.operador);
					numeroCalls.push(1);
			}
		}else{
			operadores.push(llamada.operador);
			numeroCalls.push(1);
		}
		
	}
	
	for (sinllamada of telecentro.obtenerOperadores()){
		let ret = true;
		for(let i = 0; i< operadores.length; i++){
			if(operadores[i] == sinllamada.nombre){
				ret = false
			}
		}
		if(ret){
			operadores.push(sinllamada.nombre);
			numeroCalls.push(0);
		}
	}
	
	for(let i = 0; i < operadores.length ;i++){
		data.push([operadores[i],numeroCalls[i]]);
	}
	
	chart.data(data);
	chart.background().fill({
		keys: ["#EFF8FF"]
	});
	chart.container("piechart");
	if(data.length>0){
		contenedor.style.height="300px";
		chart.draw();
	}else{
		contenedor.innerText = "No hay ningun dato para realizar una grafica torta";
	}
}

function consultaDescripcion(){
	
	let palabra = document.getElementById("palabras").value;
	let tabla = document.getElementById("ConsultaPalabra");
	
	tabla.innerHTML = "<tr><th>NUMERO</th><th>OPERADOR</th><th>DESCRIPCION</th><th>MOTIVO</th><th>DURACION</th><th>CELULAR</th></tr>";
	
	
	
	let palabras = palabra.split(" ");
	
	let callPalabra = [];
	
	
	for(llamada of telecentro.obtenerLlamadas()){
		let desc = llamada.descripcion.split(" ");
		for(let i = 0; i < desc.length;i++){
			for(let j = 0; j < palabras.length;j++){
				if(palabras[j].toUpperCase() == desc[i].toUpperCase()){
					callPalabra.push(llamada);
					j = palabras.length;
					i = desc.length;
				}
			}
		}
		
	}
	
	
	for(let llamadas of callPalabra){
		
		
		let tr = document.createElement("tr");
		let num = document.createElement("td");
		let op = document.createElement("td");
		let des = document.createElement("td");
		let mot = document.createElement("td");
		let dr = document.createElement("td");
		let cell = document.createElement("td");
		
		let img = document.createElement("img");
		img.src = "img/" + llamadas.motivo + ".png";
		img.alt = llamadas.motivo;
		mot.appendChild(img);
		
		num.innerText = llamadas.indice;
		op.innerText = llamadas.operador;
		des.innerText = llamadas.descripcion;
		dr.innerText = llamadas.duracion;
		cell.innerText = llamadas.celular;
		
		
		tr.appendChild(num);
		tr.appendChild(op);
		tr.appendChild(des);
		tr.appendChild(mot);
		tr.appendChild(dr);
		tr.appendChild(cell);
		
		tabla.appendChild(tr);
		
	}
	
}

function consultaOpeardor(){
	
	let consMotivo = document.getElementById("consMotivo");
	consMotivo.innerHTML = "<li>Motivos no atendió:</li>"
	
	
	let numero = 0;
	let duracion = 0;
	let suma = 0;
	let con = 0;
	let promedio = 0;
	let motivos = [1,2,3,4,5,6];
	
	let mtv = 0;
	
	
	let pos = document.getElementById("OperadorConsulta").value;
	let Operador = telecentro.obtenerOperador(--pos);
	let OpSelect = Operador.nombre;
	let callOp = [];
	
	
	for(llamada of telecentro.obtenerLlamadas()){
		if (llamada.operador == OpSelect){
			callOp.push(llamada);
			suma = suma + parseInt(llamada.duracion);
			con ++;
			if(duracion < llamada.duracion){
				duracion = llamada.duracion;
				numero = llamada.indice;
			}

			mtv = llamada.motivo
			for(let i = 0; i < 6; i++){
				if(mtv == motivos[i]){
					motivos[i] = undefined;
				}
			}
			
		}
	}
	
	promedio = suma / con;
	
	
	for ( let i = 0; i < 6; i++){
		
		if (motivos[i] != undefined){
			let li = document.createElement("li");
			let img = document.createElement("img");
			
			img.src = "img/" + motivos[i] + ".png";
			img.alt = "motivo " + motivo[i];
			
			li.appendChild(img);
			consMotivo.appendChild(li);
		}
		
	}
	
	if(duracion != 0){
		let escribirDur = document.getElementById("duracionllamada");
		let escribirProm = document.getElementById("promedioAt");
	
		escribirDur.innerText = "Llamada más larga: " + "Número " + numero + " Duracion " + duracion + " minutos";
		escribirProm.innerText = "Tiempo Promedio de atención: " + promedio + " minutos";
	}
	
}

function consultaDuracion(){
	
	let llamadasDuracion = [];
	let repeticion = [];
	let duracionCons = document.getElementById("consultaDuracion").value;
	let ul = document.getElementById("ConsLlamadaDuracion");
	ul.innerHTML = "";

	for(llamada of telecentro.obtenerLlamadas()){
		if (llamada.duracion == duracionCons){
			if(llamadasDuracion.length > 0){
				let ret = false;
				
				for(let i = 0; i < llamadasDuracion.length; i++){
					if(llamada.operador == llamadasDuracion[i]){
						repeticion[i] = repeticion[i] + 1;
						ret = false;
					}else{
						ret = true;
					}
				}
				if(ret){
					llamadasDuracion.push(llamada.operador);
					repeticion.push(1);
				}
			}else{
				llamadasDuracion.push(llamada.operador);
				repeticion.push(1);
			}
		}
	}
	
	let max = 0;
	for(let i = 0; i < repeticion.length; i++){
		if(max < repeticion[i]){
			max = repeticion[i];
		}
	}
	
	for (let i = 0; i < llamadasDuracion.length; i++){
		if(max == repeticion[i]){

			let li = document.createElement("li");
			li.innerText = llamadasDuracion[i];
			ul.appendChild(li);
		}
	}
}

function agregarLlamada(){

	let sel = document.getElementById("selectOp").value;
	
	let operador = telecentro.obtenerOperador(--sel);
	let oper = operador.nombre;
	
	let desc = document.getElementById("desc").value;
	let moti = document.getElementById("motivo").value;
	let dura = document.getElementById("duracion").value;
	let cel = document.getElementById("celular").value;
		
	telecentro.agregarLlamadas( new Llamadas(oper,desc,moti,dura,cel));	
	document.getElementById("regLlamadas").reset();	
	actualizarPantalla();
	
	
}

function agregarOperador(){
		
	let nom = document.getElementById("nombre").value;
	let edad = document.getElementById("edad").value;
	let mail = document.getElementById("mail").value;
		
	let nopude = false;
	
	for(let op of telecentro.obtenerOperadores()){
			if(op.nombre == nom){
				nopude = true;
			}
	}
	
	if (nopude){
		alert("Operador ya existente");
		
	}else{
		telecentro.agregarOperador(new Operador(nom, edad, mail));
		document.getElementById("regOp").reset();
		actualizarPantalla();
	}
	
}

function actualizarPantalla(){
	
	let listaOp = document.getElementById("listaOp");
	let select = document.getElementById("selectOp");
	let selectCon = document.getElementById("OperadorConsulta");
	let listaCall = document.getElementById("tablaLlamadas");
	let consMotivo = document.getElementById("consMotivo");
	let escribirDur = document.getElementById("duracionllamada");
	let escribirProm = document.getElementById("promedioAt");
	let ulduracion = document.getElementById("ConsLlamadaDuracion");
	let tabla = document.getElementById("ConsultaPalabra");
	let contenedor = document.getElementById("piechart");
	let duracionCons = document.getElementById("consultaDuracion");
	let palabra = document.getElementById("palabras");
	
	
	palabra.value = "";
	duracionCons.value = "";
	contenedor.innerHTML = "";
	tabla.innerHTML = "<tr><th>NUMERO</th><th>OPERADOR</th><th>DESCRIPCION</th><th>MOTIVO</th><th>DURACION</th><th>CELULAR</th></tr>";
	ulduracion.innerHTML = "";
	listaCall.innerHTML = "<tr><th>NUMERO</th><th>OPERADOR</th><th>DESCRIPCION</th><th>MOTIVO</th><th>DURACION</th><th>CELULAR</th></tr>";
	listaOp.innerHTML = "";
	select.innerHTML = "<option value=''>-- Seleccione un operador --</option>";
	selectCon.innerHTML = "<option value=''>-- Seleccione un opeardor --</option>";
	consMotivo.innerHTML = "<li>Motivos no atendió:</li>"
	escribirDur.innerText = "Llamada más larga: ";
	escribirProm.innerText = "Tiempo Promedio de atención: ";
	
	let orden = "";
	let ordNom = document.getElementById("OrdenNom");
	let ordEdad = document.getElementById("OrdenEdad");
	
	let ordenCall = "";
	let ordNum = document.getElementById("callNum");
	let ordNombreNumero = document.getElementById("callNom");
	 
	if (ordNum.checked){
		ordenCall = ordNum.id;
	}
	
	if(ordNombreNumero.checked){
		ordenCall = ordNombreNumero.id;
	}
	
	if (ordNom.checked){
		orden = ordNom.id;
	}
	if (ordEdad.checked){
		orden = ordEdad.id;
	}

	for(operador of telecentro.obtenerOperadores(orden)){
		
		let li = document.createElement("li");
		li.innerText = operador;
		listaOp.appendChild(li);
		
		let opcion = document.createElement("option");
		opcion.innerText = operador.nombre;
		opcion.value = operador.indice;
		
		let opc = document.createElement("option");
		opc.innerText = operador.nombre;
		opc.value = operador.indice;
		
		selectCon.appendChild(opc);
		select.appendChild(opcion);
	}
	
	for(llamadas of telecentro.obtenerLlamadas(ordenCall)){
		
		let tr = document.createElement("tr");
		let num = document.createElement("td");
		let op = document.createElement("td");
		let des = document.createElement("td");
		let mot = document.createElement("td");
		let dr = document.createElement("td");
		let cell = document.createElement("td");
		
		let img = document.createElement("img");
		img.src = "img/" + llamadas.motivo + ".png";
		img.alt = llamadas.motivo;
		mot.appendChild(img);
		
		num.innerText = llamadas.indice;
		op.innerText = llamadas.operador;
		des.innerText = llamadas.descripcion;
		dr.innerText = llamadas.duracion;
		cell.innerText = llamadas.celular;
		
		
		tr.appendChild(num);
		tr.appendChild(op);
		tr.appendChild(des);
		tr.appendChild(mot);
		tr.appendChild(dr);
		tr.appendChild(cell);
		
		listaCall.appendChild(tr);
	}
}

