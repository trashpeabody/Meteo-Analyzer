function salida_texto (text){		//SACA TEXTO DE PRIMERA COLUMNA
	texto_final += text + "<br>" + "<br>";
}

function salida_texto_2 (errores_array, evitados_array){	//SACA TEXTO DE SEGUNDA Y TERCERA COLUMNA
	
	for (errores_b = 0; errores_b < errores_array.length; errores_b++){
		
		if (errores_array[errores_b] == "" || errores_array[errores_b] == undefined){
			errores_array.splice(errores_b,1);
			errores_b--;
		}
	}
	
	for (evitados_b = 0; evitados_b < evitados_array.length; evitados_b++){
		
		if (evitados_array[evitados_b] == "" || evitados_array[evitados_b] == undefined){
			evitados_array.splice(evitados_b,1);
			evitados_b--;
		}
	}
	
	for (errores_b = 0; errores_b < errores_array.length; errores_b++){
		texto_final2 += errores_array[errores_b] + "<br>" + "<br>";
	}
	
	for (evitados_b = 0; evitados_b < evitados_array.length; evitados_b++){
		texto_final3 += evitados_array[evitados_b] + "<br>" + "<br>";
	}	
}

function detect_airport(airport_code){	//DETECTA SI ES AEROPUERTO CON O SIN TREND, Y CON O SIN RMK
	airport_trend_reg = /^(LERT|LECO|LETO|LERI|LEMO|LEMD|LEAB|LEAL|LEAS|LEBL|LEBB|LEIB|LEMG|LELC|LEPA|LEST|LEZL|GCXO|GCTS|LEVC|LEVX)$/;
	airport_notrend_reg = /^(LETU|LEAO|LECV|LEGE|LETL|LEBT|LEEC|LEGT|LEAG|LEBR|LEAM|LESU|LEBZ|LEBG|LECH|LEBA|GCHI|GCFV|GCLP|LEGR|LEHC|LEJR|GCLA|GCRR|LELN|LEDA|LELO|LEVS|GEML|LEMH|LEPP|LERS|LELL|LESA|LESO|LEXJ|LEVD|LEVT|LEZG)$/;
	airport_notrend_rmk_reg = /^(GCGM)$/;
	
	if (airport_trend_reg.test(airport_code) == true){
		return "TREND";
	}
	
	else if (airport_notrend_reg.test(airport_code) == true){
		return "NOTREND";
	}
	
	else if (airport_notrend_rmk_reg.test(airport_code) == true){
		return "RMK";
	}
	
	else{
		return false;
	}
}

function viento(avg_wind){		//SEPARA EN DIRECCION, RACHAS, UNIDADES Y VELOCIDAD
	wind_reg_exp = /^(\D{3}|\d{3})(P)?(\d{2})(G)?(P)?(\d{2})?(\D{2})(=)?$/;
	wind_reg_exp_2 = /^(\/)(\/)(\/)(\/)(\/)(KT)(=)?$/;
	var largo = avg_wind.length;						//Los de longitud 7 y 8 no llevan rachas y los de longitud 10 y 11 llevan rachas
	var direccion;
	var velocidad;
	var unidades;
	var rachas;
	var result1;
	var result2;
	var result3;
	var result4;	
	var P;
	var G;						//Declaramos todas las variables necesarias
	viento_medio_end = 0;
	
	if(wind_reg_exp_2.test(avg_wind) == true){
		
		if (avg_wind.charAt(largo-1) == "="){
			viento_medio_end = 1;
			salida_texto("El término de viento " + avg_wind + " es correcto.");
			return 0;
		}
		
		else{
			salida_texto("El término de viento " + avg_wind + " es correcto.");
			return 0;
		}
	}

	else if (wind_reg_exp.test(avg_wind) == true){
		
		
		if (avg_wind.charAt(largo-1) == "="){
			viento_medio_end = 1;
			avg_wind = avg_wind.substr(0,largo-1);
			largo = avg_wind.length;
		}
		
		if (largo == 7) {	//viento variable o no, sin rachas y menor de 100 nudos
		direccion = avg_wind.slice(0,3);	//IDENTIFICAMOS CADA VARIABLE
		velocidad = avg_wind.slice(3,5);
		unidades = avg_wind.slice(5);			
		result1 = wind_direction (direccion, largo, avg_wind);	//COMPROBAMOS LA DIRECCIÓN
	
			if (result1 == 0){
				return 0;
			}
		
		result2 = wind_speed (velocidad, result1, avg_wind);	//COMPROBAMOS LA VELOCIDAD
	
			if (result2 == 0){
				return 0;
			} 
		
			result3 = wind_units (unidades, result2, avg_wind);					//COMPROBAMOS LAS UNIDADES
		
			if (result3 === 0){
				return 0;
			}	
		}
			
		else if (largo == 8){		//VIENTO VARIABLE O NO DE MÁS DE 100 NUDOS
			direccion = avg_wind.slice(0,3);	//IDENTIFICAMOS CADA VARIABLE
			velocidad = avg_wind.slice(4,6);
			unidades = avg_wind.slice(6);		
			P = avg_wind.charAt(3);
			result1 = wind_direction(direccion,largo, avg_wind);	//COMPROBAMOS LA DIRECCIÓN
	
			if (result1 == "nocalm") {
			
				if (P == "P"){						//COMPROBAMOS LA P
			
					if (velocidad == 99){			//COMPROBAMOS LA VELOCIDAD
						result3 = wind_units (unidades, "calmok", avg_wind);					//COMPROBAMOS LAS UNIDADES
							
						if (result3 === 0){
							return 0;
						}
					}
				
					else{
						salida_texto("<span style='color:red; font-weight:bold'> La velocidad en esta estructura de viento del término " + avg_wind + " debe ser P99.</span>");
						return 0;
					}
				}
			
				else{
					salida_texto("<span style='color:red; font-weight:bold'>La estructura del término del viento del término " + avg_wind + " debe llevar una P para velocidades de más de 99 nudos.</span>");
					return 0;
				}
			}
		
			else{
				return 0;
			}
		}
	
		else if (largo == 10){			//VIENTO VARIABLE O NO CON RACHAS MENORES DE 100 NUDOS
		direccion = avg_wind.slice(0,3);	//IDENTIFICAMOS CADA VARIABLE
		velocidad = avg_wind.slice(3,5);
		unidades = avg_wind.slice(8);		
		G = avg_wind.charAt(5);
		rachas = avg_wind.slice(6,8);
		result1 = wind_direction (direccion,largo, avg_wind);	//COMPROBAMOS LA DIRECCIÓN
	
			if (result1 == "nocalm") {
				result2 = wind_speed (velocidad, result1, avg_wind);	//COMPROBAMOS LA VELOCIDAD
		
				if (result2 == "nocalmok"){
				
					if (G == "G"){					//COMPROBAMOS LA G
						result4 = wind_speed (rachas, result1, avg_wind);		//COMPROBAMOS LAS RACHAS (NÚMEROS)
				
						if (result4 == "nocalmok"){
						
							if (parseInt (rachas) >= parseInt (velocidad) + 10){	//COMPRBAMOS LAS RACHAS (OACI)
								result3 = wind_units (unidades, result4, avg_wind);		//COMPROBAMOS LAS UNIDADES
							
								if (result3 === 0){
									return 0;
								}
							}
						
							else{
								salida_texto("<span style='color:red; font-weight:bold'>Las rachas deben ser de al menos 10 nudos más que la velocidad media en el término " + avg_wind + ".</span>");
								return 0;
							}
						}
					
						else {
							return 0;
						}
					}
				
					else {
						salida_texto("<span style='color:red; font-weight:bold'>Esta estructura de rachas del término " + avg_wind + " debe llevar la letra G.</span>");
						return 0;
					}
				}
			
				else{
					return 0;
				}				
			}
		
			else{
				return 0;
			}
		}
	
		else if (largo == 11){			//VIENTO
			direccion = avg_wind.slice(0,3);	//IDENTIFICAMOS CADA VARIABLE
			velocidad = avg_wind.slice(3,5);
			unidades = avg_wind.slice(9);		
			G = avg_wind.charAt(5);
			rachas = avg_wind.slice(7,9);
			P = avg_wind.charAt (6)
			result1 = wind_direction (direccion,largo, avg_wind);	//COMPROBAMOS LA DIRECCIÓN
	
			if (result1 == "nocalm") {
				result2 = wind_speed (velocidad, result1, avg_wind);	//COMPROBAMOS LA VELOCIDAD (NÚMEROS)
		
				if (result2 == "nocalmok"){
				
					if (G == "G"){							//COMPROBAMOS LA G
				
						if (P == "P"){						//COMPROBAMOS LA P
					
							if (velocidad == 99){			//COPROBAMOS LA VELOCIDAD
								result3 = wind_units (unidades, "calmok", avg_wind);					//COMPROBAMOS LAS UNIDADES
							
								if (result3 === 0){
									return 0;
								}
							}
						
							else{
								salida_texto("<span style='color:red; font-weight:bold'>La velocidad en esta estructura del término " + avg_wind + " debe ser P99.</span>");
								return 0;
							}
						}
					
						else {
							salida_texto("<span style='color:red; font-weight:bold'>Esta estructura del término " + avg_wind + " debe llevar la letra P para la velocidad mayor de 99 nudos.</span>");
							return 0;
						}
					}
					
					else {
						salida_texto("<span style='color:red; font-weight:bold'>Esta estructura de rachas del término " + avg_wind + " debe llevar la letra G.</span>");
						return 0;
					}
				}
			
				else {
					return 0;
				}
			}
		
			else {
				return 0;
			}	
		}
			return true;
	}
		
	else {	//ESTRUCTURAS DE VIENTO NO VÁLIDAS
		return false;
	}			
}

function wind_direction (direction, longitud, viento_completo) {	//CONDICIONES OACI DE DIRECCIÓN DE VIENTO
	
	if (isNaN (direction) == true){			//direccion no escrita con 3 cifras
	
		if (direction == "VRB"){				//DIRECCIÓN VARIABLE CORRECTA
			return "nocalm";
		}
		
		else {
			salida_texto( "<span style='color:red; font-weight:bold'>La dirección en el término " + viento_completo + " solo puede ser VRB o 3 cifras.</span>"); 
			return 0;
		}
	}
	
	else {
		
		if (direction > 360 ) {
			salida_texto("<span style='color:red; font-weight:bold'>La dirección en el término " + viento_completo + " no puede ser mayor de 360 grados.</span>"); 
			return 0;
		}
		
		else if (direction == 0) {
			
			if (longitud != 7) {
				salida_texto("<span style='color:red; font-weight:bold'>La dirección 000 del término " + viento_completo + " solo es válida para viento en calma en la forma: 00000KT.</span>");
				return 0;
			}
			
			else {
				return "calm";		//DIRECCIÓN DE VIENTO EN CALMA CORRECTA
			}
		}
		
		else {
			
			if (direction.charAt(2) != 0){
				salida_texto( "<span style='color:red; font-weight:bold'>La dirección en el término " + viento_completo + " debe ir de 10 en 10 grados.</span>");
				return 0;
			}
			
			else {
				return "nocalm";	//DIRECCIÓN NO VARIABLE Y NO CALMA CORRECTA
			}
		}
	}
}
		
function wind_speed (speed, resultado1, termino_viento){			//CONDICIONES OACI DE VELOCIDAD DE VIENTO
	
	if (resultado1 == "calm"){		//DIRECCIÓN CALMA CORRECTA
	
		if (speed == 0){
			return "calmok";	//VELOCIDAD CALMA CORRECTA
		}
		
		else {
			salida_texto("<span style='color:red; font-weight:bold'>El término de viento "+ termino_viento + " con la dirección calma debe tener una velocidad de 00 nudos.</span>");
			return 0;
		}
	}
	
	else if (resultado1 == "nocalm") {		//DIRECCIÓN NO CALMA CORRECTA
	
		if (isNaN (speed) == true){
			salida_texto("<span style='color:red; font-weight:bold'>La velocidad del término " + termino_viento + " debe estar expresada con 2 cifras.</span>");
			return 0;
		}
		
		else {
						
			if (speed == 0){
				salida_texto("<span style='color:red; font-weight:bold'>La velocidad del término " + termino_viento + " solo puede ser 00 con la dirección calma.</span>");
				return 0;
			}
			
			else {
				return "nocalmok";	//VELOCIDAD NO CALMA CORRECTA
			}
		}
	}	
}
		
function wind_units (units, resultado2, wind_complete) {			//COMPROBACION DE UNIDADES (KT)
	
	if (resultado2 == "calmok" || resultado2 == "nocalmok"){
	
		if (units == "KT"){
			salida_texto ("El término " + wind_complete + " es un término de viento y es correcto.");
		}
				
		else {
			salida_texto("<span style='color:red; font-weight:bold'>Las unidades mal escritas en el término " + wind_complete + ", deberían ser KT.</span>");
			return 0;
		}				
	}
}	

