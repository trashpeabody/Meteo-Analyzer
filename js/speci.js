function speci_viento_cambio (speci_viento_previo, speci_viento_actual){
	viento_con_rachas = /^(\D{3}|\d{3})(P)?(\d{2})(G)(P)?(\d{2})?(\D{2})(=)?$/;
	
	if (speci_viento_previo == "NOWIND" || speci_viento_actual == "NOWIND"){
		return 0;
	}
	
	if (Math.abs( parseInt (speci_viento_previo.slice(0,3)) - parseInt (speci_viento_actual.slice(0,3))) > 180 ){
		
		if (Math.abs( Math.abs(( parseInt(speci_viento_previo.slice(0,3)) - parseInt (speci_viento_actual.slice(0,3)))) - 360) < 60 ){
			
			if (isNaN(speci_viento_previo.charAt(3)) == true){
			
				if (isNaN(speci_viento_actual.charAt(3)) == true){
					
					if(viento_con_rachas.test(speci_viento_previo) == true && viento_con_rachas.test(speci_viento_actual) == true){
						
						if (Math.abs(parseInt(speci_viento_actual.slice(speci_viento_actual.indexOf("G")+1 ,speci_viento_actual.indexOf("G")+3)) - parseInt(speci_viento_previo.slice(speci_viento_previo.indexOf("G")+1 ,speci_viento_previo.indexOf("G")+3))) < 10){
							return 0;
						}
						
						else{
							
							if(parseInt(speci_viento_previo.slice(0,3)) < 15 && parseInt(speci_viento_actual.slice(0,3) < 15)){
								return 0;
							}
							
							else{
								return true;
							}
						}
					}
					
					else{
						return 0;
					}
				}
			
				else{
					return true;
				}
			}
		
			else{
			
				if (isNaN(speci_viento_actual.charAt(3)) == true){
					return true;
				}
			
				else{
				
					if (Math.abs(parseInt(speci_viento_actual.slice(3,5)) - parseInt(speci_viento_previo.slice(3,5))) < 10){
						
						if(viento_con_rachas.test(speci_viento_previo) == true && viento_con_rachas.test(speci_viento_actual) == true){
						
							if (Math.abs(parseInt(speci_viento_actual.slice(speci_viento_actual.indexOf("G")+1 ,speci_viento_actual.indexOf("G")+3)) - parseInt(speci_viento_previo.slice(speci_viento_previo.indexOf("G")+1 ,speci_viento_previo.indexOf("G")+3))) < 10){
								return 0;
							}
							
							else{
								
								if(parseInt(speci_viento_previo.slice(0,3)) < 15 && parseInt(speci_viento_actual.slice(0,3) < 15)){
									return 0;
								}
								
								else{
									return true;
								}
							}
						}
					}
				
					else{
						return true;
					}
				}
			}
		}
			
		else{
			
			if (isNaN(speci_viento_previo.charAt(3)) == true || isNaN(speci_viento_actual.charAt(3)) == true){
				return true;
			}
				
			else{
					
				if (parseInt(speci_viento_actual.slice(3,5)) > 10 || parseInt(speci_viento_previo.slice(3,5)) > 10){
					return true;
				}
				
				else{
					
					if (Math.abs(parseInt(speci_viento_actual.slice(3,5)) - parseInt(speci_viento_previo.slice(3,5))) < 10){
						
						if(viento_con_rachas.test(speci_viento_previo) == true && viento_con_rachas.test(speci_viento_actual) == true){
						
							if (Math.abs(parseInt(speci_viento_actual.slice(speci_viento_actual.indexOf("G")+1 ,speci_viento_actual.indexOf("G")+3)) - parseInt(speci_viento_previo.slice(speci_viento_previo.indexOf("G")+1 ,speci_viento_previo.indexOf("G")+3))) < 10){
								return 0;
							}
							
							else{
								
								if(parseInt(speci_viento_previo.slice(0,3)) < 15 && parseInt(speci_viento_actual.slice(0,3) < 15)){
									return 0;
								}
								
								else{
									return true;
								}
							}
						}
					}
				
					else{
						return true;
					}
				}
			}
		}
	}
	
	else{
		
		if (Math.abs(( parseInt(speci_viento_previo.slice(0,3)) - parseInt (speci_viento_actual.slice(0,3)))) < 60 ){
			
			if (isNaN(speci_viento_previo.charAt(3)) == true){
			
				if (isNaN(speci_viento_actual.charAt(3)) == true){
					
					if(viento_con_rachas.test(speci_viento_previo) == true && viento_con_rachas.test(speci_viento_actual) == true){
						
						if (Math.abs(parseInt(speci_viento_actual.slice(speci_viento_actual.indexOf("G")+1 ,speci_viento_actual.indexOf("G")+3)) - parseInt(speci_viento_previo.slice(speci_viento_previo.indexOf("G")+1 ,speci_viento_previo.indexOf("G")+3))) < 10){
							return 0;
						}
						
						else{
							
							if(parseInt(speci_viento_previo.slice(0,3)) < 15 && parseInt(speci_viento_actual.slice(0,3) < 15)){
								return 0;
							}
							
							else{
								return true;
							}
						}
					}
					
					else{
						return 0;
					}
				}
			
				else{
					return true;
				}
			}
		
			else{
			
				if (isNaN(speci_viento_actual.charAt(3)) == true){
					return true;
				}
			
				else{
				
					if (Math.abs(parseInt(speci_viento_actual.slice(3,5)) - parseInt(speci_viento_previo.slice(3,5))) < 10){
						
						if(viento_con_rachas.test(speci_viento_previo) == true && viento_con_rachas.test(speci_viento_actual) == true){
						
							if (Math.abs(parseInt(speci_viento_actual.slice(speci_viento_actual.indexOf("G")+1 ,speci_viento_actual.indexOf("G")+3)) - parseInt(speci_viento_previo.slice(speci_viento_previo.indexOf("G")+1 ,speci_viento_previo.indexOf("G")+3))) < 10){
								return 0;
							}
							
							else{
								
								if(parseInt(speci_viento_previo.slice(0,3)) < 15 && parseInt(speci_viento_actual.slice(0,3) < 15)){
									return 0;
								}
								
								else{
									return true;
								}
							}
						}
					}
				
					else{
						return true;
					}
				}
			}
		}
			
		else{
			
			if (isNaN(speci_viento_previo.charAt(3)) == true || isNaN(speci_viento_actual.charAt(3)) == true){
				return true;
			}
				
			else{
					
				if (parseInt(speci_viento_actual.slice(3,5)) > 10 || parseInt(speci_viento_previo.slice(3,5)) > 10){
					return true;
				}
				
				else{
					
					if (Math.abs(parseInt(speci_viento_actual.slice(3,5)) - parseInt(speci_viento_previo.slice(3,5))) < 10){
						
						if(viento_con_rachas.test(speci_viento_previo) == true && viento_con_rachas.test(speci_viento_actual) == true){
						
							if (Math.abs(parseInt(speci_viento_actual.slice(speci_viento_actual.indexOf("G")+1 ,speci_viento_actual.indexOf("G")+3)) - parseInt(speci_viento_previo.slice(speci_viento_previo.indexOf("G")+1 ,speci_viento_previo.indexOf("G")+3))) < 10){
								return 0;
							}
							
							else{
								
								if(parseInt(speci_viento_previo.slice(0,3)) < 15 && parseInt(speci_viento_actual.slice(0,3) < 15)){
									return 0;
								}
								
								else{
									return true;
								}
							}
						}
					}
				
					else{
						return true;
					}
				}
			}
		}
	}
}

