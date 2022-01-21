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
