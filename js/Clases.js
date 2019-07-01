class Operador{
	constructor(nombre,edad,mail){
		this.nombre = nombre;
		this.edad = edad;
		this.mail = mail;
	}
	
	toString(){
		return this.nombre + " " + this.edad + " " + this.mail;
	}
	
	comparar(OtroOp){
		return this.nombre.localeCompare(OtroOp.nombre);
	}
}

class Llamadas{
	constructor(operador,descripcion,motivo,duracion,celular){
		this.operador = operador;
		this.descripcion = descripcion;
		this.motivo = motivo;
		this.duracion = duracion;
		this.celular = celular;
	}
	
	toString(){
		return this.operador + " " + this.descripcion + " " + this.motivo + " " + this.duracion + " " + this.celular; 
	}
	
	compararOp(otraLlamada){
		return this.operador.localeCompare(otraLlamada.operador);
	}
}

class Telecentro{
	constructor(){
		this.operadores = [];
		this.llamadas = [];
	}
	
	agregarOperador(operador){
		
		this.operadores.push(operador);
		operador.indice = this.operadores.length;
		
	}
	
	agregarLlamadas(llamada){
		console.log("agregarllamada en clases");
		this.llamadas.push(llamada);
		llamada.indice = this.llamadas.length;
	}
	
	obtenerLlamadas(orden){
		let calls = [];
		
		for(let llamada of this.llamadas){
			if(llamada.indice > -1){
				calls.push(llamada);
			}
		}
		
		
		if(orden != ""){
		
			switch(orden){
				
				case 'callNum':
					calls.sort(function(a,b){
						return a.indice - b.indice;
					})
				break;
				
				case 'callNom':
					calls.sort(function(a,b){
						let ret = a.compararOp(b)
						if (ret == 0){
							ret = a.indice - b.indice
						}
						return ret;
					})
				break;
			}
		}
		
		return calls;
	}
	
	obtenerOperadores(orden){
		
		let ops = [];
		
		for(let operador of this.operadores){
			if(operador.indice > -1){
				ops.push(operador);
			}
		}
		
		if(orden != ""){
			switch(orden){
				
				case 'OrdenNom':
					ops.sort(function(a,b){
						return a.comparar(b);
					})
				break;
				
				case 'OrdenEdad':
					ops.sort(function(a,b){
						return a.edad - b.edad;
					})
				break;
			}
			
		}
		
		return ops;
		
	}
	
	obtenerOperador(pos){
		return this.operadores[pos];
	}
}