function wind_var (viento_variable, viento1){						//CONDICIONES OACI DE VIENTO VARIABLE
	viento_variable_reg_exp = /^(\d{3})(V)(\d{3})(=)?$/;	//VARIABLE TIPO PARA COMPARAR
		
	if (viento_variable_reg_exp.test(viento_variable) == true){
		viento_variable_end = 0;
		
		if (viento_variable.charAt(viento_variable.length-1) == "="){
			viento_variable_end = 1;
			viento_variable = viento_variable.substr(0,viento_variable.length-1);
		}
		
		if (viento1 == "NOWIND"){
			salida_texto("<span style='color:red; font-weight:bold'>No es posible el análisis de las condiciones del viento variable al no haber un término de viento correcto.</span>");
			return 0;
		}
	
		if (viento1.slice(0,3) == "VRB"){	//COMPROBAMOS PARA CUMPLIR CON OACI (IMPOSIBLE VRB + VARIACIONES)
			salida_texto("<span style='color:red; font-weight:bold'>El término de variaci\u00F3n de direcci\u00F3n del viento " + viento_variable + " no puede aparecer con un viento VRB.</span>");
			return 0;
		}	
		
		else if (viento1.charAt(3) != "P" && parseInt(viento1.slice(3,5)) < 3){
			salida_texto("<span style='color:red; font-weight:bold'>El término de variaci\u00F3n de direcci\u00F3n del viento " + viento_variable + " no puede aparecer con un viento menor de 3 nudos.</span>");
			return 0;
		}								//COMPROBAMOS PARA CUMPLIR CON OACI (IMPOSIBLE MENOS DE 3 NUDOS + VARIACIONES)
				
		else {
			
			if (viento_variable.charAt(2) != 0 || viento_variable.charAt(6) != 0){	//DIRECCIONES ACABADAS EN 0
				salida_texto("<span style='color:red; font-weight:bold'>Las direcciones del viento en " + viento_variable + " deben ir de 10 en 10 grados.</span>");
				return 0;
			}	
			
			else{
				
				if (parseInt(viento_variable.slice(0,3)) == 0 || parseInt(viento_variable.slice(4)) == 0){	//DIRECCIONES ENTRE 010 Y 360 GRADOS
					salida_texto("<span style='color:red; font-weight:bold'>Las direcciones del viento en " + viento_variable + " deben ser mayores de 0 grados.</span>");
					return 0;
				}
					
				else if (parseInt(viento_variable.slice(0,3)) >360 || parseInt(viento_variable.slice(4)) >360){
					salida_texto("<span style='color:red; font-weight:bold'>Las direcciones del viento en " + viento_variable + " deben ser menores de 360 grados.</span>");
					return 0;
				}
				
				else {
					
					if (parseInt(viento_variable.slice(0,3)) < parseInt(viento_variable.slice(4))){
						
						if (Math.abs( parseInt (viento_variable.slice(0,3)) - parseInt (viento_variable.slice(4))) < 60 ){		//DIFERENCIA DE DIRECCIONES ENTRE 60 Y 180 GRADOS
							salida_texto("<span style='color:red; font-weight:bold'>La variaci\u00F3n de la direcci\u00F3n del viento en " + viento_variable + " debe ser al menos de 60 grados.</span>");
							return 0;
						}
			
						else if (Math.abs(parseInt (viento_variable.slice(0,3)) - parseInt (viento_variable.slice(4))) >180 ){
							salida_texto("<span style='color:red; font-weight:bold'>La variaci\u00F3n de la direcci\u00F3n del viento en " + viento_variable + " debe ser como mucho de 180 grados.</span>");
							return 0;
						}

						else{
							salida_texto( "La variaci\u00F3n de la direcci\u00F3n del viento en " + viento_variable + " es correcta");
							
							if (viento_variable_end === 1){
								return "end";
							}
							
							else{
								return true;
							}
						}
					}
					
					else{
						
						if ((360 - parseInt (viento_variable.slice(0,3))) + parseInt (viento_variable.slice(4)) < 60 ){		//DIFERENCIA DE DIRECCIONES ENTRE 60 Y 180 GRADOS
							salida_texto("<span style='color:red; font-weight:bold'>La variaci\u00F3n de la direcci\u00F3n del viento en " + viento_variable + " debe ser al menos de 60 grados.</span>");
							return 0;
						}
			
						else if ((360 - parseInt (viento_variable.slice(0,3))) + parseInt (viento_variable.slice(4)) >180 ){
							salida_texto("<span style='color:red; font-weight:bold'>La variaci\u00F3n de la direcci\u00F3n del viento en " + viento_variable + " debe ser como mucho de 180 grados.</span>");
							return 0;
						}

						else{
							salida_texto("La variaci\u00F3n de la direcci\u00F3n del viento en " + viento_variable + " es correcta.");
							
							if (viento_variable_end === 1){
								return "end";
							}
							
							else{
								return true;
							}
						}
					}
				}
			}	
		}	
	}
	
	else {
		return false;		//VARIABLE PARA COMPROBAR SI EL TÉRMINO QUE HA ENTRADO A COMPARARSE ERA DE TEMPERATURA O NO
	}
}	

function average_visibility (vis_codigo){		//CONDICIONES OACI DE VISIBILIDAD MEDIA
	avg_visibility = /^(\d{4})(=)?$/;
	
	if (avg_visibility.test(vis_codigo) == true){
		
		if (vis_codigo.charAt(vis_codigo.length-1) == "="){
			vis_codigo = vis_codigo.substr(0,vis_codigo.length-1);
		}
		
		comp_vis = precision (vis_codigo);
		
		if (comp_vis === 0){
			return 0;
		}
		
		else if (comp_vis == true){
			salida_texto("El término de visibilidad " + vis_codigo + " es correcto.");
			return true;	
		}	
	}
	
	else{
		return false;
	}
}

function min_visibility (min_vis_codigo, visib_media){	//CONDICIONES OACI DE VISIBILIDAD MÍNIMA
	visibilidad_minima = /^(\d{4})(\D{2}|\D{1})?(=)?$/;
	
	if (min_vis_codigo.charAt(min_vis_codigo.length-1) == "="){
		min_vis_codigo = min_vis_codigo.substr(0,min_vis_codigo.length-1);
	}
	
	if (visibilidad_minima.test(min_vis_codigo) == true && min_vis_codigo.length == 4){
		visib = parseInt(visib_media);
		valor_vis_min = parseInt(min_vis_codigo);
		comp_vis_min = precision (min_vis_codigo);		//COMPROBAMOS LA PRECISIÓN DE LA MAGNITUD
	
		if (comp_vis_min === 0){
			return 0;
		}

		else if (comp_vis_min == true){
				
			if (valor_vis_min == visib){			//COMPROBAMOS CONDICIONES OACI: PRIMERO QUE SEAN DISTINTAS MIN Y MEDIA
				salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe ser distinto del término de visibilidad.</span>");
				return 0;
			}	
				
			else{
				
				if (valor_vis_min < 1500){	//SEGUNDO QUE PUEDA SER MENOR DE 1500 METROS
					salida_texto("El término de visibilidad mínima " + min_vis_codigo + " es correcto.");
					return true;		
				}			
								//OTRA OPCIÓN ES ENTRE 1500 Y 5000 METROS PERO MENOR QUE EL 50% DE LA VISIBILIDAD MEDIA
				else if (valor_vis_min >= 1500 && valor_vis_min < 5000 && valor_vis_min < 0.5 * visib){
					salida_texto("El término de visibilidad mínima " + min_vis_codigo + " es correcto.");
					return true;		//COMPROBAMOS TAMBIÉN LAS DIRECCIONES
				}
					
				else {
					salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe ser menor que 1500 m, o menor que 5000 metros y que el 50% de la visibilidad.</span>");
					return 0;
				}
			}
		}
	}
	
	if (visibilidad_minima.test(min_vis_codigo) == true && min_vis_codigo.length == 5){	//DIRECCIÓN N, S, E, W
	
		if (visib_media == "NOVIS"){
			salida_texto("<span style='color:red; font-weight:bold'>Es imposible hacer la comprobación de los requisitos de visibilidad mínima debido a que el término de visibilidad no existe o está mal escrito. Aún así se procederá con su análisis considerando una visibilidad de +10km.</span>");
			visib_media = "9999";
		}
		
	visib = parseInt(visib_media);
	valor_vis_min = parseInt(min_vis_codigo.slice(0,4));
	comp_vis_min = precision (min_vis_codigo.slice(0,4));		//COMPROBAMOS LA PRECISIÓN DE LA MAGNITUD
	
		if (comp_vis_min === 0){
			return 0;
		}

		else if (comp_vis_min == true){
				
			if (valor_vis_min == visib){			//COMPROBAMOS CONDICIONES OACI: PRIMERO QUE SEAN DISTINTAS MIN Y MEDIA
				salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe ser distinto del término de visibilidad.</span>");
				return 0;
			}	
				
			else{
				
				if (valor_vis_min < 1500){	//SEGUNDO QUE PUEDA SER MENOR DE 1500 METROS
				
					if (min_vis_codigo.charAt(4) == "N" || min_vis_codigo.charAt(4) == "S" || min_vis_codigo.charAt(4) == "E" || min_vis_codigo.charAt(4) == "W"){
						salida_texto("El término de visibilidad mínima " + min_vis_codigo + " es correcto.");
						return true;		
					}			
										//COMPROBAMOS TAMBIÉN QUE LA DIRECCIÓN ESTÉ BIEN EXPRESADA
					else{
						salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe acabar en alguna de las direcciones N, S, E, W, NE, NW, SE, SW.</span>");
						return 0;
					}	
				}
								//OTRA OPCIÓN ES ENTRE 1500 Y 5000 METROS PERO MENOR QUE EL 50% DE LA VISIBILIDAD MEDIA
				else if (valor_vis_min >= 1500 && valor_vis_min < 5000 && valor_vis_min < 0.5 * visib){
						
					if (min_vis_codigo.charAt(4) == "N" || min_vis_codigo.charAt(4) == "S" || min_vis_codigo.charAt(4) == "E" || min_vis_codigo.charAt(4) == "W"){
						salida_texto("El término de visibilidad mínima " + min_vis_codigo + " es correcto.");
						return true;		//COMPROBAMOS TAMBIÉN LAS DIRECCIONES
					}			
			
					else{
						salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe acabar en alguna de las direcciones N, S, E, W, NE, NW, SE, SW.</span>");
						return 0;
					}
				}
					
				else {
					salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe ser menor que 1500 m, o menor que 5000 metros y que el 50% de la visibilidad.</span>");
					return 0;
				}
			}
		}
	}

	else if (visibilidad_minima.test(min_vis_codigo) == true && min_vis_codigo.length == 6){	//DIRECCIÓN NW, SW, NE, SE
		visib = parseInt(visib_media);
		valor_vis_min = parseInt(min_vis_codigo.slice(0,4));
		comp_vis_min = precision (min_vis_codigo.slice(0,4));		//COMPROBAMOS LA PRECISIÓN DE LA MAGNITUD

		if (comp_vis_min == true){
			
			if (valor_vis_min == visib){			//COMPROBAMOS CONDICIONES OACI: PRIMERO QUE SEAN DISTINTAS MIN Y MEDIA
				salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe ser distinto del término de visibilidad.</span>");
				return 0;
			}	
				
			else{
					
				if (valor_vis_min < 1500){	//SEGUNDO QUE PUEDA SER MENOR DE 1500 METROS
				
					if (min_vis_codigo.slice(4).toString() == "NE" || min_vis_codigo.slice(4).toString() == "NW" || min_vis_codigo.slice(4).toString() == "SE" || min_vis_codigo.slice(4).toString() == "SW"){
						salida_texto("El término de visibilidad mínima " + min_vis_codigo + " es correcto.");
						return true;		
					}			
										//COMPROBAMOS TAMBIÉN QUE LA DIRECCIÓN ESTÉ BIEN EXPRESADA
					else{
						salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe acabar en alguna de las direcciones N, S, E, W, NE, NW, SE, SW.</span>");
						return 0;
					}	
				}
								//OTRA OPCIÓN ES ENTRE 1500 Y 5000 METROS PERO MENOR QUE EL 50% DE LA VISIBILIDAD MEDIA
				else if (valor_vis_min >= 1500 && valor_vis_min < 5000 && valor_vis_min < 0.5 * visib){
						
					if (min_vis_codigo.slice(4).toString() == "NE" || min_vis_codigo.slice(4).toString() == "NW" || min_vis_codigo.slice(4).toString() == "SE" || min_vis_codigo.slice(4).toString() == "SW"){
						salida_texto("El término de visibilidad mínima " + min_vis_codigo + " es correcto.");
						return true;		//COMPROBAMOS TAMBIÉN LAS DIRECCIONES
					}			
			
					else{
						salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe acabar en alguna de las direcciones N, S, E, W, NE, NW, SE, SW.</span>");
						return 0;
					}
				}
					
				else {
					salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + " debe ser menor que 1500 m, o menor que 5000 metros y que el 50% de la visibilidad.</span>");
					return 0;
				}
			}
		}
	}	

	else {
		return false;		//VARIABLE PARA COMPROBAR SI EL TÉRMINO QUE HA ENTRADO A COMPARARSE ERA DE TEMPERATURA O NO
	}	
}	

function precision (dato_visibilidad){			//COMPRUEBA PRECISIÓN DE OACI EN FUNCIÓN DEL DATO DE VISIBILIDAD
	numero_vis = parseInt(dato_visibilidad);

	if (numero_vis >= 0 && numero_vis < 800){
		
			if (parseInt(dato_visibilidad.slice(2,4)) != 50 && parseInt(dato_visibilidad.slice(2,4)) != 0){
				salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad " + dato_visibilidad + " al ser menor de 800 debe ir de 50 en 50.</span>");
				return 0;
			}
			
			else {
				return true;
			}
		}
		
		else if (numero_vis >= 800 && numero_vis < 5000){
			
			if (dato_visibilidad.charAt(2) != 0 || dato_visibilidad.charAt(3) != 0){
				salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad " + dato_visibilidad + " al ser mayor de 800 y menor de 5000 debe ir de 100 en 100.</span>");
				return 0;
			}	
			
			else {				
				return true;
			}
		}
		
		else if (numero_vis >= 5000 && numero_vis < 9999){
			
			if (dato_visibilidad.charAt(2) != 0 || dato_visibilidad.charAt(3) != 0 || dato_visibilidad.charAt(1) != 0){
				salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad " + dato_visibilidad + " al ser mayor de 5000 y menor de 10000 debe ir de 1000 en 1000.</span>");
				return 0;
			}
			
			else {
				return true;
			}			
		}
			
		else {
			return true;
		}
}		

function rwy_visual_range(rvr_codigo, rvr_codigo_previo, rvr_n){	//COMPRUEBA QUE NO SE REPITAN TÉRMINOS Y SUS CONDICIONES OACI
	rvr_reg_exp = /^(R)(\d{2})(R|L|C)?(\/)(P|M)?(\d{4})(N|D|U)?(=)?$/;	//VARIABLE DE RVR

	if (rvr_codigo.charAt(rvr_codigo.length-1) == "="){
		rvr_codigo = rvr_codigo.substr(0, rvr_codigo.length-1);
	}
	
	if (rvr_reg_exp.test(rvr_codigo) == true){

		for (rvr_bucle = 0; rvr_bucle < rvr_codigo_previo.length ; rvr_bucle++){
			
			rvr_previo_analizado = rvr_codigo_previo[rvr_bucle].toString();
			rvr_dividido = rvr_codigo.split("/");										//DIVIDIMOS POR LA / EL CÓDIGO A ANALIZAR
			rvr_previo_dividido = rvr_previo_analizado.split("/");				//DIVIDIMOS POR LA BARRA EL CÓDIGO ANTERIOR
			
			rvr_0 = rvr_dividido[0].toString();										//DECLARAMOS VARIABLES
			rvr_previo_0 = rvr_previo_dividido[0].toString();
			
			rvr_1 = rvr_dividido[1].toString();
			longitud_rvr = rvr_1.length;
	
			if (rvr_n == 4){													//MÁXIMO DE 4 TÉRMINOS DE RVR
				salida_texto("<span style='color:red; font-weight:bold'>Ya hay 4 términos de RVR, lo cual es el máximo. El término " + rvr_codigo + " no puede ser de RVR.</span>");
				return 0;
			}
		
			else if (rvr_n < 4 && rvr_0 != rvr_previo_0){					//QUE NO SEAN RVR DE LA MISMA PISTA, NO SE PUEDEN REPETIR		 		
				rvr_comp = pistas(rvr_0.slice(1,3));							//VERIFICAMOS QUE LO REFERENTE A LA PISTA SEA CORRECTO
			
				if (rvr_comp === 0){
					return 0;
				}	
			
				else if (rvr_comp == true){
			
					if (rvr_1.charAt(0) == "P"){						//RVR MAYOR DE 2000 METROS
				
						if (parseInt(rvr_1.slice(1,5)) != 2000){
							salida_texto("<span style='color:red; font-weight:bold'>El RVR en " + rvr_codigo + " ser de 2000 si comienza por la letra P.</span>");
							return 0;
						}
					}
			
					else if (rvr_1.charAt(0) == "M"){					//RVR MENOR DE 0050 METROS
				
						if (parseInt(rvr_1.slice(1,5)) != 50){
							salida_texto("<span style='color:red; font-weight:bold'>El RVR en " + rvr_codigo + " ser de 0050 si comienza por la letra M.</span>");
							return 0;
						}
					}
			
					else{												//RVR ENTRE 50 Y 2000 METROS
						rvr_comp_2 =rvr_precision(rvr_1.slice(0,4));				//COMPROBAMOS LA PRECISIÓN DE LAS MEDIDAS
						rvr_posicion_analizar = longitud_rvr - 1;
					
						if (rvr_comp_2 === 0){		//SI HAY ERRORES SALIMOS
							return 0;
						}
					
						else if (rvr_comp_2 == true){
						
							if (isNaN(rvr_1.charAt(rvr_posicion_analizar)) == true){		//RVR ACABADO EN UNA CIERTA TENDENCIA (SOLO U, N, D)
							
								if (rvr_1.charAt(rvr_posicion_analizar) != "U" && rvr_1.charAt(rvr_posicion_analizar) != "N" && rvr_1.charAt(rvr_posicion_analizar) != "D"){
									salida_texto("<span style='color:red; font-weight:bold'>El RVR en " + rvr_codigo + " solo puede acabar en N, D o U para indicar su tendencia.</span>");
									return 0;
								}
							}
						}
					}	
				}
			}
		
			else if (rvr_n < 4 && rvr_0 == rvr_previo_0){
				salida_texto("<span style='color:red; font-weight:bold'>No puede haber dos términos de RVR para la misma pista: " + rvr_codigo + " " + rvr_codigo_previo[rvr_bucle] + ".</span>");
				return 0;
			}	
		}
		
		salida_texto("El término de RVR " + rvr_codigo + " es correcto.");
		return true;
	}	
		

	else{
		return false;
	}		

}