function speci_visibilidad_cambio (speci_visibility_previo, speci_visibility_actual){	//CONDICIONES PARA VISIBILIDAD DE TENDENCIA
	
	if (speci_visibility_previo == "NOVIS" || speci_visibility_actual == "NOVIS"){
		return;
	}
	
	else{
		speci_visibility_1 = parseInt(speci_visibility_actual);
		speci_visibility_2 = parseInt(speci_visibility_previo);
		
		if (speci_visibility_1 < speci_visibility_2){
	
			if (speci_visibility_1 < 800 && speci_visibility_2 > 800){
				return true;
			}

			else if (speci_visibility_1 < 1500 && speci_visibility_2 > 1500){
				return true;
			}
	
			else if (speci_visibility_1 < 3000 && speci_visibility_2 > 3000){
				return true;
			}

			else if (speci_visibility_1 < 5000 && speci_visibility_2 > 5000){
				return true;
			}
			
			else {
				return;
			}
		}
		
		else if (speci_visibility_1 > speci_visibility_2){
			
			if (speci_visibility_1 >= 800 && speci_visibility_2 < 800){
				return true;
			}

			else if (speci_visibility_1 >= 1500 && speci_visibility_2 < 1500){
				return true;
			}
	
			else if (speci_visibility_1 >= 3000 && speci_visibility_2 < 3000){
				return true;
			}

			else if (speci_visibility_1 >= 5000 && speci_visibility_2 < 5000){
				return true;
			}
			
			else {
				return;
			}
		}
	
		else if (speci_visibility_1 == speci_visibility_2){
			return;
		}
	}
}

