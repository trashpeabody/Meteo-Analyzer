function funcion_previa () {
  horario_emision = 1					// se considera de serie que los aeropuertos son de emisión horaria, si luego se detecta el aeropuerto se cambia

  const metar_viento = 'NOWIND'					// declaración de variables de viento, visibilidad, rvr, tiempo significativo, nubosidad y visibilidad vertical
  const metar_visibilidad = 'NOVIS'
  rvr_array = []
  tsig = []
  clouds_array = []
  visibilidad_vertical = 'NOVERTICAL'

  // base de datos de aeropuertos horarios o semihorarios
  semihorarios = /^(LETU|LECO|LEAG|LEAL|LEAM|LESU|LEAS|LEBL|LEBR|LEBB|LEBG|LECH|LEBA|GCFV|LEGE|GCLP|LEGR|GCHI|LEHC|LEIB|LEJR|GCGM|GCLA|GCRR|LEDA|LEMD|LEVS|LEMG|GEML|LEMH|LPEA|LEPP|LERS|LELL|LESA|LESO|LEXJ|LEST|LEZL|GCXO|GCTS|LETL|LEVC|LEVD|LEVX|LEVT|LEZG)$/
  horarios = /^(LEAB|LEBZ|LERT|LEAO|LEGA|LELN|LELO|LECV|LEGT|LETO|LERI|LELC|LEMO|LEEC|LEBT)$/

  document.getElementById('demo').innerHTML = texto_final		// vaciamos los cuadros para que cada vez que filtremos se actualice toda la información
  document.getElementById('demo2').innerHTML = texto_final2
  document.getElementById('demo3').innerHTML = texto_final3

  metar = document.getElementById('input').value		// Esta función recoge el texto del cuadro y lo asigna a una variable
  metar = metar.toUpperCase()						// convierte todo a mayúsculas para evitar errores de codificación
  metar_dividido = metar.split(' ')			// Esta función divide el texto en un vector separándolo en los espacios
  numero_elementos = metar_dividido.length
  ultimo_termino = metar_dividido[numero_elementos - 1].toString()	// variables para la corrección de los saltos de línea
  longitud_ultimo = ultimo_termino.length

  for (i = 0; i < numero_elementos; i++) {					// bucle para corregir saltos de línea y espaciados al final del mensaje
    numero_elementos = metar_dividido.length
    metar_dividido[i] = metar_dividido[i].replace(/\r?\n/g, ' ')
    metar_dividido[i] = metar_dividido[i].trim()

    if (metar_dividido[i].toString() == '') {
      metar_dividido.splice(i, 1)
      i = 0
    }
  }

  if (metar_dividido[0] == undefined) {	// condicional para evitar mensajes sin contenido
    if (texto_final === ' ') {
      texto_final = "<span style='color:red; font-weight:bold; font-size:22px'>No se ha introducido ningún mensaje.</span>" + '<br></br>'
    }

    document.getElementById('demo').innerHTML = texto_final			// rellenamos los cuadros de texto
    document.getElementById('demo2').innerHTML = texto_final2
    document.getElementById('demo3').innerHTML = texto_final3

    metar_para_speci = []						// sacamos la información necesaria del mensaje para el análisis de un SPECI
    metar_para_speci[0] = 'NOWIND'			// información de viento
    metar_para_speci[1] = 'NOVIS'	// información de visibilidad
    metar_para_speci[2] = 'RAA/AAA'
    metar_para_speci[3] = 'AA'
    metar_para_speci[4] = 'AAA00'
    metar_para_speci[5] = 'NOVERTICAL'

    funcion_previa_speci(metar_para_speci, 1, 1, 1, 1)		// llamamos a la función de análisis del SPECI
    return
  }

  if (evitar == 1) {
    if (metar_dividido[0] != 'METAR' && metar_dividido[0] != 'SPECI') {
      document.getElementById('demo').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:16px'>El mensaje se ha terminado de analizar.</span>"
      document.getElementById('demo2').innerHTML = texto_final + "<span style='color:red; font-weight:bold; font-size:16px'>El mensaje debe comenzar siempre con un indicador de mensaje METAR o SPECI.</span>"
      return
    }

    if (metar_dividido.length < 2) {
      metar_dividido[1] = 'A'				// variable de escape para metar sin términos
    }

    if (metar_dividido[1].toString() == 'COR') {		// detección de mensaje COR y eliminación de dicho término para seguir con el análisis de lo demás
      metar_dividido.splice(1, 1)
    }

    if (metar_dividido[3].toString() == 'NIL=') {		// comprobación de mensaje NIL
      salida_texto('El mensaje es correcto.')
      texto_final2 = 'No se ha detectado ningún error importante.'
      texto_final3 = 'No se ha evitado ningún elemento.'
      document.getElementById('demo').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:16px'>El mensaje se ha terminado de analizar.</span>"			// rellenamos los cuadros de texto
      document.getElementById('demo2').innerHTML = texto_final2
      document.getElementById('demo3').innerHTML = texto_final3
      funcion_previa_speci(metar_para_speci, rvr_array.length - 1, tsig.length - 1, clouds_array.length - 1)		// llamamos a la función de análisis del SPECI
    }

    if (metar_dividido.length < 2) {
      metar_dividido.splice(1, 1)
    }

    if (horarios.test(metar_dividido[1].toString()) == true) {	// comprobamos si el aeropuerto es horario
      horario_emision = 1
    } else if (semihorarios.test(metar_dividido[1].toString()) == true) {	// comprobamos si el aeropuerto es semihorario
      horario_emision = 2
    }

    metar_codigo_aeropuerto = metar_dividido[1].toString()		// análisis del tipo de aeropuerto (RMK, TREND o no TREND)
    tipo_metar = detect_airport(metar_codigo_aeropuerto)

    if (tipo_metar == false) {	// aeropuerto no detectado en la base de datos
      salida_texto("<span style='color:red; font-weight:bold'> El término del aeropuerto " + metar_codigo_aeropuerto + ' no se corresponde con ningún aeropuerto español. Para continuar con el análisis se considerará que el aeropuerto no emite TREND y tiene emisión horaria de mensaje. </span>')
      tipo_metar = 'NOTREND'
      evitar = 0
    }

    if (metar_dividido.length === 3) {	// mensaje de METAR que termina en el término del aeródromo
      errores_importantes[8] = "<span style='color:red; font-weight:bold'>Un mensaje debe llevar obligatoriamente términos de viento, visibilidad y nubes (o CAVOK), temperatura, QNH y si corresponde TREND.</span>"
      salida_texto_2(errores_importantes, elementos_evitados)
      evitar = 0
    } else {		// mensaje con aeródromo correcto
      metar_dividido.splice(0, 3)
      detectar(metar_dividido, tipo_metar, 18, 0)// llamamos a la función de análisis del metar
      evitar = 0
    }
  }

  if (evitar == 0) {		// actuación en caso de introducción de un primer mensaje sin contenido
    if (texto_final === ' ') {
      texto_final = 'No se ha introducido ningún mensaje.' + '<br></br>'
    }

    if (texto_final2 == ' ') {
      texto_final2 = 'No se ha detectado ningún error importante.'
    }

    if (texto_final3 === ' ') {
      texto_final3 = 'No se ha evitado ningún elemento.'
    }

    document.getElementById('demo').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:16px'>El mensaje se ha terminado de analizar.</span>"			// rellenamos los cuadros de texto
    document.getElementById('demo2').innerHTML = texto_final2
    document.getElementById('demo3').innerHTML = texto_final3

    metar_para_speci = []						// sacamos la información necesaria del mensaje para el análisis de un SPECI
    metar_para_speci[0] = metar_viento			// información de viento
    metar_para_speci[1] = metar_visibilidad	// información de visibilidad
    indice_metar_speci = 2

    for (rvr_bucle_metar_speci = 0; rvr_bucle_metar_speci < rvr_array.length; rvr_bucle_metar_speci++) {
      metar_para_speci[indice_metar_speci] = rvr_array[rvr_bucle_metar_speci]							// información de rvr
      indice_metar_speci++
    }

    for (tsig_bucle_metar_speci = 0; tsig_bucle_metar_speci < tsig.length; tsig_bucle_metar_speci++) {
      metar_para_speci[indice_metar_speci] = tsig[tsig_bucle_metar_speci]								// información de tiempo significativo
      indice_metar_speci++
    }

    for (clouds_bucle_metar_speci = 0; clouds_bucle_metar_speci < clouds_array.length; clouds_bucle_metar_speci++) {
      metar_para_speci[indice_metar_speci] = clouds_array[clouds_bucle_metar_speci]									// información de nubosidad
      indice_metar_speci++
    }

    metar_para_speci[indice_metar_speci] = visibilidad_vertical	// información de visibilidad vertical

    funcion_previa_speci(metar_para_speci, rvr_array.length, tsig.length, clouds_array.length, nubes_convectivas)		// llamamos a la función de análisis del SPECI
  }
}