function pistas(numero_pista){		//FUNCIÓN PARA COMPROBAR QUE LA PISTA ESTÁ ENTRE 01 Y 36

	if (parseInt(numero_pista) == 0 || parseInt(numero_pista) > 36){
		salida_texto("<span style='color:red; font-weight:bold'>El número de pista en " + numero_pista + " debe estar entre 01 y 36.</span>");
		return 0;
	}	
	
	else {
		return true;
	}
}

function rvr_precision (rvr_dato){		//FUNCIÓN PARA COMPROBAR LA PRECISIÓN DE LAS MEDIDAS Y QUE SE ENCUENTRE ENTRE EL MÁXIMO Y MÍNIMO

	if (parseInt(rvr_dato) >= 50 && parseInt(rvr_dato) < 400){
		
		if (parseInt(rvr_dato.slice(2,4)) != 0 && parseInt(rvr_dato.slice(2,4)) != 25 && parseInt(rvr_dato.slice(2,4)) != 50 && parseInt(rvr_dato.slice(2,4)) != 75){
			salida_texto("<span style='color:red; font-weight:bold'>El RVR en " + rvr_dato + " está entre 0 y 400 y debe ir de 25 en 25 metros.</span>");
			return 0;
		}	
		
		else {
			return true;
		}	
	}

	else if (parseInt(rvr_dato) >= 400 && parseInt(rvr_dato) < 800){
		
		if (parseInt(rvr_dato.slice(2,4)) != 0 && parseInt(rvr_dato.slice(2,4)) != 50){
			salida_texto("<span style='color:red; font-weight:bold'>El RVR en " + rvr_dato + " está entre 400 y 800 y debe ir de 50 en 50 metros.</span>");
			return 0;
		}	
		
		else {
			return true;
		}
	}
	
	else if (parseInt(rvr_dato) >= 800 && parseInt(rvr_dato) <= 2000){
		
		if (parseInt(rvr_dato.slice(2,4)) != 0){
			salida_texto("<span style='color:red; font-weight:bold'>El RVR en " + rvr_dato + " está entre 800 y 2000 y debe ir de 100 en 100 metros.</span>");
			return 0;
		}	
		
		else {
			return true;
		}
	}

	else if (parseInt(rvr_dato)>2000){
		salida_texto("<span style='color:red; font-weight:bold'>El RVR en " + rvr_dato + " debe estar entre 50 y 2000.</span>");
		return 0;
	}	
	
	else if (parseInt(rvr_dato) < 50){
		salida_texto("<span style='color:red; font-weight:bold'>El RVR en " + rvr_dato + " debe estar entre 50 y 2000.</span>");
		return 0;
	}
}	
	
function weather (tiempo_significativo_0, tiempo_significativo_array, visibilidad_dato_previo, n_tiempo_significativo){	//CONDICIONES OACI DE TIEMPO SIGNIFICATIVO
	tiempo_reg_exp_1 = /^(\+|\-|)(DZ|RA|SN|SG|PL|DS|SS|FZDZ|FZRA|FC|SHGR|SHGS|SHRA|SHSN|TSGR|TSGS|TSRA|TSSN|TSGRRA|TSRASN|DZRA|DZSN|DZSG|DZPL|DZGR|DZGS|DZUP|RADZ|RASN|RASG|RAPL|RAGR|RAGS|RAUP|SNDZ|SNRA|SNSG|SNPL|SNGR|SNGS|SNUP|SGDZ|SGRA|SGSN|SGPL|SGGR|SGGS|SGUP|PLDZ|PLRA|PLSN|PLSG|PLGR|PLGS|PLUP)(=)?$/
	tiempo_reg_exp_2 = /^(DZ|RA|SN|SG|PL|DS|SS|FZDZ|FZRA|FC|SHGR|SHGS|SHRA|SHSN|SHVC|TSGR|TSGS|TSRA|TSSN|TSGRRA|TSRASN|DZRA|DZSN|DZSG|DZPL|DZGR|DZGS|DZUP|RADZ|RASN|RASG|RAPL|RAGR|RAGS|RAUP|SNDZ|SNRA|SNSG|SNPL|SNGR|SNGS|SNUP|SGDZ|SGRA|SGSN|SGPL|SGGR|SGGS|SGUP|PLDZ|PLRA|PLSN|PLSG|PLGR|PLGS|PLUP|FG|BR|SA|DU|HZ|FU|VA|SQ|PO|TS|BCFG|BLDU|BLSA|BLSN|DRDU|DRSA|DRSN|FZFG|MIFG|PRFG|VCFG|VCPO|VCFC|VCDS|VCSS|VCTS|VCSH|VCVA|VCBLSN|VCBLSA|VCBLDU)(=)?$/

	if(tiempo_significativo_0.charAt(tiempo_significativo_0.length-1) == "="){
		tiempo_significativo_0 = tiempo_significativo_0.substr(0, tiempo_significativo_0.length-1);
	}
	
	if (tiempo_reg_exp_1.test(tiempo_significativo_0) == true || tiempo_reg_exp_2.test(tiempo_significativo_0) == true){
		
		for (t_sig_bucle = 0; t_sig_bucle < tiempo_significativo_array.length; t_sig_bucle++){
			tiempo_significativo_1 = tiempo_significativo_array[t_sig_bucle].toString();
		
			if (n_tiempo_significativo <= 3){
			
				if (tiempo_significativo_0 == tiempo_significativo_1){
					salida_texto("<span style='color:red; font-weight:bold'>El término "+ tiempo_significativo_0 + " es de tiempo significativo y no puede haber dos indicativos de tiempo significativo iguales.</span>");
					return 0;
				}

				else {
				
					if (precip(tiempo_significativo_0) == false){
					
						if (tiempo_significativo_0 == "FG" && parseInt(visibilidad_dato_previo) >= 1000){
							salida_texto("<span style='color:red; font-weight:bold'>Si el tiempo significativo es indicado con el calificador " + tiempo_significativo_0 + " la visibilidad en " + visibilidad_dato_previo + " debe ser menor de 1000 metros.</span>");
							return 0;
						}	
			
						else if (tiempo_significativo_0 == "BR" && parseInt(visibilidad_dato_previo) > 5000){
							salida_texto("<span style='color:red; font-weight:bold'>Si el tiempo significativo es indicado con el calificador " + tiempo_significativo_0 + " la visibilidad en " + visibilidad_dato_previo + " debe ser menor de 5000 metros y al menos 1000 metros.</span>");
							return 0;
						}
				
						else if (tiempo_significativo_0 == "BR" && parseInt(visibilidad_dato_previo) < 1000){
							salida_texto("<span style='color:red; font-weight:bold'>Si el tiempo significativo es indicado con el calificador " + tiempo_significativo_0 + " la visibilidad en " + visibilidad_dato_previo + " debe ser menor de 5000 metros y al menos 1000 metros.</span>");
							return 0;
						}
						
						else if (tiempo_significativo_0 == "BCFG" && parseInt(visibilidad_dato_previo) < 1000){
							salida_texto("<span style='color:red; font-weight:bold'>Si el tiempo significativo es indicado con el calificador " + tiempo_significativo_0 + " la visibilidad predominante en " + visibilidad_dato_previo + " debe ser mayor 1000 metros.</span>");
							return 0;
						}
						
						else if (tiempo_significativo_0 == "MIFG" && parseInt(visibilidad_dato_previo) < 1000){
							salida_texto("<span style='color:red; font-weight:bold'>Si el tiempo significativo es indicado con el calificador " + tiempo_significativo_0 + " la visibilidad predominante en " + visibilidad_dato_previo + " debe ser mayor de 1000 metros.</span>");
							return 0;
						}
						
						else if (tiempo_significativo_0 == "PRFG" && parseInt(visibilidad_dato_previo) < 1000){
							salida_texto("<span style='color:red; font-weight:bold'>Si el tiempo significativo es indicado con el calificador " + tiempo_significativo_0 + " la visibilidad predominante en " + visibilidad_dato_previo + " debe ser mayor de 1000 metros.</span>");
							return 0;
						}

						else if (tiempo_significativo_0 == "FU" || tiempo_significativo_0 == "HZ" || tiempo_significativo_0 == "DU" || tiempo_significativo_0 == "SA" || tiempo_significativo_0 == "BLDU" || tiempo_significativo_0 == "BLSA" || tiempo_significativo_0 == "DRDU" || tiempo_significativo_0 == "VCBLSA" || tiempo_significativo_0 == "VCBLDU"){
						
							if (parseInt(visibilidad_dato_previo) > 5000){
								salida_texto("<span style='color:red; font-weight:bold'>Si el tiempo significativo en " + tiempo_significativo_0 + " representa un oscurecimiento por partículas (salvo DRSA o VA) entonces la visibilidad en " + visibilidad_dato_previo + " debe ser no mayor de 5000 metros.</span>");
								return 0;
							}
						}
					}

					else if (precip(tiempo_significativo_0) == true){
					
						if (precip(tiempo_significativo_1) == true){
							salida_texto("<span style='color:red; font-weight:bold'>No puede haber dos términos de tiempo significativo que indiquen precipitaciones.</span>");
							return 0;
						}
					}
				}						
			}	
		
			else if (n_tiempo_significativo > 3){
				salida_texto("<span style='color:red; font-weight:bold'>No puede haber más de 3 términos de tiempo significativo por lo que el término " + tiempo_significativo_0 + " no debe ser de tiempo significativo.</span>");
				return 0;
			}
		}
						
		salida_texto("El término de tiempo significativo " + tiempo_significativo_0 + " es correcto.");
		return true;				
	}
	
	else{
		return false;
	}	
}

function precip (precipitacion_termino){		//IDENTIFICA TIEMPO SIGNIFICATIVO DE PRECIPITACIONES
	precipitacion_reg_exp_1 = /^(\+|\-|)(DZ|RA|SN|SG|PL|FZDZ|FZRA|SHGR|SHGS|SHRA|SHSN|TSGR|TSGS|TSRA|TSSN|TSGRRA|TSRASN|DZRA|DZSN|DZSG|DZPL|DZGR|DZGS|DZUP|RADZ|RASN|RASG|RAPL|RAGR|RAGS|RAUP|SNDZ|SNRA|SNSG|SNPL|SNGR|SNGS|SNUP|SGDZ|SGRA|SGSN|SGPL|SGGR|SGGS|SGUP|PLDZ|PLRA|PLSN|PLSG|PLGR|PLGS|PLUP)$/
	precipitacion_reg_exp_2 = /^(DZ|RA|SN|SG|PL|FZDZ|FZRA|SHGR|SHGS|SHRA|SHSN|SHVC|TSGR|TSGS|TSRA|TSSN|TSGRRA|TSRASN|DZRA|DZSN|DZSG|DZPL|DZGR|DZGS|DZUP|RADZ|RASN|RASG|RAPL|RAGR|RAGS|RAUP|SNDZ|SNRA|SNSG|SNPL|SNGR|SNGS|SNUP|SGDZ|SGRA|SGSN|SGPL|SGGR|SGGS|SGUP|PLDZ|PLRA|PLSN|PLSG|PLGR|PLGS|PLUP|)$/

	if (precipitacion_reg_exp_1.test(precipitacion_termino) == true || precipitacion_reg_exp_2.test(precipitacion_termino) == true){
		return true;
	}	
	
	else{
		return false;
	}
}	