function speci_rvr_cambio (speci_rvr_previo, speci_rvr_actual){
	
	if (speci_rvr_previo == "RAA/AAA" || speci_rvr_actual == "RAA/AAA"){
		return;
	}
	
	rvr_partes_2  = speci_rvr_previo.split("/");
	rvr_partes_1  = speci_rvr_actual.split("/");
	
	if (rvr_partes_1[0].toString() == rvr_partes_2[0].toString()){
		
		if (rvr_partes_1[1].length == 5){
			rvr_1_distancia = parseInt(rvr_partes_1[1].slice(0,4));
		}
		
		if (rvr_partes_2[1].length == 5){
			rvr_2_distancia = parseInt(rvr_partes_2[1].slice(0,4));
		}
		
		if (rvr_1_distancia < rvr_2_distancia){
	
			if (rvr_1_distancia < 800 && rvr_2_distancia > 800){
				return true;
			}

			else if (rvr_1_distancia < 175 && rvr_2_distancia > 175){
				return true;
			}
			
			else if (rvr_1_distancia < 550 && rvr_2_distancia > 550){
				return true;
			}
	
			else if (rvr_1_distancia < 300 && rvr_2_distancia > 300){
				return true;
			}

			else if (rvr_1_distancia < 50 && rvr_2_distancia > 50){
				return true;
			}
			
			else {
				return;
			}
		}
		
		else if (rvr_1_distancia > rvr_2_distancia){
			
			if (rvr_1_distancia >= 800 && rvr_2_distancia < 800){
				return true;
			}

			else if (rvr_1_distancia >= 175 && rvr_2_distancia < 175){
				return true;
			}
			
			else if (rvr_1_distancia >= 550 && rvr_2_distancia < 550){
				return true;
			}
	
			else if (rvr_1_distancia >= 300 && rvr_2_distancia < 300){
				return true;
			}

			else if (rvr_1_distancia >= 50 && rvr_2_distancia < 50){
				return true;
			}
			
			else {
				return 0;
			}
		}
	
		else if (rvr_1_distancia == rvr_2_distancia){
			return;
		}			
	}
	
	else{
		return;
	}
}