function funcion_previa_speci (terminos_metar, numero_rvr, numero_tsig, numero_nubes, numero_nubes_convectivas) {	// explicaciones idénticas a la función anterior hasta análisis de condiciones de SPECI
  texto_final = ' '
  texto_final2 = ' '
  texto_final3 = ' '
  elementos_evitados = []
  indice_error = 0
  errores_importantes = []
  evitar = 1
  metar_viento = 'NOWIND'
  metar_visibilidad = 'NOVIS'
  rvr_array = []
  tsig = []
  clouds_array = []
  visibilidad_vertical = 'NOVERTICAL'
  semihorario = /^(LETU|LECO|LEAG|LEAL|LEAM|LESU|LEAS|LEBL|LEBR|LEBB|LEBG|LECH|LEBA|GCFV|LEGE|GCLP|LEGR|GCHI|LEHC|LEIB|LEJR|GCGM|GCLA|GCRR|LEDA|LEMD|LEVS|LEMG|GEML|LEMH|LPEA|LEPP|LERS|LELL|LESA|LESO|LEXJ|LEST|LEZL|GCXO|GCTS|LETL|LEVC|LEVD|LEVX|LEVT|LEZG)$/
  horario = /^(LEAB|LEBZ|LERT|LEAO|LEGA|LELN|LELO|LECV|LEGT|LETO|LERI|LELC|LEMO|LEEC|LEBT)$/

  document.getElementById('demo5').innerHTML = texto_final
  document.getElementById('demo6').innerHTML = texto_final2
  document.getElementById('demo7').innerHTML = texto_final3

  speci = document.getElementById('input2').value
  speci_dividido = speci.split(' ')
  numero_elementos = speci_dividido.length
  ultimo_termino = speci_dividido[numero_elementos - 1].toString()
  longitud_ultimo = ultimo_termino.length

  for (i = 0; i < numero_elementos; i++) {
    numero_elementos = speci_dividido.length
    speci_dividido[i] = speci_dividido[i].replace(/\r?\n/g, ' ')
    speci_dividido[i] = speci_dividido[i].trim()

    if (speci_dividido[i].toString() == '') {
      speci_dividido.splice(i, 1)
      i = 0
    }
  }

  if (speci_dividido[0] == undefined) {
    texto_final = "<span style='color:red; font-weight:bold; font-size:22px'>No se ha introducido ningún mensaje.</span>" + '<br></br>'

    document.getElementById('demo5').innerHTML = texto_final			// rellenamos los cuadros de texto
    document.getElementById('demo6').innerHTML = texto_final2
    document.getElementById('demo7').innerHTML = texto_final3
    return
  }

  if (evitar == 1) {
    if (speci_dividido[0] != 'METAR' && speci_dividido[0] != 'SPECI') {
      document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:16px'>El mensaje se ha terminado de analizar.</span>"
      document.getElementById('demo6').innerHTML = texto_final2 + "<span style='color:red; font-weight:bold; font-size:16px'>El mensaje debe comenzar siempre con un indicador de mensaje METAR o SPECI.</span>"
      return
    }

    if (speci_dividido.length < 2) {
      speci_dividido[1] = 'A'
    }

    if (speci_dividido[1].toString() == 'COR') {
      speci_dividido.splice(1, 1)
    } else if (speci_dividido[1].toString() == 'NIL=') {
      salida_texto('El SPECI cancelado es correcto.')
      document.getElementById('demo').innerHTML = texto_final
      return
    }

    if (speci_dividido.length < 2) {
      speci_dividido.splice(1, 1)
    }

    if (horarios.test(speci_dividido[1].toString()) == true) {
      horario_emision = 1
    } else if (semihorarios.test(speci_dividido[1].toString()) == true) {
      horario_emision = 2
    }

    speci_codigo_aeropuerto = speci_dividido[1].toString()
    tipo_speci = detect_airport(speci_codigo_aeropuerto)

    if (tipo_speci == false) {
      salida_texto("<span style='color:red; font-weight:bold'> El término del aeropuerto " + speci_codigo_aeropuerto + ' no se corresponde con ningún aeropuerto español. Para continuar con el análisis se considerará que el aeropuerto no emite TREND. </span>')
      tipo_speci = 'NOTREND'
      evitar = 0
    }

    if (speci_dividido.length === 3) {
      errores_importantes[8] = "<span style='color:red; font-weight:bold'>Un SPECI debe llevar obligatoriamente términos de viento, visibilidad y nubes (o CAVOK), temperatura, QNH y si corresponde TREND.</span>"
      salida_texto_2(errores_importantes, elementos_evitados)
      evitar = 0
    } else {
      speci_dividido.splice(0, 3)
      detectar(speci_dividido, tipo_speci, 18, 0)
      evitar = 0
    }
  }

  if (evitar == 0) {
    if (texto_final === ' ') {
      texto_final = 'No se ha introducido ningún SPECI.' + '<br></br>'
    }

    if (texto_final2 == ' ') {
      texto_final2 = 'No se ha detectado ningún error importante.'
    }

    if (texto_final3 === ' ') {
      texto_final3 = 'No se ha evitado ningún elemento.'
    }

    document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:16px'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
    document.getElementById('demo6').innerHTML = texto_final2
    document.getElementById('demo7').innerHTML = texto_final3

    speci_analizable = []						// sacamos la información necesaria del mensaje para el análisis de un SPECI
    speci_analizable[0] = metar_viento
    speci_analizable[1] = metar_visibilidad
    indice_speci_analizable = 2

    for (rvr_bucle_speci = 0; rvr_bucle_speci < rvr_array.length; rvr_bucle_speci++) {
      speci_analizable[indice_speci_analizable] = rvr_array[rvr_bucle_speci]
      indice_speci_analizable++
    }

    for (tsig_bucle_speci = 0; tsig_bucle_speci < tsig.length; tsig_bucle_speci++) {
      speci_analizable[indice_speci_analizable] = tsig[tsig_bucle_speci]
      indice_speci_analizable++
    }

    for (clouds_bucle_speci = 0; clouds_bucle_speci < clouds_array.length; clouds_bucle_speci++) {
      speci_analizable[indice_speci_analizable] = clouds_array[clouds_bucle_speci]
      indice_speci_analizable++
    }

    speci_analizable[indice_speci_analizable] = visibilidad_vertical

    // ANÁLISIS DE CONDICIONES DE EMISIÓN DE SPECI//

    if (horario_emision == 1) { // condiciones para aeródromos horarios
      variable_metar_analizada = terminos_metar[0].toString()
      variable_speci_analizada = speci_analizable[0].toString()
      speci_comp = speci_viento_cambio(variable_metar_analizada, variable_speci_analizada)		// entramos a función de comparación de viento con viento de primer y segundo mensaje

      if (speci_comp == true) {	// condición de viento correcta
        document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
        document.getElementById('demo6').innerHTML = texto_final2
        document.getElementById('demo7').innerHTML = texto_final3
      } else {	// condición de viento incorrecta
        variable_metar_analizada = terminos_metar[1].toString()
        variable_speci_analizada = speci_analizable[1].toString()
        speci_comp = speci_visibilidad_cambio(variable_metar_analizada, variable_speci_analizada)		// comparamos visibilidades

        if (speci_comp == true) {	// condición de visibilidad correcta
          document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18x'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
          document.getElementById('demo6').innerHTML = texto_final2
          document.getElementById('demo7').innerHTML = texto_final3
        } else {	// condición de visibilidad incorrecta
          for (variable_rvr_analizada_metar = 0; variable_rvr_analizada_metar < numero_rvr; variable_rvr_analizada_metar++) {	// bucle para comparación de rvr (aquí cogemos cada término del primer mensaje)
            variable_metar_analizada = terminos_metar[2 + variable_rvr_analizada_metar].toString()

            for (variable_rvr_analizada_speci = 0; variable_rvr_analizada_speci < rvr_array.length; variable_rvr_analizada_speci++) {	// bucle para coger términos de rvr del segundo mensaje
              variable_speci_analizada = speci_analizable[2 + variable_rvr_analizada_speci].toString()
              speci_comp = speci_rvr_cambio(variable_metar_analizada, variable_speci_analizada)

              if (speci_comp == true) {	// condición correcta
                document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
                document.getElementById('demo6').innerHTML = texto_final2
                document.getElementById('demo7').innerHTML = texto_final3
                return
              }
            }
          }
          // condición incorrecta
          for (variable_tsig_analizada_metar = 0; variable_tsig_analizada_metar < numero_tsig; variable_tsig_analizada_metar++) {	// bucle idéntico al anterior pero para tiempo significativo
            variable_metar_analizada = terminos_metar[1 + numero_rvr + variable_tsig_analizada_metar].toString()

            for (variable_tsig_analizada_speci = 0; variable_tsig_analizada_speci < tsig.length; variable_tsig_analizada_speci++) {
              variable_speci_analizada = speci_analizable[2 + rvr_array.length + variable_tsig_analizada_speci].toString()
              speci_comp = speci_tsig_cambio(variable_metar_analizada, variable_speci_analizada)

              if (speci_comp == true) {	// condición correcta
                document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
                document.getElementById('demo6').innerHTML = texto_final2
                document.getElementById('demo7').innerHTML = texto_final3
                return
              }
            }
          }
          // condición incorrecta

          for (variable_clouds_analizada_metar = 0; variable_clouds_analizada_metar < numero_nubes; variable_clouds_analizada_metar++) { // bucle idéntico al anterior pero para nubosidad
            variable_metar_analizada = terminos_metar[2 + numero_rvr + numero_tsig + variable_clouds_analizada_metar].toString()

            for (variable_clouds_analizada_speci = 0; variable_clouds_analizada_speci < clouds_array.length; variable_clouds_analizada_speci++) {
              variable_speci_analizada = speci_analizable[2 + rvr_array.length + tsig.length + variable_clouds_analizada_speci].toString()
              speci_comp = speci_clouds_cambio(variable_speci_analizada, variable_metar_analizada)

              if (speci_comp == true) {	// condición correcta
                document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
                document.getElementById('demo6').innerHTML = texto_final2
                document.getElementById('demo7').innerHTML = texto_final3
                return
              }
            }
          }
          // condición incorrecta
          variable_metar_analizada = terminos_metar[1 + numero_rvr + numero_tsig + numero_nubes].toString()
          variable_speci_analizada = speci_analizable[1 + rvr_array.length + tsig.length + clouds_array.length].toString()
          speci_comp = speci_vertical_cambio(variable_metar_analizada, variable_speci_analizada)						// comprobación condiciones visibilidad vertical

          if (speci_comp == true) {	// condición correcta
            document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
            document.getElementById('demo6').innerHTML = texto_final2
            document.getElementById('demo7').innerHTML = texto_final3
          } else {	// condición incorrecta
            document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18x'>El SPECI se ha terminado de analizar.</span>" + '<br><br>' + "<span style='color:red; font-weight:bold; text-decoration:underline; font-size:22px'>Se han comprobado las condiciones de emisión del SPECI y no se cumple ninguna, por lo que no debería ser necesario.</span>"			// rellenamos los cuadros de texto
            document.getElementById('demo6').innerHTML = texto_final2
            document.getElementById('demo7').innerHTML = texto_final3
          }
        }
      }
    } else if (horario_emision == 2) {	// idéntico a aeródromos semihorarios pero solo en condiciones de aeródromos semihorarios
      variable_metar_analizada = terminos_metar[1].toString()
      variable_speci_analizada = speci_analizable[1].toString()
      speci_comp = speci_visibilidad_cambio(variable_metar_analizada, variable_speci_analizada)

      if (speci_comp == true) {
        document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
        document.getElementById('demo6').innerHTML = texto_final2
        document.getElementById('demo7').innerHTML = texto_final3
      } else {
        for (variable_tsig_analizada_metar = 0; variable_tsig_analizada_metar < numero_tsig; variable_tsig_analizada_metar++) {
          variable_metar_analizada = terminos_metar[2 + numero_rvr + variable_tsig_analizada_metar].toString()

          for (variable_tsig_analizada_speci = 0; variable_tsig_analizada_speci < tsig.length; variable_tsig_analizada_speci++) {
            variable_speci_analizada = speci_analizable[2 + rvr_array.length + variable_tsig_analizada_speci].toString()
            speci_comp = speci_tsig_cambio(variable_metar_analizada, variable_speci_analizada)

            if (speci_comp == true) {
              document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br></br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
              document.getElementById('demo6').innerHTML = texto_final2
              document.getElementById('demo7').innerHTML = texto_final3
              return
            }
          }
        }

        for (variable_clouds_analizada_metar = 0; variable_clouds_analizada_metar < numero_nubes; variable_clouds_analizada_metar++) {
          variable_metar_analizada = terminos_metar[2 + numero_rvr + numero_tsig + variable_clouds_analizada_metar].toString()

          for (variable_clouds_analizada_speci = 0; variable_clouds_analizada_speci < clouds_array.length; variable_clouds_analizada_speci++) {
            variable_speci_analizada = speci_analizable[2 + rvr_array.length + tsig.length + variable_clouds_analizada_speci].toString()
            speci_comp = speci_clouds_cambio(variable_speci_analizada, variable_metar_analizada)

            if (speci_comp == true) {
              document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
              document.getElementById('demo6').innerHTML = texto_final2
              document.getElementById('demo7').innerHTML = texto_final3
              return
            }
          }
        }

        variable_metar_analizada = terminos_metar[1 + numero_rvr + numero_tsig + numero_nubes].toString()
        variable_speci_analizada = speci_analizable[1 + rvr_array.length + tsig.length + clouds_array.length].toString()
        speci_comp = speci_vertical_cambio(variable_metar_analizada, variable_speci_analizada)

        if (speci_comp == true) {
          document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar." + '<br>' + 'El SPECI cumple con las condiciones de emisión.</span>'			// rellenamos los cuadros de texto
          document.getElementById('demo6').innerHTML = texto_final2
          document.getElementById('demo7').innerHTML = texto_final3
        } else {
          document.getElementById('demo5').innerHTML = texto_final + "<span style='color:green; font-weight:bold; font-size:18px'>El SPECI se ha terminado de analizar.</span>" + '<br><br>' + "<span style='color:red; text-decoration:underline; font-weight:bold; font-size:22px'>Se han comprobado las condiciones de emisión del SPECI y no se cumple ninguna, por lo que no debería ser necesario.</span>"			// rellenamos los cuadros de texto
          document.getElementById('demo6').innerHTML = texto_final2
          document.getElementById('demo7').innerHTML = texto_final3
        }
      }
    }
  }
}