function cloud (nube_termino_0, nube_termino_array, nube_n, nube_conv_n){	//NUBES Y CONDICIONES OACI
	nube_reg_exp = /^(FEW|SCT|BKN|OVC)(\d{3})(CB|TCU)?(=)?$/;

	if(nube_termino_0.charAt(nube_termino_0.length-1) == "="){
		nube_termino_0 = nube_termino_0.substr(0,nube_termino_0.length-1);
	}
	
	if (nube_reg_exp.test(nube_termino_0) == true){
		
		if (nube_n == 0){
			nube_comp = altura_nub (nube_termino_0);
			
			if (nube_comp === 0){
				return 0;
			}
			
			else if (nube_comp == true){
				
				if (nube_termino_0.length > 6){
					salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
					return 1;
				}
				
				else{
					salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
					return true;
				}
			}
		}
		
		
		else if (nube_n == 1){
			nube_comp = altura_nub (nube_termino_0);
			nube_termino_1 = nube_termino_array[0];
			
			if (nube_comp === 0){
				return 0;
			}
			
			else if (nube_comp == true){
				
				if (nube_termino_0.slice(0,3) == "FEW"){
					
					if (nube_termino_0.length < 7){
						salida_texto("<span style='color:red; font-weight:bold'>El término de nubes " + nube_termino_0 + " no puede ser FEW al ser el segundo término salvo que sea un término de nubes convectivas.</span>");
						return 0;
					}
					
					else {
						
						if (nube_conv_n === 0){
							
							if (parseInt(nube_termino_0.slice(3,6)) < parseInt(nube_termino_1.slice(3,6))){
								salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
								return 0;
							}
							
							else{
								salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
								return 1;
							}
						}
						
						else{
							salida_texto("<span style='color:red; font-weight:bold'>El término de nubes  " + nube_termino_0 + " es convectivo, pero no puede haber más de 1 término de nubes convectivas.</span>");
							return 0;
						}
					}
				}
				
				else{
					
					if (nube_termino_0.length > 6){
						
						if (nube_conv_n === 0){
							
							if (parseInt(nube_termino_0.slice(3,6)) < parseInt(nube_termino_1.slice(3,6))){
								salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
								return 0;
							}
								
							else{
								salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
								return 1;
							}
						}
						
						else{
							salida_texto("<span style='color:red; font-weight:bold'>El término de nubes  " + nube_termino_0 + " es convectivo, pero no puede haber más de 1 término de nubes convectivas.</span>");
							return 0;
						}
					}
					
					else{
						
						if (parseInt(nube_termino_0.slice(3,6)) < parseInt(nube_termino_1.slice(3,6))){
							salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
							return 0;
						}
								
						else{
							salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
							return true;
						}
					}
				}
			}
		}
		
		else if (nube_n == 2){
			nube_comp = altura_nub (nube_termino_0);
			nube_termino_1 = nube_termino_array[1];
			
			if (nube_comp === 0){
				return 0;
			}
			
			else if (nube_comp == true){
				
				if (nube_termino_0.slice(0,3) == "FEW" || nube_termino_0.slice(0,3) == "SCT"){
					
					if (nube_termino_0.length < 7){
						salida_texto("<span style='color:red; font-weight:bold'>El término de nubes " + nube_termino_0 + " no puede ser FEW ni SCT al ser el tercer término salvo que sea un término de nubes convectivas.</span>");
						return 0;
					}
					
					else {
						
						if (nube_conv_n === 0){
							
							if (parseInt(nube_termino_0.slice(3,6)) < parseInt(nube_termino_1.slice(3,6))){
								salida_texto("L<span style='color:red; font-weight:bold'>a altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
								return 0;
							}
							
							else{
								salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
								return 1;
							}
						}
						
						else{
							salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
							return 0;
						}						
					}
				}
				
				else{
					
					if (nube_termino_0.length > 6 ){
						
						if (nube_conv_n === 0){
							
							if (parseInt(nube_termino_0.slice(3,6)) < parseInt(nube_termino_1.slice(3,6))){
								salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
								return 0;
							}
								
							else{
								salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
								return 1;
							}
						}
						
						else{
							salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
							return 0;
						}
					}

					else{
						
						if (parseInt(nube_termino_0.slice(3,6)) < parseInt(nube_termino_1.slice(3,6))){
							salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
							return 0;
						}
								
						else{
							salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
							return true;
						}						
					}
				}
			}
		}
		
		
		else if (nube_n == 3){
			nube_termino_1 = nube_termino_array[2];
			
			if (nube_conv_n === 0){
				
				nube_comp = altura_nub (nube_termino_0);
				
				if (nube_comp === 0){
					return 0;
				}
				
				else if (nube_comp == true){
					
					if (nube_termino_0.length < 7){
						salida_texto("<span style='color:red; font-weight:bold'>El término de nubes " + nube_termino_0 + " solo puede ser de nubes convectivas al haber ya 3 términos de nubes no convectivas.</span>");
						return 0;
					}
						
					else {
						
						if (parseInt(nube_termino_0.slice(3,6)) < parseInt(nube_termino_1.slice(3,6))){
							salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término  " + nube_termino_0 + " no puede ser menor que la del término anterior.</span>");
							return 0;
						}
							
						else{
							salida_texto("El término de nubes " + nube_termino_0 + " es correcto.");
							return 1;
						}
					}
				}
			}
			
			else{
				salida_texto("<span style='color:red; font-weight:bold'>El término de nubes  " + nube_termino_0 + " no puede aparecer al haber ya 3 términos de nubes y 1 adicional.</span>");
				return 0;
			}		
		}
		
		else if (nube_n > 3){
			salida_texto("<span style='color:red; font-weight:bold'>Ya hay 4 términos de nubes, por lo que el término " + nube_termino_0 + " no puede ser de nubes.</span>");
			return 0;
		}
	}
	
	else{
		return false;
	}	
}	

function altura_nub (altura_nube_dato){				//ALTURA DE NUBES Y SUS CONDICIONES DE PRECISIÓN
	
	if (parseInt(altura_nube_dato.slice(3,6)) > 100){
		salida_texto("<span style='color:red; font-weight:bold'>La altura de las nubes en el término " + altura_nube_dato + " no puede ser mayor de 100</span>");
		return 0;
	}
	
	else {
		return true;
	}
}

function vertical (vis_vertical_dato){				//VISIBILIDAD VERTICAL
	vis_vertical_reg_exp = /^(VV)(\d{3})$/;
	
	if(vis_vertical_dato.charAt(vis_vertical_dato.length-1) == "="){
		vis_vertical_dato = vis_vertical_dato.substr(0, vis_vertical_dato.length-1);
	}
	
	if (vis_vertical_reg_exp.test(vis_vertical_dato) == true){
		vis_vertical_altura = parseInt(vis_vertical_dato.slice(2,5));
		
		if (vis_vertical_altura > 20){
			salida_texto("<span style='color:red; font-weight:bold'>La altura indicada por la visibilidad vertical en " + vis_vertical_dato + " no puede ser mayor de 20 centenares de pies.</span>");
			return 0;
		}
		
		else{
			salida_texto("El término de visibilidad vertical " + vis_vertical_dato + " es correcto.");
			return true;
		}
	}
	
	else{
		return false;
	}
	
}
	
function temperature(temperatura_dato){		//CONDICIONES OACI DE TEMPERATURA AMBIENTE Y DE ROCÍO
	temperatura_reg_exp = /^(\w{2}|\w{3})\/(\w{2}|\w{3})(=)?$/;	//DECLARAMOS UNA VARIABLE TIPO PARA COMPARAR
	temperatura_reg_exp_2 = /^(\/)(\/)(\/)(\/)(\/)(=)?$/;
	
	if(temperatura_dato.charAt(temperatura_dato.length-1) == "="){
		temperatura_dato = temperatura_dato.substr(0, temperatura_dato.length-1);
	}
	
	if (temperatura_reg_exp_2.test(temperatura_dato) == true){
		salida_texto("El término de temperatura " + temperatura_dato + " es correcto.");
		return true;
	}
	
	else if (temperatura_reg_exp.test(temperatura_dato) == true){		//ACTUAMOS SOLO SI SE CORRESPONDE CON LA VARIABLE TIPO	
		temperatura_dividida = temperatura_dato.split("/");		//SEPARAMOS EN DOS TÉRMINO POR LA BARRA CENTRAL NN/NN 
	
		for (t_bucle = 0; t_bucle < 2; t_bucle++){				//BUCLE PARA COMPROBAR LOS DOS TÉRMINOS
			temperatura_analizada = temperatura_dividida[t_bucle].toString();
			
			if (temperatura_analizada.length == 3){					//SI TIENE 3 CIFRAS DEBE SER UNA TEMPERATURA NEGATIVA
			
				if (temperatura_analizada.charAt(0) == "M"){
					
					if (isNaN(temperatura_analizada.slice(1,3)) == true){
						salida_texto("<span style='color:red; font-weight:bold'>La temperatura en " + temperatura_dato +  " debe estar expresada con 2 cifras</span>");
						return 0;		//SALIMOS PORQUE HA HABIDO UN ERROR
					}
					
					else{
						
						if (parseInt(temperatura_analizada.slice(1,3)) > 80){
							salida_texto("<span style='color:red; font-weight:bold'>La temperatura del término " + temperatura_dato + " no debe ser inferior a los -80ºC.</span>");
						}
					}
				}
				
				else {
					salida_texto("<span style='color:red; font-weight:bold'>La temperatura si es negativa debe comenzar por 'M' en " + temperatura_dato + ".</span>");
					return 0;		//SALIMOS PORQUE HA HABIDO UN ERROR
				}	
			}
				
			else {		//COMPROBAMOS SI TIENE 2 CIFRAS ES POSITIVA
			
				if (isNaN(temperatura_analizada) == true){
					salida_texto("<span style='color:red; font-weight:bold'>La temperatura en " + temperatura_dato +  " debe estar expresada con 2 cifras.</span>");
					return 0;	//SALIMOS PORQUE HA HABIDO UN ERROR
				}
					
				else{
					
					if (parseInt(temperatura_analizada) == 0){
						salida_texto("<span style='color:red; font-weight:bold'>La temperatura igual a 0 grados debe llevar la letra M delante.</span>");
						return 0;
					}
					
					else if (parseInt(temperatura_analizada) > 60){
						salida_texto("<span style='color:red; font-weight:bold'>La temperatura del término " + temperatura_dato + " no debe ser superior a los 60ºC.</span>");
					}	
				}
			}
		}
		salida_texto("El término de temperatura " + temperatura_dato + " es correcto.");
		return true;
	}
	
	else {
		return false;		//VARIABLE PARA COMPROBAR SI EL TÉRMINO QUE HA ENTRADO A COMPARARSE ERA DE TEMPERATURA O NO
	}	
}

function presion (qnh_dato){				//CONDICIONES OACI DEL QNH
	qnh_reg_exp = /^(Q)(\d{4})(=)?$/;
	qnh_reg_exp_2=/^(Q)(\/)(\/)(\/)(\/)(=)?$/;
	
	if (qnh_reg_exp_2.test(qnh_dato) == true ){
		
		if (qnh_dato.length == 5){
				salida_texto("El término de QNH en " + qnh_dato + " es correcto.");
				return true;
			}
			
			else if (qnh_dato.length == 6){
				qnh_dato = qnh_dato.substr(0, qnh_dato.length-1);
				salida_texto("El término de QNH en " + qnh_dato + " es correcto.");
				return "end";
			}
	}
	
	else if (qnh_reg_exp.test(qnh_dato) == true){
		qnh_presion = parseInt(qnh_dato.slice(1,5));
		
		if (qnh_presion < 850){
			salida_texto("<span style='color:red; font-weight:bold'>La presión del QNH " + qnh_dato + " debe ser de al menos 850 milibares.</span>");
			return 0;
		}
			
		else if (qnh_presion > 1100){
			salida_texto("<span style='color:red; font-weight:bold'>La presión del QNH " + qnh_dato + " debe ser como mucho de 1100 milibares.</span>");
			return 0;
		}
			
		else{
			
			if (qnh_dato.length == 5){
				salida_texto("El término de QNH en " + qnh_dato + " es correcto.");
				return true;
			}
			
			else if (qnh_dato.length == 6){
				qnh_dato = qnh_dato.substr(0, qnh_dato.length-1);
				salida_texto("El término de QNH en " + qnh_dato + " es correcto.");
				return "end";
			}
		}		
	}
	
	else{
		return false;
	}
}

function meteoreciente (re_fenomeno, re_fenomeno_previo, re_fenomeno_n){	//FENÓMENOS METEOROLÓGICOS RECIENTES
	re_fenomeno_reg_exp = /^(RE)(FZDZ|FZRA|BLSN|SS|DS|FC|RA|SN|SG|SHRA|SHSN|SHGR|SHGS|PL|VA|TSRA|TSSN|TSGR|TSGS|TS|DZ|RASN|UP|FZUP|TSUP|SHUP)(=)?$/;
	re_fenomeno_longitud = re_fenomeno.length;
	
	if (re_fenomeno_reg_exp.test(re_fenomeno) == true){
		
		if (re_fenomeno_n > 3){
			salida_texto("<span style='color:red; font-weight:bold'>No puede haber más de 3 términos de fenómenos meteorológicos recientes. El término " + re_fenomeno + " no puede ser un fenómeno meteorológico reciente.</span>");
			return 0;
		}
		
		else if (re_fenomeno_n == 0){
			
			if (re_fenomeno.charAt(re_fenomeno_longitud-1) == "="){
				re_fenomeno = re_fenomeno.substr(0, re_fenomeno.length-1);
				salida_texto("El término de fenómeno meteorológico reciente " + re_fenomeno + " es correcto.");
				return "end";
			}
			
			else {
				salida_texto("El término de fenómeno meteorológico reciente " + re_fenomeno + " es correcto.");
				return true;
			}
		}
		
		else if (re_fenomeno_n > 0 && re_fenomeno_n < 4){
			
			if (re_fenomeno != re_fenomeno_previo){
				
				if (re_fenomeno.charAt(re_fenomeno_longitud-1) == "="){
					re_fenomeno = re_fenomeno.substr(0, re_fenomeno.length-1);
					salida_texto("El término de fenómeno meteorológico reciente " + re_fenomeno + " es correcto.");
					return "end";
				}
			
				else {
					salida_texto("El término de fenómeno meteorológico reciente " + re_fenomeno + " es correcto.");
					return true;
				}
			}
			
			else{
				salida_texto("<span style='color:red; font-weight:bold'>El término de fenómeno meteorológico reciente " + re_fenomeno + " no puede ser igual que el anterior.</span>");
				return 0;
			}
		}			
	}
	
	else{
		return false;
	}
}

function cizalla1 (cizalladura_1){		//PRIMER TÉRMINO DE CIZALLADURA
	cizalladura_1_reg_exp = /^(WS)(=)?$/;
	cizalladura1_end = 0;
	
	if (cizalladura_1.charAt(cizalladura_1.length-1) == "="){
		cizalladura1_end = 1;
		cizalladura_1 = cizalladura_1.substr(0, cizalladura_1.length-1);
	}
	
	if (cizalladura_1_reg_exp.test(cizalladura_1) == true){
		
		if (cizalladura1_end == 1){
			return true;
		}
		
		else{
			return true;
		}
	}
	
	else{
		return false;
	}
}

function cizalla2 (cizalladura_2, cizalladura_2_n){		//SEGUNDO TÉRMINO DE CIZALLADURA
	cizalladura_2_1_reg_exp = /^(ALL)(=)?$/;
	cizalladura_2_2_reg_exp = /^(R)(\d{2})(R|L|C)?(=)?$/;
		
	if (cizalladura_2_1_reg_exp.test(cizalladura_2) == true){
		
		if(cizalladura_2.charAt(cizalladura_2.length-1) == "="){
			cizalladura_2 = cizalladura_2.substr(0, cizalladura_2.length-1);
		}
		
		if (cizalladura_2_n > 0){
			salida_texto("<span style='color:red; font-weight:bold'>No puede haber un término de WS ALL RWY si ya hay un término de cizalladura en alguna pista.</span>");
			return 0;
		}
		
		else{
			return 1;
		}
	}
	
	else if (cizalladura_2_2_reg_exp.test(cizalladura_2) == true){
		
		if (cizalladura_2.charAt(cizalladura_2.length-1) == "="){
			cizalladura_2 = cizalladura_2.substr(0, cizalladura_2.length-1);
			salida_texto("El término de WS " + cizalladura_2 + " es correcto.");
			return "end";
		}
			
		else {
			salida_texto("El término de WS " + cizalladura_2 + " es correcto.");
			return 2;
		}
	}
	
	else{
		return false;
	}
}

function cizalla3 (cizalladura_3){		//TERCER TÉRMINO DE CIZALLADURA
	cizalladura_3_reg_exp = /^(RWY)(=)?$/;
	
	if (cizalladura_3_reg_exp.test(cizalladura_3) == true){
		
		if (cizalladura_3.length == 4){
			salida_texto("El término de WS ALL RWY es correcto.");
			return "end";
		}
			
		else {
			salida_texto("El término WS ALL RWY es correcto.");
			return true;
		}
	}
	
	else {
		return false;
	}
}

function estadopista(estado_pista_dato){		//DIVISIÓN DEL TÉRMINO DE ESTADO DE LA PISTA
	estado_pista_reg_exp_1 = /^(R)(\d{2})(R|L|C)?(\/)(\d{1}|\/)(\d{1}|\/)(\d{2}|\/\/)(\d{2}|\/\/)(=)?$/;
	estado_pista_reg_exp_2 = /^(R)(\d{2})(R|L|C)?(\/)(CLRD)(\/\/)(=)?$/;
	estado_pista_reg_exp_3 = /^(R)(\/)(SNOCLO)(=)?$/;
	
	if (estado_pista_reg_exp_3.test(estado_pista_dato) == true){	
		return 3;
	}
	
	else if (estado_pista_reg_exp_2.test(estado_pista_dato) == true){
		estado_pista_comp = rwy(estado_pista_dato.slice(1,3), estado_pista_dato);
		
		if (estado_pista_comp === 0){
			return 0;
		}
		
		else if (estado_pista_comp == true){
			salida_texto("El término "+ estado_pista_dato + " es correcto.");
			return true;
		}
	}
	
	else if (estado_pista_reg_exp_1.test(estado_pista_dato) == true){
		estado_pista_comp = rwy(estado_pista_dato.slice(1,3), estado_pista_dato);
		
		if (estado_pista_comp === 0){
			return 0;
		}
		
		else if (estado_pista_comp == true){
			
			if (estado_pista_dato.charAt(3) == "R" || estado_pista_dato.charAt(3) == "L" || estado_pista_dato.charAt(3) == "C"){
				estado_pista_indice = 6;
			}
			
			else {
				estado_pista_indice = 5;
			}
			
			estado_pista_comp = contaminacion (estado_pista_dato.charAt(estado_pista_indice), estado_pista_dato);
				
			if (estado_pista_comp === 0){
				return 0;
			}
				
			else if (estado_pista_comp == true){
				estado_pista_indice++;
				estado_pista_comp = espesor(estado_pista_dato.slice(estado_pista_indice, estado_pista_indice+1), estado_pista_dato);
					
				if (estado_pista_comp === 0){
					return 0;
				}
					
				else if (estado_pista_comp == true){
					estado_pista_indice++;
					estado_pista_indice++;
					estado_pista_comp = friccion(estado_pista_dato.slice(estado_pista_indice, estado_pista_indice+1), estado_pista_dato);
						
					if (estado_pista_comp === 0){
						return 0;
					}
						
					else if (estado_pista_comp == true){
						salida_texto("El término "+ estado_pista_dato + " es correcto.");
						return true;
					}
				}
			}
		}
	}
				
	else {
		return false;
	}
}

function rwy(estado_pista_numero_pista, estado_pista_completo){		//CONDICIONES NÚMERO DE PISTA
	
	if (parseInt(estado_pista_numero_pista) == 0){
		salida_texto("<span style='color:red; font-weight:bold'>Las pistas en el término " + estado_pista_completo + " deben estar entre 01 y 36 o incluir los códigos 88 o 99.</span>");
		return 0;
	}
	
	else if (parseInt(estado_pista_numero_pista) > 36 && parseInt(estado_pista_numero_pista) != 88 && parseInt(estado_pista_numero_pista) != 99){ 
		salida_texto("<span style='color:red; font-weight:bold'>Las pistas en el término " + estado_pista_completo + " deben estar entre 01 y 36 o incluir los códigos 88 o 99.</span>");
		return 0;
	}
	
	else{
		return true;
	}
}

function contaminacion (estado_pista_contaminacion, estado_pista_completo_2){	//CONDICIONES DE CONTAMINACIÓN
	
	if (isNaN(estado_pista_contaminacion) == true){
		return true;
	}
	
	else{
		
		if (parseInt(estado_pista_contaminacion) != 1 && parseInt(estado_pista_contaminacion) != 2 && parseInt(estado_pista_contaminacion) != 5 && parseInt(estado_pista_contaminacion) != 9){
			salida_texto("<span style='color:red; font-weight:bold'>La cifra que indica el estado de contaminación de la pista en el término " + estado_pista_completo_2 + " debe ser un número entre el 1, 2, 5 o 9; o una /.</span>");
			return 0;
		}
		
		else {
			return true;
		}
	}
}

function espesor (estado_pista_espesor, estado_pista_completo_3){		//CONDICIONES DE ESPESOR DE CAPA CONTAMINANTE
	
	if (isNaN(estado_pista_espesor) == true){
		return true;
	}
	
	else{
		
		if (parseInt(estado_pista_espesor) == 91){
			salida_texto("<span style='color:red; font-weight:bold'>La cifra que indica el espesor del depósito en la pista en el término " + estado_pista_completo_3 + " debe ser un número entre de 00 a 99 (excepto el 91); o una doble /.</span>");
			return 0;
		}
		
		else {
			return true;
		}
	}
}	

function friccion (estado_pista_friccion, estado_pista_completo_4){		//CONDICIONES DE LA FRICCIÓN DE LA PISTA
	
	if (isNaN(estado_pista_friccion) == true){
		return true;
	}
	
	else{
		
		if (parseInt(estado_pista_friccion) == 96 || parseInt(estado_pista_friccion) == 97 || parseInt(estado_pista_friccion) == 98){
			salida_texto("<span style='color:red; font-weight:bold'>La cifra que indica el espesor del depósito en la pista en el término " + estado_pista_completo_4 + " debe ser un número entre de 00 a 99 (excepto el 96, 97 y 98); o una doble /.</span>");
			return 0;
		}
		
		else {
			return true;
		}
	}
	
}

function temporal(indicador_temporal_tipo){		//TIPO DE TREND
	indicador_temporal_1_reg_exp = /^(NOSIG)(=)?$/;
	indicador_temporal_2_reg_exp = /^(BECMG)(=)?$/;
	indicador_temporal_3_reg_exp = /^(TEMPO)(=)?$/;
	
	if (indicador_temporal_1_reg_exp.test(indicador_temporal_tipo) == true){
		
		if (indicador_temporal_tipo.length == 6){
			indicador_temporal_tipo = indicador_temporal_tipo.substr(0,indicador_temporal_tipo.length-1);
			salida_texto("El término " + indicador_temporal_tipo + " es correcto.");
			return "end";
		}
		
		else{
			salida_texto("El término " + indicador_temporal_tipo + " es correcto.");
			return 1;
		}
	}
	
	else if (indicador_temporal_2_reg_exp.test(indicador_temporal_tipo) == true){
		
		if (indicador_temporal_tipo.charAt(indicador_temporal_tipo.length-1) == "="){
			indicador_temporal_tipo = indicador_temporal_tipo.substr(0,indicador_temporal_tipo.length-1);
			salida_texto("El término " + indicador_temporal_tipo + " es correcto.");
			return 2;
		}
		
		else{
			salida_texto("El término " + indicador_temporal_tipo + " es correcto.");
			return 2;
		}
	}
	
	else if (indicador_temporal_3_reg_exp.test(indicador_temporal_tipo) == true){
		
		if (indicador_temporal_tipo.charAt(indicador_temporal_tipo.length-1) == "="){
			indicador_temporal_tipo = indicador_temporal_tipo.substr(0,indicador_temporal_tipo.length-1);
			salida_texto("El término " + indicador_temporal_tipo + " es correcto.");
			return 2;
		}
		
		else{
			salida_texto("El término " + indicador_temporal_tipo + " es correcto.");
			return 2;
		}
	}
	
	else{
		return false;
	}
}

function trend_wind (trend_wind_dato, trend_wind_previo){		//SEPARADOR DEL VIENTO DE TENDENCIA
	trend_wind_reg_exp_1 = /^(VRB|(\d{3}))(P)?(\d{2})(KT)(=)?$/;
	trend_wind_reg_exp_2 = /^(VRB|(\d{3}))(P)?(\d{2})(G)(P)?(\d{2})(KT)(=)?$/;
	trend_wind_end = 0;
	
	if (trend_wind_reg_exp_1.test(trend_wind_dato) == true){
		trend_wind_end = 0;
	
		if (trend_wind_dato.charAt(trend_wind_dato.length-1) == "="){
			trend_wind_dato = trend_wind_dato.substr(0, trend_wind_dato.length-1);
			trend_wind_end = 1;
		}
		
		trend_wind_comp = wind_dir(trend_wind_dato.slice(0,3), trend_wind_dato);
		
		if (trend_wind_comp === 0){
			return 0;
		}
		
		else if (trend_wind_comp == "C" && trend_wind_dato.length == 8){
			salida_texto("<span style='color:red; font-weight:bold'>La dirección del viento del término de tendencia " + trend_wind_dato + " solo puede ser 000 para viento en calma.</span>");
			return 0;
		}
		
		else if (trend_wind_comp == "C" && trend_wind_dato.length == 7){
			trend_wind_comp = wind_vel (trend_wind_dato.slice(3, 5) , "C", trend_wind_dato);
			
			if (trend_wind_comp === 0){
				return 0;
			}
			
			else if (trend_wind_comp == true){
				trend_wind_comp = change_wind (trend_wind_dato, trend_wind_previo);
						
				if (trend_wind_comp == true){
					salida_texto("El término " + trend_wind_dato + " es correcto.");
				
					if (trend_wind_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
					
				else if (trend_wind_comp === 0){
					return 0;
				}
			}
		}
		
		else if (trend_wind_comp == "NC"){
			
			if (trend_wind_dato.length == 7){
				trend_wind_comp = wind_vel (trend_wind_dato.slice(3,5), "NC", trend_wind_dato);
			
				if (trend_wind_comp === 0){
					return 0;
				}
				
				else if (trend_wind_comp == true){
					trend_wind_comp = change_wind (trend_wind_dato, trend_wind_previo);
						
					if (trend_wind_comp == true){
						salida_texto("El término " + trend_wind_dato + " es correcto.");
					
						if (trend_wind_end == 1){
							return "end";
						}
				
						else{
							return true;
						}
					}
							
					else if (trend_wind_comp === 0){
						return 0;
					}
				}
			}
				
			else if (trend_wind_dato.length == 8){
				
				if (trend_wind_dato.slice (4,6) != "99"){
					salida_texto("<span style='color:red; font-weight:bold'>La velocidad del viento del término de tendencia " + trend_wind_dato + " si lleva la letra P debe ser P99.</span>");
					return 0;
				}
				
				else{
					salida_texto("El término "+ trend_wind_dato + " es correcto.");
					
					if (trend_wind_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
			}
		}
	}
	
	else if (trend_wind_reg_exp_2.test(trend_wind_dato) == true){
		trend_wind_comp = wind_dir(trend_wind_dato.slice(0,3), trend_wind_dato);
		
		if (trend_wind_comp === 0){
			return 0;
		}
		
		else if (trend_wind_comp == "C"){
			salida_texto("<span style='color:red; font-weight:bold'>La dirección del viento en el término de tendencia " + trend_wind_dato + " solo puede ser 000 para viento en calma.</span>");
			return 0;
		}
		
		else if (trend_wind_comp == "NC"){
			
			if (isNaN(trend_wind_dato.charAt(3)) == true){
				
				if (parseInt(trend_wind_dato.slice(4,6)) != 99){
					salida_texto("<span style='color:red; font-weight:bold'>La velocidad del viento en el término de tendencia " + trend_wind_dato + " si lleva la letra P debe ser P99.</span>");
					return 0;
				}
				
				else{
					
					if (isNaN(trend_wind_dato.charAt(7)) == true){
				
						if (parseInt(trend_wind_dato.slice(8,10)) != 99){
							salida_texto("<span style='color:red; font-weight:bold'>La velocidad del viento en el término de tendencia " + trend_wind_dato + " si lleva la letra P debe ser P99.</span>");
							return 0;
						}
				
						else{
							trend_wind_comp = change_wind (trend_wind_dato, trend_wind_previo);
							
							if (trend_wind_comp == true){
								salida_texto("El término " + trend_wind_dato + " es correcto.");
								
								if (trend_wind_end == 1){
									return "end";
								}
				
								else{
									return true;
								}
							}
							
							else if (trend_wind_comp === 0){
								return 0;
							}
						}
					}
					
					else {
						trend_wind_comp = wind_vel(trend_wind_dato.slice(7,9), "NC", trend_wind_dato);
						
						if (trend_wind_comp === 0){
							return 0;
						}
						
						else if (trend_wind_comp == true){
							trend_wind_comp = change_wind (trend_wind_dato, trend_wind_previo);
							
							if (trend_wind_comp == true){
								salida_texto("El término " + trend_wind_dato + " es correcto.");
								
								if (trend_wind_end == 1){
									return "end";
								}
				
								else{
									return true;
								}
							}
							
							else if (trend_wind_comp === 0){
								return 0;
							}
						}
					}
				}
			}
			
			else{
				trend_wind_comp = wind_vel(trend_wind_dato.slice(3,5), "NC", trend_wind_dato);
				
				if (trend_wind_comp === 0){
					return 0;
				}
				
				else if (trend_wind_comp == true){
					
					if (isNaN(trend_wind_dato.charAt(7)) == true){
				
						if (parseInt(trend_wind_dato.slice(8,10)) != 99){
							salida_texto("<span style='color:red; font-weight:bold'>La velocidad del viento en el término de tendencia " + trend_wind_dato + " si lleva la letra P debe ser P99.</span>");
							return 0;
						}
				
						else{
							trend_wind_comp = change_wind (trend_wind_dato, trend_wind_previo);
							
							if (trend_wind_comp == true){
								salida_texto("El término " + trend_wind_dato + " es correcto.");
								
								if (trend_wind_end == 1){
									return "end";
								}
				
								else{
									return true;
								}
							}
							
							else if (trend_wind_comp === 0){
								return 0;
							}
						}
					}
					
					else {
						trend_wind_comp = wind_vel(trend_wind_dato.slice(7,9), "NC", trend_wind_dato);
						
						if (trend_wind_comp === 0){
							return 0;
						}
						
						else if (trend_wind_comp == true){
							trend_wind_comp = change_wind (trend_wind_dato, trend_wind_previo);
							
							if (trend_wind_comp == true){
								salida_texto("El término " + trend_wind_dato + " es correcto.");
								
								if (trend_wind_end == 1){
									return "end";
								}
				
								else{
									return true;
								}
							}
							
							else if (trend_wind_comp === 0){
								return 0;
							}
						}
					}
				}
			}		
		}	
	}
	
	else{
		return false;
	}
	
}

function wind_dir(trend_wind_direccion, trend_wind_completo){	//DIRECCIÓN DEL VIENTO DE TENDENCIA

	if (trend_wind_direccion == "VRB"){
		return "NC";
	}
	
	trend_wind_direccion_numero = parseInt(trend_wind_direccion);
	
	if (trend_wind_direccion.charAt(2) != 0){
		salida_texto("<span style='color:red; font-weight:bold'>La dirección del viento en el término de tendencia " + trend_wind_completo + " debe ir de 10 en 10 grados.</span>");
		return 0;
	}
	
	else {
		
		if (trend_wind_direccion_numero > 360){
			salida_texto("<span style='color:red; font-weight:bold'>La dirección del viento en el término de tendencia " + trend_wind_completo + " debe ser menor de 360 grados.</span>");
			return 0;
		}
		
		else if (trend_wind_direccion_numero == 0){
			return "C";
		}
		
		else{
			return "NC";
		}
	}
}

function wind_vel (trend_wind_speed, trend_wind_caso, trend_wind_completo_2){	//VELOCIDAD DEL VIENTO DE TENDENCIA
	trend_wind_speed_numero = parseInt(trend_wind_speed);
	
	if (trend_wind_caso == "C"){
		
		if (trend_wind_speed_numero != 0){
			salida_texto("<span style='color:red; font-weight:bold'>La dirección del viento en el término de tendencia " + trend_wind_completo_2 + " solo puede ser 000 para viento en calma.</span>");
			return 0;
		}
		
		else{
			return true;
		}
	}
	
	else if (trend_wind_caso == "NC"){
		
		if (trend_wind_speed_numero == 0){
			salida_texto("<span style='color:red; font-weight:bold'>La dirección del viento en el término de tendencia " + trend_wind_completo_2 + " solo puede ser 000 para viento en calma.</span>");
			return 0;
		}
		
		else{
			return true;
		}
	}
}

function change_wind (trend_wind_dato_1, trend_wind_dato_previo){		//CONDICIONES PARA VIENTO DE TENDENCIA
	trend_wind_reg_1 = /^(\d{3})(P)?(\d{2})(KT)$/;
	trend_wind_reg_2 = /^(VRB)(P)?(\d{2})(KT)$/;
	trend_wind_reg_3 = /^(\d{3})(P)?(\d{2})(G)(P)?(\d{2})(KT)$/;
	trend_wind_reg_4 = /^(VRB)(P)?(\d{2})(G)(P)?(\d{2})(KT)$/;
	
	if (trend_wind_reg_2.test(trend_wind_dato_previo) == true || trend_wind_reg_4.test(trend_wind_dato_previo) == true){
		
		if (isNaN(trend_wind_dato_previo.charAt(3)) == true){
			
			if (isNaN(trend_wind_dato_1.charAt(3)) == true){
				salida_texto("<span style='color:red; font-weight:bold'>Para aparecer el término " + trend_wind_dato_1 + " en tendencia debe haber una variación de al menos 10KT.</span>");
				return 0;
			}
			
			else{
				return true;
			}
		}
		
		else{
			
			if (isNaN(trend_wind_dato_1.charAt(3)) == true){
				return true;
			}
			
			else{
				
				if (Math.abs(parseInt(trend_wind_dato_1.slice(3,5)) - parseInt(trend_wind_dato_previo.slice(3,5))) < 10){
					salida_texto("<span style='color:red; font-weight:bold'>Para aparecer el término " + trend_wind_dato_1 + " en tendencia debe haber una variación de al menos 10KT.</span>");
					return 0;
				}
				
				else{
					return true;
				}
			}
		}
	}
	
	else {
		
		if (Math.abs( parseInt (trend_wind_dato_previo.slice(0,3)) - parseInt (trend_wind_dato_1.slice(0,3))) > 180 ){
			
			if (Math.abs( Math.abs(( parseInt(trend_wind_dato_previo.slice(0,3)) - parseInt (trend_wind_dato_1.slice(0,3)))) - 360) < 60 ){
						
				if (isNaN(trend_wind_dato_previo.charAt(3)) == true){
			
					if (isNaN(trend_wind_dato_1.charAt(3)) == true){
						salida_texto("<span style='color:red; font-weight:bold'>Para aparecer el término " + trend_wind_dato_1 + " en tendencia debe haber una variación de al menos 10KT.</span>");
						return 0;
					}
			
					else{
						return true;
					}
				}
		
				else{
			
					if (isNaN(trend_wind_dato_1.charAt(3)) == true){
						return true;
					}
			
					else{
				
						if (Math.abs(parseInt(trend_wind_dato_1.slice(3,5)) - parseInt(trend_wind_dato_previo.slice(3,5))) < 10){
							salida_texto("<span style='color:red; font-weight:bold'>Para aparecer el término " + trend_wind_dato_1 + " en tendencia debe haber una variación de al menos 10KT.</span>");
							return 0;
						}
				
						else{
							return true;
						}
					}
				}
			}
			
			else{
				
				if (isNaN(trend_wind_dato_previo.charAt(3)) == true || isNaN(trend_wind_dato_1.charAt(3)) == true){
					return true;
				}
				
				else{
					
					if (parseInt(trend_wind_dato_1.slice(3,5)) > 10 || parseInt(trend_wind_dato_previo.slice(3,5)) > 10){
						return true;
					}
				
					else{
						
						if (Math.abs(parseInt(trend_wind_dato_1.slice(3,5)) - parseInt(trend_wind_dato_previo.slice(3,5))) < 10){
							salida_texto("<span style='color:red; font-weight:bold'>Para aparecer el término " + trend_wind_dato_1 + " en tendencia debe haber una variación de al menos 10KT.</span>");
							return 0;
						}
				
						else{
							return true;
						}
					}
				}
			}
		}
		
		else{
		
			if (Math.abs( parseInt (trend_wind_dato_1.slice(0,3)) - parseInt (trend_wind_dato_previo.slice(0,3))) < 60 ){		//DIFERENCIA DE DIRECCIONES ENTRE 60 Y 180 GRADOS
				
				if (isNaN(trend_wind_dato_previo.charAt(3)) == true){
			
					if (isNaN(trend_wind_dato_1.charAt(3)) == true){
						salida_texto("<span style='color:red; font-weight:bold'>Para aparecer el término " + trend_wind_dato_1 + " en tendencia debe haber una variación de al menos 10KT.</span>");
						return 0;
					}
			
					else{
						return true;
					}
				}
		
				else{
			
					if (isNaN(trend_wind_dato_1.charAt(3)) == true){
						return true;
					}
			
					else{
				
						if (Math.abs(parseInt(trend_wind_dato_1.slice(3,5)) - parseInt(trend_wind_dato_previo.slice(3,5))) < 10){
							salida_texto("<span style='color:red; font-weight:bold'>Para aparecer el término " + trend_wind_dato_1 + " en tendencia debe haber una variación de al menos 10KT.</span>");
							return 0;
						}
				
						else{
							return true;
						}
					}
				}						
			}
				
			else{
					
				if (isNaN(trend_wind_dato_1.charAt(3)) == true || isNaN(trend_wind_dato_previo.charAt(3)) == true){
					return true;
				}
			
				else{
				
					if (parseInt(trend_wind_dato_1.slice(3,5))> 10 || parseInt(trend_wind_dato_previo.slice(3,5)) > 10){
						return true;
					}
				
					else{
						
						if (Math.abs(parseInt(trend_wind_dato_1.slice(3,5)) - parseInt(trend_wind_dato_previo.slice(3,5))) < 10){
							salida_texto("<span style='color:red; font-weight:bold'>Para aparecer el término " + trend_wind_dato_1 + " en tendencia debe haber una variación de al menos 10KT.</span>");
							return 0;
						}
				
						else{
							return true;
						}
					}
				}
			}
		}
	}
}

function trend_visibility (trend_visibility_dato, trend_visibility_visibilidad_media){ //CONDICIONES PARA VISIBILIDAD DE TENDENCIA
	trend_visibility_reg_exp = /^(\d{4})(=)?$/;
	
	if (trend_visibility_reg_exp.test(trend_visibility_dato) == true){
	
		if (precision(trend_visibility_dato) === 0){
			return 0;
		}
	
		else if (precision(trend_visibility_dato) == true){
			trend_visibility_end = 0;
	
			if (trend_visibility_dato.charAt(trend_visibility_dato.length-1) == "="){
				trend_visibility_dato = trend_visibility_dato.substr(0, trend_visibility_dato.length-1);
				trend_visibility_end = 1;
			}
			
			if (trend_visibility_visibilidad_media === "NOVIS"){
				salida_texto ("<span style='color:red; font-weight:bold'>No se puede analizar el término de visibilidad en tendencia " + trend_visibility_dato + " al no haber ningún término de visibilidad correcto.</span>");
				return 0;
			}
			
			trend_visibility_1 = parseInt(trend_visibility_visibilidad_media);
			trend_visibility_2 = parseInt(trend_visibility_dato);
		
			if (trend_visibility_1 < trend_visibility_2){
	
				if (trend_visibility_1 < 150 && trend_visibility_2 >= 150){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
					
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}

				else if (trend_visibility_1 < 350 && trend_visibility_2 >= 350){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
					
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
	
				else if (trend_visibility_1 < 600 && trend_visibility_2 >=600){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
					
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}

				else if (trend_visibility_1 < 1500 && trend_visibility_2 >= 1500){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
					
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
	
				else if (trend_visibility_1 < 3000 && trend_visibility_2 >= 3000){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
				
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
	
				else if (trend_visibility_1 < 5000 && trend_visibility_2 >= 5000){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
				
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
			
				else {
					salida_texto("<span style='color:red; font-weight:bold'>La visibilidad solo ha de indicarse en la tendencia si supone una mejoría (hasta o pasando por) 150, 350, 600, 1500, 3000 o 5000 metros.</span>");
					return 0;
				}
			}
		
			if (trend_visibility_1 > trend_visibility_2){
	
				if (trend_visibility_2 < 150 && trend_visibility_1 > 150){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
					
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}

				else if (trend_visibility_2 < 350 && trend_visibility_1 > 350){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
				
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
	
				else if (trend_visibility_2 < 600 && trend_visibility_1 >600){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
				
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}

				else if (trend_visibility_2 < 1500 && trend_visibility_1 >= 1500){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
				
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
	
				else if (trend_visibility_2 < 3000 && trend_visibility_1 >= 3000){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
				
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
	
				else if (trend_visibility_2 < 5000 && trend_visibility_1 >= 5000){
					salida_texto("El término de visibilidad en tendencia " + trend_visibility_dato + " es correcto.");
			
					if (trend_visibility_end == 1){
						return "end";
					}
				
					else{
						return true;
					}
				}
			
				else {
					salida_texto("<span style='color:red; font-weight:bold'>La visibilidad solo ha de indicarse en la tendencia si supone una bajada pasando por 150, 350, 600, 1500, 3000 o 5000 metros.</span>");
					return 0;
				}
			}
	
			else if (trend_visibility_1 == trend_visibility_2){
				salida_texto("El indicador de tendencia debe indicar un cambio por lo que la visibilidad debe ser distinta de la visibilidad media.");
				return 0;
			}
		}
	}
	
	else {
		return false;
	}
}

function trend_weather (trend_weather_dato, trend_weather_previo_dato, trend_weather_n1, trend_weather_n2){	//CONDICIONES PARA TIEMPO SIGNIFICATIVO EN TENDENCIA	
	tor = /^(\+|\-)?(TSGR|TSGS|TSRA|TSSN)(=)?$/;
	prec = /^(\+|\-)?(SHGS|SHGR|SHRA|SHSN|DZ|RA|SN|SG|PL|GR|GS|RASN|RADZ)(=)?$/;
	eng = /^(\+|\-)?(FZDZ|FZRA)(=)?$/;
	pol1 = /^(\+|\-)?(SS)(=)?$/;
	pol2 = /^(\+|\-)?(DS)(=)?$/;
	
	fenomeno_extra_1 = /^(FG|MIFG|BCFG|PRFG|VCFG|BR)(=)?$/;
	fenomeno_extra_2= /^(FU)(=)?$/;
	fenomeno_extra_3= /^(HZ)(=)?$/;
	fenomeno_extra_4 = /^(VA)(=)?$/;
	fenomeno_extra_5 = /^(PO)(=)?$/;	
	
	nieb = /^(FZFG)(=)?$/;
	venbaja = /^(DR)(DU|SA|SN)(=)?$/;
	venalta = /^(BL)(DU|SA|SN)(=)?$/;
	tors = /^(TS)(=)?$/;
	turbo = /^(SQ)(=)?$/;
	emb = /^(FC)(=)?$/;
	
	trend_weather_end = 0;
	
	if (trend_weather_dato.charAt(trend_weather_dato.length-1) == "="){
		trend_weather_dato = trend_weather_dato.substr(0, trend_weather_dato.length-1);
		trend_weather_end = 1;
	}
	
	if (trend_weather_n1 > 3){
		
		if (prec.test(trend_weather_dato) == true || tor.test(trend_weather_dato) == true || pol1.test(trend_weather_dato) == true || pol2.test(trend_weather_dato) == true || eng.test(trend_weather_dato) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " no debe incluir más de 3 grupos de: precipitación engelante, tormenta de precipitación, tempestad de arena, tempestad de polvo o precipitaciones (o chubacos con precipitaciones).</span>");
			return 0;
		}
	}
	
	if (trend_weather_n2 > 3){
		
		if (nieb.test(trend_weather_dato) == true || venbaja.test(trend_weather_dato) == true || venalta.test(trend_weather_dato) == true || tors.test(trend_weather_dato) == true || turbo.test(trend_weather_dato) == true || emb.test(trend_weather_dato) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " no debe incluir más de 3 grupos de: niebla engelante, ventisca baja de polvo, arena o nieve; ventisca alta de polvo, arena o nieve; tormenta sin precipitación, turbonada o nubes en forma de embudo.</span>");
			return 0;
		}
	}
		
	
	for (t_w_bucle = 0; t_w_bucle < trend_weather_previo_dato.length; t_w_bucle++){		
		trend_weather_previo = trend_weather_previo_dato[t_w_bucle].toString();
		
		if (tor.test(trend_weather_dato) == true && tor.test(trend_weather_previo) == true){
			
			if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
				
				if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " se debe emplear para indicar cambio en la intensidad, aparición o cese de tormentas con precipitación.</span>");
					return 0;
				}
			}
			
			else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
				
				if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " se debe emplear para indicar cambio en la intensidad, aparición o cese de tormentas con precipitación.</span>");
					return 0;
				}
			}
		}
		
		else if (eng.test(trend_weather_dato) == true && eng.test(trend_weather_previo) == true){
			
			if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
				
				if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " se debe emplear para indicar cambio en la intensidad, aparición o cese de precipitación engelante.</span>");
					return 0;
				}
			}
			
			else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
				
				if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " se debe emplear para indicar cambio en la intensidad, aparición o cese de recipitación engelante.</span>");
					return 0;
				}
			}
		}
		
		else if (pol1.test(trend_weather_dato) == true && pol1.test(trend_weather_previo) == true){
			
			if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
				
				if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " se debe emplear para indicar cambio en la intensidad, aparición o cese de tempestad de arena.</span>");
					return 0;
				}
			}
			
			else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
				
				if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " se debe emplear para indicar cambio en la intensidad, aparición o cese de tempestad de arena.</span>");
					return 0;
				}
			}
		}
		
		else if (pol2.test(trend_weather_dato) == true && pol2.test(trend_weather_previo) == true){
			
			if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
				
				if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " se debe emplear para indicar cambio en la intensidad, aparición o cese de tempestad de polvo.</span>");
					return 0;
				}
			}
			
			else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
				
				if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " se debe emplear para indicar cambio en la intensidad, aparición o cese de tempestad de polvo.</span>");
					return 0;
				}
			}
		}
		
		else if (prec.test(trend_weather_dato) == true && prec.test(trend_weather_previo) == true){
			
			if (trend_weather_previo.charAt(0) == "+" && trend_weather_dato.charAt(0) == "+"){
				salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " de tiempo significativo solo incluirá términos de precicipitación cuando estas cambian su intensidad a moderada o fuerte.</span>");
				return 0;
			}
			
			else if (trend_weather_dato.charAt(0) == "-" && trend_weather_previo.charAt(0) == "-"){
				salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " de tiempo significativo solo incluirá términos de precicipitación cuando estas cambian su intensidad a moderada o fuerte.</span>");
				return 0;
			}
			
			else if (trend_weather_dato.charAt(0) == "-" && trend_weather_previo.charAt(0) == "+"){
				salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " de tiempo significativo solo incluirá términos de precicipitación cuando estas cambian su intensidad a moderada o fuerte.</span>");
				return 0;
			}
			
			else if (trend_weather_previo.charAt(0) != "-" && trend_weather_previo.charAt(0) != "+" && trend_weather_dato.charAt(0) == "-"){
				salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " de tiempo significativo solo incluirá términos de precicipitación cuando estas cambian su intensidad a moderada o fuerte./span>");
				return 0;
			}
			
			else if (trend_weather_previo.charAt(0) != "-" && trend_weather_previo.charAt(0) != "+" && trend_weather_dato.charAt(0)!= "-" && trend_weather_dato.charAt(0)!= "+"){
				salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " de tiempo significativo solo incluirá términos de precicipitación cuando estas cambian su intensidad a moderada o fuerte.</span>");
				return 0;
			}
		}
		
		else if (nieb.test(trend_weather_dato) == true && nieb.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: niebla engelante, ventisca baja de polvo, arena o nieve; ventisca alta de polvo, arena o nieve; tormenta sin precipitación, turbonada o nubes en forma de embudo.</span>");
			return 0;
		}
		
		else if (venalta.test(trend_weather_dato) == true && venalta.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: niebla engelante, ventisca baja de polvo, arena o nieve; ventisca alta de polvo, arena o nieve; tormenta sin precipitación, turbonada o nubes en forma de embudo.</span>");
			return 0;
		}
		
		else if (venbaja.test(trend_weather_dato) == true && venbaja.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: niebla engelante, ventisca baja de polvo, arena o nieve; ventisca alta de polvo, arena o nieve; tormenta sin precipitación, turbonada o nubes en forma de embudo.</span>");
			return 0;
		}
		
		else if (fenomeno_extra_1.test(trend_weather_dato) == true && fenomeno_extra_1.test(trend_weather_previo) == true){	
			
			if (trend_weather_dato == trend_weather_previo){
				salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: niebla (ya sea en bancos, baja, parcial o en las proximidades) o de bruma.</span>");
				return 0;
			}
		}
		
		else if (fenomeno_extra_2.test(trend_weather_dato) == true && fenomeno_extra_2.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: oscurecimiento por humo.</span>");
			return 0;
		}
		
		else if (fenomeno_extra_3.test(trend_weather_dato) == true && fenomeno_extra_3.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: oscurecimiento por calima.</span>");
			return 0;
		}
		
		else if (fenomeno_extra_4.test(trend_weather_dato) == true && fenomeno_extra_4.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: oscurecimiento por cenizas volcánicas.</span>");
			return 0;
		}
		
		else if (fenomeno_extra_5.test(trend_weather_dato) == true && fenomeno_extra_5.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: tolvaneras.</span>");
			return 0;
		}
		
		else if (turbo.test(trend_weather_dato) == true && turbo.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: niebla engelante, ventisca baja de polvo, arena o nieve; ventisca alta de polvo, arena o nieve; tormenta sin precipitación, turbonada o nubes en forma de embudo.</span>");
			return 0;
		}
		
		else if (tors.test(trend_weather_dato) == true && tors.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: niebla engelante, ventisca baja de polvo, arena o nieve; ventisca alta de polvo, arena o nieve; tormenta sin precipitación, turbonada o nubes en forma de embudo.</span>");
			return 0;
		}
		
		else if (emb.test(trend_weather_dato) == true && emb.test(trend_weather_previo) == true){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " debe incluir el inicio o cese de: niebla engelante, ventisca baja de polvo, arena o nieve; ventisca alta de polvo, arena o nieve; tormenta sin precipitación, turbonada o nubes en forma de embudo.</span>");
			return 0;
		}

		if (prec.test(trend_weather_dato) == true && trend_weather_dato.charAt(0) == "-"){
			salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia " + trend_weather_dato + " no debe aparecer si son precipitaciones de intensidad leve.</span>");
			return 0;
		}
	}
	
	if (prec.test(trend_weather_dato) == true && trend_weather_dato.charAt(0) != "-"){
		salida_texto("El término de tendencia de tiempo significativo " + trend_weather_dato + " es correcto.");
		
		if (trend_weather_end == 1){
			return "end";
		}
		
		else{
			return 1;
		}
	}
	
	else if (tor.test(trend_weather_dato) == true || pol1.test(trend_weather_dato) == true || pol2.test(trend_weather_dato) == true || eng.test(trend_weather_dato) == true){
		salida_texto("El término de tendencia de tiempo significativo " + trend_weather_dato + " es correcto.");
		
		if (trend_weather_end == 1){
			return "end";
		}
		
		else{
			return 1;
		}
	}
	
	else if (nieb.test(trend_weather_dato) == true || venbaja.test(trend_weather_dato) == true || venalta.test(trend_weather_dato) == true || tors.test(trend_weather_dato) == true || turbo.test(trend_weather_dato) == true || emb.test(trend_weather_dato) == true || fenomeno_extra_1.test(trend_weather_dato) == true || fenomeno_extra_2.test(trend_weather_dato) == true || fenomeno_extra_3.test(trend_weather_dato) == true || fenomeno_extra_4.test(trend_weather_dato) == true|| fenomeno_extra_5.test(trend_weather_dato) == true){
		salida_texto("El término de tendencia de tiempo significativo " + trend_weather_dato + " es correcto.");
		
		if (trend_weather_end == 1){
			return "end";
		}
		
		else{
			return 2;
		}
	}
	return false;
}

