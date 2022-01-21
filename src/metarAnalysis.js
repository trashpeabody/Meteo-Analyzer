const metarAnalysis = () => {

}
function detectar (metar_codigo, metar_type, localizacion, localizacion2){		//función que guía el proceso de análisis. variables de entrada: el mensaje, tipo de metar, localización del último término correcto, e índice del mensaje que toca analizar
		tsig[indice_t_sign] = "AA";
		clouds_array[indice_nubes] = "AAA00";
		rvr_array[indice_rvr] = "RAA/AAA";
		visibilidad_vertical= "VV000";

		
		else if (metar_comp == true){	//VIENTO variable_analizada CORRECTO = CASO1_1
		
			if (metar_indice == metar_codigo.length-1){
				errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de visibilidad y nubes (o CAVOK), temperatura, QNH y si corresponde TREND.";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
				
			else{
				errores_importantes[8]="";
				caso1 = 1;
				localizacion = 1;
				ultimo_true = 1;
				metar_indice++;
			}
		}
	
		else if (metar_comp == false){		//NO ES VIENTO variable
			metar_comp = average_visibility (variable_analizada);
			
			if (metar_comp === 0){		//VISIBILIDAD CON ERRORES
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					metar_visibilidad = "NOVIS";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					metar_visibilidad = "NOVIS";
					errores_importantes[8]="";
					caso1 = 2;
					localizacion = 1;
					ultimo_true = 1;
					metar_indice++;
					errores_importantes[0] = "";
				}
			}
		
			else if (metar_comp == true){			//VISIBILIDAD CORRECTA = CASO1_2
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					metar_visibilidad = variable_analizada;
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					caso1 = 2;
					metar_visibilidad = variable_analizada;
					localizacion = 1;
					ultimo_true = 1;
					metar_indice++;
					errores_importantes[0] = "";
				}
			}
		
			else if (metar_comp == false){		//NO ES VISIBILIDAD
			
				var metar_cavok = /^(CAVOK)(=)?$/;
			
				if (metar_cavok.test(variable_analizada) == false){		//CAVOK INCORRECTO
					errores_importantes[0] = ("Es obligatoria la presencia de un término de visibilidad o CAVOK, sin embargo no se ha detectado que cumpla la estructura de ninguno de ellos.");
					metar_visibilidad = "NOVIS";
					caso2 = 0;
					control_nub = 10;	
					caso1 = 4;
					localizacion = 1;
				}
			
				else{		//CAVOK CORRECTO = CASO1_3
				
					if (metar_indice == metar_codigo.length-1){
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de temperatura, QNH y si corresponde TREND.";
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						salida_texto("El término CAVOK es correcto.");
						metar_visibilidad = 10000;	//asignamos valor a la visibilidad para su análisis posteriro
						caso2 = 0;					//evitamos pasar por análisis del caso 2 
						metar_indice++;
						control_nub = 10;			
						caso1 = 3;
						localizacion = 1;
						ultimo_true = 1;
						errores_importantes[0] = "";
						errores_importantes[1] = "";
						skipper = 1;
					}
				}
			}
		}
	}	

	if (localizacion === 1){	
		variable_analizada = metar_codigo[metar_indice].toString();
	
		if (caso1 == 1){				//PRIMER TÉRMINO DE VIENTO VARIABLE
			metar_comp = average_visibility (variable_analizada);
		
			if (metar_comp === 0){			//VISIBILIDAD CON ERRORES
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					metar_visibilidad = "NOVIS";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					caso2 = 1;
					metar_visibilidad = "NOVIS";
					localizacion = 2;
					ultimo_true = 2;
					metar_indice++;
					errores_importantes[0] = "";
				}
			}
		
			else if (metar_comp == true){		//VISBILIDAD CORRECTA = CASO2_1
			
				if (metar_indice == metar_codigo.length-1){
					metar_visibilidad = variable_analizada;
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					caso2 = 1;
					metar_visibilidad = variable_analizada;
					localizacion = 2;
					ultimo_true = 2;
					metar_indice++;
					errores_importantes[0] = "";
				}
			}
		
			else if (metar_comp == false){	//NO ES VISIBILIDAD
			
			var metar_cavok = /^(CAVOK)(=)?$/;
			
				if (metar_cavok.test(variable_analizada) == false){		//CAVOK INCORRECTO
					errores_importantes[0] = ("Es obligatoria la presencia de un término de visibilidad o CAVOK, sin embargo no se ha detectado que cumpla la estructura de ninguno de ellos.");
					metar_visibilidad = "NOVIS";
					control_nub = 10;
					caso2 = 3;
					localizacion = 2;
				}

				else{	//CAVOK CORRECTO = CASO2_2
				
					if (metar_indice == metar_codigo.length-1){
						salida_texto("El término CAVOK es correcto.");
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de temperatura, QNH y si corresponde TREND.";
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						salida_texto("El término CAVOK es correcto.");
						metar_visibilidad = 10000;
						control_nub = 10;
						caso2 = 2;
						localizacion = 2;
						ultimo_true = 2;
						metar_indice++;
						errores_importantes[0] = "";
						errores_importantes[1] = "";
						skipper = 1;
					}
				}
			}
		}
	

		else if (caso1 == 2){	//PRIMER TÉRMINO VISBILIDAD
			metar_comp = min_visibility (variable_analizada, metar_visibilidad);

			if (metar_comp === 0){			//VISIBILIDAD MÍNIMA CON ERRORES
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					caso2 = 0;
					localizacion = 3;
					ultimo_true = 3;
					metar_indice++;
				}
			}
		
			else if (metar_comp == true){		//VISIBILIDAD MÍNIMA CORRECTA
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					caso2 = 0;
					metar_indice++;
					localizacion = 3;
					ultimo_true = 3;
				}
			}
		
			else if (metar_comp == false){	//NO ES VISIBILIDAD MÍNIMA
				caso2 = 0;
				localizacion = 3;
			}
		}
	
		else if (caso1 == 4){				
			variable_analizada = metar_codigo[metar_indice].toString();
			metar_comp = min_visibility (variable_analizada, metar_visibilidad);
		
			if (metar_comp === 0){			//VISIBILIDAD MÍNIMA CON ERRORES
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					metar_indice = 3;
					localizacion = 3;
					ultimo_true = 3;
					metar_indice++;
				}
			}
		
			else if (metar_comp == true){		//VISBILIDAD MÍNIMA CORRECTA 
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					metar_indice = 3;
					localizacion = 3;
					ultimo_true = 3;
					metar_indice++;
				}
			}
		
			else if (metar_comp == false){	//NO ES VISIBILIDAD MÍNIMA
				localizacion = 3;
			}
		}
	
		else if (caso1 === 3){		//RECUPERAMOS EL CASO DE CAVOK JUSTO DESPUÉS DEL TÉRMINO DE VIENTO
			metar_indice = 2;
			localizacion = 6;
			ultimo_true = 6;
		}
	}	
		
	if (localizacion === 2){	
	
		if (caso2 == 1){	//PRIMER TÉRMINO VIENTO VARIABLE Y SEGUNDO VISIBILIDAD
			variable_analizada = metar_codigo[metar_indice].toString();
			metar_comp = min_visibility (variable_analizada, metar_visibilidad);
		
			if (metar_comp === 0){			//VISIBILIDAD MÍNIMA CON ERRORES
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					localizacion = 3;
					ultimo_true = 3;
					metar_indice++;
				}
			}
		
			else if (metar_comp == true){		//VISBILIDAD MÍNIMA CORRECTA 
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					localizacion = 3;
					ultimo_true = 3;
					metar_indice++;
				}
			}
			
			else if (metar_comp == false){	//NO ES VISIBILIDAD MÍNIMA
				metar_indice = 3;
				localizacion = 3;
			}
		}
	
		else if (caso2 == 3){	
			variable_analizada = metar_codigo[2].toString();
			metar_comp = min_visibility (variable_analizada, metar_visibilidad);
		
			if (metar_comp === 0){			//VISIBILIDAD MÍNIMA CON ERRORES
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					localizacion = 3;
					ultimo_true = 3;
					metar_indice++;
				}
			}
		
			else if (metar_comp == true){		//VISBILIDAD MÍNIMA CORRECTA 
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					localizacion = 3;
					ultimo_true = 3;
					metar_indice++;
				}
			}
		
			else if (metar_comp == false){	//NO ES VISIBILIDAD MÍNIMA
				metar_indice = 2;
				localizacion = 3;
			}
		}	
	
		else if (caso2 === 2){		//RECUPERAMOS EL CASO DE CAVOK JUSTO DESPUÉS DEL TÉRMINO DE VIENTO VARIABLE
			metar_indice = 3;
			localizacion = 6;
			ultimo_true =6;
		}
	}			

	if (skipper === 0){		

		for (meteo_b = metar_indice; meteo_b < 40; meteo_b++){					//BUCLE PARA IR PROBANDO TÉRMINOS EN RVR, TIEMPO SIGN Y NUBES
			variable_analizada = metar_codigo[meteo_b].toString();
	
			if (localizacion === 3){	
				metar_comp = rwy_visual_range (variable_analizada, rvr_array, metar_rvr_n);

				if (metar_comp === 0){		//RVR CON ERRORES
				
					if (meteo_b == metar_codigo.length-1){
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
						rvr_array[indice_rvr] = "RAA/AAA";
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						rvr_array[indice_rvr] = "RAA/AAA";
						indice_rvr++;
						metar_rvr_n++;
						ultimo_true = 3;
					}
				}
			
				else if (metar_comp == true){			//RVR CORRECTO AÑADIMOS 1 RVR

					if (meteo_b == metar_codigo.length-1){
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
						rvr_array[indice_rvr] = variable_analizada;
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						rvr_array[indice_rvr] = variable_analizada;
						indice_rvr++;
						metar_rvr_n++;
						ultimo_true = 3;
					}
				}
		
				else if (metar_comp == false){		//NO ES RVR. SKIPPER = 1 EQUIVALE A PROBAR TIEMPO SIGN
					localizacion = 4;
				}
			}
	
			if (localizacion === 4){				//TIEMPO SIGNIFICATIVO
				metar_comp = weather (variable_analizada, tsig, metar_visibilidad, metar_signi_n);
		
				if (metar_comp === 0){		//TIEMPO SIGNIFICATIVO CON ERRORES
				
					if (meteo_b == metar_codigo.length-1){
						tsig[indice_t_sign] = "AA";
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						tsig[indice_t_sign] = "AA";
						indice_t_sign++;
						metar_signi_n++;
						ultimo_true = 4;
					}
				}
					
				else if (metar_comp == true){		//TIEMPO SIGNIFICATIVO CORRECTO. AÑADIMOS UN TERMINO A SIGNI
				
					if (meteo_b	== metar_codigo.length-1){
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de nubes, temperatura, QNH y si corresponde TREND.";
						tsig[indice_t_sign] = variable_analizada;
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						tsig[indice_t_sign] = variable_analizada;
						indice_t_sign++;
						metar_signi_n++;
						ultimo_true = 4;
					}
				}
		
				else if (metar_comp == false){	//NO ES DE TIEMPO SIGNIFICATIVO. SKIPPER = 2 EQUIVALE A PROBAR NUBES
					localizacion = 5;
				}
			}
		
			if (localizacion === 5){	//PROBAMOS NUBES
				metar_comp = cloud (variable_analizada, clouds_array, metar_nub_n, nubes_convectivas);
		
				if (metar_comp === 0){			//NUBES CON ERRORES
				
					if (meteo_b == metar_codigo.length-1){
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de temperatura, QNH y si corresponde TREND.";
						clouds_array[indice_nubes] = "AAA00";
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						clouds_array[indice_nubes] = "AAA00";
						indice_nubes++;
						metar_nub_n++;
						ultimo_true = 5;
						errores_importantes[1]="";
					}
				}
				
				else if (metar_comp === 1){		//NUBES CORRECTO. AÑADIMOS 1 A NUB
				
					if (meteo_b == metar_codigo.length-1){
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de temperatura, QNH y si corresponde TREND.";
						clouds_array[indice_nubes] = variable_analizada;
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						nubes_convectivas++;
						clouds_array[indice_nubes] = variable_analizada;
						indice_nubes++;
						ultimo_true = 5;
						errores_importantes[1]="";
					}
				}
				
				else if (metar_comp == true){		//NUBES CORRECTO. AÑADIMOS 1 A NUB
				
					if (meteo_b == metar_codigo.length-1){
						errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de temperatura, QNH y si corresponde TREND.";
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{
						errores_importantes[8]="";
						clouds_array[indice_nubes] = variable_analizada;
						indice_nubes++;
						metar_nub_n++;
						ultimo_true = 5;
						errores_importantes[1]="";
					}
				}
			
				else if (metar_comp == false){	//NO ES DE NUBES. SACAMOS EL ÍNDICE Y UN CONTROLADOR (SI HAY NUBES NO HABRÁ VV O NCD)
					control_nub = metar_nub_n;
					metar_indice = meteo_b;
					meteo_b = 40;
					localizacion = 6;
				}
			}
		}	
	}
	
	if (control_nub === 0 && nubes_convectivas === 0){			//ESTE CONTROLADOR INDICA QUE NO HAY TÉRMINOS DE NUBES
		variable_analizada = metar_codigo[metar_indice].toString();
		metar_comp = vertical (variable_analizada);		//PROBAMOS CON LA VISIBILIDAD VERTICAL
		
		if (metar_comp === 0){				//VISIBILIDAD VERTICAL CON ERRORES
		
			if (metar_indice == metar_codigo.length-1){
				errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de temperatura, QNH y si corresponde TREND.";
				visibilidad_vertical = "NOVERTICAL";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
				
			else{
				errores_importantes[8]="";
				visibilidad_vertical = "NOVERTICAL";
				metar_vvertical_n = 1;
				metar_indice++;
				localizacion = 6;
				ultimo_true = 6;
				errores_importantes[1]="";
			}
		}
		
		else if (metar_comp == true){			//VISIBILIDAD VERTICAL CORRECTA, AVANZAMOS EL ÍNDICE EN 1
		
			if (metar_indice == metar_codigo.length-1){
				errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de temperatura, QNH y si corresponde TREND.";
				visibilidad_vertical = variable_analizada;
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
				
			else{
				errores_importantes[8]="";
				visibilidad_vertical = variable_analizada;
				metar_vvertical_n = 1;
				metar_indice++;
				localizacion = 6;
				ultimo_true = 6;
				errores_importantes[1]="";
			}
		}
		
		else if (metar_comp == false){		//NO HAY VISIBILIDAD VERTICAL
		metar_vvertical_n = 0;
		visibilidad_vertical = "VV0000";
			
			if (variable_analizada != "NSC"){	//PROBAMOS CON NSC
				errores_importantes[1] = ("Es obligatorio que haya un término de nubes, visibilidad vertical o NSC.");
				localizacion = 6;
			}
			
			else if (variable_analizada == "NSC"){	//NSC CORRECTO, AVANZAMOS EL ÍNDICE EN 1
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de temperatura, QNH y si corresponde TREND.";
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[8]="";
					salida_texto("El término de nubes NSC es correcto.");
					metar_indice++;
					localizacion = 6;
					ultimo_true = 6;
					errores_importantes[1] = "";
				}
			}
		}
	}

	if (localizacion === 6){		
		variable_analizada = metar_codigo[metar_indice].toString();	
		metar_comp = temperature (variable_analizada);		//ANALIZAMOS LA TEMPERATURA
	
		if (metar_comp === 0){		//TEMPERATURA CON ERRORES
		
			if (metar_indice == metar_codigo.length-1){
				errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de QNH y si corresponde TREND.";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
				
			else{
				errores_importantes[8]="";
				metar_indice++;
				localizacion = 7;
				ultimo_true = 7;
				errores_importantes[2] = "";
			}
		}
	
		else if (metar_comp == true){	//TEMPERATURA CORRECTA, AUMENTAMOS EL ÍNDICE EN 1
		
			if (metar_indice == metar_codigo.length-1){
				errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de QNH y si corresponde TREND.";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
				
			else{				
				errores_importantes[8]="";
				metar_indice++;
				localizacion = 7;
				ultimo_true = 7;
				errores_importantes[2] = "";
			}
		}
	
		else if (metar_comp == false){	//NO HAY TEMPERATURA, LO CUAL ES UN ERROR
			errores_importantes[2] = ("El término de temperatura es obligatorio, y no se ha detectado ningún término que sea de temperatura ambiente y temperatura de rocío.");
			localizacion = 7;
		}	
	}	

	if (localizacion === 7){	
		variable_analizada = metar_codigo[metar_indice].toString();	
		metar_comp = presion (variable_analizada);		//ANALIZAMOS EL QNH
	
		if (metar_comp === 0){		//QNH CON ERRORES
		
			if (metar_indice == metar_codigo.length-1){
				errores_importantes[3] = "";
			
				if (metar_type == "TREND"){			
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else if (metar_type == "RMK"){
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else{			
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}
				
			else{		
				metar_indice++;
				localizacion =8;	
				ultimo_true = 8;
				errores_importantes[3] = "";
			}
		}
	
		else if (metar_comp == true){	//QNH CORRECTO, AUMENTAMOS EL ÍNDICE EN 1
		
			if (metar_indice == metar_codigo.length-1){
				errores_importantes[3] = "";
			
				if (metar_type == "TREND"){			
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else if (metar_type == "RMK"){
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else{			
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}
				
			else{
				metar_indice++;
				localizacion = 8;
				ultimo_true = 8;
				errores_importantes[3] = "";
			}
		}
	
		else if (metar_comp == false){	//NO HAY QNH, LO CUAL ES UN ERROR
			errores_importantes[3] = ("El término de QNH es obligatorio pero no se ha encontrado ningún término que cumpla con dicha estructura.");
			localizacion =8;
		}
	
		else if (metar_comp == "end"){
			errores_importantes[3] = "";
			
			if (metar_type == "TREND"){			
				errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		
			else if (metar_type == "RMK"){
				errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		
			else{			
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		}
	}	

	if (localizacion == 8){	
		
		for (reci_b = metar_indice; reci_b < 40; reci_b++){		
			variable_analizada = metar_codigo[reci_b].toString();

			if (reci_b === 0){
				anterior = "AA";
			}
			
			else{
				anterior = metar_codigo[reci_b-1].toString();
			}
					
			metar_comp = meteoreciente (variable_analizada, anterior, metar_recientes_1);		//ANALIZAMOS FENÓMENOS RECIENTES EN BUCLE
	
			if (metar_comp === 0){		//RECIENTES CON ERRORES CON ERRORES
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[3] = "";
			
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
		
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
				
				else{
					metar_recientes_1++;
				}
			}
	
			else if (metar_comp == true){		//RECIENTES CORRECTOS
			
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[3] = "";
			
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
		
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
				
				else{
					metar_recientes_1++;
				}
			}
	
			else if (metar_comp == false){	//NO HAY RECIENTES
				metar_indice = reci_b;
				reci_b = 40;
				localizacion = 9;
			}	
		
			else if (metar_comp == "end"){
		
				if (metar_type == "TREND"){			
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else if (metar_type == "RMK"){
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else{			
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}
		}
	}	
		
	for (ciza_b = metar_indice; ciza_b < 50; ciza_b++){				//ANALIZAMOS POSIBLES TÉRMINOS DE CIZALLADURA DE VIENTO
		variable_analizada = metar_codigo[ciza_b].toString();	
		
		
		if (localizacion === 9){	
			metar_comp = cizalla1 (variable_analizada);				//COMPROBAMOS QUE EMPIEZAN POR WS QUE INDICARÍA QUE ES CIZALLADURA
	
			if (metar_comp == true){						//HAY CIZALLADURA, PROBAMOS EL SIGUIENTE TÉRMINO SI ES ALL (WS ALL RWY) O UNA PISTA RDD
			
				if (ciza_b == metar_codigo.length-1){
					salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura de viento WS está incompleto.</span>");
			
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
		
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
				
				else{
					ciza_b++;
					variable_analizada = metar_codigo[ciza_b].toString();
					metar_comp = cizalla2 (variable_analizada, metar_cizalla_n);
			
					if (metar_comp === 0){					//HAY ALGÚN ERROR EN LA CIZALLADURA
					
						if (ciza_b == metar_codigo.length-1){
				
							if (metar_type == "TREND"){			
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
				
							else if (metar_type == "RMK"){
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
						
							else{			
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
						}
				
						else{
							ciza_b++;
							variable_analizada = metar_codigo[ciza_b].toString();
							metar_comp = cizalla3 (variable_analizada);
				
							if (metar_comp == true){				//EL TÉRMINO ES DE CIZALLADURA WS ALL RWY Y CORRECTO ASÍ QUE SALIMOS DEL BUCLE
							
								if (ciza_b == metar_codigo.length-1){
					
									if (metar_type == "TREND"){			
										errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
										salida_texto_2(errores_importantes, elementos_evitados);
										return;
									}
						
									else if (metar_type == "RMK"){
										errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
										salida_texto_2(errores_importantes, elementos_evitados);
										return;
									}
								
									else{			
										salida_texto_2(errores_importantes, elementos_evitados);
										return;
									}
								}
								
								else{
									metar_indice = ciza_b+1;
									ciza_b = 50;
									localizacion = 12;
									ultimo_true = 12;
								}
							}
				
							else if (metar_comp == false){		//NO ES RWY PERO SÍ WS ALL ASÍ QUE ES UN ERROR
								salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura WS ALL RWY no cumple con la estructura requerida.</span>");
								metar_indice = ciza_b+1;
								ciza_b = 50;
								localizacion = 12;
								ultimo_true = 11;
							}
				
							else if (metar_comp == "end"){		//ES WS ALL RWY= ASÍ QUE TERMINA EL mensaje
					
								if (metar_type == "TREND"){			
									errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
									salida_texto_2(errores_importantes, elementos_evitados);
									return;
								}
				
								else if (metar_type == "RMK"){
									errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
									salida_texto_2(errores_importantes, elementos_evitados);
									return;
								}
				
								else{			
									salida_texto_2(errores_importantes, elementos_evitados);
									return;
								}
							}
						}
					}
				
					else if (metar_comp === 1){				//EL TÉRMINO ES ALL ASÍ QUE COMPROBAMOS QUE EL SIGUIENTE SEA RWY
						ciza_b++;
						variable_analizada = metar_codigo[ciza_b].toString();
						metar_comp = cizalla3 (variable_analizada);
					
						if (metar_comp == true){				//EL TÉRMINO ES DE CIZALLADURA WS ALL RWY Y CORRECTO ASÍ QUE SALIMOS DEL BUCLE
							metar_indice = ciza_b+1;
							ciza_b = 50;
							localizacion = 12;
							ultimo_true = 12;
						}
					
						else if (metar_comp == false){		//NO ES RWY PERO SÍ WS ALL ASÍ QUE ES UN ERROR
							salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura WS ALL RWY no cumple con la estructura requerida.</span>");
							metar_indice = ciza_b+1;
							ciza_b = 50;
							localizacion = 12;
							ultimo_true = 11;
						}
					
						else if (metar_comp == "end"){		//ES WS ALL RWY= ASÍ QUE TERMINA EL mensaje
					
							if (metar_type == "TREND"){			
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
			
							else if (metar_type == "RMK"){
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
			
							else{			
								salida_texto("El mensaje introducido es correcto.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
						}
					}
					
					else if (metar_comp === 2){				//ES DE CIZALLADURA EN UNA PISTA CORRECTO
					
						if (ciza_b == metar_codigo.length-1){
						
							if (metar_type == "TREND"){			
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
					
							else if (metar_type == "RMK"){
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
							
							else{			
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
						}
				
						else{
							metar_cizalla_n++;
						}
					}
				
					else if (metar_comp == false){			//ES DE CIZALLADURA EN UNA PISTA PERO LA ESTRUCTURA DE PISTA ES ERRÓNEA
						salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura WS no cumple con la estructura requerida.</span>");
						
						if (ciza_b == metar_codigo.length-1){
							salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura de viento WS está incompleto.</span>");
						
							if (metar_type == "TREND"){			
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
					
							else if (metar_type == "RMK"){
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
							
							else{			
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
						}
				
						else{
							metar_cizalla_n++;
						}
					}
				
					else if (metar_comp == "end"){			//ES DE CIZALLADURA DE PISTA Y CON UN = POR LO QUE TERMINA EL mensaje
					
						if (metar_type == "TREND"){			
							errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
			
						else if (metar_type == "RMK"){
							errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
			
						else{			
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
					}
				}
			}
	
			else if (metar_comp == false){				//NO ES DE CIZALLADURA ASÍ QUE SALIMOS DEL BUCLE
				metar_indice = ciza_b;
				ciza_b = 50;
				localizacion = 12;
			}
		}

		if (localizacion === 10){
			metar_comp = cizalla2 (variable_analizada, metar_cizalla_n);
			
			if (metar_comp === 0){					//HAY ALGÚN ERROR EN LA CIZALLADURA
			
				if (ciza_b == metar_codigo.length-1){
						
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
							
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
									
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
								
				else{
					ciza_b++;
					variable_analizada = metar_codigo[ciza_b].toString();
					metar_comp = cizalla3 (variable_analizada);
				
					if (metar_comp == true){				//EL TÉRMINO ES DE CIZALLADURA WS ALL RWY Y CORRECTO ASÍ QUE SALIMOS DEL BUCLE
					
						if (ciza_b == metar_codigo.length-1){
					
							if (metar_type == "TREND"){			
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
						
							else if (metar_type == "RMK"){
								errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
								
							else{			
								salida_texto_2(errores_importantes, elementos_evitados);
								return;
							}
						}
								
						else{
							metar_indice = ciza_b+1;
							ciza_b = 50;
							localizacion =12;
							ultimo_true = 12;
						}
					}
					
					else if (metar_comp == false){		//NO ES RWY PERO SÍ WS ALL ASÍ QUE ES UN ERROR
						salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura WS ALL RWY no cumple con la estructura requerida.</span>");
						metar_indice = ciza_b+1;
						ciza_b = 50;
						localizacion = 12;
						ultimo_true = 11;
					}
					
					else if (metar_comp == "end"){		//ES WS ALL RWY= ASÍ QUE TERMINA EL mensaje
					
						if (metar_type == "TREND"){			
							errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
			
						else if (metar_type == "RMK"){
							errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
			
						else{			
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
					}
				}
			}
				
			else if (metar_comp === 1){				//EL TÉRMINO ES ALL ASÍ QUE COMPROBAMOS QUE EL SIGUIENTE SEA RWY
				ciza_b++;
				variable_analizada = metar_codigo[ciza_b].toString();
				metar_comp = cizalla3 (variable_analizada);
				
				if (metar_comp == true){				//EL TÉRMINO ES DE CIZALLADURA WS ALL RWY Y CORRECTO ASÍ QUE SALIMOS DEL BUCLE
					metar_indice = ciza_b+1;
					ciza_b = 50;
					localizacion = 12;
					ultimo_true = 12;
				}
				
				else if (metar_comp == false){		//NO ES RWY PERO SÍ WS ALL ASÍ QUE ES UN ERROR
					salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura WS ALL RWY no cumple con la estructura requerida.</span>");
					metar_indice = ciza_b+1;
					ciza_b = 50;
					localizacion = 12;
					ultimo_true = 11;
				}
				
				else if (metar_comp == "end"){		//ES WS ALL RWY= ASÍ QUE TERMINA EL mensaje
				
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
		
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
		
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
			}
				
			else if (metar_comp === 2){				//ES DE CIZALLADURA EN UNA PISTA CORRECTO
			
				if (ciza_b == metar_codigo.length-1){
					
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
						
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
								
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
								
				else{
					metar_cizalla_n++;
				}
			}
			
			else if (metar_comp == false){			//ES DE CIZALLADURA EN UNA PISTA PERO LA ESTRUCTURA DE PISTA ES ERRÓNEA
				salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura WS no cumple con la estructura requerida.</span>");
				
				if (ciza_b == metar_codigo.length-1){
					
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
						
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
							
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
								
				else{
					metar_cizalla_n++;
				}
			}
			
			else if (metar_comp == "end"){			//ES DE CIZALLADURA DE PISTA Y CON UN = POR LO QUE TERMINA EL mensaje
				
				if (metar_type == "TREND"){			
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else if (metar_type == "RMK"){
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else{			
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}
		}
	
		else if (localizacion === 11){
			metar_comp = cizalla3 (variable_analizada);
				
			if (metar_comp == true){				//EL TÉRMINO ES DE CIZALLADURA WS ALL RWY Y CORRECTO ASÍ QUE SALIMOS DEL BUCLE
				metar_indice = ciza_b+1;
				ciza_b = 50;
				localizacion = 12;
				ultimo_true = 12;
			}
				
			else if (metar_comp == false){		//NO ES RWY PERO SÍ WS ALL ASÍ QUE ES UN ERROR
				salida_texto("<span style='color:red; font-weight:bold'>El término de cizalladura WS ALL RWY no cumple con la estructura requerida.</span>");
				metar_indice = ciza_b+1;
				ciza_b = 50;
				localizacion = 12;
				ultimo_true = 11;
			}
				
			else if (metar_comp == "end"){		//ES WS ALL RWY= ASÍ QUE TERMINA EL mensaje
				
				if (metar_type == "TREND"){			
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else if (metar_type == "RMK"){
					errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else{			
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}
		}
	}
		
	if (localizacion === 12){
	
		for (pist_b=metar_indice; pist_b < 80; pist_b++){				//BUCLE PARA COMPROBAR SI HAY TÉRMINOS QUE INDIQUEN EL ESTADO DE UNA PISTA
			variable_analizada = metar_codigo[pist_b].toString();
			metar_comp = estadopista(variable_analizada);
		
			if (metar_comp === 0){						//ERROR EN ALGUNO DE LOS NÚMEROS DEL TÉRMINO
			
				if (metar_indice == metar_codigo.length-1){
						
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
							
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
									
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
								
				else{
				}
			}
		
			else if (metar_comp === 3){					//ES UN R/SNOCLO POR LO QUE SALIMOS DEL BUCLE
			
				if (metar_indice == metar_codigo.length-1){
						
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
							
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
									
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
								
				else{
					metar_indice = pist_b+1;
					pist_b = 80;
					localizacion = 13;
					ultimo_true = 13;
				}
			}
		
			else if (metar_comp == false){				//NO HAY TÉRMINOS DE ESTADO DE PISTA
				metar_indice = pist_b;
				pist_b = 80;
				localizacion = 13;
			}	
			
			else if (metar_comp == true){
				
				if (metar_indice == metar_codigo.length-1){
						
					if (metar_type == "TREND"){			
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite TREND pero no se ha incluido ningún término de tendencia.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
							
					else if (metar_type == "RMK"){
						errores_importantes[4] = ("El aeropuerto indicado en el mensaje emite RMK pero no se ha incluido ningún término de este grupo.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
									
					else{			
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
				}
								
				else{
				}
			}
		}
	}	
		
	if (metar_type == "TREND"){	
		
		if (localizacion === 13){
			variable_analizada = metar_codigo[metar_indice].toString();
			metar_comp = temporal (variable_analizada);
		
			if (metar_comp == "end"){
				errores_importantes[4] ="";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
			
			else if (metar_comp === 1){
				errores_importantes[4]="";
				salida_texto("<span style='color:red; font-weight:bold'>El mensaje debería haber terminado en el término NOSIG.</span>");

				for (metar_bucle_evitados = metar_indice+1; metar_bucle_evitados < metar_codigo.length; metar_bucle_evitados++){
						elementos_evitados[indice_error] = metar_codigo[metar_bucle_evitados].toString();
						indice_error++;
				}

				salida_texto_2(errores_importantes, elementos_evitados);	
				return;
			}
	
			else if (metar_comp === 2 && metar_indice == metar_codigo.length-1){
				errores_importantes[4]="";
				
				if (variable_analizada.charAt(variable_analizada.length-1) == "="){
					variable_analizada = variable_analizada.substr(0,variable_analizada.length-1);
					errores_importantes[10] = ("El término de trend " + variable_analizada + " debe llevar algún término a continuación.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[10] = ("El término de trend " + variable_analizada + " debe llevar algún término a continuación.");
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}					
			
			else if (metar_comp == false){
				
				if (metar_indice == metar_codigo.length-1){
					errores_importantes[4] =("El aeropuerto indicado en el mensaje emite TREND, no obstante no se ha detectado ningún término TEMPO, BECMG o NOSIG.");		//no hay tendencia
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					errores_importantes[4] =("El aeropuerto indicado en el mensaje emite TREND, no obstante no se ha detectado ningún término TEMPO, BECMG o NOSIG.");		//no hay tendencia
					localizacion = 14;
				}
			}
			
			else{
				metar_comprobador_tendencia = 1;
				metar_indice++;				//TEMPO BECMG
				localizacion = 14;
				ultimo_true = 14;
				errores_importantes[4] ="";
			}			
		}	
	
		variable_analizada = metar_codigo[metar_indice].toString();
		
		if (localizacion === 14){
			metar_comp = trend_wind(variable_analizada,metar_viento);
	
			if (metar_comp === 0){		//ERRORES EN EL VIENTO
			
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					metar_indice++;
					localizacion = 15;
					ultimo_true = 15;
				}
			}
		
			else if (metar_comp == true){		//HAY VIENTO ASÍ QUE PASAMOS AL SIGUIENTE TÉRMINO
			
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					metar_indice++;
					localizacion = 15;
					ultimo_true = 15;
				}
			}
		
			else if (metar_comp == false){	//NO HAY VIENTO SEGUIMOS EN EL MISMO TÉRMINO
				localizacion = 15;
			}
		
			else if (metar_comp == "end"){	//VIENTO ACABADO EN =, TERMINA EL mensaje
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		}		
	
		variable_analizada = metar_codigo[metar_indice].toString();
		
		if (localizacion === 15){	
	
			if (variable_analizada == "CAVOK="){	//SI HAY CAVOK NO HAY VISIBILIDAD, Y SI ACABA EN = TERMINA EL mensaje
				salida_texto("El término CAVOK es correcto.");
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		
			else if (variable_analizada == "CAVOK"){	//CAVOK NO ACABA EN =, ANALIZAMOS EL SIGUIENTE TÉRMINO
			
				if (metar_comprobador_tendencia === 1){
					salida_texto("El término CAVOK es correcto.");
					errores_importantes[5] = ("El mensaje introducido debería haber finalizado en CAVOK."); //NO HAY TÉRMINOS DE RMK PERO NO HAY UN = QUE FINALICE EL mensaje
					
					for (metar_bucle_evitados = metar_indice+1; metar_bucle_evitados < metar_codigo.length; metar_bucle_evitados++){
						elementos_evitados[indice_error] =metar_codigo[metar_bucle_evitados].toString();
						indice_error++;
					}
					
					salida_texto_2(errores_importantes, elementos_evitados);
					return;			
				}
				
				else{
					localizacion = 16;
				}
			}		
		
		
			metar_comp = trend_visibility (variable_analizada, metar_visibilidad);	//NO HAY CAVOK, VAMOS 1 A 1
		
			if (metar_comp === 0){		//VISIBILIDAD CON ERRORES
			
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					metar_indice++;
					localizacion = 16;
					ultimo_true = 16;
				}
			}
		
			else if (metar_comp == true){		//VISIBILIDAD CORRECTA, PASAMOS AL SIGUIENTE
			
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					metar_indice++;
					localizacion = 16;
					ultimo_true= 16;
				}
			}
		
			else if (metar_comp == "end"){	//VISIBILIDAD ACABADA EN =, TERMINA EL mensaje
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}	
		
			else if (metar_comp == false){
				localizacion = 16;
			}
		}		

		if (localizacion === 16){
	
			for (t_w_b = metar_indice; t_w_b < 100; t_w_b++){
				variable_analizada = metar_codigo[t_w_b].toString();
				metar_comp = trend_weather(variable_analizada, tsig, metar_indicador_t1, metar_indicador_t2);
		
				if (metar_comp === 0){
					
					if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
					}
				}
		
				else if (metar_comp == "end"){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			
				else if (metar_comp === 1){
					
					if (metar_indice == metar_codigo.length-1){
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
					
					else{
						tsig[indice_t_sign] = variable_analizada;
						indice_t_sign++;
						metar_indicador_t1++;
					}
				}
		
				else if (metar_comp === 2){
					
					if (metar_indice == metar_codigo.length-1){
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
					
					else{
						tsig[indice_t_sign] = variable_analizada;
						indice_t_sign++;
						metar_indicador_t2++;
					}
				}
		
				else if (metar_comp == false){
					no_tiempo_sig = /^(NSW)(=)?$/;
			
					if ((no_tiempo_sig.test(variable_analizada) == true && metar_indicador_t1 != 0) || (no_tiempo_sig.test(variable_analizada) == true && metar_indicador_t2 != 0)){
						salida_texto("<span style='color:red; font-weight:bold'>No puede haber un término de NSW y también términos de tiempo.</span>");
						
						if (metar_indice == metar_codigo.length-1){
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
						
						else{
							metar_indice = t_w_b+1;
							t_w_b=100;
							localizacion = 17;
							ultimo_true = 17;
						}
					}
			
					else if (no_tiempo_sig.test(variable_analizada) == true && variable_analizada.length == 4){
						variable_analizada=variable_analizada.slice(0,3);
						salida_texto("El término "+ variable_analizada + " es correcto.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
			
					else if (no_tiempo_sig.test(variable_analizada) == true && variable_analizada.length == 3){
						salida_texto("El término "+ variable_analizada + " es correcto.");
						
						if (metar_indice == metar_codigo.length-1){
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
						
						else{
							metar_indice = t_w_b+1;
							t_w_b=100;
							localizacion = 17;
							ultimo_true = 17;
						}
					}
			
					else{
						metar_indice = t_w_b;
						t_w_b=100;
						localizacion = 17;
					}
				}
			}
		}	

		if (localizacion === 17){
	
			for (t_c_b=metar_indice; t_c_b < 100; t_c_b++){
				variable_analizada = metar_codigo[t_c_b].toString();
				metar_comp = trend_clouds(variable_analizada, clouds_array);
				
				if (metar_comp === 0){
					
					if (metar_indice == metar_codigo.length-1){
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
						
					else{
						clouds_array[indice_nubes] = "AAA00";
						metar_vvertical_n = 1;
						indice_nubes++;
						metar_indice++;
					}
				}
			
				else if (metar_comp == "end"){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
		
				else if (metar_comp === true){
					
					if (metar_indice == metar_codigo.length-1){
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
						
					else{
						clouds_array[indice_nubes] = variable_analizada;
						metar_vvertical_n = 1;
						indice_nubes++;
						metar_indice++;
					}
				}
		
				else if (metar_comp == false){
					no_nubes = /^(NSC)(=)?$/;
			
					if ((no_nubes.test(variable_analizada) == true && metar_indicador_t1 != 0) || (no_nubes.test(variable_analizada) == true && metar_indicador_t2 != 0)){
						salida_texto("<span style='color:red; font-weight:bold'>No puede haber un término de NSC y también términos de nubes.</span>");
						
						if (metar_indice == metar_codigo.length-1){
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
						
						else{
							metar_indice++;
							metar_vvertical_n = 1;
							t_c_b=100;
							localizacion = 18;
							ultimo_true = 18;
						}
					}
			
					else if (no_nubes.test(variable_analizada) == true && variable_analizada.length == 4){
						variable_analizada = variable_analizada.substr(0, variable_analizada.length-1);
						salida_texto("El término "+ variable_analizada + " es correcto.");
						salida_texto_2(errores_importantes, elementos_evitados);
						return;
					}
			
					else if (no_nubes.test(variable_analizada) == true && variable_analizada.length == 3){
						salida_texto("El término "+ variable_analizada + " es correcto.");
						
						if (metar_indice == metar_codigo.length-1){
							salida_texto_2(errores_importantes, elementos_evitados);
							return;
						}
						
						else{
							metar_indice++;
							metar_vvertical_n = 1;
							t_c_b=100;
							localizacion = 18;
							ultimo_true = 18;
						}
					}
			
					else{
						metar_vvertical_n = 0;
						t_c_b=100;
						localizacion = 18;
					}
				}
			}
		}	

		if (localizacion === 18){	
			variable_analizada = metar_codigo[metar_indice].toString();
			metar_comp = trend_vertical (variable_analizada, visibilidad_vertical, metar_vvertical_n);
			
			if (metar_comp === 0){
		
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					salida_texto("<span style='color:red; font-weight:bold'>Ha habido elementos al final del código que no se han analizado puesto que se ha llegado a la última posición que debería tener un mensaje.</span>");
					
					for (metar_bucle_evitados = metar_indice+1; metar_bucle_evitados < metar_codigo.length; metar_bucle_evitados++){
						elementos_evitados[indice_error] = metar_codigo[metar_bucle_evitados].toString();
						indice_error++;
					}
					
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}
	
			else if (metar_comp == "end"){
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
	
			else if (metar_comp == true){
		
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
					
				else{
					salida_texto("<span style='color:red; font-weight:bold'>Ha habido elementos al final del código que no se han analizado puesto que se ha llegado a la última posición que debería tener un mensaje.</span>");
					
					for (metar_bucle_evitados = metar_indice+1; metar_bucle_evitados < metar_codigo.length; metar_bucle_evitados++){
						elementos_evitados[indice_error] = metar_codigo[metar_bucle_evitados].toString();
						indice_error++;
					}
					
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}
	
			else if (metar_comp == false){
				elementos_evitados[indice_error] = variable_analizada;
				indice_error++;
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					metar_codigo.splice(metar_indice,1);
					detectar(metar_codigo, metar_type, ultimo_true, metar_indice);	
				}	
			}
		}
	}
	
	else if (metar_type == "RMK"){
			
		if (localizacion === 13){
			variable_analizada = metar_codigo[metar_indice].toString();
			
			if (variable_analizada == "RMK"){
				salida_texto("El término RMK es correcto.");
				errores_importantes[5]="";
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					metar_indice++;
					localizacion = 14;
					ultimo_true=14;
				}
			}
			
			else{
				errores_importantes[5]="Es obligatorio el término RMK en este aeropuerto.";
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					localizacion = 14;
				}
			}
		}
		
		if (localizacion === 14){
			variable_analizada = metar_codigo[metar_indice].toString();
			metar_comp = rmk_wind_separador (variable_analizada, 1);

			if (metar_comp == true){
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					metar_indice++;
					localizacion = 15;
					ultimo_true = 15;
					rmk_viento_correcto_1 = variable_analizada;
					errores_importantes[6]="";
				}
			}
		
			else if (metar_comp == "nopista"){
				errores_importantes[6] = "Es obligatorio en aeropuertos con RMK la aparición del viento en la pista R09 del aeropuerto.";
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					localizacion = 15;
					rmk_viento_correcto_1 = "NOWIND";
				}
			}
		
			else if (metar_comp === 0 || metar_comp == false){
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					metar_indice++;
					localizacion = 15;
					ultimo_true = 15;
					rmk_viento_correcto_1 = "NOWIND";
					errores_importantes[6]="";
				}
			}

			else if (metar_comp == "end"){
				errores_importantes[7] = "Es obligatorio en aeropuertos con RMK la aparición del viento en el ARP del aeropuerto.";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		}
		
		if (localizacion === 15){
			variable_analizada = metar_codigo[metar_indice].toString();
			metar_comp = rmk_wind_var (variable_analizada, rmk_viento_correcto_1);
			
			if (metar_comp == true){
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					metar_indice++;
					localizacion = 16;
					ultimo_true = 16;
				}
			}
			
			else if (metar_comp == false){
				localizacion = 16;
			}
			
			else if (metar_comp === 0){
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					metar_indice++;
					localizacion = 16;
					ultimo_true=16;
				}
			}
			
			else if (metar_comp == "end"){
				errores_importantes[7] = "Es obligatorio en aeropuertos con RMK la aparición del viento en el ARP del aeropuerto.";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		}
		
		if (localizacion === 16){
			variable_analizada = metar_codigo[metar_indice].toString();
			metar_comp = rmk_wind_separador (variable_analizada, 2);

			if (metar_comp == true){
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					metar_indice++;
					localizacion = 17;
					ultimo_true = 17;
					rmk_viento_correcto_2 = variable_analizada;
					errores_importantes[7]="";
				}
			}
		
			else if (metar_comp == "nopista"){
				errores_importantes[7] = "Es obligatorio en aeropuertos con RMK la aparición del viento en el ARP del aeropuerto.";
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					localizacion = 17;
					rmk_viento_correcto_2 = "NOWIND";
				}
			}
		
			else if (metar_comp === 0 || metar_comp == false){
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
						
				else{
					metar_indice++;
					localizacion = 17;
					ultimo_true = 17;
					rmk_viento_correcto_2 = "NOWIND";
					errores_importantes[7]="";
				}
			}

			else if (metar_comp == "end"){
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		}
		
		if (localizacion === 17){
			variable_analizada = metar_codigo[metar_indice].toString();
			metar_comp = rmk_wind_var (variable_analizada, rmk_viento_correcto_2);
			
			if (metar_comp == true){
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
			
			else if (metar_comp == false){
				elementos_evitados[indice_error] = variable_analizada;
				indice_error++;
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{					
					metar_codigo.splice(metar_indice,1);
					detectar(metar_codigo, metar_type, ultimo_true, metar_indice);	
				}
			}
			
			else if (metar_comp === 0){
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
				
				else{
					salida_texto("<span style='color:red; font-weight:bold'>Ha habido elementos al final del código que no se han analizado puesto que se ha llegado a la última posición que debería tener un mensaje.</span>");
					
					for (metar_bucle_evitados = metar_indice+1; metar_bucle_evitados < metar_codigo.length; metar_bucle_evitados++){
						elementos_evitados[indice_error] = metar_codigo[metar_bucle_evitados].toString();
						indice_error++;
					}
					
					salida_texto_2(errores_importantes, elementos_evitados);
					return;
				}
			}
			
			else if (metar_comp == "end"){
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
		}
	}
	
	else{
		elementos_evitados[indice_error] = variable_analizada;
		indice_error++;
				
		if (metar_indice == metar_codigo.length-1){
			salida_texto_2(errores_importantes, elementos_evitados);
			return;
		}
				
		else{					
			metar_codigo.splice(metar_indice,1);
			detectar(metar_codigo, metar_type, ultimo_true, metar_indice);	
		}
	}
}