function detectar (metar_codigo, metar_type, localizacion, localizacion2){		//función que guía el proceso de análisis. variables de entrada: el mensaje, tipo de metar, localización del último término correcto, e índice del mensaje que toca analizar
	variable_analizada = metar_codigo[localizacion2].toString();
	metar_indice = localizacion2;
	skipper = 0;	//variable de escape para el bucle de rvr, tiempo significativo y nubosidad
	
	if (localizacion > 5 && localizacion != 18){	//cuando hemos pasado del paso 5, evitamos el bucle mencionado con skipper = 1 y evitamos visibilidad vertical con control_nub = 1
		skipper = 1;
		control_nub = 1;
	}
	
	if(localizacion === 18){	//primer escalón: viento
		comprobador = viento(variable_analizada);		//entramos a la función que comprueba el primer término de viento
		
		if (comprobador === 0){	//viento con errores
			
			if (metar_indice == metar_codigo.length-1){	//el mensaje termina en el término de viento
				errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de visibilidad y nubes (o CAVOK), temperatura, QNH y si corresponde TREND.";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
				
			else{	//el mensaje no termina aquí
				metar_viento = "NOWIND";	//damos valor al viento para evitar errores en análisis posteriores por ser un término incorrecto
				errores_importantes[8]="";	//anulamos un posible error de no existencia de término de viento
				localizacion = 0;	//pasamos a siguiente escalón de análisis
				ultimo_true = 0;	//guardamos en la memoria que ya hay un término de viento
				metar_indice++;		//pasamos al siguiente término del mensaje
			}
		}
			
		else if (comprobador == false){	//no es un término de viento
			errores_importantes[8] ="Un mensaje debe llevar obligatoriamente términos de viento, visibilidad y nubes (o CAVOK), temperatura, QNH y, si corresponde, TREND.";
			metar_viento = "NOWIND";
			localizacion = 0;	//pasamos a siguiente escalón de análisis
			ultimo_true=18;		//guardamos en memoria que no hay término de viento
		}
			
		else if (comprobador == true){	//término de viento y correcto
			
			if (metar_indice == metar_codigo.length-1){	//el término de viento es el último del mensaje
				errores_importantes[8]= "Un mensaje debe llevar obligatoriamente términos de visibilidad y nubes (o CAVOK), temperatura, QNH y si corresponde TREND.";
				salida_texto_2(errores_importantes, elementos_evitados);
				return;
			}
				
			else{									//el término de viento no es el último del mensaje
				metar_viento = variable_analizada;	//guardamos la información del viento para futuras comprobaciones
				errores_importantes[8]="";			//pasos idénticos a los mencionados
				localizacion = 0;
				ultimo_true = 0;
				metar_indice++;
			}
		}
	}

	if (localizacion === 0){	//segundo escalón
		metar_comprobador_tendencia = 0;	//declaración de variables que se usan de aquí en adelante
		
		caso1 = 0;
		caso2 = 0;
		caso3 = 0;

		skipper = 0;
		metar_visibilidad = 0;
		control_nub = 0;

		indice_t_sign = 0;
		tsig = [];
		tsig[indice_t_sign] = "AA";
		metar_signi_n = 0;

		indice_nubes = 0;
		clouds_array = [];
		clouds_array[indice_nubes] = "AAA00";
		metar_nub_n = 0;
		nubes_convectivas = 0;

		indice_rvr = 0;
		rvr_array = [];
		rvr_array[indice_rvr] = "RAA/AAA";
		metar_rvr_n = 0;

		visibilidad_vertical= "VV000";
		metar_vvertical_n = 0;

		metar_recientes_1 = 0;

		metar_cizalla_n = 0;

		metar_indicador_t1 = 0
		metar_indicador_t2 = 0
		
		variable_analizada = metar_codigo[metar_indice].toString();
		metar_comp = wind_var (variable_analizada, metar_viento);	//análisis de viento variable
		
		//A PARTIR DE AHORA EL PROCESO A SEGUIR EN CADA ANÁLISIS ES IDÉNTICO AL DEL VIENTO//
		
		if (metar_comp === 0){		//errores en viento variable
		
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
					
				}
				
				else{
					salida_texto("<span style='color:red; font-weight:bold'>Ha habido elementos al final del código que no se han analizado puesto que se ha llegado a la última posición que debería tener un mensaje.</span>");
					
					for (metar_bucle_evitados = metar_indice+1; metar_bucle_evitados < metar_codigo.length; metar_bucle_evitados++){
						elementos_evitados[indice_error] = metar_codigo[metar_bucle_evitados].toString();
						indice_error++;
					}
					
					salida_texto_2(errores_importantes, elementos_evitados);
					
				}
			}
	
			else if (metar_comp == "end"){
				salida_texto_2(errores_importantes, elementos_evitados);
				
			}
	
			else if (metar_comp == true){
		
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					
				}
					
				else{
					salida_texto("<span style='color:red; font-weight:bold'>Ha habido elementos al final del código que no se han analizado puesto que se ha llegado a la última posición que debería tener un mensaje.</span>");
					
					for (metar_bucle_evitados = metar_indice+1; metar_bucle_evitados < metar_codigo.length; metar_bucle_evitados++){
						elementos_evitados[indice_error] = metar_codigo[metar_bucle_evitados].toString();
						indice_error++;
					}
					
					salida_texto_2(errores_importantes, elementos_evitados);
					
				}
			}
	
			else if (metar_comp == false){
				elementos_evitados[indice_error] = variable_analizada;
				indice_error++;
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					
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
				
			}
			
			else if (metar_comp == false){
				elementos_evitados[indice_error] = variable_analizada;
				indice_error++;
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					
				}
				
				else{					
					metar_codigo.splice(metar_indice,1);
					detectar(metar_codigo, metar_type, ultimo_true, metar_indice);	
				}
			}
			
			else if (metar_comp === 0){
				
				if (metar_indice == metar_codigo.length-1){
					salida_texto_2(errores_importantes, elementos_evitados);
					
				}
				
				else{
					salida_texto("<span style='color:red; font-weight:bold'>Ha habido elementos al final del código que no se han analizado puesto que se ha llegado a la última posición que debería tener un mensaje.</span>");
					
					for (metar_bucle_evitados = metar_indice+1; metar_bucle_evitados < metar_codigo.length; metar_bucle_evitados++){
						elementos_evitados[indice_error] = metar_codigo[metar_bucle_evitados].toString();
						indice_error++;
					}
					
					salida_texto_2(errores_importantes, elementos_evitados);
					
				}
			}
			
			else if (metar_comp == "end"){
				salida_texto_2(errores_importantes, elementos_evitados);
				
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