function trend_clouds (trend_clouds_dato, trend_clouds_previo){		//CONDICIONES PARA NUBES DE TENDENCIA 
	nube = /^(FEW|SCT|BKN|OVC)(\d{3})(CB|TCU)?(=)?$/;
	
	if (nube.test(trend_clouds_dato) == true){	
	
		trend_clouds_end = 0;

		if (trend_clouds_dato.charAt(trend_clouds_dato.length-1) == "="){
			trend_clouds_dato = trend_clouds_dato.substr(0, trend_clouds_dato.length-1);
			trend_clouds_end = 1;
		}

		for (t_c_bucle = 0; t_c_bucle < trend_clouds_previo.length; t_c_bucle++){
			trend_clouds_tipo_1 = trend_clouds_dato.slice(0,3);
			trend_clouds_tipo_2 = trend_clouds_previo[t_c_bucle].toString().slice(0,3);
			trend_clouds_altura_1 = parseInt(trend_clouds_dato.slice(3));
			trend_clouds_altura_2 = parseInt(trend_clouds_previo[t_c_bucle].toString().slice(3));
		
			if ((trend_clouds_tipo_1 == "BKN" && trend_clouds_tipo_2 == "BKN") || (trend_clouds_tipo_1 == "OVC" && trend_clouds_tipo_2 == "OVC")){
				
				if (trend_clouds_altura_1 < trend_clouds_altura_2){
	
					if (trend_clouds_altura_1 < 1 && trend_clouds_altura_2 > 1){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
					
					if (trend_clouds_altura_1 < 2 && trend_clouds_altura_2 > 2){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
					
					if (trend_clouds_altura_1 < 5 && trend_clouds_altura_2 > 5){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
					
					if (trend_clouds_altura_1 < 10 && trend_clouds_altura_2 > 10){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
					
					if (trend_clouds_altura_1 < 15 && trend_clouds_altura_2 > 15){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
				}
				
				else if (trend_clouds_altura_1 > trend_clouds_altura_2){				
	
					if (trend_clouds_altura_2 < 1 && trend_clouds_altura_1 >= 1){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
					
					if (trend_clouds_altura_2 < 2 && trend_clouds_altura_1 >= 2){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
					
					if (trend_clouds_altura_2 < 5 && trend_clouds_altura_1 >= 5){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
					
					if (trend_clouds_altura_2 < 10 &&  trend_clouds_altura_1 >= 10){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
					
					if (trend_clouds_altura_2 < 15 && trend_clouds_altura_1 >= 15){
					
						if (trend_clouds_end == 1){
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return "end";
						}
				
						else{
							salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
							return true;
						}
					}
				}
			}
			
			else if (trend_clouds_altura_1 < 15 && trend_clouds_altura_2 < 15){
				
				if ((trend_clouds_tipo_2 == "SCT" && trend_clouds_tipo_1 == "BKN") || (trend_clouds_tipo_2 == "SCT" && trend_clouds_tipo_1 == "OVC") || (trend_clouds_tipo_2 == "BKN" && trend_clouds_tipo_1 == "SCT") || (trend_clouds_tipo_2 == "BKN" && trend_clouds_tipo_1 == "FEW") || (trend_clouds_tipo_2 == "OVC" && trend_clouds_tipo_1 == "SCT") || (trend_clouds_tipo_2 == "OVC" && trend_clouds_tipo_1 == "FEW")){
					
					if (trend_clouds_end == 1){
						salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
						return "end";
					}
				
					else{
						salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
						return true;
					}
				}
			}
			
			if (trend_clouds_dato.length == 6 && trend_clouds_previo[t_c_bucle].toString().length == 8){
					
				if (trend_clouds_end == 1){
					salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
					return "end";
				}
				
				else{
					salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
					return true;
				}
			}
				
			if (trend_clouds_dato.length == 8 && trend_clouds_previo[t_c_bucle].toString().length == 6){
				
				if (trend_clouds_end == 1){
					salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
					return "end";
				}
			
				else{
					salida_texto("El término de tendencia de nubes " + trend_clouds_dato + " es correcto.");
					return true;
				}
			}
		}
	salida_texto("<span style='color:red; font-weight:bold'>El término de tendencia de nubes " + trend_clouds_dato + " no cumple con las condiciones para aparecer en TREND.</span>");
	return 0;
	}
	
	else{
		return false;
	}
}

function trend_vertical (trend_vertical_dato, trend_vertical_visibilidad_dato, trend_vertical_n){	//CONDICIONES PARA VISIBILIDAD VERTICAL EN TENDENCIA
	trend_vertical_reg_exp = /^(VV)(\d{3})(=)?$/;
	
	if (trend_vertical_reg_exp.test(trend_vertical_dato) == true){	
		trend_vertical_end = 0;
		trend_vertical_altura = parseInt(trend_vertical_dato.slice(2,5));
	
		if (trend_vertical_dato.charAt(trend_vertical_dato.length-1) == "="){
			trend_vertical_dato = trend_vertical_dato.substr(0, trend_vertical_dato.length-1);
			trend_vertical_end = 1;
		}
		
		if (trend_vertical_n > 0){
			salida_texto("<span style='color:red; font-weight:bold'>El término " + trend_vertical_dato + " de visibilidad vertical no debe aparecer si ya hay un término de nubes.</span>");
			return 0;
		}
		
		else{
		
			if (trend_vertical_altura > 20){
				salida_texto("<span style='color:red; font-weight:bold'>La altura indicada por la visibilidad vertical en " + trend_vertical_dato + " no puede ser mayor de 20 centenares de pies.</span>");
				return 0;
			}
	
			else {
				trend_vertical_numero_1 = parseInt(trend_vertical_visibilidad_dato.slice(2,5));
				trend_vertical_numero_2 = parseInt(trend_vertical_dato.slice(2,5));
				
				if (trend_vertical_numero_1 < trend_vertical_numero_2){
	
					if (trend_vertical_numero_1 < 1 && trend_vertical_numero_2 >= 1){
						salida_texto("El término " + trend_vertical_dato + " es correcto.");
					
						if (trend_vertical_end == 1){
							return "end";
						}
				
						else{
							return true;
						}
					}

					else if (trend_vertical_numero_1 < 2 && trend_vertical_numero_2 >= 2){
						salida_texto("El término " + trend_vertical_dato + " es correcto.");
						
						if (trend_vertical_end == 1){
							return "end";
						}
				
						else{
							return true;
						}
					}
	
					else if (trend_vertical_numero_1 < 5 && trend_vertical_numero_2 >=5){
						salida_texto("El término " + trend_vertical_dato + " es correcto.");
					
						if (trend_vertical_end == 1){
							return "end";
						}
				
						else{
							return true;
						}
					}

					else if (trend_vertical_numero_1 < 10 && trend_vertical_numero_2 >= 10){
						salida_texto("El término " + trend_vertical_dato + " es correcto.");
					
						if (trend_vertical_end == 1){
							return "end";
						}	
				
						else{
							return true;
						}
					}
			
					else {
						salida_texto("<span style='color:red; font-weight:bold'>La visibilidad solo ha de indicarse en la tendencia en el término " + trend_vertical_dato + " si supone una mejoría (hasta o pasando por) 100, 200, 500 o 1000 pies.</span>");
						return 0;
					}
				}
		
				else if (trend_vertical_numero_1 > trend_vertical_numero_2){
	
					if (trend_vertical_numero_2 < 1 && trend_vertical_numero_1 > 1){
						salida_texto("El término " + trend_vertical_dato + " es correcto.");
				
						if (trend_vertical_end == 1){
							return "end";
						}
				
						else{
							return true;
						}
					}

					else if (trend_vertical_numero_2 < 2 && trend_vertical_numero_1 > 2){
						salida_texto("El término " + trend_vertical_dato + " es correcto.");
				
						if (trend_vertical_end == 1){
							return "end";
						}
				
						else{
							return true;
						}
					}
	
					else if (trend_vertical_numero_2 < 5 && trend_vertical_numero_1 >5){
						salida_texto("El término " + trend_vertical_dato + " es correcto.");
				
						if (trend_vertical_end == 1){
							return "end";
						}
				
						else{
							return true;
						}
					}

					else if (trend_vertical_numero_2 < 10 && trend_vertical_numero_1 >= 10){
						salida_texto("El término " + trend_vertical_dato + " es correcto.");
					
						if (trend_vertical_end == 1){
							return "end";
						}
				
						else{
							return true;
						}
					}
			
					else {
						salida_texto("<span style='color:red; font-weight:bold'>La visibilidad solo ha de indicarse en la tendencia en el término " + trend_vertical_dato+ " si supone una mejoría (hasta o pasando por) 100, 200, 500 o 1000 pies.</span>");
						return 0;
					}
				}
	
				else if (trend_vertical_numero_1 == trend_vertical_numero_2){
					salida_texto("<span style='color:red; font-weight:bold'>El indicador de tendencia debe indicar un cambio por lo que la visibilidad en el término " + trend_vertical_dato + " debe ser distinta de la visibilidad media.</span>");
					return 0;
				}
			}
		}
	}
		
	else {
		return false;
	}
}

function rmk_wind_separador (rmk_wind_code, rmk_termino){		//SEPARADOR TÉRMINO DE VIENTO RMK
	rmk_wind_1 = /^(R09)\//;
	rmk_wind_2 = /^(ARP)\//;
	
	if (rmk_termino === 1){
		
		if (rmk_wind_1.test(rmk_wind_code) == true){
			viento_rmk = rmk_wind_code.split("/");
			rmk_wind_analizado = viento_rmk[1];
			rmk_wind_resultado = rmk_wind(rmk_wind_analizado, rmk_termino, rmk_wind_code);
			return rmk_wind_resultado;
		}
		
		else{
			return "nopista";
		}
	}
	
	else if (rmk_termino === 2){
		
		if (rmk_wind_2.test(rmk_wind_code) == true){
			viento_rmk = rmk_wind_code.split("/");
			rmk_wind_analizado = viento_rmk[1];
			rmk_wind_resultado = rmk_wind(rmk_wind_analizado, rmk_termino, rmk_wind_code);
			return rmk_wind_resultado;
		}
		
		else{
			return "nopista";
		}
	}
}

function rmk_wind(termino_viento_rmk, tipo_rmk, rmk_wind_completo){		//CONDICIONES DE VIENTO EN RMK
	wind_reg_exp = /^(\D{3}|\d{3})(P)?(\d{2})(G)?(P)?(\d{2})?(\D{2})(=)?$/;	
	var rmk_largo = termino_viento_rmk.length;	//Los de longitud 7 y 8 no llevan rachas y los de longitud 10 y 11 llevan rachas
	var direccion;
	var velocidad;
	var unidades;
	var rachas;
	var result1;
	var result2;
	var result3;
	var result4;	
	var P;
	var G;						//Declaramos todas las variables necesarias
	var rmk_wind_end = 0;
	
	if (wind_reg_exp.test(termino_viento_rmk) == true){

		if (termino_viento_rmk.charAt(rmk_largo-1) == "="){
			rmk_wind_end = 1;
			termino_viento_rmk = termino_viento_rmk.substr(0,rmk_largo-1);
		}
		
		if (rmk_wind_completo.charAt(rmk_wind_completo.length-1) == "="){
			rmk_wind_end = 1;
			rmk_wind_completo = rmk_wind_completo.substr(0,rmk_wind_completo.length-1);
		}

		rmk_largo = termino_viento_rmk.length;
			
		if (rmk_largo == 7) {		//viento variable o no, sin rachas y menor de 100 nudos
		direccion = termino_viento_rmk.slice(0,3);	//IDENTIFICAMOS CADA VARIABLE
		velocidad = termino_viento_rmk.slice(3,5);
		unidades = termino_viento_rmk.slice(5);			
		result1 = wind_direction (direccion, rmk_largo, rmk_wind_completo);	//COMPROBAMOS LA DIRECCIÓN
	
			if (result1 == 0){
				return 0;
			}
		
			result2 = wind_speed (velocidad, result1, rmk_wind_completo);	//COMPROBAMOS LA VELOCIDAD
	
			if (result2 == 0){
				return 0;
			} 
		
			result3 = wind_units (unidades, result2, rmk_wind_completo);					//COMPROBAMOS LAS UNIDADES
		
			if (result3 === 0){
				return 0;
			}
		}
			
		else if (rmk_largo == 8){		//VIENTO VARIABLE O NO DE MÁS DE 100 NUDOS
			direccion = termino_viento_rmk.slice(0,3);	//IDENTIFICAMOS CADA VARIABLE
			velocidad = termino_viento_rmk.slice(4,6);
			unidades = termino_viento_rmk.slice(6);		
			P = termino_viento_rmk.charAt(3);
			result1 = wind_direction(direccion,rmk_largo, rmk_wind_completo);	//COMPROBAMOS LA DIRECCIÓN
	
			if (result1 == "nocalm") {
			
				if (P == "P"){						//COMPROBAMOS LA P
			
					if (velocidad == 99){			//COMPROBAMOS LA VELOCIDAD
						result3 = wind_units (unidades, "calmok", rmk_wind_completo);					//COMPROBAMOS LAS UNIDADES
					
						if (result3 === 0){
							return 0;
						}
					}
				
					else{
						salida_texto("<span style='color:red; font-weight:bold'>La velocidad en esta estructura de viento del término " + rmk_wind_completo + " debe ser P99.</span>");
						return 0;
					}
				}
			
				else{
					salida_texto("<span style='color:red; font-weight:bold'>La estructura del término del viento del término " + rmk_wind_completo + " debe llevar una P para velocidades de más de 99 nudos.</span>");
					return 0;
				}
			}
		
			else{
				return 0;
			}
		}
	
		else if (rmk_largo == 10){			//VIENTO VARIABLE O NO CON RACHAS MENORES DE 100 NUDOS
			direccion = termino_viento_rmk.slice(0,3);	//IDENTIFICAMOS CADA VARIABLE
			velocidad = termino_viento_rmk.slice(3,5);
			unidades = termino_viento_rmk.slice(8);		
			G = termino_viento_rmk.charAt(5);
			rachas = termino_viento_rmk.slice(6,8);
			result1 = wind_direction (direccion,rmk_largo, rmk_wind_completo);	//COMPROBAMOS LA DIRECCIÓN
	
			if (result1 == "nocalm") {
				result2 = wind_speed (velocidad, result1, rmk_wind_completo);	//COMPROBAMOS LA VELOCIDAD
		
				if (result2 == "nocalmok"){
					
					if (G == "G"){					//COMPROBAMOS LA G
						result4 = wind_speed (rachas, result1, rmk_wind_completo);		//COMPROBAMOS LAS RACHAS (NÚMEROS)
				
						if (result4 == "nocalmok"){
						
							if (parseInt (rachas) >= parseInt (velocidad) + 10){	//COMPRBAMOS LAS RACHAS (OACI)
								result3 = wind_units (unidades, result4, rmk_wind_completo);		//COMPROBAMOS LAS UNIDADES
								
								if (result3 === 0){
									return 0;
								}
							}
						
							else{
								salida_texto("<span style='color:red; font-weight:bold'>Las rachas deben ser de al menos 10 nudos más que la velocidad media en el término " + rmk_wind_completo + ".</span>");
								return 0;
							}
						}
					
						else {
							return 0;
						}
					}
				
					else {
						salida_texto("<span style='color:red; font-weight:bold'>Esta estructura de rachas del término " + rmk_wind_completo + " debe llevar la letra G.</span>");
						return 0;
					}
				}
			
				else{
					return 0;
				}				
			}
		
			else{
				return 0;
			}
		}
	
		else if (rmk_largo == 11){			//VIENTO
			direccion = termino_viento_rmk.slice(0,3);	//IDENTIFICAMOS CADA VARIABLE
			velocidad = termino_viento_rmk.slice(3,5);
			unidades = termino_viento_rmk.slice(9);		
			G = termino_viento_rmk.charAt(5);
			rachas = termino_viento_rmk.slice(7,9);
			P = termino_viento_rmk.charAt (6)
			result1 = wind_direction (direccion,rmk_largo, rmk_wind_completo);	//COMPROBAMOS LA DIRECCIÓN
	
			if (result1 == "nocalm") {
				result2 = wind_speed (velocidad, result1, rmk_wind_completo);	//COMPROBAMOS LA VELOCIDAD (NÚMEROS)
		
				if (result2 == "nocalmok"){
				
					if (G == "G"){							//COMPROBAMOS LA G
				
						if (P == "P"){						//COMPROBAMOS LA P
					
							if (velocidad == 99){			//COPROBAMOS LA VELOCIDAD
								result3 = wind_units (unidades, "calmok", rmk_wind_completo);					//COMPROBAMOS LAS UNIDADES
							
								if (result3 === 0){
									return 0;
								}
							}
						
							else{
								salida_texto("<span style='color:red; font-weight:bold'>La velocidad en esta estructura del término " + rmk_wind_completo + " debe ser P99.</span>");
								return 0;
							}
						}
					
						else {
							salida_texto("<span style='color:red; font-weight:bold'>Esta estructura del término " + rmk_wind_completo + " debe llevar la letra P para la velocidad mayor de 99 nudos.</span>");
							return 0;
						}
					}
					
					else {
						salida_texto("<span style='color:red; font-weight:bold'>Esta estructura de rachas del término " + rmk_wind_completo + " debe llevar la letra G.</span>");
						return 0;
					}
				}
			
				else {
					return 0;
				}
			}
		
			else {
				return 0;
			}	
		}

		if (rmk_wind_end === 1){
			return "end";
		}
	
		else{
			return true;
		}		
	}
		
	else {	//ESTRUCTURAS DE VIENTO NO VÁLIDAS
		return 0;
	}			
}

function rmk_wind_var (rmk_viento_variable, rmk_viento_previo){			//CONDICIONES DE VIENTO VARIABLE EN RMK

	rmk_viento_variable_reg_exp = /^(\d{3})(V)(\d{3})(=)?$/;	//VARIABLE TIPO PARA COMPARAR
	
	if (rmk_viento_variable_reg_exp.test(rmk_viento_variable) == true){
	
		if (rmk_viento_variable.charAt(rmk_viento_variable.length - 1) == "="){
			rmk_viento_variable_end = 1;
			rmk_viento_variable = rmk_viento_variable.substr(0, rmk_viento_variable.length -1);
		}
	
		else{
			rmk_viento_variable_end = 0;
		}
	
		if (rmk_viento_previo == "NOWIND"){
			salida_texto("<span style='color:red; font-weight:bold'>No es posible el análisis de las condiciones del viento variable al no haber un término de viento correcto.</span>");
			return 0;
		}
	
		if (rmk_viento_previo.slice(0,3) == "VRB"){	//COMPROBAMOS PARA CUMPLIR CON OACI (IMPOSIBLE VRB + VARIACIONES)
			salida_texto("<span style='color:red; font-weight:bold'>El término de variaci\u00F3n de direcci\u00F3n del viento " + rmk_viento_variable + " no puede aparecer con un viento VRB.</span>");
			return 0;
		}	
		
		else if (rmk_viento_previo.charAt(3) != "P" && parseInt(rmk_viento_previo.slice(3,5)) < 3){
			salida_texto("<span style='color:red; font-weight:bold'>El término de variaci\u00F3n de direcci\u00F3n del viento " + rmk_viento_variable + " no puede aparecer con un viento menor de 3 nudos.</span>");
			return 0;
		}								//COMPROBAMOS PARA CUMPLIR CON OACI (IMPOSIBLE MENOS DE 3 NUDOS + VARIACIONES)
				
		else {
			
			if (rmk_viento_variable.charAt(2) != 0 || rmk_viento_variable.charAt(6) != 0){	//DIRECCIONES ACABADAS EN 0
				salida_texto("<span style='color:red; font-weight:bold'>Las direcciones del viento en " + rmk_viento_variable + " deben ir de 10 en 10 grados.</span>");
				return 0;
			}	
			
			else{
				
				if (parseInt(rmk_viento_variable.slice(0,3)) == 0 || parseInt(rmk_viento_variable.slice(4)) == 0){	//DIRECCIONES ENTRE 010 Y 360 GRADOS
					salida_texto("<span style='color:red; font-weight:bold'>Las direcciones del viento en " + rmk_viento_variable + " deben ser mayores de 0 grados.</span>");
					return 0;
				}
					
				else if (parseInt(rmk_viento_variable.slice(0,3)) >360 || parseInt(rmk_viento_variable.slice(4)) >360){
					salida_texto("<span style='color:red; font-weight:bold'>Las direcciones del viento en " + rmk_viento_variable + " deben ser menores de 360 grados.</span>");
					return 0;
				}
				
				else {
					
					if (parseInt(rmk_viento_variable.slice(0,3)) < parseInt(rmk_viento_variable.slice(4))){
						
						if (Math.abs( parseInt (rmk_viento_variable.slice(0,3)) - parseInt (rmk_viento_variable.slice(4))) < 60 ){		//DIFERENCIA DE DIRECCIONES ENTRE 60 Y 180 GRADOS
							salida_texto("<span style='color:red; font-weight:bold'>La variaci\u00F3n de la direcci\u00F3n del viento en " + rmk_viento_variable + " debe ser al menos de 60 grados.</span>");
							return 0;
						}
			
						else if (Math.abs(parseInt (rmk_viento_variable.slice(0,3)) - parseInt (rmk_viento_variable.slice(4))) >180 ){
							salida_texto("<span style='color:red; font-weight:bold'>La variaci\u00F3n de la direcci\u00F3n del viento en " + rmk_viento_variable + " debe ser como mucho de 180 grados.</span>");
							return 0;
						}

						else{
							salida_texto( "La variaci\u00F3n de la direcci\u00F3n del viento en " + rmk_viento_variable + " es correcta");
							
							if (rmk_viento_variable_end === 0){
								return true;
							}
							
							else if (rmk_viento_variable_end === 1){
								return "end";
							}
						}
					}
					
					else{
						
						if ((360 - parseInt (rmk_viento_variable.slice(0,3))) + parseInt (rmk_viento_variable.slice(4)) < 60 ){		//DIFERENCIA DE DIRECCIONES ENTRE 60 Y 180 GRADOS
							salida_texto("<span style='color:red; font-weight:bold'>La variaci\u00F3n de la direcci\u00F3n del viento en " + rmk_viento_variable + " debe ser al menos de 60 grados.</span>");
							return 0;
						}
			
						else if ((360 - parseInt (rmk_viento_variable.slice(0,3))) + parseInt (rmk_viento_variable.slice(4)) >180 ){
							salida_texto("<span style='color:red; font-weight:bold'>La variaci\u00F3n de la direcci\u00F3n del viento en " + rmk_viento_variable + " debe ser como mucho de 180 grados.</span>");
							return 0;
						}

						else{
							salida_texto("La variaci\u00F3n de la direcci\u00F3n del viento en " + rmk_viento_variable + " es correcta.");
							
							if (rmk_viento_variable_end === 0){
								return true;
							}
							
							else if (rmk_viento_variable_end === 1){
								return "end";
							}
						}
					}
				}
			}	
		}	
	}
	
	else {
		return false;		//VARIABLE PARA COMPROBAR SI EL TÉRMINO QUE HA ENTRADO A COMPARARSE ERA DE TEMPERATURA O NO
	}
}	