function speci_tsig_cambio (speci_tsig_previo, speci_tsig_actual){

	tor = /^(\+|\-)?(TSGR|TSGS|TSRA|TSSN)(=)?$/;
	prec = /^(\+|\-)?(SHGS|SHGR|SHRA|SHSN|DZ|RA|SN|SG|PL|GR|GS|RASN)(=)?$/;
	eng = /^(\+|\-)?(FZDZ|FZRA)(=)?$/;
	pol1 = /^(\+|\-)?(SS)(=)?$/;
	pol2 = /^(\+|\-)?(DS)(=)?$/;
	emb = /^(FC)(=)?$/;
	
	nieb = /^(FZFG)(=)?$/;
	venbaja = /^(DR)(DU|SA|SN)(=)?$/;
	venalta = /^(BL)(DU|SA|SN)(=)?$/;
	tors = /^(TS)(=)?$/;
	turbo = /^(SQ)(=)?$/;
	
	trend_weather_previo = speci_tsig_previo.toString();
	trend_weather_dato = speci_tsig_actual.toString();
			
	if (trend_weather_dato == "AA" || trend_weather_previo == "AA"){
		return;
	}
			
	if (tor.test(trend_weather_dato) == true && tor.test(trend_weather_previo) == true){
				
		if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
		
		else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
	}
	
	else if (eng.test(trend_weather_dato) == true && eng.test(trend_weather_previo) == true){
		
		if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
		
		else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
	}
	
	else if (pol1.test(trend_weather_dato) == true && pol1.test(trend_weather_previo) == true){
		
		if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
		
		else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
	}
	
	else if (pol2.test(trend_weather_dato) == true && pol2.test(trend_weather_previo) == true){
		
		if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
		
		else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
	}
	
	else if (prec.test(trend_weather_dato) == true && prec.test(trend_weather_previo) == true){
		
		if (trend_weather_previo.charAt(0) == "+" && trend_weather_dato.charAt(0) == "+"){
			return;
		}
		
		else if (trend_weather_dato.charAt(0) == "-" && trend_weather_previo.charAt(0) == "-"){
			return;
		}
		
		else if (trend_weather_dato.charAt(0) == "-" && trend_weather_previo.charAt(0) == "+"){
			return;
		}
		
		else if (trend_weather_previo.charAt(0) != "-" && trend_weather_previo.charAt(0) != "+" && trend_weather_dato.charAt(0) == "-"){
			return;
		}
		
		else if (trend_weather_previo.charAt(0) != "-" && trend_weather_previo.charAt(0) != "+" && trend_weather_dato.charAt(0)!= "-" && trend_weather_dato.charAt(0)!= "+"){
			return;
		}
	}
	
	else if (emb.test(trend_weather_dato) == true && emb.test(trend_weather_previo) == true){
		
		if (trend_weather_dato.charAt(0) == "+" || trend_weather_dato.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
		
		else if (trend_weather_previo.charAt(0) == "+" || trend_weather_previo.charAt(0) == "-"){
			
			if (trend_weather_previo.charAt(0) == trend_weather_dato.charAt(0)){
				return;
			}
		}
	}
	
	else if (nieb.test(trend_weather_dato) == true && nieb.test(trend_weather_previo) == true){
		return;
	}
	
	else if (venalta.test(trend_weather_dato) == true && venalta.test(trend_weather_previo) == true){
		return;
	}
	
	else if (venbaja.test(trend_weather_dato) == true && venbaja.test(trend_weather_previo) == true){
		return;
	}
	
	else if (tors.test(trend_weather_dato) == true && tors.test(trend_weather_previo) == true){
		return;
	}
	
	else if (emb.test(trend_weather_dato) == true && emb.test(trend_weather_previo) == true){
		return;
	}
	
	else if (prec.test(trend_weather_dato) == false && tor.test(trend_weather_dato) == false && pol1.test(trend_weather_dato) == false && pol2.test(trend_weather_dato) == false && eng.test(trend_weather_dato) == false && nieb.test(trend_weather_dato) == false && venbaja.test(trend_weather_dato) == false && venalta.test(trend_weather_dato) == false && turbo.test(trend_weather_dato) == false && tors.test(trend_weather_dato) == false && emb.test(trend_weather_dato) == false){
		return;
	}
	
	if (prec.test(trend_weather_dato) == true && trend_weather_dato.charAt(0) == "-"){
		return;
	}
	
	else if (prec.test(trend_weather_dato) == true && trend_weather_dato.charAt(0) != "-"){
		return true;
	}
	
	else if (tor.test(trend_weather_dato) == true || pol1.test(trend_weather_dato) == true || pol2.test(trend_weather_dato) == true || eng.test(trend_weather_dato) == true){
		return true;
	}
	
	else if (nieb.test(trend_weather_dato) == true || venbaja.test(trend_weather_dato) == true || venalta.test(trend_weather_dato) == true || tors.test(trend_weather_dato) == true || turbo.test(trend_weather_dato) == true || emb.test(trend_weather_dato) == true){
		return true;
	}
}

function speci_clouds_cambio (speci_clouds_actual, speci_clouds_previo){		//CONDICIONES PARA NUBES DE TENDENCIA 

	speci_clouds_tipo_previo = speci_clouds_previo.slice(0,3);
	speci_clouds_altura_previo = parseInt(speci_clouds_previo.slice(3,6));
	speci_clouds_tipo_actual = speci_clouds_actual.slice(0,3);		
	speci_clouds_altura_actual = parseInt(speci_clouds_actual.slice (3,6));
	
	if (speci_clouds_tipo_actual == "AAA" || speci_clouds_tipo_previo == "AAA"){
		return;
	}
	
	if ((speci_clouds_tipo_actual == "BKN" && speci_clouds_tipo_previo == "BKN") || (speci_clouds_tipo_actual == "OVC" && speci_clouds_tipo_previo == "OVC")){
		
		if (speci_clouds_altura_actual < speci_clouds_altura_previo){
			
			if (speci_clouds_altura_actual < 1 && speci_clouds_altura_previo >= 1){
				return true;
			}
		
			if (speci_clouds_altura_actual < 2 && speci_clouds_altura_previo >= 2){
				return true;
			}
		
			if (speci_clouds_altura_actual < 5 && speci_clouds_altura_previo >= 5){
				return true;
			}
		
			if (speci_clouds_altura_actual < 10 && speci_clouds_altura_previo >= 10){
				return true;
			}
			
			if (speci_clouds_altura_actual < 15 && speci_clouds_altura_previo >= 15){
				return true;
			}
		}
		
		else if (speci_clouds_altura_actual > speci_clouds_altura_previo){				

			if (speci_clouds_altura_previo < 1 && speci_clouds_altura_previo > 1){
				return true;
			}
			
			if (speci_clouds_altura_previo < 2 && speci_clouds_altura_actual > 2){
				return true;
			}
			
			if (speci_clouds_altura_previo < 5 && speci_clouds_altura_actual > 5){
				return true;
			}
			
			if (speci_clouds_altura_previo < 10 && speci_clouds_altura_actual > 10){
				return true;
			}
			
			if (speci_clouds_altura_previo < 15 && speci_clouds_altura_actual > 15){
				return true;
			}
		}
	}
	
	else if (speci_clouds_altura_actual < 15 && speci_clouds_altura_previo < 15){
		
		if ((speci_clouds_tipo_previo == "SCT" && speci_clouds_tipo_actual == "BKN") || (speci_clouds_tipo_previo == "SCT" && speci_clouds_tipo_actual == "OVC") || (speci_clouds_tipo_previo == "BKN" && speci_clouds_tipo_actual == "SCT") || (speci_clouds_tipo_previo == "BKN" && speci_clouds_tipo_actual == "FEW") || (speci_clouds_tipo_previo == "OVC" && speci_clouds_tipo_actual == "SCT") || (speci_clouds_tipo_previo == "OVC" && speci_clouds_tipo_actual == "FEW")){
			return true;
		}
	}
		
	if (speci_clouds_actual.toString().length == 6 && speci_clouds_previo.toString().length == 8){
		return true;
	}
		
	else if (speci_clouds_actual.toString().length > 6 && speci_clouds_previo.toString().length == 6){
		
		if (speci_clouds_tipo_actual == "BKN" || speci_clouds_tipo_actual == "SCT" || speci_clouds_tipo_actual == "OVC"){
			return true;
		}
	}
}

function speci_vertical_cambio (speci_vertical_actual, speci_vertical_previo){
	
	if (speci_vertical_previo == "NOVERTICAL" || speci_vertical_actual == "NOVERTICAL"){
		return;
	}
	
	else{
		speci_vertical_1 = parseInt(speci_vertical_actual);
		speci_vertical_2 = parseInt(speci_vertical_previo);
		
		if (speci_vertical_1 < speci_vertical_2){
	
			if (speci_vertical_1 < 1 && speci_vertical_2 > 1){
				return true;
			}

			else if (speci_vertical_1 < 2 && speci_vertical_2 > 2){
				return true;
			}
	
			else if (speci_vertical_1 < 5 && speci_vertical_2 > 5){
				return true;
			}

			else if (speci_vertical_1 < 10 && speci_vertical_2 > 10){
				return true;
			}
			
			else {
				return;
			}
		}
		
		else if (speci_vertical_1 > speci_vertical_2){
			
			if (speci_vertical_1 >= 1 && speci_vertical_2 < 1){
				return true;
			}

			else if (speci_vertical_1 >= 2 && speci_vertical_2 > 2){
				return true;
			}
	
			else if (speci_vertical_1 >= 5 && speci_vertical_2 < 5){
				return true;
			}

			else if (speci_vertical_1 >= 10 && speci_vertical_2 < 10){
				return true;
			}
			
			else {
				return;
			}
		}
	
		else if (speci_vertical_1 == speci_vertical_2){
			return;
		}
	}
}
